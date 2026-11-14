"""Acceptance tests for plans/01_m1_discovery step A3: review of the text-derived envelope.

Every row of meta/inv_envelope_text.parquet (produced by A2) gets exactly one review entry in
meta/inv_envelope_text_review.csv (decision doğru / düzeltildi / silindi). The evidence file
docs/evidence/envelope_review.md is generated from parquet + csv (drift guard).

These tests check the RULES of a review (no invented numbers, quotes stay verbatim, rejected rows
are deleted, context is per investigation, ...) and the behaviour of apply_review on a crafted
frame. They deliberately do not pin individual reviewer decisions.
"""
import math
import re
import subprocess
import sys

import pandas as pd
import pytest

from conftest import REPO
from src.data_layer.store import connect_all

META = REPO / "data_analysis" / "Nasa_data" / "meta"
PARQUET = META / "inv_envelope_text.parquet"
REVIEW_CSV = META / "inv_envelope_text_review.csv"
REVIEW_MD = REPO / "docs" / "evidence" / "envelope_review.md"
PY = "/home/halil/miniconda3/envs/nasa_hack/bin/python"

REVIEW_COLUMNS = ["row", "psi_id", "field", "decision", "context", "corrected_field",
                  "corrected_value_text", "corrected_value_min_std", "corrected_value_max_std", "note"]
CORRECTED = ["corrected_field", "corrected_value_text", "corrected_value_min_std",
             "corrected_value_max_std"]
DECISIONS = ["doğru", "düzeltildi", "silindi"]
CONTEXTS = {"experiment", "modeling"}
FIELDS = ["o2", "pressure", "flow", "diluent", "fuel_or_material",
          "material_class", "gravity", "phenomenon"]
SECTIONS = ["title", "objective", "approach", "hypothesis", "research_impacts"]
REVIEWER_LINE = "İnceleyen: Claude (geliştirici), 2026-11-14"
FACT_COLUMNS = ["psi_id", "field", "value_min", "value_max", "unit_raw", "value_text", "section",
                "source_span", "value_min_std", "value_max_std", "unit_std", "source", "accepted",
                "reject_reason"]


# ---------------------------------------------------------------- helpers / fixtures

def _norm(s):
    return " ".join(str(s).split()).casefold()  # every Unicode whitespace -> one space


def _isna(x):
    return x is None or (isinstance(x, float) and math.isnan(x)) or pd.isna(x)


def _blank(x):
    return _isna(x) or str(x).strip() == ""


def _same(a, b):
    if _isna(a) and _isna(b):
        return True
    if _isna(a) or _isna(b):
        return False
    if isinstance(a, float) or isinstance(b, float):
        try:
            return float(a) == pytest.approx(float(b))
        except (TypeError, ValueError):
            return False
    return a == b


@pytest.fixture(scope="module")
def te():
    from src.discovery import text_envelope
    return text_envelope


@pytest.fixture(scope="module")
def facts():
    return pd.read_parquet(PARQUET)


@pytest.fixture(scope="module")
def raw_review():
    """The committed csv read as plain strings (independent of load_review)."""
    return pd.read_csv(REVIEW_CSV, dtype=str, keep_default_na=False, encoding="utf-8")


@pytest.fixture(scope="module")
def review(te):
    return te.load_review()


@pytest.fixture(scope="module")
def applied(te, facts, review):
    return te.apply_review(facts, review)


@pytest.fixture(scope="module")
def real_sections():
    con = connect_all()
    df = con.execute("SELECT psi_id, " + ", ".join(SECTIONS) + " FROM investigations").df()
    return {r.psi_id: {s: (getattr(r, s) or "") for s in SECTIONS} for r in df.itertuples()}


def _review_by_row(raw_review):
    return {int(r["row"]): r for _, r in raw_review.iterrows()}


# ---------------------------------------------------------------- the plan's acceptance test

