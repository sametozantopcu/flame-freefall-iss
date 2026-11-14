"""D4 - table_map (investigation <-> parquet table) and store.connect_all (feature store + metadata on one connection)."""
import pandas as pd
import pytest

from conftest import TABLES
from src.data_layer import metadata, store, table_map
from src.data_layer.store import connect, connect_all


@pytest.fixture(scope="module")
def con():
    return connect_all()


@pytest.fixture(scope="module")
def tm(con):
    return con.execute("SELECT * FROM table_map").df()


def test_schema_and_order(tm):
    assert list(tm.columns) == table_map.COLUMNS
    assert str(tm.n_rows.dtype) == "Int64" and str(tm.n_source_files.dtype) == "Int64"
    nums = tm.psi_id.str.extract(r"(\d+)")[0].astype(int).tolist()
    assert nums == sorted(nums)                                          # PSI-9 < PSI-10: numeric, not alphabetic
    assert set(tm.coverage) == {"table", "inferred", "none"} and set(tm.relation) == {"source_file", "inferred", "none"}


@pytest.mark.parametrize("t", TABLES)
def test_every_table_row_is_mapped(con, tm, t):
    """Acceptance: every psi_id of every parquet table is mapped; no row of the table is left without an investigation."""
    actual = {r[0]: (r[1], r[2]) for r in con.execute(
        f"SELECT psi_id, count(*), count(DISTINCT source_file) FROM {t} GROUP BY 1").fetchall()}
    m = tm[(tm.table == t) & (tm.relation == "source_file")]
    assert {r.psi_id: (r.n_rows, r.n_source_files) for r in m.itertuples()} == actual
    assert int(m.n_rows.sum()) == con.execute(f"SELECT count(*) FROM {t}").fetchone()[0]
    assert (m.coverage == "table").all() and m.reason.isna().all()


def test_no_orphans_and_acronyms_agree(con, tm):
    inv = con.execute("SELECT psi_id, acronym FROM investigations").df()
    assert set(tm.psi_id) == set(inv.psi_id) and len(inv) == 24            # every investigation appears at least once
    j = tm.merge(inv, on="psi_id", suffixes=("", "_inv"))
    assert (j.acronym.fillna("") == j.acronym_inv.fillna("")).all()


NOT_LOADED = {"PSI-26", "PSI-47", "PSI-68", "PSI-106", "PSI-142"}
NO_TABLE = {"PSI-60", "PSI-62", "PSI-115", "PSI-117"}


def test_unmapped_investigations_and_reasons(con, tm):
    none = tm[tm.coverage == "none"]
    assert set(none.psi_id) == NOT_LOADED | NO_TABLE and len(none) == 9
    assert none.table.isna().all() and none.n_rows.isna().all()
    assert set(none[none.reason == "no_experimental_table"].psi_id) == NO_TABLE
    assert set(none[none.reason == "experimental_table_not_loaded"].psi_id) == NOT_LOADED
    n = dict(con.execute("SELECT psi_id, n_experimental_tables FROM investigations").fetchall())
    assert all((n[r.psi_id] == 0) == (r.reason == "no_experimental_table") for r in none.itertuples())   # derived, not invented
    assert not (set(none.psi_id) & set(tm[tm.coverage != "none"].psi_id))


def test_inferred_link_is_only_same_and_marked(con, tm):
    inf = tm[tm.relation == "inferred"]
    assert len(inf) == 1
    r = inf.iloc[0]
    assert (r.psi_id, r.table, r.coverage) == ("PSI-102", "smoke", "inferred")
    assert r.n_rows == con.execute("SELECT count(*) FROM smoke WHERE campaign = 'SAME'").fetchone()[0] == 25
    assert "inference" in r.basis and "campaign='SAME'" in r.basis and "PSI-101" in r.basis
    assert "ground" not in " ".join(inf.basis)                              # ground rows are linked to no investigation
    assert con.execute("SELECT count(DISTINCT campaign) FROM smoke").fetchone()[0] == 3


def test_experimental_table_counts_in_export(con):
    n = con.execute("SELECT sum(n_experimental_tables), min(n_experimental_tables) FROM investigations").fetchone()
    assert n == (22, 0)                                                    # 20 investigations with 1, PSI-10 and PSI-159 with 2
    zero = {r[0] for r in con.execute("SELECT psi_id FROM investigations WHERE n_experimental_tables = 0").fetchall()}
    assert zero == NO_TABLE


@pytest.mark.skipif(not metadata.RAW_DIR.is_dir(), reason="raw/ yok: sayım detail.json ile çapraz doğrulanamadı")
def test_experimental_table_counts_match_raw(con):
    import json
    exp = dict(con.execute("SELECT psi_id, n_experimental_tables FROM investigations").fetchall())
    raw = {p.parent.name: len(json.loads(p.read_text()).get("experimentalTable") or [])
           for p in metadata.RAW_DIR.glob("PSI-*/detail.json")}
    assert exp == raw


def test_connect_all_joins_rows_to_investigation_and_doi(con):
    assert con.execute("SELECT count(*) FROM flex f JOIN investigations i USING (psi_id)").fetchone()[0] == 274
    assert con.execute("SELECT DISTINCT i.doi FROM flex f JOIN investigations i USING (psi_id)").fetchall() == [("10.60555/mbq8-0451",)]
    names = {r[0] for r in con.execute("SELECT table_name FROM duckdb_tables() UNION SELECT view_name FROM duckdb_views() "
                                       "WHERE NOT internal").fetchall()}
    assert names == set(TABLES) | {"catalog", "units", "investigations", "publications", "files", "table_map"}


def test_plain_connect_is_unchanged():
    c = connect()
    views = {r[0] for r in c.execute("SELECT view_name FROM duckdb_views() WHERE NOT internal").fetchall()}
    assert views == set(TABLES) | {"catalog"}
    assert not {"investigations", "table_map"} & views


def test_connect_all_without_raw_from_any_cwd_and_deterministic(monkeypatch, tmp_path, tm):
    monkeypatch.setattr(metadata, "RAW_DIR", tmp_path / "no_raw_here")
    monkeypatch.chdir(tmp_path)
    again = connect_all().execute("SELECT * FROM table_map").df()
    pd.testing.assert_frame_equal(tm, again)
