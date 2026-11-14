"""B4 - idempotency / reproducibility of 01_load_core.py (needs the raw csv/ folder; skipped without it).

The script is run twice in two throw-away trees (scripts copied, csv/ symlinked read-only), so the repo's
analysis/data and csv/ can never be touched by this test.
"""
import hashlib
import os
import shutil
import subprocess
import sys
from pathlib import Path

import pandas as pd
import pytest

from conftest import ANALYSIS, DATA, REPO, TABLES

CSV = ANALYSIS.parent / "csv"
pytestmark = pytest.mark.needs_raw
SKIP = (not CSV.is_dir() or sys.platform == "win32")
WHY = "csv/ yok (veya Windows): yeniden üretim doğrulanamadı — kutu yalnızca csv/ olan Linux/Mac makinede işaretlenir"


def snapshot(root: Path) -> dict:
    """{relative path: (size, mtime_ns)} of every file under root (cheap stand-in for hashing 2.6 GB)."""
    return {str(p.relative_to(root)): (p.stat().st_size, p.stat().st_mtime_ns)
            for p in sorted(root.rglob("*")) if p.is_file()}


def content_hash(df: pd.DataFrame) -> str:
    h = hashlib.sha256()
    h.update(repr((list(df.columns), [str(t) for t in df.dtypes], len(df))).encode())
    h.update(pd.util.hash_pandas_object(df, index=False).values.tobytes())
    return h.hexdigest()


def md5(p: Path) -> str:
    return hashlib.md5(p.read_bytes()).hexdigest()


def _run(tree: Path) -> Path:
    scripts = tree / "Nasa_data" / "analysis" / "scripts"
    scripts.mkdir(parents=True)
    for f in ("_common.py", "01_load_core.py"):
        shutil.copy(ANALYSIS / "scripts" / f, scripts / f)
    os.symlink(CSV, tree / "Nasa_data" / "csv")                       # read-only use by the script
    r = subprocess.run([sys.executable, str(scripts / "01_load_core.py")], cwd=tree, capture_output=True, text=True,
                       env={**os.environ, "PYTHONPATH": str(REPO)})
    assert r.returncode == 0, r.stderr[-800:]
    return tree / "Nasa_data" / "analysis"


@pytest.fixture(scope="module")
def runs(tmp_path_factory):
    if SKIP:
        pytest.skip(WHY)
    csv_before, repo_before = snapshot(CSV), snapshot(DATA)
    a = _run(tmp_path_factory.mktemp("run1"))
    b = _run(tmp_path_factory.mktemp("run2"))
    return dict(a=a, b=b, csv_before=csv_before, repo_before=repo_before)


def test_two_runs_identical(runs):
    a, b = runs["a"], runs["b"]
    for t in TABLES:
        pa, pb = a / "data" / f"{t}.parquet", b / "data" / f"{t}.parquet"
        assert pa.exists() and pb.exists(), t
        assert md5(pa) == md5(pb), f"{t}: parquet bytes differ between runs"
        assert content_hash(pd.read_parquet(pa)) == content_hash(pd.read_parquet(pb)), t
    for f in ("load_report.md", "assumptions.md"):
        assert (a / "outputs" / f).read_text() == (b / "outputs" / f).read_text(), f


def test_rebuilt_equals_committed_parquet(runs):
    """Stronger than the plan: the committed tables are reproducible from csv/ (content, not bytes)."""
    for t in TABLES:
        fresh = pd.read_parquet(runs["a"] / "data" / f"{t}.parquet")
        assert content_hash(fresh) == content_hash(pd.read_parquet(DATA / f"{t}.parquet")), t


def test_csv_untouched(runs):
    assert snapshot(CSV) == runs["csv_before"]


def test_repo_data_untouched(runs):
    assert snapshot(DATA) == runs["repo_before"]


def test_snapshot_detects_changes(tmp_path):                           # no csv/ needed: validates the checker
    (tmp_path / "a.txt").write_text("x")
    s0 = snapshot(tmp_path)
    assert snapshot(tmp_path) == s0
    (tmp_path / "a.txt").write_text("xy")
    assert snapshot(tmp_path) != s0
    s1 = snapshot(tmp_path)
    (tmp_path / "b.txt").write_text("")
    assert snapshot(tmp_path) != s1
    (tmp_path / "b.txt").unlink()
    assert snapshot(tmp_path) == s1


def test_content_hash_detects_changes(tables):
    df = tables["flex"]
    assert content_hash(df) == content_hash(df.copy())
    df2 = df.copy()
    df2.loc[df2.index[0], "d0_mm"] = df2.loc[df2.index[0], "d0_mm"] + 1e-9
    assert content_hash(df) != content_hash(df2)
    assert content_hash(df) != content_hash(df.iloc[:-1])
    assert content_hash(df) != content_hash(df.rename(columns={"d0_mm": "d0"}))
