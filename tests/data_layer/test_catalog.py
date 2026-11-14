"""B3 - feature catalog consistency: targets present, leakage never offered as a feature."""
import pandas as pd
import pytest

from conftest import OUT
from _common import SPEC

CAT = pd.read_csv(OUT / "feature_catalog.csv")
TARGETS = [(n, t) for n, s in SPEC.items() for t in s["targets"]]


def test_nineteen_targets():
    assert len(TARGETS) == 19


@pytest.mark.parametrize("name,target", TARGETS)
def test_target_role(name, target):
    r = CAT[(CAT.dataset == name) & (CAT.column == target)]
    assert len(r) == 1, f"{name}.{target} not in catalog exactly once"
    assert r.role.iat[0] == "target"


@pytest.mark.parametrize("name,target", TARGETS)
def test_no_leakage_as_feature(name, target):
    leak = set(SPEC[name]["leakage"][target])
    feats = set(CAT[(CAT.dataset == name) & (CAT.role == "feature")].column)
    assert not (leak & feats), f"{name}.{target}: leakage columns offered as features: {sorted(leak & feats)}"
    assert target not in feats
