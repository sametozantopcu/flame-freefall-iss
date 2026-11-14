"""S5 acceptance: scripts/build_site_data.py -> app/data/site_data.{js,json}."""
import json
import re
import subprocess
import sys
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[2]
JS = REPO / "app" / "data" / "site_data.js"
JSON = REPO / "app" / "data" / "site_data.json"


@pytest.fixture(scope="module")
def built():
    subprocess.run([sys.executable, str(REPO / "scripts" / "build_site_data.py")], check=True, cwd=REPO)
    return json.loads(JSON.read_text(encoding="utf-8"))


def test_js_matches_json_and_no_nan(built):
    js = JS.read_text(encoding="utf-8")
    assert not re.search(r"\bNaN\b|\bInfinity\b", js)
    m = re.fullmatch(r"window\.FF = window\.FF \|\| \{\};\nwindow\.FF\.site = (.*);\nwindow\.FF\.siteData = window\.FF\.site;\n", js, re.S)
    assert m and json.loads(m.group(1)) == built


def test_deterministic(built):
    before = JS.read_bytes()
    subprocess.run([sys.executable, str(REPO / "scripts" / "build_site_data.py")], check=True, cwd=REPO)
    assert JS.read_bytes() == before


def test_investigations(built):
    inv = built["investigations"]
    assert len(inv) == 24
    for r in inv:
        assert "doi" in r and "envelope" in r and "summary" in r and "components" in r and "rationale" in r
    scored = [r["score"] for r in inv if r["score"] is not None]
    assert all(0 <= s <= 100 for s in scored)
    assert {r["score_status"] for r in inv} <= {"scored", "low_confidence", "not_scorable"}
    assert all((r["score"] is not None) == (r["score_status"] == "scored") for r in inv)
    assert any(r["score_status"] == "low_confidence" for r in inv)


def test_envelope_not_zero_filled(built):
    # an investigation with no table/text pressure data must have null, not 0
    nulls = [r for r in built["investigations"] if r["envelope"]["pressure_atm"] is None]
    assert nulls, "expected at least one investigation without pressure envelope"
    for r in built["investigations"]:
        for k in ("o2_pct", "pressure_atm", "flow_cm_s"):
            v = r["envelope"][k]
            assert v is None or (v["min"] is not None and v["max"] is not None)
        if r["envelope"]["pressure_atm"]:
            assert r["envelope"]["pressure_atm"]["min"] > 0


def test_model_cards_meta(built):
    assert built["model"]["cv"]["primary"] and "fuel_diluent" in built["model"]["cv"]
    assert len(built["cards"]) == 4
    assert built["meta"]["no_partial_gravity_data"] is True
    assert set(built["meta"]["score_assumptions"]) >= {"weights", "habitat", "min_known"}
    assert built["meta"]["source_dois"] and built["flamesense"]["concept"] is True


# --- R3: site.risk (precomputed risk grid) -------------------------------------------------------------------
def _cell(risk, material, o2, kpa):
    f = risk["fields"]
    row = risk["grid"][material][risk["axes"]["pressure_kpa"].index(kpa)][risk["axes"]["o2_pct"].index(o2)]
    return dict(zip(f, row))


def test_risk_schema(built):
    r = built["risk"]
    assert {"source", "reference", "weights", "level_thresholds", "materials", "provenance", "axes", "presets",
            "grid", "fields", "warning_keys", "component_keys"} <= set(r)
    assert r["source"] == {"pr": 7, "author": "sametozantopcu"}
    assert r["reference"] == {"o2_pct": 21.0, "pressure_kpa": 101.325}
    assert sum(r["weights"].values()) == pytest.approx(1.0) and r["level_thresholds"] == {"medium": 35.0, "critical": 65.0}
    from src.risk import engine as R
    assert [m["key"] for m in r["materials"]] == list(R.MATERIAL_PROFILES)
    assert all({"key", "label", "inert", "threshold_o2_pct_ref", "basis"} <= set(m) for m in r["materials"])
    assert {p["component"] for p in r["provenance"]} >= set(R.RISK_WEIGHTS) | {"ignition_delay", "weights"}
    assert set(r["grid"]) == set(R.MATERIAL_PROFILES)
    assert r["fields"][:2] == ["risk_index", "risk_level"] and len(r["component_keys"]) == 6
    assert all(f"components.{k}" in r["fields"] for k in r["component_keys"])


