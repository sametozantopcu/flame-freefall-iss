"""S2 acceptance: FLEX Ridge model, GroupKFold, export (plans/mvp)."""
import json
import math

import numpy as np
import pytest
from sklearn.model_selection import GroupKFold

import conftest  # noqa: F401  (sys.path)
from src.data_layer.frame import get_modeling_frame
from src.prediction import flex_model as fm


@pytest.fixture(scope="module")
def model():
    return fit_once()


def fit_once():
    return fm.fit_flex()


def test_groupkfold_groups_disjoint():
    df = get_modeling_frame("flex", fm.TARGET)
    for g in (df["fuel"] + "|" + df["diluent"],):
        for tr, te in fm._splits(g, 6):
            assert not set(g.iloc[tr]) & set(g.iloc[te])
    d = df[df["year"].notna()]
    for tr, te in fm._splits(d["year"], 3):
        assert not set(d["year"].iloc[tr]) & set(d["year"].iloc[te])


def test_no_leakage_features(model):
    assert not set(model["features"]) & set(fm.LEAKAGE)
    assert set(model["leakage_excluded"]) == set(fm.LEAKAGE)
    assert not any(c.split("=")[0] in fm.LEAKAGE for c in model["coef"]["columns"])


def test_cv_scores(model):
    a, b = model["cv"]["fuel_diluent"]["r2"], model["cv"]["year"]["r2"]
    assert math.isfinite(a) and math.isfinite(b)
    assert a < b or abs(a - 0.18) <= 0.1, (a, b)
    assert abs(b - 0.56) <= 0.15, (a, b)
    assert model["cv"]["fuel_diluent"]["n_groups"] == 6 and model["cv"]["year"]["n_groups"] == 3
    print("CV", model["cv"]["fuel_diluent"]["r2"], model["cv"]["year"]["r2"])


def test_cv_metrics_are_stable_serialization_values(model):
    for split in ("fuel_diluent", "year"):
        for metric in ("r2", "mae"):
            value = model["cv"][split][metric]
            assert value == round(value, 12)


def test_export_predict_matches_pipeline(model):
    df = fm._clean(get_modeling_frame("flex", fm.TARGET))
    pipe = fm._pipeline().fit(df[fm.FEATURES], df[fm.TARGET])
    ref = pipe.predict(df[fm.FEATURES])
    rows = [{k: (None if (isinstance(v, float) and math.isnan(v)) else v) for k, v in r.items()}
            for r in df[fm.FEATURES].to_dict("records")]
    np.testing.assert_allclose(fm.predict(model, rows), ref, atol=1e-6)


def test_export_json_safe_and_complete(model):
    s = json.dumps(model, allow_nan=False)
    assert "NaN" not in s
    for k in ("coef", "cv", "features", "leakage_excluded", "known_combos", "ranges", "impute", "n", "doi",
              "fuels", "diluents"):
        assert k in model
    assert len(model["known_combos"]) == 6 and model["n"] > 200


def test_zero_pressure_treated_as_missing(model):
    assert model["ranges"]["p_atm"]["min"] > 0.3 and model["impute"]["p_atm"] > 0
    raw = get_modeling_frame("flex", fm.TARGET)
    assert (raw["p_atm"] <= 0).sum() == 1          # PSI-69 source_row 113 placeholder
    assert fm._clean(raw)["p_atm"].isna().sum() == 1
