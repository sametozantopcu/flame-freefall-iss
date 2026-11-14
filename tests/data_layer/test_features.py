"""C4 - get_features: leakage-free feature lists, guard proven with injected violations."""
import os

import pytest

from conftest import TABLES
from src.data_layer import features, store
from src.data_layer.features import get_features
from src.data_layer.spec import SPEC

TARGETS = [(n, t) for n, s in SPEC.items() for t in s["targets"]]


@pytest.fixture(scope="module")
def con():
    return store.connect()


@pytest.mark.parametrize("name,target", TARGETS)
def test_feature_list(tables, con, name, target):
    f = get_features(name, target, con)
    s = SPEC[name]
    assert f and len(f) == len(set(f))
    assert set(f) <= set(tables[name].columns)
    assert not (set(f) & set(s["targets"]))                      # no target, no other target
    assert not (set(f) & set(s["leakage"][target]))
    assert set(f) == set(s["num"] + s["cat"])                    # today: equals SPEC features


def test_flex_burn_time_has_no_d_ext(con):
    f = get_features("flex", "burn_time_s", con)
    for bad in ["d_ext_mm", "d_ext_over_d0", "K_from_d2_law", "burn_rate_K_mm2_s", "test_end", "burn_time_approx"]:
        assert bad not in f
    assert "d0_mm" in f and "x_o2" in f


def test_guard_removes_spec_leakage(monkeypatch, con):
    """Today leakage is never a feature, so inject a violation: x_o2 declared leakage must disappear."""
    assert "x_o2" in get_features("flex", "burn_time_s", con)
    monkeypatch.setitem(SPEC["flex"]["leakage"], "burn_time_s", SPEC["flex"]["leakage"]["burn_time_s"] + ["x_o2"])
    assert "x_o2" not in get_features("flex", "burn_time_s", con)
    assert "x_o2" in get_features("flex", "d_ext_mm", con)       # only that target is affected


def test_guard_removes_leakage_marked_feature_in_catalog(con):
    """A leakage column wrongly labelled role=feature in the catalog must still be removed."""
    c2 = store.connect()
    c2.execute("ALTER VIEW catalog RENAME TO catalog_real")
    c2.execute("""CREATE VIEW catalog AS
                  SELECT dataset, "column", CASE WHEN dataset='flex' AND "column" IN ('d_ext_mm','burn_time_s')
                         THEN 'feature' ELSE role END AS role FROM catalog_real""")
    assert c2.execute("""SELECT count(*) FROM catalog WHERE dataset='flex' AND "column"='d_ext_mm'
                         AND role='feature'""").fetchone()[0] == 1       # the injected violation is really there
    f = get_features("flex", "burn_time_s", c2)
    assert "d_ext_mm" not in f and "burn_time_s" not in f        # leakage and the target itself are guarded
    assert "d0_mm" in f


@pytest.mark.parametrize("args", [("nope", "burn_time_s"), ("flex", "nope"), ("saffire3", "burn_time_s"),
                                  ("flex", "hot_ignition")])
def test_errors(con, args):
    with pytest.raises(ValueError, match="valid:"):
        get_features(*args, con)


def test_deterministic_and_cwd_independent(tmp_path, monkeypatch):
    a = get_features("smoke", "amd_um")
    monkeypatch.chdir(tmp_path)
    assert get_features("smoke", "amd_um") == a
    assert "material" in a                                         # smoke: material must stay a feature (Simpson)


def test_numeric_features_have_units(con):
    for name, target in TARGETS:
        f = get_features(name, target, con)
        rows = con.execute("SELECT \"column\", unit, is_numeric FROM units WHERE dataset = ?", [name]).fetchall()
        u = {c: (unit, num) for c, unit, num in rows}
        assert all(u[c][0] != "unit_unknown" for c in f if u[c][1]), (name, target)
