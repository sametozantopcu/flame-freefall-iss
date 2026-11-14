"""Tests for ``src.risk.provenance`` (R2): evidence table and consistency warnings."""
from __future__ import annotations

import json
import math

import pytest

from src.risk import engine as R
from src.risk import provenance as P


@pytest.fixture(scope="module")
def table():
    return {r["component"]: r for r in P.build_provenance()}


def test_one_record_per_component_with_schema(table):
    assert set(table) == set(P.RECORD_COMPONENTS)
    assert set(R.RISK_WEIGHTS) <= set(table)
    for r in table.values():
        assert {"component", "basis", "psi_id", "doi", "n", "r2", "note_key"} <= set(r)
        assert r["basis"] in P.BASES
        assert r["note_key"].startswith("risk.prov.")
    json.dumps(list(table.values()), allow_nan=False)  # JSON-safe, no NaN


def test_classification_matches_engine(table):
    basis = {k: v["basis"] for k, v in table.items()}
    assert basis["ignition"] == "data"
    assert basis["spread"] == "data"
    assert basis["ignition_delay"] == "literature"
    assert basis["weights"] == basis["level_thresholds"] == basis["pressure_scaling"] == "assumption"
    assert basis["oxygen"] == "assumption"
    assert {basis["duration"], basis["margin"], basis["material"], basis["material_thresholds"]} == {"mixed"}


def test_values_come_from_the_engine_not_literals(table):
    a = R.Anchors.default()
    assert (table["ignition"]["n"], table["ignition"]["psi_id"]) == (a.ignition_n, "PSI-159") and a.ignition_n == 333
    assert (table["duration"]["n"], table["duration"]["r2"]) == (a.burn_time_n, a.burn_time_r2)
    assert table["duration"]["n"] == 175 and table["duration"]["r2"] == pytest.approx(0.40, abs=0.01)
    assert table["spread"]["psi_id"] == "PSI-39" and table["spread"]["r2"] == a.spread_r2 < 0.05
    assert table["weights"]["params"] == R.RISK_WEIGHTS
    assert table["level_thresholds"]["params"] == R.RISK_THRESHOLDS
    assert table["ignition_delay"]["params"]["t_ref_s"] == R.REF_IGNITION_DELAY_S
    assert table["pressure_scaling"]["params"]["exponent"] == pytest.approx(0.35, abs=1e-6)
    assert sum(table["weights"]["params"].values()) == pytest.approx(1.0)
    for k, w in R.RISK_WEIGHTS.items():
        assert table[k]["weight"] == w


def test_custom_anchors_change_the_table():
    from dataclasses import replace
    a = replace(R.Anchors.default(), ignition_n=7, burn_time_r2=0.5)
    t = {r["component"]: r for r in P.build_provenance(a, refit=False)}
    assert t["ignition"]["n"] == 7 and t["duration"]["r2"] == 0.5


def test_dois_from_metadata_and_never_invented(table):
    assert table["ignition"]["doi"] == "10.60555/cyt1-kh64"
    assert table["spread"]["doi"] == "10.60555/m6pj-a914"
    assert table["material"]["doi"] == "10.60555/4qc4-de67"
    for k in ("oxygen", "ignition_delay", "weights", "level_thresholds", "pressure_scaling"):
        assert table[k]["psi_id"] is None and table[k]["doi"] is None


def test_spread_carries_embedded_and_refit_and_flags_difference(table):
    s = table["spread"]
    emb, fit = s["embedded"], s["feature_store_refit"]
    a = R.Anchors.default()
    assert emb == {"coef": a.spread_po2_exp, "n": a.spread_n, "r2": a.spread_r2}
    assert emb["n"] == 74 and emb["coef"] == pytest.approx(0.454)
    ref = R.Anchors.from_feature_store()
    assert fit == {"coef": ref.spread_po2_exp, "n": ref.spread_n, "r2": ref.spread_r2}
    assert fit["n"] == 66 and fit["coef"] == pytest.approx(0.319, abs=1e-3)
    assert s["refit_differs"] is True
    assert s["note_key"] == "risk.prov.spread_low_r2_refit_differs"
    # the index still uses the embedded coefficient
    assert s["params"]["coef"] == a.spread_po2_exp


def test_other_refits_equal_embedded():
    ref, emb = R.Anchors.from_feature_store(), R.Anchors.default()
    assert (ref.ignition_n, ref.burn_time_n, ref.burn_n) == (emb.ignition_n, emb.burn_time_n, emb.burn_n)
    assert ref.burn_time_r2 == pytest.approx(emb.burn_time_r2, abs=1e-3)


def test_no_refit_gives_null_and_no_flag():
    s = {r["component"]: r for r in P.build_provenance(refit=False)}["spread"]
    assert s["feature_store_refit"] is None and s["refit_differs"] is None
    assert s["note_key"] == "risk.prov.spread_low_r2"


def test_material_threshold_basis_only_pmma_is_data():
    rows = P.material_thresholds_table()
    assert [r["key"] for r in rows] == list(R.MATERIAL_PROFILES)
    assert {r["key"] for r in rows if r["basis"] == "data"} == {"PMMA"}
    assert all(math.isfinite(r["threshold_o2_pct_ref"]) for r in rows)


# --- extra warnings ------------------------------------------------------- #
ENG = R.RiskEngine()


def test_nomex_30_is_above_threshold_but_low():
    r = ENG.assess(30.0, 101.325, "Nomex")
    assert r.margin_pct > 0 and r.risk_level == "low"
    assert P.extra_warnings(r) == ["above_threshold_low_index"]


def test_pmma_21_at_70kpa_is_clipped_below_reference():
    r = ENG.assess(21.0, 70.0, "PMMA")
    assert r.pO2_atm < R.REF_PO2_ATM and r.margin_pct > 0
    assert P.extra_warnings(r) == ["above_threshold_low_index", "clipped_below_reference"]


def test_no_extra_warning_when_consistent():
    assert P.extra_warnings(ENG.assess(40.0, 101.3, "PMMA")) == []      # critical
    assert P.extra_warnings(ENG.assess(15.0, 101.3, "SIBAL")) == []     # below threshold
    inert = ENG.assess(30.0, 101.3, "Inert")
    assert "inert_material" in inert.warnings and P.extra_warnings(inert) == []


def test_extra_warnings_do_not_change_assessment():
    r = ENG.assess(30.0, 101.325, "Nomex")
    before = r.as_dict()
    P.extra_warnings(r)
    assert r.as_dict() == before
    assert "above_threshold_low_index" not in r.warnings
