"""C2 - Feature Store: one DuckDB view per parquet table, equal to the parquet, cwd independent."""
import os

import pandas as pd
import pytest

from conftest import DATA, TABLES
from src.data_layer import store
from src.data_layer.spec import TIER1, TIER2, TRACE


def test_views(tables):
    con = store.connect()
    views = {r[0] for r in con.execute("SELECT view_name FROM duckdb_views() WHERE NOT internal").fetchall()}
    assert views == set(TABLES) and len(views) == 11
    assert store.TABLES == TIER1 + TIER2


@pytest.mark.parametrize("name", TABLES)
def test_view_equals_parquet(tables, name):
    con = store.connect()
    df = con.execute(f"SELECT * FROM {name}").df()
    ref = tables[name]
    assert list(df.columns) == list(ref.columns)             # same names, same order
    assert len(df) == len(ref)
    for c in TRACE:                                          # trace columns survive
        assert c in df.columns and df[c].isna().sum() == 0
    norm = lambda d: d.astype(object).where(d.notna(), None)   # nan and <NA> are both 'missing'
    pd.testing.assert_frame_equal(norm(df), norm(ref), check_dtype=False)


def test_string_columns_are_varchar():
    con = store.connect()
    types = {r[0]: r[1] for r in con.execute("DESCRIBE smoke").fetchall()}
    assert types["material"] == "VARCHAR" and types["psi_id"] == "VARCHAR"


def test_cwd_independent_and_build_idempotent(tmp_path, monkeypatch):
    out = tmp_path / "fs.duckdb"
    monkeypatch.chdir(tmp_path)                              # NOT the repo
    assert store.build(out) == out
    assert store.build(out) == out                           # second run: no error, same result
    sub = tmp_path / "elsewhere"
    sub.mkdir()
    monkeypatch.chdir(sub)
    import duckdb
    with duckdb.connect(str(out), read_only=True) as c:
        n = {t: c.execute(f"SELECT count(*) FROM {t}").fetchone()[0] for t in TABLES}
    assert n == {t: len(pd.read_parquet(DATA / f"{t}.parquet")) for t in TABLES}


def test_missing_parquet_is_a_clear_error(monkeypatch, tmp_path):
    monkeypatch.setattr(store, "DATA_DIR", tmp_path)         # empty folder
    with pytest.raises(FileNotFoundError, match="parquet tables missing"):
        store.connect()
