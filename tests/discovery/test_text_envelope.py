"""Acceptance tests for plans/01_m1_discovery step A2: envelope from text (LLM).

The LLM is always mocked here; no test may open a network connection.
Real-text facts were checked by hand against the metadata investigations table:
  PSI-68 approach : "... varied in pressure between 0.5 atm to 3.0 atm and O2 concentration
                     between 0.1 to 0.4 mole fraction with the diluent gas making up the balance."
  PSI-142 approach: "... at elevated pressure (up to 20 atm) using DME/air mixtures."  (narrow no-break space)
  PSI-142 research_impacts: "Since many real engines operate in the 20-40 atm pressure range"
"""
import json
import math
import re
import socket

import pandas as pd
import pytest
import requests

from conftest import REPO
from src.data_layer.store import connect_all

META = REPO / "data_analysis" / "Nasa_data" / "meta"
PARQUET = META / "inv_envelope_text.parquet"
CACHE = META / "llm_cache"

TABLELESS = ["PSI-26", "PSI-47", "PSI-60", "PSI-62", "PSI-68",
             "PSI-106", "PSI-115", "PSI-117", "PSI-142"]
SECTIONS = ["title", "objective", "approach", "hypothesis", "research_impacts"]
FIELDS = ["o2", "pressure", "flow", "diluent", "fuel_or_material",
          "material_class", "gravity", "phenomenon"]
NUMERIC = {"o2", "pressure", "flow"}
COLUMNS = ["psi_id", "field", "value_min", "value_max", "unit_raw", "value_text", "section",
           "source_span", "value_min_std", "value_max_std", "unit_std", "source", "accepted",
           "reject_reason"]
REASONS = {"unknown_field", "unknown_section", "span_not_in_source", "missing_value",
           "number_not_in_span", "unknown_unit", "min_gt_max", "out_of_range", "text_not_in_span"}
UNIT_STD = {"o2": "%", "pressure": "atm", "flow": "cm/s"}
SECRET = "sk-TEST-SECRET-0123456789abcdef"


# ---------------------------------------------------------------- helpers / fixtures

def _norm(s):
    return " ".join(str(s).split())  # str.split() splits on every Unicode whitespace (incl. \xa0,  )


def _isna(x):
    return x is None or (isinstance(x, float) and math.isnan(x)) or pd.isna(x)


def fact(field, span, section="approach", value_min=None, value_max=None, unit=None, value_text=None):
    return {"field": field, "value_min": value_min, "value_max": value_max, "unit": unit,
            "value_text": value_text, "section": section, "source_span": span}


def synth(**texts):
    """A sections dict with every section present (unlisted ones empty)."""
    return {s: texts.get(s, "") for s in SECTIONS}


@pytest.fixture(scope="module")
def te():
    from src.discovery import text_envelope
    return text_envelope


@pytest.fixture(scope="module")
def llm_mod():
    from src.discovery import llm
    return llm


@pytest.fixture(scope="module")
def real_sections():
    con = connect_all()
    df = con.execute("SELECT psi_id, " + ", ".join(SECTIONS) + " FROM investigations").df()
    return {r.psi_id: {s: (getattr(r, s) or "") for s in SECTIONS} for r in df.itertuples()}


@pytest.fixture
def no_network(monkeypatch):
    def boom(*a, **k):
        raise AssertionError("network access attempted in a test")
    monkeypatch.setattr(socket.socket, "connect", boom)
    monkeypatch.setattr(socket.socket, "connect_ex", boom)
    monkeypatch.setattr(socket, "create_connection", boom)
    monkeypatch.setattr(socket, "getaddrinfo", boom)


@pytest.fixture
def clean_env(monkeypatch):
    for k in ("API_KEY", "LLM_BASE_URL", "LLM_MODEL"):
        monkeypatch.delenv(k, raising=False)


def one(te, psi, f, sections):
    df = te.validate_facts(psi, [f], sections)
    assert len(df) == 1
    return df.iloc[0]


# ---------------------------------------------------------------- the plan's acceptance test