def test_review_evidence(te, facts, review, raw_review):
    """md exists, equals render_review_md(parquet, csv), lists every row's decision, counts agree."""
    assert REVIEW_MD.exists(), "docs/evidence/envelope_review.md missing"
    md = REVIEW_MD.read_text(encoding="utf-8")
    rendered = te.render_review_md(facts, review)
    assert isinstance(rendered, str)
    assert md.rstrip("\n") == rendered.rstrip("\n"), \
        "envelope_review.md drifted; regenerate with `python -m src.discovery.text_envelope review-md`"

    assert REVIEWER_LINE in md

    table_lines = [ln for ln in md.splitlines() if ln.strip().startswith("|")]
    by_row = _review_by_row(raw_review)
    for i in range(len(facts)):
        rv = by_row[i]
        hits = []
        for ln in table_lines:
            cells = [c.strip().strip("`*") for c in ln.strip().strip("|").split("|")]
            if str(i) in cells and facts.psi_id.iloc[i] in cells:
                hits.append(cells)
        assert len(hits) == 1, f"row {i}: expected exactly one table line, got {len(hits)}"
        cells = hits[0]
        assert rv["decision"] in cells, f"row {i}: decision {rv['decision']!r} not in its table line"
        assert rv["context"] in cells
        assert facts.field.iloc[i] in cells

    # summary line: one line carrying every decision with its count
    counts = raw_review.decision.value_counts().to_dict()

    def has_count(line, d, n):
        pats = [rf"{d}\W{{0,4}}{n}\b", rf"\b{n}\W{{0,4}}{d}"]
        return any(re.search(p, line) for p in pats)

    summary = [ln for ln in md.splitlines()
               if not ln.strip().startswith("|")
               and all(has_count(ln, d, counts.get(d, 0)) for d in DECISIONS)]
    assert summary, f"no summary line with counts {counts}"
    assert sum(counts.get(d, 0) for d in DECISIONS) == len(facts)


# ---------------------------------------------------------------- csv rules

def test_review_path_and_loader(te, raw_review):
    assert REVIEW_CSV.exists()
    assert (REPO / te.REVIEW).resolve() == REVIEW_CSV.resolve()  # absolute REVIEW wins over REPO
    df = te.load_review()
    assert isinstance(df, pd.DataFrame)
    assert list(df.columns) == REVIEW_COLUMNS
    assert len(df) == len(raw_review)


def test_csv_columns_utf8(raw_review):
    REVIEW_CSV.read_bytes().decode("utf-8")  # strict UTF-8
    assert list(raw_review.columns) == REVIEW_COLUMNS


def test_one_entry_per_parquet_row(facts, raw_review):
    rows = [int(x) for x in raw_review["row"]]
    assert sorted(rows) == list(range(len(facts))), "every parquet row exactly once"
    assert len(facts) == 33
    for _, r in raw_review.iterrows():
        i = int(r["row"])
        assert r["psi_id"] == facts.psi_id.iloc[i], f"row {i}: psi_id mismatch"
        assert r["field"] == facts.field.iloc[i], f"row {i}: field mismatch"


def test_decision_and_context_values(raw_review):
    assert set(raw_review.decision) <= set(DECISIONS)
    assert set(raw_review.context) <= CONTEXTS
    per_psi = raw_review.groupby("psi_id").context.nunique()
    assert (per_psi == 1).all(), f"context differs within an investigation: {per_psi[per_psi > 1]}"


def test_rejected_rows_deleted(facts, raw_review):
    by_row = _review_by_row(raw_review)
    rejected = [i for i in range(len(facts)) if not bool(facts.accepted.iloc[i])]
    assert len(rejected) == 2  # A2: 31 accepted, 2 rejected
    for i in rejected:
        assert by_row[i]["decision"] == "silindi", f"row {i} was rejected by A2"


def test_notes(raw_review):
    for _, r in raw_review.iterrows():
        if r["decision"] in ("düzeltildi", "silindi"):
            assert r["note"].strip(), f"row {r['row']}: note required for {r['decision']}"


