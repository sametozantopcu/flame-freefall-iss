"""Plan consistency checker (plans/00_data_layer F3, plans/06_delivery A3).

Rules (see plans/README.md):
  R1 ticked / total boxes == Durum "İlerleme" == plans/README.md row; struck-through steps (`- ~~[`) are not counted
  R2 every ticked step has an evidence line `✔ YYYY-MM-DD · <command> · <result>` (valid date, not in the future)
  R3 an unticked step has no evidence line
  R4 a struck step reads `- ~~[ ] **ID** ...~~ — **İPTAL (YYYY-MM-DD):** <reason>` with a non-empty reason
  R5 step IDs are unique within a plan and their letter matches the phase heading (`## Faz X`)
  R6 every open step (unticked, not struck) has a Test line and a Kabul line
  R7 plans/README.md has exactly one row per plan folder and its links point to existing files
  R8 Durum "Sıradaki adım" names an open step of that plan, or "—" when the plan is complete
  R9 Durum "Son güncelleme" is a valid date, not in the future
Ticked steps may lack Test/Kabul (phase-A EDA steps of plan 00 predate the tests); their proof is the evidence line.
"""
from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import date, timedelta
from pathlib import Path

STEP = re.compile(r"^- \[( |x)\] \*\*([A-Z]\d+)\*\*")
STRUCK = re.compile(r"^- ~~\[( |x)\] \*\*([A-Z]\d+)\*\*")
STRUCK_OK = re.compile(r"^- ~~\[( |x)\] \*\*([A-Z]\d+)\*\*.*~~ — \*\*İPTAL \((\d{4}-\d{2}-\d{2})\):\*\* (\S.*)$")
PHASE = re.compile(r"^## Faz ([A-Z])\b")
EVIDENCE = re.compile(r"^  ✔ (.*)$")
README_ROW = re.compile(r"^\| (\d\d) \| .+? \| \[([\w-]+)\]\(([\w-]+)/PLAN\.md\) \| .*? \| (\d+) / (\d+) \|\s*$")
TOLERANCE = timedelta(days=1)                                       # time-zone slack for "not in the future"


@dataclass(frozen=True)
class Problem:
    file: str
    line: int
    rule: str
    msg: str

    def __str__(self):
        return f"{self.file}:{self.line} [{self.rule}] {self.msg}"


def _date(s: str):
    try:
        return date.fromisoformat(s)
    except ValueError:
        return None


def parse_readme(plans_dir: Path) -> dict:
    rows = {}
    for i, line in enumerate((plans_dir / "README.md").read_text().splitlines(), 1):
        m = README_ROW.match(line)
        if m:
            rows.setdefault(m.group(2), []).append(dict(line=i, num=m.group(1), link=m.group(3),
                                                        done=int(m.group(4)), total=int(m.group(5))))
    return rows