def test_text_spans(te, real_sections):
    """Real verbatim quote (PSI-68) is accepted, a fabricated quote is rejected."""
    secs = te.source_sections("PSI-68")
    quote = "varied in pressure between 0.5 atm to 3.0 atm"
    assert quote in real_sections["PSI-68"]["approach"]  # sanity: the quote really exists
    fabricated = "varied in pressure between 0.2 atm to 5.0 atm"
    assert fabricated not in _norm(real_sections["PSI-68"]["approach"])
    df = te.validate_facts("PSI-68", [
        fact("pressure", quote, value_min=0.5, value_max=3.0, unit="atm"),
        fact("pressure", fabricated, value_min=0.2, value_max=5.0, unit="atm"),
    ], secs)
    assert list(df.columns) == COLUMNS
    assert len(df) == 2
    ok, bad = df.iloc[0], df.iloc[1]
    assert bool(ok.accepted) is True and _isna(ok.reject_reason)
    assert ok.unit_std == "atm"
    assert ok.value_min_std == pytest.approx(0.5) and ok.value_max_std == pytest.approx(3.0)
    assert bool(bad.accepted) is False and bad.reject_reason == "span_not_in_source"
    # every accepted span occurs (normalised) in the source text
    for r in df[df.accepted].itertuples():
        assert _norm(r.source_span) in _norm(secs[r.section])
    assert (df.source == "text").all()


# ---------------------------------------------------------------- inputs: ids, sections, prompt

def test_tableless_ids(te):
    assert te.tableless_ids() == TABLELESS
    assert te.tableless_ids(connect_all()) == TABLELESS


def test_constants(te):
    assert list(te.SECTIONS) == SECTIONS
    assert list(te.FIELDS) == FIELDS


def test_source_sections(te, real_sections):
    for psi in ("PSI-68", "PSI-142", "PSI-26"):
        secs = te.source_sections(psi)
        assert list(secs) == SECTIONS or set(secs) == set(SECTIONS)
        for s in SECTIONS:
            assert isinstance(secs[s], str)
            assert secs[s] == real_sections[psi][s]
    assert "0.5 atm to 3.0 atm" in te.source_sections("PSI-68")["approach"]


def test_build_prompt(te):
    for psi in ("PSI-68", "PSI-142"):
        secs = te.source_sections(psi)
        system, user = te.build_prompt(psi, secs)
        assert isinstance(system, str) and isinstance(user, str)
        for s in SECTIONS:
            assert s in user
            assert secs[s] in user, f"{psi}/{s} text missing from prompt"
        low = system.lower()
        assert "verbatim" in low
        assert "json" in low
        assert "facts" in system
        for k in ("source_span", "field", "section"):
            assert k in system


# ---------------------------------------------------------------- validate_facts: rules

def test_columns_and_source(te):
    secs = synth(approach="pressure of 1 atm in nitrogen")
    df = te.validate_facts("PSI-1", [
        fact("pressure", "pressure of 1 atm", value_min=1, unit="atm"),
        fact("diluent", "in nitrogen", value_text="nitrogen"),
        fact("bogus", "in nitrogen", value_text="nitrogen"),
    ], secs)
    assert list(df.columns) == COLUMNS
    assert (df.source == "text").all()
    assert (df.psi_id == "PSI-1").all()
    assert df.accepted.dtype == bool
    assert df.accepted.tolist() == [True, True, False]


def test_empty_facts(te):
    df = te.validate_facts("PSI-1", [], synth())
    assert len(df) == 0
    assert list(df.columns) == COLUMNS


def test_unknown_field_first(te):
    # unknown field AND unknown section -> field rule wins
    r = one(te, "PSI-1", fact("temperature", "x", section="abstract", value_text="x"), synth(approach="x"))
    assert r.reject_reason == "unknown_field" and not r.accepted


def test_unknown_section(te):
    r = one(te, "PSI-1", fact("diluent", "nitrogen", section="abstract", value_text="nitrogen"),
            synth(approach="nitrogen"))
    assert r.reject_reason == "unknown_section"


@pytest.mark.parametrize("span", ["", None, "helium atmosphere", "nitrogen  diluent gas X"])
def test_span_not_in_source(te, span):
    r = one(te, "PSI-1", fact("diluent", span, value_text="nitrogen"),
            synth(approach="the nitrogen diluent gas"))
    assert r.reject_reason == "span_not_in_source" and not r.accepted


def test_span_in_other_section_rejected(te):
    """The quote must be in the section the LLM named, not just anywhere."""
    r = one(te, "PSI-1", fact("diluent", "nitrogen diluent", section="objective", value_text="nitrogen"),
            synth(approach="the nitrogen diluent gas", objective="something else"))
    assert r.reject_reason == "span_not_in_source"