def test_corrections_present_only_when_corrected(raw_review):
    for _, r in raw_review.iterrows():
        any_corr = any(not _blank(r[c]) for c in CORRECTED)
        if r["decision"] == "düzeltildi":
            assert any_corr, f"row {r['row']}: düzeltildi without any corrected_* value"
        else:
            assert not any_corr, f"row {r['row']}: corrected_* set but decision {r['decision']}"


def test_corrected_field_valid(raw_review):
    for v in raw_review.corrected_field:
        if not _blank(v):
            assert v in FIELDS


def test_corrected_text_in_span(facts, raw_review):
    for _, r in raw_review.iterrows():
        v = r["corrected_value_text"]
        if not _blank(v):
            span = facts.source_span.iloc[int(r["row"])]
            assert _norm(v) in _norm(span), f"row {r['row']}: {v!r} not in its source_span"


def test_corrected_numbers_not_invented(facts, raw_review):
    """A corrected number must be one of the row's original std numbers; min <= max afterwards."""
    for _, r in raw_review.iterrows():
        i = int(r["row"])
        orig = [x for x in (facts.value_min_std.iloc[i], facts.value_max_std.iloc[i]) if not _isna(x)]
        final = {}
        for col, src in (("corrected_value_min_std", "value_min_std"),
                         ("corrected_value_max_std", "value_max_std")):
            v = r[col].strip()
            if v == "":
                final[src] = facts[src].iloc[i]
            elif v == "unknown":
                final[src] = float("nan")
            else:
                x = float(v)  # must parse
                assert any(x == pytest.approx(o) for o in orig), \
                    f"row {i}: {col}={v} is not among the original numbers {orig}"
                final[src] = x
        lo, hi = final["value_min_std"], final["value_max_std"]
        if not _isna(lo) and not _isna(hi):
            assert lo <= hi, f"row {i}: min > max after review"


# ---------------------------------------------------------------- apply_review on the real data

def test_apply_no_deleted_rows(applied, raw_review):
    deleted = {int(r["row"]) for _, r in raw_review.iterrows() if r["decision"] == "silindi"}
    kept = set(int(x) for x in applied["row"])
    assert kept.isdisjoint(deleted)
    assert kept == set(range(len(raw_review))) - deleted
    assert len(applied) == len(kept)
    assert set(applied.review_decision) <= {"doğru", "düzeltildi"}
    assert applied.accepted.astype(bool).all()


def test_apply_columns(applied):
    for c in FACT_COLUMNS + ["review_decision", "context", "note", "row"]:
        assert c in applied.columns, c


def test_apply_values(facts, applied, raw_review):
    """Corrections applied ('unknown' -> NaN); everything else equals the parquet row."""
    by_row = _review_by_row(raw_review)
    for _, a in applied.iterrows():
        i = int(a["row"])
        rv = by_row[i]
        orig = facts.iloc[i]
        assert a["review_decision"] == rv["decision"]
        assert a["context"] == rv["context"]
        expected = {c: orig[c] for c in FACT_COLUMNS}
        if not _blank(rv["corrected_field"]):
            expected["field"] = rv["corrected_field"]
        if not _blank(rv["corrected_value_text"]):
            expected["value_text"] = rv["corrected_value_text"]
        for col, src in (("corrected_value_min_std", "value_min_std"),
                         ("corrected_value_max_std", "value_max_std")):
            v = rv[col].strip()
            if v == "unknown":
                expected[src] = float("nan")
            elif v:
                expected[src] = float(v)
        for c in FACT_COLUMNS:
            assert _same(a[c], expected[c]), f"row {i} column {c}: {a[c]!r} != {expected[c]!r}"


