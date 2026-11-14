"""02/A2 - censoring flags: gas_flame `burn_time_censored` (FT = right-censored), droplet `burn_time_truncated`.

Expected numbers were computed independently from the DuckDB source views (acme_normal, acme_inverse, flex)
with the SPEC burn_time_s subset queries:

gas_flame (burn_time subset = experiment == 'CFI-G' and hot_ignition == 1)
  Normal  (179 rows): subset 132 -> FT 30 (True), SE 102 (False); 47 outside -> NA
  Inverse (154 rows): subset 131 -> FT 58 (True), SE 73 (False);  23 outside -> NA
  Outside the subset ext_mode is still known on 9 rows (Normal PSI-159 row 37: FT, hot_ignition 'No';
  Inverse PSI-159 rows 4,6,7,8,10,11,13,44: SE, hot_ignition 'flash'); the contract keeps them NA.
droplet (burn_time subset = burn_time_s.notna(), flex only)
  flex (274 rows): subset 268 -> Extinction 184 + Disruption 57 = 241 True, Completion 27 False; 6 outside -> NA
  cfi  (227 rows): no test_end -> all NA
"""
import pandas as pd
import pytest

from conftest import OUT
from src.data_layer import store
from src.data_layer.features import get_features
from src.data_layer.spec import SPEC, TRACE
from src.prediction.datasets import build_dataset

FLAGS = {"gas_flame": "burn_time_censored", "droplet": "burn_time_truncated"}
ALL_FLAGS = set(FLAGS.values())
ROWS = {"droplet": 501, "gas_flame": 333, "smoke": 134, "solid_atm": 129}
MASK = "in_subset__burn_time_s"

# (True, False, NA) per group
EXP_GAS = {"Normal": (30, 102, 47), "Inverse": (58, 73, 23)}
EXP_DROP = {"flex": (241, 27, 6), "cfi": (0, 0, 227)}

# Column lists of the A1 datasets (before A2); A2 may only add the flag column.
BASE_COLS = {
    "droplet": ['psi_id', 'source_file', 'source_row', 'source_table', 'fuel', 'x_o2', 'x_n2', 'x_co2', 'x_he',
                'd0_mm', 'p_atm', 'diluent', 'year', 'burn_time_s', 'burn_rate_K_mm2_s', 'd_ext_mm', 'test_end',
                'fiber', 'ign_power_w', 'ign_time_ms', 'k_hot_mm2_s', 'hf_burn_time_s', 'd_ext_hot_mm',
                'has_cool_flame', 'in_subset__burn_time_s', 'in_subset__burn_rate_K_mm2_s', 'in_subset__d_ext_mm',
                'in_subset__test_end', 'in_subset__k_hot_mm2_s', 'in_subset__hf_burn_time_s',
                'in_subset__d_ext_hot_mm', 'in_subset__has_cool_flame'],
    "gas_flame": ['psi_id', 'source_file', 'source_row', 'source_table', 'flame_type', 'day', 'x_fuel',
                  'm_fuel_mg_s', 'xo2_init', 'p_atm', 'zst', 'tad_k_calc', 'experiment', 'fuel_base',
                  'fuel_bottle_frac', 'burn_time_s', 'hot_ignition', 'ext_mode', 'xo2', 'm_o2_mg_s',
                  'x_fuel_amb_init', 'hc_burnrate_mg_s', 'in_subset__burn_time_s', 'in_subset__hot_ignition',
                  'in_subset__ext_mode'],
}


@pytest.fixture(scope="module")
def con():
    return store.connect()


@pytest.fixture(scope="module")
def sets(con):
    return {n: build_dataset(n, con) for n in ROWS}


def _counts(s):
    """(True, False, NA) counts of a nullable boolean series."""
    return int((s == True).sum()), int((s == False).sum()), int(s.isna().sum())  # noqa: E712


def _key(df):
    return df[TRACE].astype(str).apply(tuple, axis=1)


def test_flag_dtype(sets):
    """Both flags exist and use the pandas nullable boolean dtype (so unknown stays <NA>, not False)."""
    for name, flag in FLAGS.items():
        assert flag in sets[name].columns, f"{name}: missing {flag}"
        assert str(sets[name][flag].dtype) == "boolean", f"{name}.{flag}: dtype {sets[name][flag].dtype}"


def test_gas_flame_counts(sets):
    """True/False/NA per flame_type equal the independently computed source counts."""
    df = sets["gas_flame"]
    flag = df["burn_time_censored"]
    for ft, exp in EXP_GAS.items():
        assert _counts(flag[df.flame_type == ft]) == exp, ft
    assert _counts(flag) == (88, 175, 70)


def test_droplet_counts(sets):
    """True/False/NA split flex vs cfi equal the independently computed source counts."""
    df = sets["droplet"]
    flag = df["burn_time_truncated"]
    for tbl, exp in EXP_DROP.items():
        assert _counts(flag[df.source_table == tbl]) == exp, tbl
    assert _counts(flag) == (241, 27, 233)


