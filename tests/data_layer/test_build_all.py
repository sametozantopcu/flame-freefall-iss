"""F1 - build_all: one command rebuilds the data layer from a clean copy; never overwrites shared data by default."""
import hashlib
import os
import shutil
import subprocess
import sys
from pathlib import Path

import duckdb
import pandas as pd
import pytest

from conftest import REPO
from src.data_layer import metadata, store
from src.data_layer.spec import TIER1, TIER2

NASA = Path("data_analysis/Nasa_data")
HAS_GIT = (REPO / ".git").exists()
RAW = REPO / NASA / "raw"
needs_git = pytest.mark.skipif(not HAS_GIT, reason=".git yok: temiz kopya doğrulanamadı (zip indirmesi olabilir)")
needs_raw = pytest.mark.skipif(not RAW.is_dir(), reason="raw/ yok: raw varken davranış doğrulanamadı — kutu yalnızca raw/ olan makinede işaretlenir")


def snapshot(root: Path, skip=()) -> dict:
    return {str(p.relative_to(root)): (p.stat().st_size, p.stat().st_mtime_ns)
            for p in sorted(root.rglob("*")) if p.is_file() and not any(s in p.parts for s in skip)}


def copy_clean(dst: Path) -> Path:
    """Everything that would be committed (tracked + untracked, not git-ignored): raw/ and csv/ are NOT in it."""
    names = subprocess.run(["git", "ls-files", "--cached", "--others", "--exclude-standard"], cwd=REPO, check=True,
                           capture_output=True, text=True).stdout.splitlines()
    for n in names:
        src = REPO / n
        if src.is_file():
            (dst / n).parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst / n)
    return dst


def run(root: Path, *args, env_extra=None):
    env = {k: v for k, v in os.environ.items() if k != "PYTHONPATH"}      # no help from the caller's environment
    env["PYTHONDONTWRITEBYTECODE"] = "1"
    env.update(env_extra or {})
    r = subprocess.run([sys.executable, "-m", "src.data_layer.build_all", *args], cwd=root, env=env, capture_output=True, text=True)
    return r.returncode, r.stdout + r.stderr


@pytest.fixture(scope="module")
def base(tmp_path_factory):
    if not HAS_GIT:
        pytest.skip(".git yok")
    return copy_clean(tmp_path_factory.mktemp("clean_copy"))


@pytest.fixture()
def fresh(base, tmp_path):
    return shutil.copytree(base, tmp_path / "copy")


@needs_git
def test_clean_copy_has_no_raw_and_builds_with_skip_raw(base, tmp_path):
    assert not (base / NASA / "raw").exists() and not (base / NASA / "csv").exists()
    out = tmp_path / "out"
    rc, text = run(base, "--skip-raw", "--out", str(out))
    assert rc == 0, text
    for i, name in enumerate(["girdiler", "feature_store", "catalog_units", "metadata", "meta_db", "table_map"], 1):
        assert f"[{i}/6] {name}: OK" in text, text
    assert "build_all tamam" in text
    with duckdb.connect(str(out / "feature_store.duckdb"), read_only=True) as c:
        views = {r[0] for r in c.execute("SELECT view_name FROM duckdb_views() WHERE NOT internal").fetchall()}
        assert views == set(TIER1 + TIER2) | {"catalog"}
    with duckdb.connect(str(out / "meta.duckdb"), read_only=True) as c:
        assert c.execute("SELECT count(*) FROM investigations").fetchone()[0] == 24
    tm = pd.read_parquet(out / "table_map.parquet")
    assert len(tm) == 26 and (tm.coverage == "none").sum() == 9


@needs_git
def test_writes_only_into_out(base, tmp_path):
    before = snapshot(base)
    rc, text = run(base, "--skip-raw", "--out", str(tmp_path / "out"))
    assert rc == 0, text
    assert snapshot(base) == before                                     # nothing else in the copy was created or changed


