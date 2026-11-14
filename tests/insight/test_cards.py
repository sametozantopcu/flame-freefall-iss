"""S4 acceptance: M3 insight cards are number-sourced, DOI-cited, English, and free of partial-gravity claims."""
import json
import re

import pandas as pd
import pytest

from src.data_layer.store import connect_all
from src.insight.cards import FIELDS, build_cards, load_cards

OUT = "data_analysis/Nasa_data/analysis/outputs/"
IDS = {"flex_d2_slope", "acme_ignition_21pct_o2", "smoke_simpson_rt_r0", "bass2_co2_o2_ratio"}


@pytest.fixture(scope="module")
def cards():
    return {c["id"]: c for c in build_cards()}


def test_four_cards_with_schema(cards):
    assert set(cards) == IDS
    for c in cards.values():
        assert list(c) == list(FIELDS) or set(c) == set(FIELDS)
        assert c["n"] and c["n"] > 0 and c["finding"] and c["caveat"] and c["equipment_implication"]


def test_doi_from_metadata(cards):
    con = connect_all()
    dois = dict(con.execute("SELECT psi_id, doi FROM investigations").fetchall())
    for c in cards.values():
        assert c["doi"].startswith("10.60555/")
        assert dois[c["psi_id"]] == c["doi"]
    assert {c["psi_id"] for c in cards.values()} == {"PSI-69", "PSI-159", "PSI-101", "PSI-25"}


def test_values_in_range_and_match_sources(cards):
    d2 = pd.read_csv(OUT + "d2_law_flex.csv").set_index("subset").loc["Completion"]
    assert cards["flex_d2_slope"]["value"] == pytest.approx(d2.ols_slope)
    assert cards["flex_d2_slope"]["value"] == pytest.approx(2.12, abs=0.05)
    assert cards["flex_d2_slope"]["n"] == int(d2.n) == 27
    assert cards["bass2_co2_o2_ratio"]["value"] == pytest.approx(-0.80, abs=0.05)
    assert cards["bass2_co2_o2_ratio"]["value"] == pytest.approx(json.load(open(OUT + "group_effects_numbers.json"))["bass_pmma_ratio_median"])
    sm = cards["smoke_simpson_rt_r0"]["values"]
    assert sm["marginal_rho"] == pytest.approx(-0.27, abs=0.01) and sm["partial_rho"] == pytest.approx(0.49, abs=0.01)
    assert sm["materials_positive"] == 5 and sm["materials_total"] == 5


def test_acme_card_recomputed_from_feature_store(cards):
    con = connect_all()
    n, hot = con.execute("SELECT count(*), sum(hot_ignition::int) FROM acme_normal WHERE psi_id='PSI-159' "
                         "AND fuel_base IN ('butane','propane') AND xo2_init_pct BETWEEN 20.5 AND 21.5 "
                         "AND hot_ignition IS NOT NULL").fetchone()
    c = cards["acme_ignition_21pct_o2"]
    assert c["n"] == n and c["value"] == pytest.approx(hot / n)
    assert 0 < c["value"] < 1          # the EDA claim "no hot ignition at ~21% O2" is not reproduced; card must say so
    assert "not reproduced" in c["caveat"]


def test_no_partial_gravity_claims_no_nan(cards):
    text = json.dumps(cards).lower()
    for bad in ("lunar", "martian", "moon", "mars", "partial gravity", "partial-g", "reduced gravity"):
        assert bad not in text
    assert "nan" not in re.findall(r"[a-z]+", text)
    assert json.loads(json.dumps(load_cards())) == json.loads(json.dumps(list(cards.values())))