def test_whitespace_normalisation_synthetic(te):
    secs = synth(approach="pressure\nof 2 atm   and\tmore")
    r = one(te, "PSI-1", fact("pressure", "pressure of 2 atm and more", value_min=2, unit="atm"), secs)
    assert r.accepted, r.reject_reason
    r = one(te, "PSI-1", fact("pressure", "  pressure  of 2 atm ", value_min=2, unit="atm"), secs)
    assert r.accepted, r.reject_reason


def test_whitespace_real_psi142(te, real_sections):
    raw = real_sections["PSI-142"]["approach"]
    assert "20 atm" in raw and "20 atm" not in raw  # the source uses a narrow no-break space
    secs = te.source_sections("PSI-142")
    r = one(te, "PSI-142", fact("pressure", "elevated pressure (up to 20 atm)", value_min=20, unit="atm"), secs)
    assert r.accepted, r.reject_reason
    assert r.value_min_std == pytest.approx(20) and r.value_max_std == pytest.approx(20)


def test_range_dash_real_psi142(te):
    secs = te.source_sections("PSI-142")
    r = one(te, "PSI-142", fact("pressure", "operate in the 20-40 atm pressure range", section="research_impacts",
                                value_min=20, value_max=40, unit="atm"), secs)
    assert r.accepted, r.reject_reason
    assert (r.value_min_std, r.value_max_std) == (pytest.approx(20), pytest.approx(40))


def test_newline_real_psi68(te, real_sections):
    """Span crossing a paragraph break (\\n\\n) in the source still matches after normalisation."""
    raw = real_sections["PSI-68"]["approach"]
    assert "near real time.\n\nThe overall investigation" in raw
    secs = te.source_sections("PSI-68")
    r = one(te, "PSI-68", fact("phenomenon", "near real time. The overall investigation", value_text="real time"),
            secs)
    assert r.accepted, r.reject_reason


@pytest.mark.parametrize("vmin,vmax", [(None, None), (None, 3.0)])
def test_numeric_missing_value(te, vmin, vmax):
    r = one(te, "PSI-1", fact("pressure", "between 0.5 atm to 3.0 atm", value_min=vmin, value_max=vmax, unit="atm"),
            synth(approach="between 0.5 atm to 3.0 atm"))
    assert r.reject_reason == "missing_value"


def test_text_missing_value(te):
    r = one(te, "PSI-1", fact("diluent", "nitrogen diluent", value_text=None), synth(approach="nitrogen diluent"))
    assert r.reject_reason == "missing_value"


def test_value_max_defaults_to_min(te):
    r = one(te, "PSI-1", fact("pressure", "at 2 atm", value_min=2, value_max=None, unit="atm"),
            synth(approach="at 2 atm"))
    assert r.accepted
    assert r.value_min_std == pytest.approx(2) and r.value_max_std == pytest.approx(2)


@pytest.mark.parametrize("vmin,vmax,ok", [
    (0.5, 3.0, True),
    (0.5, 3, True),       # 3 matches "3.0"
    (0.5, None, True),
    (5, None, False),     # 5 is not 0.5
    (0.5, 4.0, False),    # 4.0 absent
    (1.5, 3.0, False),
])
def test_number_in_span(te, vmin, vmax, ok):
    secs = synth(approach="between 0.5 atm to 3.0 atm")
    r = one(te, "PSI-1", fact("pressure", "between 0.5 atm to 3.0 atm", value_min=vmin, value_max=vmax, unit="atm"),
            secs)
    if ok:
        assert r.accepted, r.reject_reason
    else:
        assert r.reject_reason == "number_not_in_span"


