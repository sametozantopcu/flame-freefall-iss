"""B2 - invariant: missing values are never filled with 0; flags are well formed."""
import pandas as pd
import pytest

# measurement columns where 0 is physically impossible / means "not measured"
MEASURED = {
    "smoke": ["amd_um", "dam_um", "dg_um", "sample_temp_c", "inlet_velocity_cm_s",
              "m0_per_cc", "m1_mm_per_cc", "dusttrak_b_mg_m3"],
    "flex": ["d0_mm", "burn_time_s"],  # d_ext_mm: 0 is valid, see test_flex_zero_d_ext
    "cfi": ["d0_mm", "d_ext_hot_mm", "hf_burn_time_s"],
}
BOOL_FLAGS = {"acme_normal": ["any_ramp_flag"],
              "bass2": ["co_negative_flag", "o2_final_anomaly_flag"]}


@pytest.mark.parametrize("table,col", [(t, c) for t, cols in MEASURED.items() for c in cols])
def test_no_zeros_in_measurements(tables, table, col):
    df = tables[table]
    assert col in df.columns, f"{table}.{col} does not exist (update the test if renamed)"
    assert (df[col] == 0).sum() == 0, f"{table}.{col} contains zeros"


def test_flex_zero_d_ext(tables):
    """d_ext_mm == 0 exists in the source (droplet burned out). Allowed only for Completion/Disruption, never Extinction."""
    d = tables["flex"]
    z = d[d.d_ext_mm == 0]
    assert 0 < len(z) <= 8
    assert set(z.test_end.dropna()) <= {"Completion", "Disruption"}


@pytest.mark.parametrize("table,col", [(t, c) for t, cols in BOOL_FLAGS.items() for c in cols])
def test_indicator_flags_are_bool(tables, table, col):
    assert tables[table][col].dtype == bool


def test_token_flags_only_where_value_missing(tables):
    """<col>_flag (string) keeps the original non-numeric token; it may only be set when <col> is NaN."""
    checked = 0
    for name, df in tables.items():
        for c in df.columns:
            if c.endswith("_flag") and pd.api.types.is_string_dtype(df[c]):
                base = c[: -len("_flag")]
                assert base in df.columns, f"{name}.{c} has no base column {base}"
                bad = df[df[c].notna() & df[base].notna()]
                assert bad.empty, f"{name}.{c} set on {len(bad)} rows where {base} has a value"
                checked += 1
    assert checked >= 20  # EDA produced 25 token flags; guards against the test silently checking nothing
