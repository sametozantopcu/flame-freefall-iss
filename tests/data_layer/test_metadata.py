"""D1 - detail.json parser: fixture tests run everywhere; real-data tests need raw/ (skipped without it)."""
import copy
import hashlib
import json
import re
from pathlib import Path

import pandas as pd
import pytest

from conftest import REPO
from src.data_layer import metadata
from src.data_layer.metadata import load_all, parse_detail

FIX = REPO / "tests" / "fixtures" / "detail_PSI-25.json"
RAW = metadata.RAW_DIR
KEY = ["psi_id", "source_file", "source_row"]
needs_raw = pytest.mark.skipif(not RAW.is_dir(), reason="raw/ yok: gerçek veri doğrulanamadı — kutu yalnızca raw/ olan makinede işaretlenir")


@pytest.fixture(scope="module")
def parsed():
    obj = json.loads(FIX.read_text())
    return obj, parse_detail(obj, "PSI-25", "raw/PSI-25/detail.json")


def test_fixture_has_no_personal_data():
    text = FIX.read_text()
    assert not re.search(r"[\w.+-]+@[\w-]+\.[\w.]+", text) and json.loads(text)["contacts"] == []


def test_row_counts(parsed):
    obj, (inv, pubs, files) = parsed
    assert len(pubs) == len(obj["publications"]) == 3
    assert len(files) == len(obj["added"]) + len(obj["removed"]) == 7
    assert (inv["n_publications"], inv["n_files_added"], inv["n_files_removed"]) == (3, 5, 2)
    assert files.status.value_counts().to_dict() == {"added": 5, "removed": 2}


def test_field_mapping(parsed):
    _, (inv, pubs, files) = parsed
    assert inv["psi_id"] == "PSI-25" and inv["acronym"] == "BASS-II" and inv["doi"] == "10.60555/4qc4-de67"
    assert inv["total_file_size"] == 274631106141 and inv["version"] == 4
    p = pubs[pubs.doi == "10.1016/j.combustflame.2017.03.001"].iloc[0]
    assert p.title.startswith("Microgravity flammability") and p.status == "published"
    v = files[files.file_name.str.endswith("TEST_B1.mp4")].iloc[0]
    assert (v.ext, v.size_bytes, v.category, v.status) == (".mp4", 5803980, "Raw Data", "added")
    assert files[files.file_name.str.endswith("flame testing.jpg")].iloc[0].category == "Representative Image(s)"
    assert set(files.category.dropna()) == {"Raw Data", "Reference Data", "metadata", "Representative Image(s)"}


def test_missing_stays_missing(parsed):
    obj, (inv, pubs, _) = parsed
    assert pubs.doi.isna().sum() == 1 and (pubs.doi.dropna() != "").all()          # NA, never ''
    o = copy.deepcopy(obj)
    o["investigationAcronym"], o["investigationStartDate"] = "   ", ""
    inv2, _, _ = parse_detail(o, "PSI-25", "x")
    assert inv2["acronym"] is pd.NA and inv2["start_date"] is pd.NaT


def test_dates(parsed):
    _, (inv, _, files) = parsed
    assert inv["start_date"] == pd.Timestamp("2010-01-01") and inv["end_date"] == pd.Timestamp("2022-12-31")  # MM-DD-YYYY
    assert inv["release_date"] == pd.Timestamp("2022-12-31") and inv["modified_date"] == pd.Timestamp("2025-11-24")  # DD-Mon-YYYY
    assert files.date_created.iloc[0] == pd.Timestamp("2025-11-24 15:56:42.269")                           # epoch ms, UTC
    obj = json.loads(FIX.read_text())
    obj["investigationStartDate"] = "2010/01/01"
    with pytest.raises(ValueError, match="unrecognised date"):                       # never a silent NaT
        parse_detail(obj, "PSI-25", "x")


def test_float_sizes_become_integers_and_fractions_fail(parsed):
    _, (_, _, files) = parsed
    assert str(files.size_bytes.dtype) == "Int64" and files.size_bytes.notna().all()
    obj = json.loads(FIX.read_text())
    obj["added"][0]["file_size"] = 10.5
    with pytest.raises(ValueError, match="non-integral"):
        parse_detail(obj, "PSI-25", "x")