@pytest.mark.parametrize("field,value,unit,std_value,std_unit", [
    ("pressure", 14.7, "psia", 14.7 * 0.068046, "atm"),
    ("pressure", 14.7, "psi", 14.7 * 0.068046, "atm"),
    ("pressure", 101.325, "kPa", 1.0, "atm"),
    ("pressure", 101.325, " KPA ", 1.0, "atm"),
    ("pressure", 2.0265, "bar", 2.0, "atm"),
    ("pressure", 380, "mmHg", 0.5, "atm"),
    ("pressure", 380, "torr", 0.5, "atm"),
    ("pressure", 2, "ATM", 2.0, "atm"),
    ("flow", 50, "mm/s", 5.0, "cm/s"),
    ("flow", 0.25, "m/s", 25.0, "cm/s"),
    ("flow", 12, "cm/s", 12.0, "cm/s"),
    ("o2", 21, "%", 21.0, "%"),
    ("o2", 21, "percent", 21.0, "%"),
])
def test_unit_conversion(te, field, value, unit, std_value, std_unit):
    span = f"a value of {value} here"
    r = one(te, "PSI-1", fact(field, span, value_min=value, unit=unit), synth(approach=span))
    assert r.accepted, r.reject_reason
    assert r.unit_std == std_unit
    assert r.value_min_std == pytest.approx(std_value, rel=1e-4)
    assert r.value_max_std == pytest.approx(std_value, rel=1e-4)
    assert r.unit_raw == unit  # raw unit kept as given


@pytest.mark.parametrize("unit", ["furlongs", None, "mole fraction", "atm/s", "ppm"])
def test_unknown_unit(te, unit):
    r = one(te, "PSI-1", fact("pressure", "at 2 atm", value_min=2, unit=unit), synth(approach="at 2 atm"))
    assert r.reject_reason == "unknown_unit"


def test_o2_mole_fraction_real_psi68(te, real_sections):
    """Contract change: o2 'mole fraction' -> % (x100); number check uses the raw numbers."""
    quote = "O2 concentration between 0.1 to 0.4 mole fraction"
    assert quote in real_sections["PSI-68"]["approach"]
    secs = te.source_sections("PSI-68")
    r = one(te, "PSI-68", fact("o2", quote, value_min=0.1, value_max=0.4, unit="mole fraction"), secs)
    assert r.accepted, r.reject_reason
    assert r.unit_std == "%"
    assert r.value_min_std == pytest.approx(10.0) and r.value_max_std == pytest.approx(40.0)
    assert r.unit_raw == "mole fraction" and r.value_min == pytest.approx(0.1)
    # converted numbers are NOT in the span -> rejected
    r = one(te, "PSI-68", fact("o2", quote, value_min=10, value_max=40, unit="mole fraction"), secs)
    assert r.reject_reason == "number_not_in_span"
    r = one(te, "PSI-68", fact("o2", quote, value_min=10, value_max=40, unit="%"), secs)
    assert r.reject_reason == "number_not_in_span"


@pytest.mark.parametrize("unit", ["mole fraction", "mol fraction", " Mole Fraction ", "MOL FRACTION"])
def test_o2_mole_fraction_spellings(te, unit):
    span = "oxygen at 0.21 of the gas"
    r = one(te, "PSI-1", fact("o2", span, value_min=0.21, unit=unit), synth(approach=span))
    assert r.accepted, r.reject_reason
    assert r.unit_std == "%" and r.value_min_std == pytest.approx(21.0)


def test_o2_mole_fraction_out_of_range(te):
    span = "oxygen at 1.5 of the gas"
    r = one(te, "PSI-1", fact("o2", span, value_min=1.5, unit="mole fraction"), synth(approach=span))
    assert r.reject_reason == "out_of_range"
    assert _isna(r.value_min_std)
    span = "oxygen at 1.0 of the gas"   # 100 % boundary still accepted
    r = one(te, "PSI-1", fact("o2", span, value_min=1.0, unit="mol fraction"), synth(approach=span))
    assert r.accepted and r.value_min_std == pytest.approx(100.0)


def test_mole_fraction_only_for_o2(te):
    r = one(te, "PSI-1", fact("pressure", "at 0.5 here", value_min=0.5, unit="mole fraction"),
            synth(approach="at 0.5 here"))
    assert r.reject_reason == "unknown_unit"


@pytest.mark.parametrize("span,vmin,vmax,ok", [
    ("range 20-40 atm", 20, 40, True),       # dash after digit = range separator
    ("range 0.5-3.0 atm", 0.5, 3.0, True),
    ("range 20-40 atm", 20, -40, False),     # -40 is not in the span
])
def test_dash_range_separator(te, span, vmin, vmax, ok):
    r = one(te, "PSI-1", fact("pressure", span, value_min=vmin, value_max=vmax, unit="atm"), synth(approach=span))
    if ok:
        assert r.accepted, r.reject_reason
    else:
        assert not r.accepted