def test_risk_axes_and_presets(built):
    r = built["risk"]
    o2, kpa = r["axes"]["o2_pct"], r["axes"]["pressure_kpa"]
    assert (o2[0], o2[-1], len(o2)) == (15.0, 40.0, 51) and all(round(b - a, 1) == 0.5 for a, b in zip(o2, o2[1:]))
    assert kpa == sorted(set(kpa)) and {50.0, 100.0, 56.5, 70.3, 101.3} <= set(kpa)
    assert [p for p in kpa if p % 5 == 0] == [float(p) for p in range(50, 101, 5)]
    keys = {p["key"]: p for p in r["presets"]}
    assert keys["iss"]["o2_pct"] == 21 and keys["iss"]["pressure_kpa"] == 101.3
    assert keys["exploration"]["o2_pct"] == 34 and keys["exploration"]["pressure_kpa"] == 56.5
    assert all(p["o2_pct"] in o2 and p["pressure_kpa"] in kpa for p in r["presets"])
    n = len(r["grid"]["PMMA"])
    assert n == len(kpa) and all(len(row) == len(o2) for row in r["grid"]["PMMA"])


@pytest.mark.parametrize("material, o2, kpa", [("PMMA", 21.0, 101.3), ("Nomex", 30.0, 100.0),
                                               ("PMMA", 21.0, 70.3), ("Silicone", 34.0, 56.5), ("SIBAL", 15.5, 90.0)])
def test_risk_cells_match_engine(built, material, o2, kpa):
    from src.risk import engine as R
    from src.risk import provenance as P
    a = R.RiskEngine().assess(o2, kpa, material)
    c = _cell(built["risk"], material, o2, kpa)
    assert c["risk_index"] == pytest.approx(a.risk_index, abs=1e-9) and c["risk_level"] == a.risk_level
    for k, v in a.components.items():
        assert c[f"components.{k}"] == pytest.approx(v, abs=1e-9)
    for k in ("ignition_probability", "burn_time_s", "ignition_delay_s", "spread_coefficient_mm2_s", "pO2_atm",
              "threshold_o2_pct", "margin_pct"):
        assert c[k] == pytest.approx(getattr(a, k), abs=1e-9)
    wk = built["risk"]["warning_keys"]
    assert sorted(wk[i] for i in c["warnings"]) == sorted([*a.warnings, *P.extra_warnings(a)])


def test_risk_known_points(built):
    iss = _cell(built["risk"], "PMMA", 21.0, 101.3)
    assert iss["risk_index"] < 1 and iss["risk_level"] == "low"
    assert _cell(built["risk"], "PMMA", 40.0, 101.3)["risk_level"] == "critical"
    r = built["risk"]
    wk = r["warning_keys"]
    assert "outside_envelope" in [wk[i] for i in _cell(r, "PMMA", 15.0, 101.3)["warnings"]]
    assert "outside_envelope" not in [wk[i] for i in _cell(r, "PMMA", 21.0, 101.3)["warnings"]]
    nomex = _cell(r, "Nomex", 30.0, 100.0)
    assert "above_threshold_low_index" in [wk[i] for i in nomex["warnings"]]


def test_risk_numbers_finite_and_unfilled(built):
    import math
    for mat, g in built["risk"]["grid"].items():
        for row in g:
            for cell in row:
                for v in cell:
                    assert v is None or isinstance(v, (str, list)) or math.isfinite(v)
                assert 0 <= cell[0] <= 100
    prov = {p["component"]: p for p in built["risk"]["provenance"]}
    assert prov["ignition_delay"]["psi_id"] is None and prov["ignition_delay"]["doi"] is None
    assert prov["spread"]["embedded"]["n"] == 74 and prov["spread"]["refit_differs"] is True


def test_existing_site_keys_unchanged(built):
    import subprocess as sp
    old = json.loads(sp.check_output(["git", "show", "HEAD:app/data/site_data.json"], cwd=REPO))
    old.pop("risk", None)  # present once R3 is committed; every other key must stay byte-for-value identical
    for k in ("generated", "meta", "model", "cards", "flamesense", "series"):
        assert built[k] == old[k], k
    # L2 adds only the Q&A-only `qa_text` field to investigations; every pre-existing field stays identical
    strip = lambda rows: [{k: v for k, v in r.items() if k != "qa_text"} for r in rows]  # noqa: E731
    assert strip(built["investigations"]) == strip(old["investigations"])
    assert set(old) <= set(built)


def test_site_data_size_limit(built):
    assert JS.stat().st_size < 1_000_000


def test_qa_text_added_and_bounded(built):
    for inv in built["investigations"]:
        qa = inv["qa_text"]
        assert qa is None or (isinstance(qa, str) and 0 < len(qa) <= 1200)
        if qa and inv["summary"]:
            assert len(qa) >= len(inv["summary"]) - 3
    assert sum(1 for i in built["investigations"] if i["qa_text"]) >= 20
