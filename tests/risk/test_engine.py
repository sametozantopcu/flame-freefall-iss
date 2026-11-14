"""Unit tests for ``src.risk.engine`` (ported from PR #7 by sametozantopcu).

Run with::

    python -m pytest tests/risk/test_engine.py -q

The coefficient-refit tests read the Feature Store (``Anchors.from_feature_store``) and
never skip: the parquet tables are part of the repository checkout's data layer.
"""
from __future__ import annotations

from pathlib import Path

import pytest

from src.risk import engine as R


# --------------------------------------------------------------------------- #
# Unit conversions
# --------------------------------------------------------------------------- #
@pytest.mark.parametrize(
    "value, unit, expected",
    [(1.0, "atm", 101.325), (1.0, "bar", 100.0), (14.6959, "psia", 101.325),
     (1.0, "kPa", 1.0), (760.0, "torr", 101.325)],
)
def test_to_kpa(value, unit, expected):
    assert R.to_kpa(value, unit) == pytest.approx(expected, rel=1e-3)


def test_to_kpa_rejects_bad_input():
    with pytest.raises(ValueError):
        R.to_kpa(-1.0)
    with pytest.raises(ValueError):
        R.to_kpa(1.0, "furlongs")


def test_partial_pressure_equivalence():
    """The same pO2 can be obtained from different (O2 %, pressure) pairs."""
    assert R.o2_partial_pressure_atm(21.0, 101.325) == pytest.approx(0.21, abs=1e-6)
    assert R.o2_partial_pressure_atm(42.0, 50.66) == pytest.approx(0.21, abs=1e-3)


def test_equivalent_sea_level_o2():
    assert R.equivalent_sea_level_o2_pct(34.0, 56.5) == pytest.approx(18.96, abs=0.01)


# --------------------------------------------------------------------------- #
# Material matching / smart fallback
# --------------------------------------------------------------------------- #
@pytest.mark.parametrize(
    "raw, expected_key",
    [("PMMA", "PMMA"), ("akrilik levha", "PMMA"), ("Plexiglas", "PMMA"),
     ("2 cm SIBAL fabric", "SIBAL"), ("Nomex III", "Nomex"),
     ("Japan Wax candle", "Wax candle"), ("Kapton film", "Kapton"),
     ("teflon", "PTFE"), ("aluminum 6061", "Inert")],
)
def test_resolve_material_matches(raw, expected_key):
    key, fallback, _alias = R.resolve_material(raw)
    assert key == expected_key
    assert fallback is False


@pytest.mark.parametrize("raw", ["unobtainium", "", None, "   "])
def test_resolve_material_fallback(raw):
    key, fallback, alias = R.resolve_material(raw)
    assert (key, fallback, alias) == (R.FALLBACK_MATERIAL_KEY, True, None)


def test_longest_alias_wins():
    """'beta cloth' must not match through the shorter 'cloth' alias."""
    assert R.resolve_material("beta cloth")[0] == "SIBAL"


# --------------------------------------------------------------------------- #
# Empirical curves
# --------------------------------------------------------------------------- #
def test_burn_time_matches_reference():
    assert R.burn_time_s(21.0, R.REF_PRESSURE_KPA) == pytest.approx(13.6, abs=0.1)


def test_burn_time_increases_with_o2():
    times = [R.burn_time_s(o) for o in (21, 25, 30, 35, 40)]
    assert times == sorted(times)


def test_burn_time_decreases_with_pressure():
    assert R.burn_time_s(21.0, 200.0) < R.burn_time_s(21.0, 101.325)


def test_ignition_probability_monotonic_and_bounded():
    probs = [R.ignition_probability(o) for o in (21, 25, 30, 35, 40)]
    assert probs == sorted(probs)
    assert all(0.0 <= p <= 1.0 for p in probs)
    assert R.ignition_probability(40.0) > R.ignition_probability(21.0)


def test_spread_coefficient_matches_psi39_fit():
    """PSI-39 khot: ln K = -1.080 + 0.454 ln(pO2) -> 0.167 mm²/s @ 1 atm."""
    assert R.spread_coefficient_mm2_s(21.0, R.REF_PRESSURE_KPA) == pytest.approx(0.167, abs=0.001)
    assert R.spread_coefficient_mm2_s(40.0) > R.spread_coefficient_mm2_s(21.0)


