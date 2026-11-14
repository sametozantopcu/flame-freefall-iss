"""Static detector for 'a module reads raw/ or csv/ directly' (plans/00_data_layer, step F2).

AST based, .py files only. What it flags (first matching kind per site):
  nasa_data_folder   a string with  Nasa_data/raw  or  Nasa_data/csv
  raw_csv_segment    a string with a path segment  raw/  or  csv/  (needs the trailing slash: 'text/csv' is fine)
  psi_path           a string like  PSI-101/...   (only the raw layout has those)
  path_join          pathlib   x / "raw"   or   x / "csv"
  path_call          Path(..., "raw"), x.joinpath("csv"), os.path.join(..., "raw", ...)
  RAW_DIR            use or import of the name RAW_DIR
  analysis_helper    import of the EDA helper module _common (it reads csv/)
  unparsable         file could not be parsed (never skipped silently)
Not flagged: bare "raw"/"csv" strings, variable names like raw / raw_df, docstrings, comments, 'bass2_clean.csv'.
LIMIT: a static check cannot see paths assembled at run time (base + "/" + name). It is a guard rail, not a proof.
"""
from __future__ import annotations

import ast
import re
from dataclasses import dataclass
from pathlib import Path

STRING_RULES = [
    ("nasa_data_folder", re.compile(r"Nasa_data[/\\](raw|csv)\b")),
    ("raw_csv_segment", re.compile(r"(^|[/\\])(raw|csv)[/\\]")),
    ("psi_path", re.compile(r"\bPSI-\d+[/\\]")),
]
FOLDERS = {"raw", "csv"}
RULE_TEXT = ("Modüller 'raw/' veya 'csv/' klasörünü doğrudan okumaz (Architecture.md §1). Veriyi Feature Store'dan alın: "
             "src.data_layer.store.connect_all() / frame.get_modeling_frame(...). Meşru bir istisna için tests/data_layer/"
             "test_no_raw_access.py içindeki ALLOWLIST'e dosyayı NEDENİYLE birlikte yazın.")


@dataclass(frozen=True)
class Violation:
    path: str
    line: int
    kind: str
    snippet: str

    def __str__(self):
        return f"{self.path}:{self.line} [{self.kind}] {self.snippet}"


def _is_str(n) -> bool:
    return isinstance(n, ast.Constant) and isinstance(n.value, str)


def scan_source(text: str, path: str = "<memory>") -> list[Violation]:
    lines = text.splitlines()
    snip = lambda ln: lines[ln - 1].strip()[:120] if 0 < ln <= len(lines) else ""
    try:
        tree = ast.parse(text)
    except SyntaxError as e:
        return [Violation(path, e.lineno or 1, "unparsable", str(e.msg))]
    skip = set()                                        # docstrings and bare string statements are prose, not paths
    for node in ast.walk(tree):
        if isinstance(node, ast.Expr) and _is_str(node.value):
            skip.add(id(node.value))
    out = []

    def add(node, kind):
        out.append(Violation(path, node.lineno, kind, snip(node.lineno)))

    for node in ast.walk(tree):
        if _is_str(node) and id(node) not in skip:
            for kind, rx in STRING_RULES:
                if rx.search(node.value):
                    add(node, kind)
                    break
        elif isinstance(node, ast.BinOp) and isinstance(node.op, ast.Div):
            if any(_is_str(o) and o.value in FOLDERS for o in (node.left, node.right)):
                add(node, "path_join")
        elif isinstance(node, ast.Call):
            f = node.func
            pathy = (isinstance(f, ast.Name) and f.id in {"Path", "PurePath"}) or \
                    (isinstance(f, ast.Attribute) and f.attr == "joinpath") or \
                    (isinstance(f, ast.Attribute) and f.attr == "join" and isinstance(f.value, ast.Attribute)
                     and f.value.attr == "path")
            if pathy and any(_is_str(a) and a.value in FOLDERS for a in node.args):
                add(node, "path_call")
        elif isinstance(node, (ast.Name, ast.Attribute)):
            if (isinstance(node, ast.Name) and node.id == "RAW_DIR") or (isinstance(node, ast.Attribute) and node.attr == "RAW_DIR"):
                add(node, "RAW_DIR")
        elif isinstance(node, ast.ImportFrom):
            if any(a.name == "RAW_DIR" for a in node.names):
                add(node, "RAW_DIR")
            if (node.module or "").split(".")[0] == "_common":
                add(node, "analysis_helper")
        elif isinstance(node, ast.Import):
            if any(a.name.split(".")[0] == "_common" for a in node.names):
                add(node, "analysis_helper")
    return sorted(set(out), key=lambda v: (v.line, v.kind))


def scan_file(path: Path, root: Path | None = None) -> list[Violation]:
    rel = path.relative_to(root).as_posix() if root else str(path)
    return scan_source(path.read_text(encoding="utf-8", errors="replace"), rel)


def scan_dirs(dirs, root: Path, allowlist: dict | None = None):
    """-> (violations, scanned_files, missing_dirs). Directories that do not exist yet are reported, not an error."""
    allowlist, violations, scanned, missing = allowlist or {}, [], [], []
    for d in dirs:
        d = Path(d)
        if not d.exists():
            missing.append(d.name)
            continue
        for f in sorted(d.rglob("*.py")):
            if "__pycache__" in f.parts:
                continue
            rel = f.relative_to(root).as_posix()
            scanned.append(rel)
            if rel not in allowlist:
                violations += scan_file(f, root)
    return violations, scanned, missing


def format_violations(vs) -> str:
    return RULE_TEXT + "\n" + "\n".join(f"  {v}" for v in vs)
