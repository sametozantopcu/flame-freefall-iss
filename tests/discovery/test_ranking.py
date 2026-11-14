"""Acceptance tests for plans/mvp step S3: explainable habitat-relevance ranking."""
import math

import pandas as pd
import pytest

from src.discovery import ranking as R

COMPONENTS = ["o2_overlap", "pressure_overlap", "low_flow_overlap", "has_flight", "has_solid", "data_volume"]


@pytest.fixture(scope="module")
def df():
    return R.rank_investigations()


def test_24_rows_and_columns(df):
    assert len(df) == 24 and df["psi_id"].is_unique
    for c in ["psi_id", "doi", "score", "score_status", "n_components_known", "missing_components", "rationale", *COMPONENTS]:
        assert c in df.columns
    assert not any("grav" in c for c in df.columns if c != "has_flight")


def test_scores_in_range_and_status(df):
    s = df["score"].dropna()
    assert ((s >= 0) & (s <= 100)).all()
    assert set(df["score_status"]) <= {"scored", "low_confidence", "not_scorable"}
    assert (df["score"].notna() == (df["score_status"] == "scored")).all()
    assert (df[df.score_status == "scored"].n_components_known >= R.MIN_KNOWN).all()
    low = df[df.score_status == "low_confidence"]
    assert ((low.n_components_known >= 1) & (low.n_components_known < R.MIN_KNOWN)).all()
    assert (df[df.score_status == "not_scorable"].n_components_known == 0).all()
    assert df[df.score_status == "scored"]["score"].is_monotonic_decreasing
    order = df["score_status"].map({"scored": 0, "low_confidence": 1, "not_scorable": 2})
    assert order.is_monotonic_increasing
    assert low["n_components_known"].is_monotonic_decreasing
    for k in low.index:  # known components stay non-null (never zero-filled)
        assert sum(pd.notna(low.loc[k, c]) for c in COMPONENTS) == low.loc[k, "n_components_known"]


def test_low_confidence_keeps_components_and_has_no_score():
    env = pd.DataFrame(columns=["psi_id"])
    text = pd.DataFrame({"psi_id": ["PSI-1"], "field": ["gravity"], "accepted": [True], "value_text": ["µg"],
                         "value_min_std": [None], "value_max_std": [None]})
    inv = pd.DataFrame({"psi_id": ["PSI-1"], "doi": [None]})
    r = R.rank_investigations(env=env, text=text, inv=inv).iloc[0]
    assert pd.isna(r["score"]) and r["score_status"] == "low_confidence"
    assert r["has_flight"] == 1.0 and r["n_components_known"] == 1 and "o2_overlap" in r["missing_components"]


def test_missing_component_is_null_not_zero(df):
    # PSI-20 (acme_testdays) has no O2/pressure/flow columns -> those components are null
    r = df[df.psi_id == "PSI-20"].iloc[0]
    for c in ["o2_overlap", "pressure_overlap", "low_flow_overlap"]:
        assert pd.isna(r[c])
        assert c in r["missing_components"]
    assert r["n_components_known"] == len(COMPONENTS) - len(r["missing_components"])
    # tableless investigation without a text volume: volume null
    r = df[df.psi_id == "PSI-60"].iloc[0]
    assert pd.isna(r["data_volume"])


def test_renormalised_score_matches_manual(df):
    r = df[df.psi_id == "PSI-69"].iloc[0]
    known = {c: r[c] for c in COMPONENTS if not pd.isna(r[c])}
    w = R.WEIGHTS
    exp = 100 * sum(w[c] * v for c, v in known.items()) / sum(w[c] for c in known)
    assert math.isclose(r["score"], exp, abs_tol=1e-9)


def test_all_missing_gives_null_score():
    env = pd.DataFrame(columns=["psi_id"])
    inv = pd.DataFrame({"psi_id": ["PSI-1"], "doi": [None]})
    out = R.rank_investigations(env=env, text=pd.DataFrame(), inv=inv)
    r = out.iloc[0]
    assert pd.isna(r["score"]) and r["score_status"] == "not_scorable" and r["n_components_known"] == 0
    assert pd.isna(r["doi"])


def test_deterministic(df):
    pd.testing.assert_frame_equal(df, R.rank_investigations())


def test_doi_filled_or_null(df):
    assert df["doi"].map(lambda d: d is None or (isinstance(d, str) and d.startswith("10."))).all()
    assert df["doi"].notna().sum() == 24


def test_overlap_helper():
    assert R.overlap_fraction(20, 30, 17, 35) == 1.0
    assert R.overlap_fraction(21, 21, 17, 35) == 1.0
    assert R.overlap_fraction(40, 40, 17, 35) == 0.0
    assert R.overlap_fraction(10, 30, 20, 40) == pytest.approx(0.5)


def test_assumptions_documented():
    assert R.HABITAT["o2_pct"] == (17.0, 35.0) and R.HABITAT["pressure_kpa"] == (56.0, 101.0)
    assert abs(sum(R.WEIGHTS.values()) - 1.0) < 1e-9
    assert "ASSUMPTION" in R.__doc__