def test_dash_without_digit_is_minus(te):
    """A '-' not preceded by a digit makes a negative number: 'at -5 cm/s' contains -5, not 5."""
    span = "drift at -5 cm/s"
    r = one(te, "PSI-1", fact("flow", span, value_min=5, unit="cm/s"), synth(approach=span))
    assert r.reject_reason == "number_not_in_span"
    r = one(te, "PSI-1", fact("flow", span, value_min=-5, unit="cm/s"), synth(approach=span))
    assert r.reject_reason == "out_of_range"


def test_unit_not_shared_between_fields(te):
    """'%' is an o2 unit, not a pressure unit; 'atm' is not a flow unit."""
    r = one(te, "PSI-1", fact("pressure", "at 2 here", value_min=2, unit="%"), synth(approach="at 2 here"))
    assert r.reject_reason == "unknown_unit"
    r = one(te, "PSI-1", fact("flow", "at 2 here", value_min=2, unit="atm"), synth(approach="at 2 here"))
    assert r.reject_reason == "unknown_unit"


def test_min_gt_max(te):
    r = one(te, "PSI-1", fact("pressure", "between 0.5 atm to 3.0 atm", value_min=3.0, value_max=0.5, unit="atm"),
            synth(approach="between 0.5 atm to 3.0 atm"))
    assert r.reject_reason == "min_gt_max"


@pytest.mark.parametrize("field,value,unit", [
    ("o2", 150, "%"),
    ("pressure", 0, "atm"),
])
def test_out_of_range(te, field, value, unit):
    span = f"value {value} {unit}"
    r = one(te, "PSI-1", fact(field, span, value_min=value, unit=unit), synth(approach=span))
    assert r.reject_reason == "out_of_range"


@pytest.mark.parametrize("field,value,unit", [("o2", 0, "%"), ("o2", 100, "%"), ("flow", 0, "cm/s")])
def test_range_boundaries_accepted(te, field, value, unit):
    span = f"value {value} {unit}"
    r = one(te, "PSI-1", fact(field, span, value_min=value, unit=unit), synth(approach=span))
    assert r.accepted, r.reject_reason


def test_text_fields(te):
    secs = synth(approach="Burning in a Nitrogen diluent under microgravity")
    df = te.validate_facts("PSI-1", [
        fact("diluent", "in a Nitrogen diluent", value_text="nitrogen"),          # case-insensitive
        fact("gravity", "under  microgravity", value_text="microgravity"),        # span whitespace normalised
        fact("diluent", "in a Nitrogen diluent", value_text="helium"),            # not in span
        fact("fuel_or_material", "Burning in", value_text="microgravity"),       # in source, not in span
    ], secs)
    assert df.accepted.tolist() == [True, True, False, False]
    assert df.reject_reason.tolist()[2:] == ["text_not_in_span", "text_not_in_span"]
    for r in df.itertuples():
        assert _isna(r.value_min_std) and _isna(r.value_max_std) and _isna(r.unit_std)
    assert df.value_text.tolist() == ["nitrogen", "microgravity", "helium", "microgravity"]


def test_rejected_rows_keep_raw(te):
    secs = synth(approach="between 0.5 atm to 3.0 atm")
    df = te.validate_facts("PSI-9", [
        fact("pressure", "between 0.5 atm to 3.0 atm", value_min=3.0, value_max=0.5, unit="atm"),
        fact("pressure", "invented 7 kPa", value_min=7, value_max=8, unit="kPa"),
        fact("o2", "between 0.5 atm to 3.0 atm", value_min=0.5, unit="ppm"),
    ], secs)
    assert df.reject_reason.tolist() == ["min_gt_max", "span_not_in_source", "unknown_unit"]
    assert not df.accepted.any()
    assert df.value_min.tolist() == [3.0, 7, 0.5]
    assert df.value_max.tolist()[:2] == [0.5, 8]
    assert df.unit_raw.tolist() == ["atm", "kPa", "ppm"]
    assert df.source_span.tolist()[1] == "invented 7 kPa"
    assert df.section.tolist() == ["approach"] * 3
    assert df.value_min_std.isna().all() and df.value_max_std.isna().all()
    assert (df.source == "text").all()