@needs_git
def test_deterministic(base, tmp_path):
    outs = []
    for k in "ab":
        rc, text = run(base, "--skip-raw", "--out", str(tmp_path / k))
        assert rc == 0, text
        outs.append(tmp_path / k)
    pd.testing.assert_frame_equal(*(pd.read_parquet(o / "table_map.parquet") for o in outs))
    res = []
    for o in outs:
        with duckdb.connect(str(o / "feature_store.duckdb"), read_only=True) as c:
            res.append((c.execute("SELECT * FROM units ORDER BY dataset, \"column\"").df(),
                        c.execute("SELECT * FROM catalog ORDER BY dataset, \"column\"").df(),
                        {t: c.execute(f"SELECT count(*) FROM {t}").fetchone()[0] for t in TIER1 + TIER2}))
    pd.testing.assert_frame_equal(res[0][0], res[1][0])
    pd.testing.assert_frame_equal(res[0][1], res[1][1])
    assert res[0][2] == res[1][2]


@needs_git
def test_without_skip_raw_and_without_raw_fails_clearly(fresh, tmp_path):
    rc, text = run(fresh, "--out", str(tmp_path / "o"))
    assert rc != 0 and "--skip-raw" in text and "raw/ bulunamadı" in text


@needs_git
@pytest.mark.parametrize("victim,needle", [
    (NASA / "analysis/data/flex.parquet", "flex"),
    (NASA / "analysis/outputs/feature_catalog.csv", "feature_catalog"),
    (NASA / "meta/files.parquet", "meta"),
])
def test_missing_input_fails_with_its_name(fresh, tmp_path, victim, needle):
    (fresh / victim).unlink()
    rc, text = run(fresh, "--skip-raw", "--out", str(tmp_path / "o"))
    assert rc == 1 and "HATA" in text and needle in text, text


@needs_git
def test_help_lists_the_flags(base):
    rc, text = run(base, "--help")
    assert rc == 0 and all(f in text for f in ("--skip-raw", "--out", "--update-meta"))


# ---------------------------------------------------------------- with raw/ (this machine only)
def _md5(p: Path) -> str:
    return hashlib.md5(p.read_bytes()).hexdigest()


@needs_raw
def test_with_raw_reports_identical_and_changes_nothing(tmp_path):
    meta = REPO / NASA / "meta"
    before_meta = snapshot(meta)
    before_raw = {p: _md5(p) for p in sorted(RAW.glob("PSI-*/detail.json"))}
    rc, text = run(REPO, "--out", str(tmp_path / "out"))
    assert rc == 0, text
    assert "AYNI" in text and "FARKLI" not in text
    assert (tmp_path / "out" / "meta" / "files.parquet").exists()          # the fresh export went to --out only
    assert snapshot(meta) == before_meta                                   # committed meta/ untouched
    assert before_raw == {p: _md5(p) for p in sorted(RAW.glob("PSI-*/detail.json"))} and len(before_raw) == 24


@needs_raw
def test_default_never_overwrites_and_update_meta_does(fresh, tmp_path):
    os.symlink(RAW, fresh / NASA / "raw")                                   # raw/ read-only use
    committed = fresh / NASA / "meta" / "investigations.parquet"
    good = pd.read_parquet(committed)
    bad = good.copy()
    bad.loc[bad.index[0], "title"] = "TAMPERED"                              # a value drifts, invariants still hold
    bad.to_parquet(committed, index=False)
    corrupted = _md5(committed)

    rc, text = run(fresh, "--out", str(tmp_path / "o1"))                    # default: warn, do not overwrite
    assert rc == 0 and "FARKLI" in text and "UYARI" in text and "investigations" in text, text
    assert _md5(committed) == corrupted

    rc, text = run(fresh, "--update-meta", "--out", str(tmp_path / "o2"))   # explicit: refresh
    assert rc == 0 and "GÜNCELLENDİ" in text, text
    pd.testing.assert_frame_equal(pd.read_parquet(committed), good)
    rc, text = run(fresh, "--out", str(tmp_path / "o3"))
    assert rc == 0 and "AYNI" in text                                       # now consistent again


@needs_git
def test_row_loss_in_committed_meta_is_caught_by_the_invariants(fresh, tmp_path):
    """Losing investigations from meta/ must fail the build (table_map invariant), not just warn."""
    committed = fresh / NASA / "meta" / "investigations.parquet"
    pd.read_parquet(committed).iloc[:-3].to_parquet(committed, index=False)
    rc, text = run(fresh, "--skip-raw", "--out", str(tmp_path / "o"))
    assert rc == 1 and "[6/6] table_map: HATA" in text and "PSI-159" in text, text