def test_no_contact_columns(parsed):
    _, (inv, pubs, files) = parsed
    cols = set(inv) | set(pubs.columns) | set(files.columns)
    assert not {c for c in cols if re.search(r"mail|phone|contact|fax", c)}
    assert "year" not in pubs.columns                                  # the source has no publication year


def test_trace_columns_and_unique_key(parsed):
    _, (inv, pubs, files) = parsed
    for df in (pubs, files):
        assert all(df[c].notna().all() for c in KEY) and not df.duplicated(KEY).any()
    assert inv["source_file"] == "raw/PSI-25/detail.json" and (pubs.psi_id == "PSI-25").all()


def test_input_not_mutated(parsed):
    obj, _ = parsed
    assert obj == json.loads(FIX.read_text())
    before = copy.deepcopy(obj)
    parse_detail(obj, "PSI-25", "x")
    assert obj == before


def test_bad_input_raises():
    obj = json.loads(FIX.read_text())
    with pytest.raises(ValueError, match="does not match folder"):
        parse_detail(obj, "PSI-99", "x")
    obj.pop("accession")
    with pytest.raises(ValueError, match="missing 'accession'"):
        parse_detail(obj, "PSI-25", "x")


def test_empty_raw_dir_is_a_clear_error(tmp_path):
    with pytest.raises(FileNotFoundError, match="no PSI-"):
        load_all(tmp_path)


# ---------------------------------------------------------------- real data (needs raw/)
@pytest.fixture(scope="module")
def real():
    if not RAW.is_dir():
        pytest.skip("raw/ yok")
    before = {p: hashlib.md5(p.read_bytes()).hexdigest() for p in sorted(RAW.glob("PSI-*/detail.json"))}
    out = load_all()
    after = {p: hashlib.md5(p.read_bytes()).hexdigest() for p in sorted(RAW.glob("PSI-*/detail.json"))}
    return dict(tables=out, before=before, after=after)


@needs_raw
def test_real_24_investigations_valid_dois(real):
    inv, _, _ = real["tables"]
    assert len(inv) == 24 and inv.psi_id.is_unique
    assert inv.doi.notna().all() and inv.doi.str.match(r"^10\.\d{4,9}/\S+$").all()
    assert inv.psi_id.tolist() == sorted(inv.psi_id, key=lambda s: int(s.split("-")[1]))


@needs_raw
def test_real_pinned_counts(real):
    inv, pubs, files = real["tables"]
    assert len(pubs) == 352 and int(pubs.doi.isna().sum()) == 68
    assert (files.status == "added").sum() == 16354 == inv.n_files_added.sum()
    assert (files.status == "removed").sum() == 10722 == inv.n_files_removed.sum()
    assert inv.n_publications.sum() == len(pubs)
    assert pubs.doi.dropna().str.match(r"^10\.\d{4,9}/\S+$").all()
    assert inv.acronym.isna().sum() == 5 and inv.start_date.isna().sum() == 3 and inv.end_date.isna().sum() == 4


@needs_raw
def test_real_uniqueness_rules(real):
    _, pubs, files = real["tables"]
    assert not pubs.duplicated(KEY).any() and not files.duplicated(KEY).any()
    added, removed = files[files.status == "added"], files[files.status == "removed"]
    assert not added.duplicated(["psi_id", "remote_path"]).any()           # added: one row per path
    assert removed.duplicated(["psi_id", "remote_path"]).sum() == 3023     # removed: repeated versions are real, NOT deduped
    assert not (set(zip(added.psi_id, added.remote_path)) & set(zip(removed.psi_id, removed.remote_path)))


@needs_raw
def test_real_videos_are_listed(real):
    _, _, files = real["tables"]
    assert (files[files.status == "added"].ext == ".mp4").sum() == 855        # input for phase E


@needs_raw
def test_raw_detail_files_untouched(real):
    assert real["before"] == real["after"] and len(real["before"]) == 24


# ---------------------------------------------------------------- D2: export / connect_meta
def _fixture_raw(tmp_path) -> Path:
    raw = tmp_path / "raw" / "PSI-25"
    raw.mkdir(parents=True, exist_ok=True)
    (raw / "detail.json").write_text(FIX.read_text())
    return tmp_path / "raw"


def test_export_roundtrip_from_fixture(tmp_path):
    out = tmp_path / "meta"
    paths = metadata.export(out, _fixture_raw(tmp_path))
    assert [p.name for p in paths] == ["investigations.parquet", "publications.parquet", "files.parquet"]
    tables = load_all(_fixture_raw(tmp_path))
    for name, df, p in zip(metadata.META_TABLES, tables, paths):
        pd.testing.assert_frame_equal(df, pd.read_parquet(p))            # values, dtypes (Int64, string, datetime), NA
    assert [len(t) for t in tables] == [1, 3, 7]