def test_defined_only_in_burn_time_subset(sets):
    """Flags are defined exactly on burn_time rows with a known end mode; NA elsewhere (never False)."""
    g = sets["gas_flame"]
    f = g["burn_time_censored"]
    assert f[~g[MASK]].isna().all(), "gas_flame: flag set outside the burn_time subset"
    known = g[MASK] & g.ext_mode.isin(["FT", "SE"])
    assert f[known].notna().all() and f[~known].isna().all()
    # the 9 out-of-subset rows with a known ext_mode stay NA (not False / not True)
    out_known = ~g[MASK] & g.ext_mode.notna()
    assert int(out_known.sum()) == 9 and f[out_known].isna().all()

    d = sets["droplet"]
    t = d["burn_time_truncated"]
    assert t[d.source_table == "cfi"].isna().all(), "droplet: cfi has no test_end, flag must be NA"
    assert t[~d[MASK]].isna().all(), "droplet: flag set outside the burn_time subset"
    known = d[MASK] & d.test_end.notna() & (d.source_table == "flex")
    assert t[known].notna().all() and t[~known].isna().all()


def test_flag_semantics_in_dataset(sets):
    """Flag value matches the dataset's own ext_mode / test_end on defined rows."""
    g = sets["gas_flame"]
    m = g["burn_time_censored"].notna()
    assert (g.loc[m, "burn_time_censored"].astype(bool) == (g.loc[m, "ext_mode"] == "FT")).all()
    d = sets["droplet"]
    m = d["burn_time_truncated"].notna()
    assert (d.loc[m, "burn_time_truncated"].astype(bool) == (d.loc[m, "test_end"] != "Completion")).all()


def _expected_from_source(con, table, label_col, true_fn):
    """Recompute the flag per row from the source view with the SPEC burn_time_s subset query."""
    src = con.execute(f"SELECT * FROM {table}").df()
    sub = SPEC[table]["targets"]["burn_time_s"]["subset"]
    in_sub = src.index.isin(src.query(sub).index)
    exp = pd.Series(pd.NA, index=src.index, dtype="boolean")
    known = in_sub & src[label_col].notna()
    exp[known] = true_fn(src.loc[known, label_col]).values
    return pd.Series(exp.values, index=_key(src), dtype="boolean")


def test_flags_match_source_via_trace(sets, con):
    """Per-row cross-check against the source tables through (psi_id, source_file, source_row)."""
    cases = [("gas_flame", "acme_normal", "ext_mode", lambda s: s == "FT"),
             ("gas_flame", "acme_inverse", "ext_mode", lambda s: s == "FT"),
             ("droplet", "flex", "test_end", lambda s: s != "Completion")]
    for name, table, col, fn in cases:
        df = sets[name][sets[name].source_table == table]
        exp = _expected_from_source(con, table, col, fn)
        got = pd.Series(df[FLAGS[name]].values, index=_key(df), dtype="boolean")
        assert got.index.is_unique
        exp = exp.reindex(got.index)
        assert got.isna().equals(exp.isna()), f"{name}/{table}: NA pattern differs"
        m = got.notna()
        assert (got[m] == exp[m]).all(), f"{name}/{table}: flag values differ"


def test_counts_tie_to_eda(sets, con):
    """Tie to target_candidates.csv class_balance. EDA counts are over the ext_mode / test_end subsets;
    the flags live on the burn_time subset, so the difference must be exactly the out-of-subset rows."""
    tc = pd.read_csv(OUT / "target_candidates.csv").set_index(["dataset", "target"]).class_balance

    def bal(table, target):
        return {k.strip(): int(v) for k, v in (p.split(":") for p in tc[(table, target)].split(","))}

    g = sets["gas_flame"]
    for table, ft in [("acme_normal", "Normal"), ("acme_inverse", "Inverse")]:
        eda = bal(table, "ext_mode")
        sub = g[g.flame_type == ft]
        out = sub[~sub[MASK]]
        t, f, _ = _counts(sub["burn_time_censored"])
        assert t == eda["FT"] - int((out.ext_mode == "FT").sum()), table
        assert f == eda["SE"] - int((out.ext_mode == "SE").sum()), table
    assert bal("acme_normal", "ext_mode") == {"SE": 102, "FT": 31}
    assert bal("acme_inverse", "ext_mode") == {"SE": 81, "FT": 58}

    d = sets["droplet"]
    eda = bal("flex", "test_end")
    assert eda == {"Extinction": 186, "Disruption": 61, "Completion": 27}
    flex = d[d.source_table == "flex"]
    out = flex[~flex[MASK]]
    t, f, _ = _counts(flex["burn_time_truncated"])
    assert f == eda["Completion"] - int((out.test_end == "Completion").sum()) == 27
    assert t == eda["Extinction"] + eda["Disruption"] - int((out.test_end != "Completion").sum()) == 241


def test_flags_are_not_features(con):
    """Censor flags are labels, never features, for any table/target."""
    for table, s in SPEC.items():
        for target in s["targets"]:
            feats = set(get_features(table, target, con))
            assert not (feats & ALL_FLAGS), f"{table}/{target}: {feats & ALL_FLAGS}"


def test_rest_unchanged(sets):
    """Row counts and the other columns stay as in A1; only the flag column is added."""
    for name, df in sets.items():
        assert len(df) == ROWS[name], name
    for name, cols in BASE_COLS.items():
        assert list(sets[name].columns.drop(FLAGS[name], errors="ignore")) == cols, name
        assert FLAGS[name] in sets[name].columns, name


def test_no_flags_on_other_sets(sets):
    """smoke and solid_atm get no censor columns; each flag only on its own dataset."""
    for name in ("smoke", "solid_atm"):
        assert not (set(sets[name].columns) & ALL_FLAGS), name
        assert not any("censor" in c or "truncat" in c for c in sets[name].columns), name
    assert "burn_time_truncated" not in sets["gas_flame"].columns
    assert "burn_time_censored" not in sets["droplet"].columns
