"""C2 - Feature Store: one DuckDB view per parquet table, equal to the parquet, cwd independent."""
import os

import pandas as pd
import pytest

from conftest import DATA, OUT, TABLES
from src.data_layer import store
from src.data_layer.spec import TIER1, TIER2, TRACE


def test_views(tables):
    con = store.connect()
    views = {r[0] for r in con.execute("SELECT view_name FROM duckdb_views() WHERE NOT internal").fetchall()}
    assert views == set(TABLES) | {"catalog"} and len(views) == 12   # 11 table views + catalog (units is a table)
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


ROLE_COUNTS = {"feature": 55, "leakage": 54, "target": 19, "meta": 62, "exclude": 21, "id": 15}


def test_catalog_units(tables):
    con = store.connect()
    csv = pd.read_csv(OUT / "feature_catalog.csv")
    cat = con.execute("SELECT * FROM catalog").df()
    assert len(cat) == len(csv) == 226
    assert set(cat.dataset) == set(TIER1)                     # catalog covers the 6 Tier-1 tables only
    assert cat.role.value_counts().to_dict() == ROLE_COUNTS    # pinned: a catalog change must be deliberate

    units = con.execute("SELECT * FROM units").df()
    assert set(units.dataset) == set(TABLES)                   # units cover all 11 tables
    assert len(units) == sum(t.shape[1] for t in tables.values())
    assert units.unit.notna().all() and (units.unit != "").all()   # never empty; unknown is 'unit_unknown'
    assert not units.duplicated(["dataset", "column"]).any()

    j = con.execute("""SELECT c.dataset, c.column, c.unit AS cat_unit, u.unit, u.is_numeric
                       FROM catalog c JOIN units u ON c.dataset = u.dataset AND c.column = u.column""").df()
    assert len(j) == len(cat)                                  # every catalog row has a units row
    assert (j.cat_unit == j.unit).all()                        # catalog and units agree

    feats = con.execute("""SELECT c.dataset, c.column, u.unit, u.is_numeric FROM catalog c
                           JOIN units u ON c.dataset = u.dataset AND c.column = u.column
                           WHERE c.role = 'feature'""").df()
    num = feats[feats.is_numeric]
    assert len(num) == 39 and (num.unit != "unit_unknown").all(), num[num.unit == "unit_unknown"]
    cat_feats = feats[~feats.is_numeric]
    assert len(cat_feats) == 16 and (cat_feats.unit == "unit_unknown").all()   # categoricals: no unit


def test_units_persist_in_built_file(tmp_path):
    import duckdb
    out = store.build(tmp_path / "fs.duckdb")
    with duckdb.connect(str(out), read_only=True) as c:
        assert c.execute("SELECT count(*) FROM units").fetchone()[0] > 0
        assert c.execute("SELECT count(*) FROM catalog").fetchone()[0] == 226


def test_missing_catalog_is_a_clear_error(monkeypatch, tmp_path):
    monkeypatch.setattr(store, "CATALOG_CSV", tmp_path / "nope.csv")
    with pytest.raises(FileNotFoundError, match="feature catalog missing"):
        store.connect()