def test_apply_no_new_numbers(facts, applied):
    for _, a in applied.iterrows():
        i = int(a["row"])
        orig = [x for x in (facts.value_min_std.iloc[i], facts.value_max_std.iloc[i]) if not _isna(x)]
        for c in ("value_min_std", "value_max_std"):
            if not _isna(a[c]):
                assert any(float(a[c]) == pytest.approx(o) for o in orig), f"row {i}: new number in {c}"
        if not _isna(a.value_min_std) and not _isna(a.value_max_std):
            assert a.value_min_std <= a.value_max_std


def test_apply_spans_still_verbatim(applied, real_sections):
    for _, a in applied.iterrows():
        text = real_sections[a.psi_id][a.section]
        assert _norm(a.source_span) in _norm(text), f"row {a['row']}: span not in current metadata text"


def test_apply_context_per_psi(applied):
    assert set(applied.context) <= CONTEXTS
    assert (applied.groupby("psi_id").context.nunique() == 1).all()


def test_apply_does_not_mutate_inputs(te, facts, review):
    f0, r0 = facts.copy(), review.copy()
    te.apply_review(facts, review)
    pd.testing.assert_frame_equal(facts, f0)
    pd.testing.assert_frame_equal(review, r0)


# ---------------------------------------------------------------- apply_review on a crafted frame

def _crafted_facts():
    nan = float("nan")
    rows = [
        # 0: kept as is
        dict(psi_id="PSI-X", field="pressure", value_min=0.5, value_max=3.0, unit_raw="atm",
             value_text=None, section="approach", source_span="between 0.5 atm to 3.0 atm",
             value_min_std=0.5, value_max_std=3.0, unit_std="atm", source="text",
             accepted=True, reject_reason=None),
        # 1: "up to 20 atm" -> min unknown
        dict(psi_id="PSI-X", field="pressure", value_min=20.0, value_max=20.0, unit_raw="atm",
             value_text=None, section="approach", source_span="elevated pressure (up to 20 atm)",
             value_min_std=20.0, value_max_std=20.0, unit_std="atm", source="text",
             accepted=True, reject_reason=None),
        # 2: deleted
        dict(psi_id="PSI-Y", field="diluent", value_min=nan, value_max=nan, unit_raw=None,
             value_text="nitrogen", section="research_impacts",
             source_span="Using nitrogen as a flame suppressant", value_min_std=nan,
             value_max_std=nan, unit_std=None, source="text", accepted=True, reject_reason=None),
        # 3: field + text corrected
        dict(psi_id="PSI-Y", field="diluent", value_min=nan, value_max=nan, unit_raw=None,
             value_text="Nomex fabric", section="approach", source_span="Nomex fabric",
             value_min_std=nan, value_max_std=nan, unit_std=None, source="text",
             accepted=True, reject_reason=None),
        # 4: max set to a number that already exists in the row (max <- min)
        dict(psi_id="PSI-Y", field="flow", value_min=5.0, value_max=40.0, unit_raw="cm/s",
             value_text=None, section="approach", source_span="from 5 to 40 cm/s",
             value_min_std=5.0, value_max_std=40.0, unit_std="cm/s", source="text",
             accepted=True, reject_reason=None),
    ]
    return pd.DataFrame(rows)[FACT_COLUMNS]


CRAFTED_CSV = """row,psi_id,field,decision,context,corrected_field,corrected_value_text,corrected_value_min_std,corrected_value_max_std,note
0,PSI-X,pressure,doğru,modeling,,,,,
1,PSI-X,pressure,düzeltildi,modeling,,,unknown,,only the maximum is given
2,PSI-Y,diluent,silindi,experiment,,,,,extinguishing agent
3,PSI-Y,diluent,düzeltildi,experiment,fuel_or_material,nomex  FABRIC,,,wrong field
4,PSI-Y,flow,düzeltildi,experiment,,,,5,crafted
"""


