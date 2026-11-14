"""C1 - src/data_layer/spec.py is the single source of truth and consistent with the data."""
import re
from pathlib import Path

import pandas as pd
import pytest

from conftest import ANALYSIS, DATA, OUT
from src.data_layer import spec
from src.data_layer.spec import SPEC, TRACE, target_frame, unit_of

NAMES = list(SPEC)


def test_six_tables_nineteen_targets():
    assert NAMES == ["acme_normal", "acme_inverse", "flex", "bass2", "smoke", "cfi"]
    assert sum(len(s["targets"]) for s in SPEC.values()) == 19


@pytest.mark.parametrize("name", NAMES)
def test_spec_columns_exist(tables, name):
    s, cols = SPEC[name], set(tables[name].columns)
    wanted = set(s["num"] + s["cat"] + s["groups"] + list(s["targets"]) + s.get("unclear", []))
    for leak in s["leakage"].values():
        wanted |= set(leak)
    assert not (wanted - cols), f"{name}: SPEC columns missing from parquet: {sorted(wanted - cols)}"


@pytest.mark.parametrize("name", NAMES)
def test_target_never_in_own_leakage(name):
    for t, leak in SPEC[name]["leakage"].items():
        assert t not in leak


@pytest.mark.parametrize("name", NAMES)
def test_units_for_numeric_features(name):
    for c in SPEC[name]["num"]:
        u = unit_of(c)
        assert isinstance(u, str) and u  # unknown units are spelled 'unit_unknown', never empty
    assert unit_of("definitely_not_a_column") == "unit_unknown"


def test_target_frame_rows_match_target_candidates(tables):
    tc = pd.read_csv(OUT / "target_candidates.csv").set_index(["dataset", "target"]).n
    for name, s in SPEC.items():
        for t in s["targets"]:
            d = target_frame(name, t, tables[name])
            assert int(d[t].notna().sum()) == tc[(name, t)], f"{name}.{t}"


def test_trace_columns():
    assert TRACE == ["psi_id", "source_file", "source_row"]


def test_single_source_of_truth():
    import sys
    sys.path.insert(0, str(ANALYSIS / "scripts"))
    import _common
    assert _common.SPEC is spec.SPEC and _common.UNITS is spec.UNITS and _common.TRACE is spec.TRACE
    for f in (ANALYSIS / "scripts").glob("*.py"):
        assert not re.search(r"^(SPEC|UNITS)\s*=", f.read_text(), re.M), f"{f.name} redefines SPEC/UNITS"