def test_accepted_reason_none(te):
    r = one(te, "PSI-1", fact("pressure", "at 2 atm", value_min=2, unit="atm"), synth(approach="at 2 atm"))
    assert r.accepted and _isna(r.reject_reason)


# ---------------------------------------------------------------- extract_text_envelope (fake LLM)

def test_extract_text_envelope(te, no_network, real_sections):
    prompts = {te.build_prompt(p, te.source_sections(p))[1]: p for p in TABLELESS}
    assert len(prompts) == 9
    calls = []
    answers = {
        "PSI-26": {"facts": [fact("diluent", "made up story", value_text="story")]},
        "PSI-68": {"facts": [
            fact("pressure", "varied in pressure between 0.5 atm to 3.0 atm", value_min=0.5, value_max=3.0,
                 unit="atm"),
            fact("pressure", "pressure between 9 atm", value_min=9, unit="atm"),
        ]},
        "PSI-142": {"facts": [fact("pressure", "elevated pressure (up to 20 atm)", value_min=20, unit="atm")]},
    }

    def fake_llm(system, user):
        psi = prompts[user]
        calls.append(psi)
        return answers.get(psi, {"facts": []})

    df = te.extract_text_envelope(llm=fake_llm)
    assert sorted(calls, key=lambda s: int(s.split("-")[1])) == TABLELESS
    assert len(calls) == 9
    assert list(df.columns) == COLUMNS
    assert df.psi_id.tolist() == ["PSI-26", "PSI-68", "PSI-68", "PSI-142"]
    assert df.accepted.tolist() == [False, True, False, True]
    assert df.reject_reason.tolist()[0] == "span_not_in_source"
    assert df.value_min.tolist()[1:] == [0.5, 9, 20]
    assert df.value_text.tolist()[0] == "story"
    assert (df.source == "text").all()
    df2 = te.extract_text_envelope(llm=fake_llm)
    pd.testing.assert_frame_equal(df.reset_index(drop=True), df2.reset_index(drop=True))


def test_extract_subset_and_empty(te, no_network):
    seen = []

    def fake_llm(system, user):
        seen.append(user)
        return {"facts": []}

    df = te.extract_text_envelope(psi_ids=["PSI-68"], llm=fake_llm)
    assert len(seen) == 1
    assert len(df) == 0
    assert list(df.columns) == COLUMNS


# ---------------------------------------------------------------- llm.py: settings

def test_defaults(llm_mod):
    assert llm_mod.DEFAULT_BASE_URL == "https://evren-llmapi.ssyz.org.tr/v1"
    assert llm_mod.DEFAULT_MODEL == "deepseek-v4.1-flash"


@pytest.mark.parametrize("content", [
    f"API_KEY = {SECRET}\n",
    f"API_KEY={SECRET}",                      # no trailing newline
    f'API_KEY = "{SECRET}"\n',
    f"API_KEY='{SECRET}'",
    f"OTHER=1\nAPI_KEY  =  {SECRET}  \n\n",
])
def test_load_settings_parsing(llm_mod, tmp_path, clean_env, content):
    p = tmp_path / ".env"
    p.write_text(content)
    s = llm_mod.load_settings(p)
    assert s.api_key == SECRET
    assert s.base_url == llm_mod.DEFAULT_BASE_URL
    assert s.model == llm_mod.DEFAULT_MODEL
    assert SECRET not in repr(s) and SECRET not in str(s)


def test_load_settings_overrides(llm_mod, tmp_path, clean_env, monkeypatch):
    p = tmp_path / ".env"
    p.write_text(f"API_KEY = {SECRET}\nLLM_BASE_URL = https://example.invalid/v1\nLLM_MODEL = m-file")
    s = llm_mod.load_settings(env_path=p)
    assert (s.base_url, s.model) == ("https://example.invalid/v1", "m-file")
    monkeypatch.setenv("LLM_MODEL", "m-env")
    monkeypatch.setenv("API_KEY", "envkey")
    s = llm_mod.load_settings(env_path=p)
    assert s.model == "m-env" and s.api_key == "envkey"
    assert s.base_url == "https://example.invalid/v1"
    assert "envkey" not in repr(s) and "envkey" not in str(s)


def test_load_settings_missing_key(llm_mod, tmp_path, clean_env):
    p = tmp_path / ".env"
    p.write_text("LLM_MODEL = x\n")
    with pytest.raises(llm_mod.LLMError):
        llm_mod.load_settings(p)