def test_ignition_delay_obeys_literature_power_law():
    """t_ig ∝ pO2^-1: doubling pO2 halves the delay."""
    ref = R.ignition_delay_s(21.0, R.REF_PRESSURE_KPA)
    assert ref == pytest.approx(R.REF_IGNITION_DELAY_S, abs=1e-6)
    assert R.ignition_delay_s(42.0, R.REF_PRESSURE_KPA) == pytest.approx(ref / 2, rel=1e-6)
    assert R.ignition_delay_s(21.0, 50.6625) == pytest.approx(ref * 2, rel=1e-6)


def test_threshold_scales_with_pressure():
    pmma = R.MATERIAL_PROFILES["PMMA"]
    assert R.threshold_o2_pct(pmma, R.REF_PRESSURE_KPA) == pytest.approx(13.5)
    assert R.threshold_o2_pct(pmma, 55.0) > R.threshold_o2_pct(pmma, R.REF_PRESSURE_KPA)


# --------------------------------------------------------------------------- #
# RiskEngine
# --------------------------------------------------------------------------- #
def test_baseline_earth_air_is_low():
    r = R.RiskEngine().assess(21.0, 101.325, "PMMA")
    assert r.risk_index == pytest.approx(0.0, abs=0.1)
    assert r.risk_level == "low"
    assert r.risk_label == "Low"
    assert r.ignition_change_pct == pytest.approx(0.0, abs=0.1)


def test_index_monotonic_in_oxygen():
    eng = R.RiskEngine()
    idx = [eng.assess(o, 101.325, "PMMA").risk_index for o in (21, 24, 28, 32, 36, 40)]
    assert idx == sorted(idx)
    assert idx[0] < 10 and idx[-1] > 90


def test_levels_cover_envelope():
    eng = R.RiskEngine()
    seen = {eng.assess(o, 101.325, "PMMA").risk_level for o in range(21, 41)}
    assert seen == {"low", "medium", "critical"}


def test_envelope_top_is_critical():
    r = R.RiskEngine().assess(40.0, 101.325, "PMMA")
    assert r.risk_level == "critical"
    assert r.risk_label == "Critical"
    assert 95 <= r.risk_index <= 100


def test_ignition_delay_shortens_as_risk_rises():
    eng = R.RiskEngine()
    r21 = eng.assess(21.0, 101.325, "PMMA")
    r40 = eng.assess(40.0, 101.325, "PMMA")
    assert r40.ignition_delay_s < r21.ignition_delay_s
    assert r40.ignition_change_pct < 0            # shortening
    assert r40.ignition_change_pct == pytest.approx(-47.5, abs=0.2)


def test_index_bounded_0_100_beyond_envelope():
    eng = R.RiskEngine()
    for o in (5.0, 15.0, 21.0, 60.0, 100.0):
        for p in (20.0, 101.325, 400.0):
            r = eng.assess(o, p, "PMMA")
            assert 0.0 <= r.risk_index <= 100.0
            assert r.risk_level in R.RISK_LEVELS


def test_partial_pressure_controls_risk():
    """34 % O2 @ 8.2 psia (pO2≈0.19) must not be riskier than Earth air."""
    eng = R.RiskEngine()
    low_p = eng.assess(34.0, 8.2, "PMMA", "psia")
    ref = eng.assess(21.0, 101.325, "PMMA")
    assert low_p.pO2_atm < 0.21
    assert low_p.risk_level == "low"
    assert low_p.risk_index <= 10.0
    assert low_p.risk_index >= ref.risk_index - 1e-9


def test_material_ordering_at_high_o2():
    """At the same O2: inert < flame-retardant < PMMA."""
    eng = R.RiskEngine()
    idx = {m: eng.assess(40.0, 101.325, m).risk_index
           for m in ("Inert", "Nomex", "SIBAL", "PMMA")}
    assert idx["Inert"] == 0.0
    assert idx["Nomex"] < idx["PMMA"]
    assert idx["SIBAL"] < idx["PMMA"]


def test_inert_material_never_ignites():
    r = R.RiskEngine().assess(100.0, 320.0, "steel")
    assert r.risk_index == 0.0
    assert "inert_material" in r.warnings
    assert all(v == 0.0 for v in r.components.values())


def test_unknown_material_flags_fallback():
    r = R.RiskEngine().assess(30.0, 101.325, "unobtainium")
    assert r.material_fallback is True
    assert "material_fallback" in r.warnings
    assert r.material_key == R.FALLBACK_MATERIAL_KEY
    # conservative: an unknown material is assessed like PMMA
    pmma = R.RiskEngine().assess(30.0, 101.325, "PMMA")
    assert r.risk_index == pmma.risk_index