def test_apply_crafted(te, tmp_path):
    p = tmp_path / "review.csv"
    p.write_text(CRAFTED_CSV, encoding="utf-8")
    review = te.load_review(p)
    assert list(review.columns) == REVIEW_COLUMNS
    out = te.apply_review(_crafted_facts(), review).reset_index(drop=True)
    assert [int(x) for x in out["row"]] == [0, 1, 3, 4]
    assert list(out.review_decision) == ["doğru", "düzeltildi", "düzeltildi", "düzeltildi"]
    assert list(out.context) == ["modeling", "modeling", "experiment", "experiment"]
    assert out.note.iloc[1] == "only the maximum is given"
    # row 0 untouched
    assert out.value_min_std.iloc[0] == 0.5 and out.value_max_std.iloc[0] == 3.0
    # row 1: min -> NaN (never 0), max unchanged
    assert _isna(out.value_min_std.iloc[1])
    assert out.value_max_std.iloc[1] == 20.0
    assert out.field.iloc[1] == "pressure"
    # row 3: field and text corrected, span untouched
    assert out.field.iloc[2] == "fuel_or_material"
    assert _norm(out.value_text.iloc[2]) == "nomex fabric"
    assert out.source_span.iloc[2] == "Nomex fabric"
    # row 4: max <- 5 (an original number); min unchanged
    assert out.value_min_std.iloc[3] == 5.0 and out.value_max_std.iloc[3] == 5.0
    assert out.psi_id.tolist() == ["PSI-X", "PSI-X", "PSI-Y", "PSI-Y"]


def test_apply_crafted_all_deleted(te, tmp_path):
    csv = "\n".join(CRAFTED_CSV.splitlines()[:1] + [
        f"{i},{pid},{fld},silindi,experiment,,,,,gone"
        for i, (pid, fld) in enumerate(_crafted_facts()[["psi_id", "field"]].itertuples(index=False))
    ]) + "\n"
    p = tmp_path / "review.csv"
    p.write_text(csv, encoding="utf-8")
    out = te.apply_review(_crafted_facts(), te.load_review(p))
    assert len(out) == 0


def test_render_crafted(te, tmp_path):
    p = tmp_path / "review.csv"
    p.write_text(CRAFTED_CSV, encoding="utf-8")
    md = te.render_review_md(_crafted_facts(), te.load_review(p))
    assert REVIEWER_LINE in md
    table = [ln for ln in md.splitlines() if ln.strip().startswith("|")]
    for i in range(5):
        assert any(str(i) in [c.strip().strip("`*") for c in ln.strip().strip("|").split("|")]
                   for ln in table), f"row {i} missing from rendered table"
    # deleted row is still listed with its decision
    assert any("silindi" in ln and "PSI-Y" in ln for ln in table)
    # counts: 1 doğru, 3 düzeltildi, 1 silindi
    assert any(re.search(r"doğru\W{0,4}1\b|\b1\W{0,4}doğru", ln)
               and re.search(r"düzeltildi\W{0,4}3\b|\b3\W{0,4}düzeltildi", ln)
               and re.search(r"silindi\W{0,4}1\b|\b1\W{0,4}silindi", ln)
               for ln in md.splitlines() if not ln.strip().startswith("|"))


# ---------------------------------------------------------------- CLI

def test_cli_review_md(te, facts, review):
    """`python -m src.discovery.text_envelope review-md` writes render_review_md(...)."""
    before = REVIEW_MD.read_bytes() if REVIEW_MD.exists() else None
    try:
        res = subprocess.run([PY, "-m", "src.discovery.text_envelope", "review-md"], cwd=REPO,
                             capture_output=True, text=True, timeout=300)
        assert res.returncode == 0, res.stderr[-2000:]
        assert REVIEW_MD.read_text(encoding="utf-8").rstrip("\n") == \
            te.render_review_md(facts, review).rstrip("\n")
    finally:
        if before is not None:
            REVIEW_MD.write_bytes(before)
        elif REVIEW_MD.exists():
            REVIEW_MD.unlink()