# ---------------------------------------------------------------- llm.py: chat_json with fake session

class FakeResp:
    def __init__(self, status, payload=None, headers=None, text=None):
        self.status_code = status
        self._payload = payload
        self.headers = headers or {}
        self.text = text if text is not None else json.dumps(payload)
        self.content = self.text.encode()
        self.ok = status == 200

    def json(self):
        if self._payload is None:
            raise ValueError("no json")
        return self._payload

    def raise_for_status(self):
        if self.status_code != 200:
            raise requests.HTTPError(f"{self.status_code}")


def ok_resp(content):
    return FakeResp(200, {"choices": [{"message": {"role": "assistant", "content": content}}]})


class FakeSession:
    def __init__(self, responses):
        self.responses = list(responses)
        self.calls = []

    def post(self, url, headers=None, json=None, timeout=None, **kw):
        self.calls.append({"url": url, "headers": headers, "json": json, "timeout": timeout, **kw})
        return self.responses.pop(0)


@pytest.fixture
def settings(llm_mod, tmp_path, clean_env):
    p = tmp_path / ".env"
    p.write_text(f"API_KEY = {SECRET}\nLLM_BASE_URL = https://example.invalid/v1\nLLM_MODEL = test-model\n")
    return llm_mod.load_settings(p)


@pytest.fixture
def sleeps(llm_mod, monkeypatch):
    got = []
    monkeypatch.setattr(llm_mod, "_sleep", lambda s: got.append(float(s)))
    return got


def test_chat_json_request(llm_mod, settings, no_network, sleeps):
    sess = FakeSession([ok_resp('{"facts": [{"field": "o2"}]}')])
    out = llm_mod.chat_json("SYS", "USR", settings=settings, session=sess)
    assert out == {"facts": [{"field": "o2"}]}
    assert len(sess.calls) == 1
    c = sess.calls[0]
    assert c["url"] == "https://example.invalid/v1/chat/completions"
    assert c["headers"]["Authorization"] == f"Bearer {SECRET}"
    body = c["json"]
    assert body["model"] == "test-model"
    assert body["messages"] == [{"role": "system", "content": "SYS"}, {"role": "user", "content": "USR"}]
    assert body["max_tokens"] == 4096
    assert body["temperature"] == 0
    assert body["thinking"] is False
    assert sleeps == []


def test_chat_json_max_tokens(llm_mod, settings, no_network, sleeps):
    sess = FakeSession([ok_resp("{}")])
    assert llm_mod.chat_json("s", "u", settings=settings, max_tokens=8000, session=sess) == {}
    assert sess.calls[0]["json"]["max_tokens"] == 8000


@pytest.mark.parametrize("content", [
    '```json\n{"facts": []}\n```',
    '```\n{"facts": []}\n```',
    '  {"facts": []}  ',
])
def test_chat_json_fences(llm_mod, settings, no_network, sleeps, content):
    assert llm_mod.chat_json("s", "u", settings=settings, session=FakeSession([ok_resp(content)])) == {"facts": []}


def test_chat_json_retry_after(llm_mod, settings, no_network, sleeps):
    sess = FakeSession([FakeResp(429, {"error": "rate"}, headers={"Retry-After": "7"}),
                        FakeResp(503, {"error": "busy"}),
                        ok_resp('{"a": 1}')])
    assert llm_mod.chat_json("s", "u", settings=settings, session=sess) == {"a": 1}
    assert len(sess.calls) == 3
    assert sleeps == [7.0, 2.0]


def test_chat_json_401(llm_mod, settings, no_network, sleeps):
    sess = FakeSession([FakeResp(401, {"error": f"invalid api key {SECRET}"},
                                 text=f'{{"error": "invalid api key {SECRET}"}}')])
    with pytest.raises(llm_mod.LLMError) as ei:
        llm_mod.chat_json("s", "u", settings=settings, session=sess)
    msg = str(ei.value) + repr(ei.value)
    assert "401" in msg
    assert SECRET not in msg
    assert len(sess.calls) == 1 and sleeps == []


def test_chat_json_gives_up(llm_mod, settings, no_network, sleeps):
    sess = FakeSession([FakeResp(503, {"error": "busy"}) for _ in range(10)])
    with pytest.raises(llm_mod.LLMError) as ei:
        llm_mod.chat_json("s", "u", settings=settings, session=sess)
    assert len(sess.calls) == 5
    assert SECRET not in str(ei.value)