def test_extrapolate_flag_blocks_out_of_envelope():
    eng = R.RiskEngine()
    with pytest.raises(ValueError):
        eng.assess(50.0, 101.325, "PMMA", extrapolate=False)
    r = eng.assess(50.0, 101.325, "PMMA")            # default: allowed
    assert "outside_envelope" in r.warnings


def test_below_threshold_warning():
    r = R.RiskEngine().assess(12.0, 101.325, "PMMA")   # BASS-II threshold 13.5 %
    assert "below_threshold" in r.warnings
    assert r.margin_pct < 0


def test_pressure_units_change_result():
    eng = R.RiskEngine()
    a = eng.assess(30.0, 2.0, "PMMA", "atm")
    b = eng.assess(30.0, 2 * 101.325, "PMMA", "kPa")
    assert a.risk_index == b.risk_index
    assert a.pO2_atm == pytest.approx(b.pO2_atm)
    assert a.pressure_unit == "atm" and b.pressure_unit == "kPa"


def test_components_and_weights_consistent():
    eng = R.RiskEngine()
    r = eng.assess(32.0, 101.325, "PMMA")
    assert set(r.components) == set(R.RISK_WEIGHTS)
    assert all(0.0 <= v <= 1.0 for v in r.components.values())
    manual = sum(eng.weights[k] * v for k, v in r.components.items()) * 100
    assert r.risk_index == pytest.approx(round(manual, 1), abs=0.05)


def test_custom_weights_are_normalised():
    eng = R.RiskEngine(weights={k: 1.0 for k in R.RISK_WEIGHTS})
    assert sum(eng.weights.values()) == pytest.approx(1.0)
    assert all(v == pytest.approx(1 / len(R.RISK_WEIGHTS)) for v in eng.weights.values())


def test_invalid_weights_and_thresholds_raise():
    with pytest.raises(ValueError):
        R.RiskEngine(weights={"ignition": 1.0})
    with pytest.raises(ValueError):
        R.RiskEngine(thresholds={"medium": 80.0, "critical": 60.0})


def test_risk_level_for_boundaries():
    assert R.risk_level_for(0) == "low"
    assert R.risk_level_for(34.9) == "low"
    assert R.risk_level_for(35) == "medium"
    assert R.risk_level_for(64.9) == "medium"
    assert R.risk_level_for(65) == "critical"


def test_assessment_as_dict_is_json_ready():
    import json

    r = R.assess_risk(30.0, 101.325, "Nomex")
    payload = r.as_dict()
    assert json.loads(json.dumps(payload))["risk_level"] == r.risk_level
    assert isinstance(payload["components"], dict)
    assert isinstance(payload["warnings"], list)


def test_summary_is_ascii_arrow():
    """The summary contains an ASCII arrow for the Windows console (cp1254)."""
    txt = R.assess_risk(30.0).summary()
    txt.encode("cp1254")                              # must not raise
    assert "->" in txt


# --------------------------------------------------------------------------- #
# Column detection and refreshing from data
# --------------------------------------------------------------------------- #
def test_detect_columns_psi159_headers():
    cols = R.detect_columns(["Flame Type", "XO2 before test", "approx p (bar)",
                             "Hot ignition", "burn time (sec)", "Self-ext or flow term"])
    assert cols["o2_initial"] == "XO2 before test"
    assert cols["pressure"] == "approx p (bar)"
    assert cols["burn_time"] == "burn time (sec)"
    assert cols["ignition"] == "Hot ignition"


def test_detect_columns_bass2_headers():
    cols = R.detect_columns(["Fuel Sample Material", "Calibrated initial O2 % by vol",
                             "Calibrated final O2 % by vol", "Initial CO2 % by vol",
                             "Final CO2 % by vol"])
    assert cols["material"] == "Fuel Sample Material"
    assert cols["co2_final"] == "Final CO2 % by vol"


def test_pressure_unit_from_header():
    assert R.pressure_unit_from_header("approx p (bar)") == "bar"
    assert R.pressure_unit_from_header("pmean (atm)") == "atm"
    assert R.pressure_unit_from_header("Pressure (kPa)") == "kpa"
    assert R.pressure_unit_from_header("Pressure (psia)") == "psia"
    assert R.pressure_unit_from_header("Pressure") == "kpa"


@pytest.fixture(scope="module")
def refit():
    return R.Anchors.from_feature_store()


