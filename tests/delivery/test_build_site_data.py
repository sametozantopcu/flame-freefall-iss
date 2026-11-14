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