def test_export_is_byte_deterministic(tmp_path):
    raw = _fixture_raw(tmp_path)
    a, b = metadata.export(tmp_path / "a", raw), metadata.export(tmp_path / "b", raw)
    assert [x.read_bytes() for x in a] == [y.read_bytes() for y in b]


def test_size_budget_on_committed_export():
    total = sum((metadata.META_DIR / f"{n}.parquet").stat().st_size for n in metadata.META_TABLES)
    assert 0 < total < 5_000_000, f"{total / 1e6:.2f} MB exceeds the 5 MB commit budget"


def test_connect_meta_missing_export_is_a_clear_error(monkeypatch, tmp_path):
    monkeypatch.setattr(metadata, "META_DIR", tmp_path)
    with pytest.raises(FileNotFoundError, match="metadata export missing"):
        metadata.connect_meta()


def test_connect_meta_works_without_raw_and_from_any_cwd(monkeypatch, tmp_path):
    """The acceptance criterion: readable without raw/ (RAW_DIR pointed at an empty folder, cwd elsewhere)."""
    monkeypatch.setattr(metadata, "RAW_DIR", tmp_path / "no_raw_here")
    monkeypatch.chdir(tmp_path)
    con = metadata.connect_meta()
    n = {t: con.execute(f"SELECT count(*) FROM {t}").fetchone()[0] for t in metadata.META_TABLES}
    assert n == {"investigations": 24, "publications": 352, "files": 27076}
    assert con.execute("SELECT count(*) FROM investigations WHERE doi IS NULL").fetchone()[0] == 0
    assert con.execute("SELECT count(*) FROM publications WHERE doi IS NULL").fetchone()[0] == 68
    assert con.execute("SELECT count(*) FROM files WHERE status='added' AND ext='.mp4'").fetchone()[0] == 855
    types = {r[0]: r[1] for r in con.execute("DESCRIBE investigations").fetchall()}
    assert types["start_date"].startswith("TIMESTAMP") and types["total_file_size"] == "BIGINT"


def test_build_meta_file_is_idempotent_and_ignored_by_git(tmp_path):
    out = metadata.build_meta(tmp_path / "meta.duckdb")
    assert metadata.build_meta(out) == out
    with duckdb_read(out) as c:
        assert c.execute("SELECT count(*) FROM files").fetchone()[0] == 27076
    assert "*.duckdb" in (REPO / ".gitignore").read_text()                 # the .duckdb file is never committed


def duckdb_read(p):
    import duckdb
    return duckdb.connect(str(p), read_only=True)


@needs_raw
def test_committed_export_equals_fresh_export_from_raw(tmp_path):
    fresh = metadata.export(tmp_path / "fresh")
    for name, p in zip(metadata.META_TABLES, fresh):
        pd.testing.assert_frame_equal(pd.read_parquet(metadata.META_DIR / f"{name}.parquet"), pd.read_parquet(p))
    assert sum(p.stat().st_size for p in fresh) < 5_000_000


@needs_raw
def test_export_does_not_touch_raw(tmp_path):
    before = {p: hashlib.md5(p.read_bytes()).hexdigest() for p in sorted(RAW.glob("PSI-*/detail.json"))}
    metadata.export(tmp_path / "m")
    assert before == {p: hashlib.md5(p.read_bytes()).hexdigest() for p in sorted(RAW.glob("PSI-*/detail.json"))}


# ---------------------------------------------------------------- D3: DOI validation
from src.data_layer.metadata import doi_flag  # noqa: E402

VALID = ["10.60555/4qc4-de67", "10.1016/S0010-2180(01)00247-4", "10.1016/j.combustflame.2017.03.001",
         "10.2514/6.2005-341", "10.1155/2012/587987", "10.123456789/abc"]
INVALID = ["doi:10.1000/x", "https://doi.org/10.1000/x", "10.12/x", "10.1234/", "11.1000/x", "10.1000/has space",
           "10.1000/tab\tx", " 10.1000/x", "10.1000/x ", "10.1234567890/x", "abc"]
MISSING = [None, pd.NA, float("nan"), "", "   ", "\n"]