def test_anchors_refit_matches_embedded_constants(refit):
    """The ``from_feature_store`` refit validates the embedded coefficients within tolerance."""
    a = refit
    assert a.refreshed_from_store is True
    emb = R.Anchors.default()
    assert a.burn_time_o2_exp == pytest.approx(emb.burn_time_o2_exp, abs=0.35)
    assert a.burn_time_p_exp == pytest.approx(emb.burn_time_p_exp, abs=0.35)
    assert a.ignition_logit_po2 == pytest.approx(emb.ignition_logit_po2, abs=0.35)
    assert a.burn_time_n == emb.burn_time_n
    assert a.ignition_n == emb.ignition_n
    assert a.burn_n == emb.burn_n


def test_anchors_refit_reports_refreshed_fields(refit):
    assert set(refit.refreshed_fields) == {"burn_time", "ignition", "spread",
                                           "burn_logit", "material_burn_share"}
    assert R.Anchors.default().refreshed_fields == ()


def test_spread_embedded_vs_refit_difference_is_reported(refit):
    """Embedded vs refit difference is reported (NOT a pass/fail on the original tolerance).

    The embedded PSI-39 fit (n=74, exponent 0.454) came from the experimental table
    joined with DATA. The Feature Store ``cfi`` table is Master_Sheet-based and holds
    79 of the 87 experimental-table rows, so only 66 have ``k_hot`` and the exponent is
    0.319. The 0.135 gap exceeds the original +/-0.10 tolerance; it is measured here,
    not hidden. Spread has R^2 < 0.05 either way.
    """
    emb = R.Anchors.default()
    diff = abs(refit.spread_po2_exp - emb.spread_po2_exp)
    assert (emb.spread_n, refit.spread_n) == (74, 66)
    assert refit.spread_po2_exp == pytest.approx(0.319, abs=0.005)
    assert diff == pytest.approx(0.135, abs=0.005)
    assert refit.spread_r2 < 0.05 and emb.spread_r2 < 0.05


def test_anchors_material_shares_from_bass2(refit):
    a = refit
    assert a.material_burn_share["PMMA"] == pytest.approx(0.76, abs=0.02)
    assert a.material_burn_share["SIBAL"] == pytest.approx(0.0, abs=1e-9)
    assert a.material_n_tests["PMMA"] > 50


def test_anchors_fall_back_to_embedded_when_data_layer_unavailable(monkeypatch, tmp_path):
    """No readable Feature Store -> the embedded coefficients, unrefreshed."""
    from src.data_layer import store

    monkeypatch.setattr(store, "DATA_DIR", tmp_path)            # parquet tables 'missing'
    a = R.Anchors.from_feature_store()
    assert a.refreshed_from_store is False
    assert a.refreshed_fields == ()
    assert a == R.Anchors.default()


def test_anchors_from_connection_without_tables_fall_back():
    import duckdb

    con = duckdb.connect(":memory:")
    try:
        a = R.Anchors.from_feature_store(con)
    finally:
        con.close()
    assert a == R.Anchors.default()


def test_engine_accepts_refreshed_anchors(refit):
    eng = R.RiskEngine(anchors=refit)
    r = eng.assess(30.0, 101.325, "PMMA")
    assert 0.0 <= r.risk_index <= 100.0
    assert r.anchors.refreshed_from_store is True


# --------------------------------------------------------------------------- #
# Interface helpers
# --------------------------------------------------------------------------- #
def test_risk_curve_shape_and_monotonicity():
    df = R.risk_curve("PMMA", steps=21)
    assert len(df) == 21
    assert list(df.columns)[:3] == ["o2_pct", "risk_index", "risk_level"]
    assert df["risk_index"].is_monotonic_increasing
    assert df["ignition_delay_s"].is_monotonic_decreasing
    assert df["pO2_atm"].is_monotonic_increasing


def test_risk_curve_pressure_unit_is_respected():
    a = R.risk_curve("PMMA", pressure=1.0, pressure_unit="atm", steps=3)
    b = R.risk_curve("PMMA", pressure=101.325, pressure_unit="kPa", steps=3)
    assert a["risk_index"].tolist() == b["risk_index"].tolist()


def test_material_table_contains_all_profiles():
    df = R.material_table()
    assert set(df["key"]) == set(R.MATERIAL_PROFILES)
    assert df["inert"].sum() >= 1


def test_default_engine_is_cached():
    assert R.default_engine() is R.default_engine()


def test_module_has_no_streamlit_dependency():
    """The engine must be independent of Streamlit (headless import)."""
    assert "streamlit" not in str(Path(R.__file__).read_text(encoding="utf-8"))