def check_plan(path: Path, readme_rows: dict | None = None, today: date | None = None) -> list[Problem]:
    today = today or date.today()
    rel = f"{path.parent.name}/{path.name}"
    lines = path.read_text().splitlines()
    out, steps, phase = [], [], None
    add = lambda ln, rule, msg: out.append(Problem(rel, ln, rule, msg))

    i = 0
    while i < len(lines):
        line = lines[i]
        if (m := PHASE.match(line)):
            phase = m.group(1)
        m, ms = STEP.match(line), STRUCK.match(line)
        if m or ms:
            j = i + 1
            while j < len(lines) and not lines[j].startswith(("- ", "## ", "---")):
                j += 1
            block = lines[i + 1:j]
            sid = (m or ms).group(2)
            steps.append(dict(id=sid, line=i + 1, ticked=bool(m and m.group(1) == "x"), struck=bool(ms), block=block,
                              phase=phase))
            if ms and not STRUCK_OK.match(line):
                add(i + 1, "R4", f"{sid}: iptal satırı `- ~~[ ] **ID** ...~~ — **İPTAL (YYYY-MM-DD):** neden` biçiminde değil")
            i = j
            continue
        i += 1

    seen = {}
    for s in steps:
        if s["id"] in seen:
            add(s["line"], "R5", f"{s['id']} ID'si {seen[s['id']]}. satırda da var")
        seen.setdefault(s["id"], s["line"])
        if s["phase"] and s["id"][0] != s["phase"]:
            add(s["line"], "R5", f"{s['id']} 'Faz {s['phase']}' altında; harf fazla uyuşmuyor")
        if s["struck"]:
            continue
        ev = [(k, EVIDENCE.match(b).group(1)) for k, b in enumerate(s["block"]) if EVIDENCE.match(b)]
        if s["ticked"]:
            if not ev:
                add(s["line"], "R2", f"{s['id']} işaretli ama altında kanıt satırı (✔ YYYY-MM-DD · komut · sonuç) yok")
            for k, text in ev:
                parts = [p.strip() for p in text.split(" · ")]
                d = _date(parts[0])
                if len(parts) < 3 or not all(parts[:3]):
                    add(s["line"] + 1 + k, "R2", f"{s['id']} kanıt satırı 3 parçalı değil (tarih · komut · sonuç)")
                if d is None:
                    add(s["line"] + 1 + k, "R2", f"{s['id']} kanıt tarihi geçersiz: {parts[0]!r}")
                elif d > today + TOLERANCE:
                    add(s["line"] + 1 + k, "R2", f"{s['id']} kanıt tarihi gelecekte: {d}")
        else:
            if ev:
                add(s["line"], "R3", f"{s['id']} işaretsiz ama altında kanıt satırı var")
            body = "\n".join(s["block"])
            for label in ("Test", "Kabul"):
                if not re.search(rf"^  - {label}:", body, re.M):
                    add(s["line"], "R6", f"{s['id']} açık adımında '{label}:' satırı yok")

    counted = [s for s in steps if not s["struck"]]
    done, total = sum(s["ticked"] for s in counted), len(counted)
    text = "\n".join(lines)
    prog = re.search(r"^- \*\*İlerleme:\*\* (\d+) / (\d+)\s*$", text, re.M)
    if not prog:
        add(1, "R1", "Durum bölümünde '- **İlerleme:** k / t' satırı yok")
    elif (int(prog.group(1)), int(prog.group(2))) != (done, total):
        add(text[:prog.start()].count("\n") + 1, "R1", f"Durum {prog.group(1)} / {prog.group(2)} diyor, kutular {done} / {total}")
    if readme_rows is not None:
        rows = readme_rows.get(path.parent.name, [])
        if len(rows) == 1 and (rows[0]["done"], rows[0]["total"]) != (done, total):
            out.append(Problem("README.md", rows[0]["line"], "R1",
                               f"{path.parent.name}: README {rows[0]['done']} / {rows[0]['total']} diyor, kutular {done} / {total}"))

    upd = re.search(r"^- \*\*Son güncelleme:\*\* (\S+)", text, re.M)
    if not upd or _date(upd.group(1)) is None:
        add(1, "R9", "Durum 'Son güncelleme' tarihi yok veya geçersiz")
    elif _date(upd.group(1)) > today + TOLERANCE:
        add(1, "R9", f"'Son güncelleme' gelecekte: {upd.group(1)}")

    nxt = re.search(r"^- \*\*Sıradaki adım:\*\* (.*)$", text, re.M)
    open_ids = {s["id"] for s in counted if not s["ticked"]}
    if not nxt:
        add(1, "R8", "Durum 'Sıradaki adım' satırı yok")
    elif done == total and total:
        if not nxt.group(1).startswith("—"):
            add(1, "R8", "plan tamamlandı; 'Sıradaki adım' '—' ile başlamalı")
    else:
        m = re.match(r"([A-Z]\d+)\b", nxt.group(1))
        if not m or m.group(1) not in open_ids:
            add(1, "R8", f"'Sıradaki adım' açık bir adımı göstermiyor: {nxt.group(1)[:40]!r}")
    return out


def check_all(plans_dir: Path, today: date | None = None) -> list[Problem]:
    plans = sorted(p for p in plans_dir.glob("[0-9][0-9]_*/PLAN.md"))
    rows = parse_readme(plans_dir)
    out = []
    folders = {p.parent.name for p in plans}
    for name, rs in rows.items():
        for r in rs:
            if name not in folders or r["link"] != name or not (plans_dir / r["link"] / "PLAN.md").is_file():
                out.append(Problem("README.md", r["line"], "R7", f"satır {name} bir plan klasörüne doğru bağlanmıyor"))
    for f in sorted(folders):
        if len(rows.get(f, [])) != 1:
            out.append(Problem("README.md", 1, "R7", f"{f} için README tablosunda {len(rows.get(f, []))} satır var (1 olmalı)"))
    for p in plans:
        out += check_plan(p, rows, today)
    return out


def format_problems(ps) -> str:
    return "Plan tutarlılığı bozuk (kurallar: tests/plancheck.py):\n" + "\n".join(f"  {p}" for p in ps)