@pytest.mark.parametrize("v", VALID)
def test_doi_flag_ok(v):
    assert doi_flag(v) == "ok"


@pytest.mark.parametrize("v", INVALID)
def test_doi_flag_invalid(v):
    assert doi_flag(v) == "invalid_format"


@pytest.mark.parametrize("v", MISSING)
def test_doi_flag_missing_is_not_invalid(v):
    assert doi_flag(v) == "missing"


def test_doi_invalid_is_flagged_not_dropped_or_repaired():
    obj = json.loads(FIX.read_text())
    bad = "https://doi.org/10.1000/xyz"
    obj["publications"][0]["doi"] = bad
    obj["doi"] = "doi:10.60555/4qc4-de67"
    inv, pubs, _ = parse_detail(obj, "PSI-25", "x")
    assert len(pubs) == 3                                              # nothing dropped
    assert pubs.doi.iloc[0] == bad and pubs.doi_flag.iloc[0] == "invalid_format"   # kept verbatim, not repaired
    assert pubs.doi_flag.tolist() == ["invalid_format", "ok", "missing"]
    assert inv["doi"] == "doi:10.60555/4qc4-de67" and inv["doi_flag"] == "invalid_format"
    assert inv["n_publication_dois"] == 1                              # only valid DOIs count


def test_pub_doi_status_three_states(parsed):
    obj, (inv, _, _) = parsed
    assert (inv["pub_doi_status"], inv["n_publication_dois"], inv["doi_flag"]) == ("ok", 2, "ok")
    nodoi = copy.deepcopy(obj)
    for p in nodoi["publications"]:
        p["doi"] = ""
    assert parse_detail(nodoi, "PSI-25", "x")[0]["pub_doi_status"] == "no_doi"
    nopub = copy.deepcopy(obj)
    nopub["publications"] = []
    i3 = parse_detail(nopub, "PSI-25", "x")[0]
    assert (i3["pub_doi_status"], i3["n_publication_dois"]) == ("no_publications", 0)
    allbad = copy.deepcopy(obj)
    for p in allbad["publications"]:
        p["doi"] = "not-a-doi"
    assert parse_detail(allbad, "PSI-25", "x")[0]["pub_doi_status"] == "no_doi"      # nothing usable to cite


def test_doi_flags_in_committed_export_without_raw(monkeypatch, tmp_path):
    """Readable without raw/: flags are part of the committed export."""
    monkeypatch.setattr(metadata, "RAW_DIR", tmp_path / "no_raw_here")
    con = metadata.connect_meta()
    q = lambda sql: con.execute(sql).fetchall()
    assert dict(q("SELECT doi_flag, count(*) FROM publications GROUP BY 1")) == {"ok": 284, "missing": 68}
    assert dict(q("SELECT doi_flag, count(*) FROM investigations GROUP BY 1")) == {"ok": 24}
    assert dict(q("SELECT pub_doi_status, count(*) FROM investigations GROUP BY 1")) == {"ok": 22, "no_doi": 1, "no_publications": 1}
    assert q("SELECT psi_id FROM investigations WHERE pub_doi_status = 'no_doi'") == [("PSI-100",)]
    assert q("SELECT psi_id FROM investigations WHERE pub_doi_status = 'no_publications'") == [("PSI-115",)]
    assert q("SELECT count(*) FROM investigations WHERE pub_doi_status IS NULL OR doi_flag IS NULL")[0][0] == 0


def test_doi(parsed):
    """Acceptance: every investigation has >=1 usable publication DOI or carries a 'no_doi'/'no_publications' status;
    every invalid DOI is flagged (none exist in the real data today, hence the injected cases above)."""
    con = metadata.connect_meta()
    inv = con.execute("SELECT psi_id, doi, doi_flag, pub_doi_status, n_publication_dois FROM investigations").df()
    assert inv.pub_doi_status.isin(["ok", "no_doi", "no_publications"]).all()
    assert ((inv.pub_doi_status == "ok") == (inv.n_publication_dois > 0)).all()
    pubs = con.execute("SELECT doi, doi_flag FROM publications").df()
    assert (pubs.doi_flag.eq("invalid_format") == (pubs.doi.notna() & ~pubs.doi.fillna("").str.fullmatch(r"10\.\d{4,9}/\S+"))).all()
    assert (pubs.doi_flag.eq("missing") == pubs.doi.isna()).all()
