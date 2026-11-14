"""C5 - get_modeling_frame: right rows, right columns, nothing filled, source-traceable."""
import pandas as pd
import pytest

from conftest import OUT
from src.data_layer import store
from src.data_layer.features import get_features
from src.data_layer.frame import get_modeling_frame
from src.data_layer.spec import SPEC, TRACE

TARGETS = [(n, t) for n, s in SPEC.items() for t in s["targets"]]
TC = pd.read_csv(OUT / "target_candidates.csv").set_index(["dataset", "target"]).n
KEY = ["psi_id", "source_file", "source_row"]


@pytest.fixture(scope="module")
def con():
    return store.connect()


@pytest.mark.parametrize("name,target", TARGETS)
def test_rows_match_target_candidates(con, name, target):
    f = get_modeling_frame(name, target, con)
    assert len(f) == TC[(name, target)]                          # the acceptance criterion, all 19 targets
    assert f[target].notna().all()


@pytest.mark.parametrize("name,target", TARGETS)
def test_columns(con, name, target):
    f = get_modeling_frame(name, target, con)
    s = SPEC[name]
    feats = get_features(name, target, con)
    expected = list(dict.fromkeys(TRACE + [target] + feats + s["groups"]))
    assert list(f.columns) == expected
    assert not (set(f.columns) & set(s["leakage"][target]))
    others = set(s["targets"]) - {target}
    assert not (set(f.columns) & others)
    assert f.attrs["target"] == target and f.attrs["features"] == feats and f.attrs["groups"] == s["groups"]
    assert f.attrs["task"] == s["targets"][target]["task"]


@pytest.mark.parametrize("name,target", TARGETS)
def test_traceable_and_nothing_filled(con, tables, name, target):
    f = get_modeling_frame(name, target, con)
    assert not f.duplicated(KEY).any()
    src = tables[name].set_index(KEY)
    ff = f.set_index(KEY)
    ref = src.loc[ff.index, list(ff.columns)]                     # same rows, found by source key
    norm = lambda d: d.astype(object).where(d.notna(), None)      # nan / <NA> both mean 'missing'
    pd.testing.assert_frame_equal(norm(ff), norm(ref), check_dtype=False)   # values and missingness untouched
    for c in ff.columns:
        assert int(ff[c].isna().sum()) == int(ref[c].isna().sum())


def test_subsets_actually_applied(con, tables):
    f = get_modeling_frame("acme_normal", "burn_time_s", con)
    src = tables["acme_normal"].set_index(KEY).loc[f.set_index(KEY).index]
    assert (f.experiment == "CFI-G").all() and (src.hot_ignition == 1).all()
    assert "hot_ignition" not in f.columns                        # filter column is not returned

    b = get_modeling_frame("bass2", "d_o2_pct", con)
    assert not tables["bass2"].set_index(KEY).loc[b.set_index(KEY).index].o2_final_anomaly_flag.any()
    assert "o2_final_anomaly_flag" not in b.columns

    c = get_modeling_frame("cfi", "has_cool_flame", con)
    assert (tables["cfi"].set_index(KEY).loc[c.set_index(KEY).index].completed_analysis == "Yes").all()


def test_group_and_feature_specifics(con):
    fx = get_modeling_frame("flex", "burn_time_s", con)
    assert "year" in fx.columns and "year" not in fx.attrs["features"]    # group that is not a feature
    assert "d_ext_mm" not in fx.columns
    assert "material" in get_modeling_frame("smoke", "amd_um", con).columns


def test_deterministic_and_cwd_independent(tmp_path, monkeypatch):
    a = get_modeling_frame("cfi", "k_hot_mm2_s")
    monkeypatch.chdir(tmp_path)
    b = get_modeling_frame("cfi", "k_hot_mm2_s")
    pd.testing.assert_frame_equal(a, b)


@pytest.mark.parametrize("args", [("nope", "burn_time_s"), ("flex", "nope"), ("saffire3", "x")])
def test_errors(con, args):
    with pytest.raises(ValueError, match="valid:"):
        get_modeling_frame(*args, con)