# ---------------------------------------------------------------- committed output (generated once)

@pytest.fixture(scope="module")
def committed():
    assert PARQUET.exists(), (f"{PARQUET} missing: run `python -m src.discovery.text_envelope generate` once "
                              "(A2 output must be generated and stored)")
    return pd.read_parquet(PARQUET)


def test_committed_schema(committed):
    df = committed
    assert list(df.columns) == COLUMNS
    assert len(df) > 0
    assert set(df.psi_id) <= set(TABLELESS)
    assert (df.source == "text").all()
    assert df[df.accepted].field.isin(FIELDS).all()
    assert df.accepted.dtype == bool


def test_committed_reasons(committed):
    df = committed
    acc, rej = df[df.accepted], df[~df.accepted]
    assert acc.reject_reason.isna().all()
    assert rej.reject_reason.notna().all()
    assert set(rej.reject_reason) <= REASONS
    assert rej.value_min_std.isna().all() and rej.value_max_std.isna().all()


def test_committed_spans_in_current_text(committed, real_sections):
    acc = committed[committed.accepted]
    assert len(acc) > 0
    for r in acc.itertuples():
        assert r.section in SECTIONS
        assert r.source_span and _norm(r.source_span) in _norm(real_sections[r.psi_id][r.section]), \
            f"{r.psi_id}/{r.section}: {r.source_span!r} not in current metadata text"
        if r.field not in NUMERIC:
            assert r.value_text and r.value_text.lower() in _norm(r.source_span).lower()


def test_committed_numeric_rows(committed):
    acc = committed[committed.accepted & committed.field.isin(NUMERIC)]
    for r in acc.itertuples():
        assert r.unit_std == UNIT_STD[r.field]
        assert pd.notna(r.value_min_std) and pd.notna(r.value_max_std)
        assert r.value_min_std <= r.value_max_std
        if r.field == "o2":
            assert 0 <= r.value_min_std and r.value_max_std <= 100
        elif r.field == "pressure":
            assert r.value_min_std > 0
        else:
            assert r.value_min_std >= 0
    # FLEX-2 (PSI-68) clearly states 0.5-3.0 atm; the stored output should contain it
    p68 = acc[(acc.psi_id == "PSI-68") & (acc.field == "pressure")]
    assert len(p68) >= 1
    assert p68.value_min_std.min() == pytest.approx(0.5) and p68.value_max_std.max() == pytest.approx(3.0)


def test_committed_reproducible_by_validator(te, committed):
    """Re-running validate_facts on the stored raw values gives the stored verdicts (no hand edits)."""
    for psi, g in committed.groupby("psi_id", sort=False):
        facts = []
        for r in g.itertuples():
            facts.append({"field": r.field,
                          "value_min": None if _isna(r.value_min) else r.value_min,
                          "value_max": None if _isna(r.value_max) else r.value_max,
                          "unit": None if _isna(r.unit_raw) else r.unit_raw,
                          "value_text": None if _isna(r.value_text) else r.value_text,
                          "section": r.section, "source_span": r.source_span})
        again = te.validate_facts(psi, facts, te.source_sections(psi))
        assert again.accepted.tolist() == g.accepted.tolist(), psi
        assert again.reject_reason.fillna("").tolist() == g.reject_reason.fillna("").tolist(), psi


def test_llm_cache_stored():
    assert CACHE.is_dir(), f"{CACHE} missing: raw LLM answers must be cached"
    files = sorted(CACHE.glob("*.json"))
    assert len(files) >= len(TABLELESS)
    for f in files:
        assert re.fullmatch(r"[0-9a-f]{64}", f.stem), f.name
        json.loads(f.read_text())


def test_app_never_calls_llm():
    app = REPO / "app"
    assert app.is_dir()
    pat = re.compile(r"discovery\.llm|discovery import llm|chat_json|extract_text_envelope|load_settings|"
                     r"evren-llmapi|API_KEY")
    hits = [f"{p.relative_to(REPO)}:{i}" for p in app.rglob("*.py")
            for i, line in enumerate(p.read_text(encoding="utf-8").splitlines(), 1) if pat.search(line)]
    assert hits == [], hits
