"""Single source of truth for tables, units, targets, features and leakage (plans/00_data_layer, step C1).

Pure data + tiny helpers: no file I/O. The EDA scripts (analysis/scripts/_common.py) and the Feature Store
import from here. No model is trained anywhere in this package.
"""
from __future__ import annotations

import re

import pandas as pd

TIER1 = ["acme_normal", "acme_inverse", "flex", "bass2", "smoke", "cfi"]
TIER2 = ["saffire1", "saffire2", "saffire3", "spice", "acme_testdays"]

TRACE = ["psi_id", "source_file", "source_row"]


UNITS = {
    # ACME
    "x_fuel": "mol fraction", "m_fuel_mg_s": "mg/s", "m_n2_mg_s": "mg/s", "m_tot_mg_s": "mg/s", "m_o2_mg_s": "mg/s",
    "xo2_init": "mol fraction", "xo2_final": "mol fraction", "xo2": "mol fraction", "xo2_init_pct": "%",
    "xo2_final_pct": "%", "xo2_pct": "%", "d_xo2": "mol fraction", "p_init_atm": "atm", "p_final_atm": "atm",
    "p_atm": "atm", "p_bar": "bar", "zst": "- (mixture fraction)", "tad_k_calc": "K (calculated)",
    "burn_time_s": "s", "peak_burner_T_C": "°C", "peak_burner_T_K": "K", "hc_burnrate_mg_s": "mg/s",
    "x_fuel_amb_init": "mol fraction", "x_fuel_amb_final": "mol fraction", "fuel_bottle_frac": "vol fraction",
    "day": "test day index",
    # FLEX
    "p_mmHg": "mmHg", "x_o2": "mol fraction", "x_n2": "mol fraction", "x_co2": "mol fraction", "x_he": "mol fraction",
    "x_o2_pct": "%", "d0_mm": "mm", "d_ext_mm": "mm", "burn_rate_K_mm2_s": "mm²/s (assumed)", "d0_sq_mm2": "mm²",
    "d_ext_over_d0": "-", "K_from_d2_law": "mm²/s", "test_no": "id", "year": "year",
    # BASS-II
    "o2_init_pct": "% vol", "o2_final_pct": "% vol", "co2_init_pct": "% vol", "co2_final_pct": "% vol",
    "co_init_ppm": "ppm", "co_final_ppm": "ppm", "d_o2_pct": "% vol", "d_co2_pct": "% vol", "d_co_ppm": "ppm",
    "thickness_mm": "mm", "air_display_initial": "unit_unknown (device reading)",
    "fan_display_initial": "unit_unknown (device reading)", "flow_restrictor": "setting index", "frames": "count",
    # smoke
    "inlet_velocity_cm_s": "cm/s", "rt_r0": "- (resistance ratio, heater temp proxy)", "aging_s": "s",
    "m0_per_cc": "#/cm³", "m1_mm_per_cc": "mm/cm³", "m3_mpass": "unit_unknown", "dusttrak_a_mg_m3": "mg/m³",
    "dusttrak_b_mg_m3": "mg/m³", "amd_um": "µm", "dam_um": "µm", "mpass_3_2": "-", "sigma_g": "-", "dg_um": "µm",
    "sample_temp_c": "°C", "mass_loss_mg": "mg", "log_m0": "log10(#/cm³)",
    # CFI
    "d_ext_hot_mm": "mm", "k_hot_mm2_s": "mm²/s", "k_cool_mm2_s": "mm²/s", "d_ext_cool_mm": "mm",
    "p_atm_data": "atm", "reignitions": "count", "hf_burn_time_s": "s (assumed)", "peak_hf_rad": "unit_unknown",
    "peak_h2o_rad": "unit_unknown", "rad_ratio": "-", "rad_2p5mm": "unit_unknown", "rad_2p5mm_narrow": "unit_unknown",
    "cf_rad_ratio": "-", "rad_2p5mm_cf": "unit_unknown", "time_2p5mm": "s (assumed)", "actual_d_mm": "mm",
    "ign_power_w": "W", "ign_time_ms": "ms", "has_cool_flame": "0/1", "extrap_cf": "0/1",
    # tier 2
    "flame_duration_s": "s", "flames_ignited": "count", "thickness_mm_s2": "mm", "o2_pct_approx": "%",
    "spread_rate_1g_mm_s": "mm/s (1-g)",
}


def unit_of(col):
    if col in UNITS:
        return UNITS[col]
    m = re.search(r"\(([^)]+)\)\s*$", str(col))
    return m.group(1) if m else "unit_unknown"



# ---------------------------------------------------------------------------
# Target / feature / leakage specification (single source of truth for 03-08)
# task: regression | binary | multiclass ; subset: pandas query applied before analysing that target
SPEC = {
    "acme_normal": dict(
        num=["x_fuel", "m_fuel_mg_s", "xo2_init", "p_atm", "zst", "tad_k_calc", "fuel_bottle_frac", "day"],
        cat=["fuel_base", "experiment"],
        groups=["experiment", "fuel_base", "day"],
        targets={
            "burn_time_s": dict(task="regression", subset="experiment == 'CFI-G' and hot_ignition == 1"),
            "hot_ignition": dict(task="binary", subset="experiment == 'CFI-G'"),
            "ext_mode": dict(task="binary", subset="experiment == 'CFI-G' and ext_mode.notna()"),
        },
        leakage={
            "burn_time_s": ["xo2_final", "xo2_final_pct", "d_xo2", "peak_burner_T_C", "ext_mode", "ext_mode_raw",
                            "hot_ignition", "hot_ignition_raw", "cool_flame", "cool_flame_raw", "comments", "p_final_atm"],
            "hot_ignition": ["burn_time_s", "ext_mode", "ext_mode_raw", "peak_burner_T_C", "xo2_final",
                             "xo2_final_pct", "d_xo2", "comments", "cool_flame", "cool_flame_raw", "hot_ignition_raw"],
            "ext_mode": ["burn_time_s", "peak_burner_T_C", "xo2_final", "xo2_final_pct", "d_xo2", "comments",
                         "ext_mode_raw", "hot_ignition", "hot_ignition_raw"],
        },
        unclear=["tfp"],
    ),
    "acme_inverse": dict(
        num=["xo2", "m_o2_mg_s", "x_fuel_amb_init", "p_atm", "zst", "tad_k_calc", "hc_burnrate_mg_s", "day"],
        cat=["fuel_base", "experiment"],
        groups=["experiment", "fuel_base", "day"],
        targets={
            "burn_time_s": dict(task="regression", subset="experiment == 'CFI-G' and hot_ignition == 1"),
            "hot_ignition": dict(task="binary", subset="experiment == 'CFI-G'"),
            "ext_mode": dict(task="binary", subset="experiment == 'CFI-G' and ext_mode.notna()"),
        },
        leakage={
            "burn_time_s": ["x_fuel_amb_final", "peak_burner_T_C", "peak_burner_T_K", "flame_color", "color_raw",
                            "color_hit_limit", "comments", "ext_mode", "ext_mode_raw", "ignition_class",
                            "hot_ignition", "hot_ignition_raw", "p_final_atm"],
            "hot_ignition": ["burn_time_s", "x_fuel_amb_final", "peak_burner_T_C", "peak_burner_T_K", "flame_color",
                             "color_raw", "color_hit_limit", "comments", "ext_mode", "ext_mode_raw",
                             "ignition_class", "hot_ignition_raw"],
            "ext_mode": ["burn_time_s", "x_fuel_amb_final", "peak_burner_T_C", "peak_burner_T_K", "flame_color",
                         "color_raw", "color_hit_limit", "comments", "ext_mode_raw"],
        },
        unclear=["tfp"],
    ),
    "flex": dict(
        num=["d0_mm", "p_atm", "x_o2", "x_n2", "x_co2", "x_he"],
        cat=["fuel", "diluent"],
        groups=["fuel", "diluent", "year"],
        targets={
            "burn_time_s": dict(task="regression", subset="burn_time_s.notna()"),
            "burn_rate_K_mm2_s": dict(task="regression", subset="burn_rate_K_mm2_s.notna()"),
            "d_ext_mm": dict(task="regression", subset="d_ext_mm.notna()"),
            "test_end": dict(task="multiclass", subset="test_end.notna()"),
        },
        leakage={
            "burn_time_s": ["d_ext_mm", "d_ext_over_d0", "K_from_d2_law", "burn_rate_K_mm2_s", "test_end",
                            "burn_time_approx"],
            "burn_rate_K_mm2_s": ["burn_time_s", "d_ext_mm", "d_ext_over_d0", "K_from_d2_law", "test_end"],
            "d_ext_mm": ["burn_time_s", "burn_rate_K_mm2_s", "d_ext_over_d0", "K_from_d2_law", "test_end"],
            "test_end": ["burn_time_s", "burn_rate_K_mm2_s", "d_ext_mm", "d_ext_over_d0", "K_from_d2_law"],
        },
        unclear=[],
    ),
    "bass2": dict(
        num=["thickness_mm", "flow_restrictor", "air_display_initial", "o2_init_pct", "co2_init_pct", "co_init_ppm"],
        cat=["material", "geometry", "pi", "rod_color"],
        groups=["pi", "material"],
        targets={
            "d_o2_pct": dict(task="regression", subset="d_o2_pct.notna() and not o2_final_anomaly_flag"),
            "d_co2_pct": dict(task="regression", subset="d_co2_pct.notna()"),
            "co_final_ppm": dict(task="regression", subset="co_final_ppm.notna() and not co_negative_flag"),
        },
        leakage={t: ["o2_final_pct", "co2_final_pct", "co_final_ppm", "d_o2_pct", "d_co2_pct", "d_co_ppm",
                     "frames", "frames_raw", "co_final_ppm_overrange", "o2_final_anomaly_flag"]
                 for t in ["d_o2_pct", "d_co2_pct", "co_final_ppm"]},
        unclear=["fan_display_initial"],
    ),
    "smoke": dict(
        num=["rt_r0", "inlet_velocity_cm_s", "aging_s", "sample_temp_c"],
        cat=["material", "campaign", "gravity"],
        groups=["material", "campaign"],
        targets={
            "amd_um": dict(task="regression", subset="amd_um.notna()"),
            "dusttrak_b_mg_m3": dict(task="regression", subset="dusttrak_b_mg_m3.notna()"),
        },
        leakage={
            "amd_um": ["m0_per_cc", "m1_mm_per_cc", "log_m0", "dam_um", "dg_um", "sigma_g", "dusttrak_a_mg_m3",
                       "dusttrak_b_mg_m3", "m3_mpass", "mpass_3_2", "mass_loss_mg"],
            "dusttrak_b_mg_m3": ["dusttrak_a_mg_m3", "m3_mpass", "mpass_3_2", "m0_per_cc", "m1_mm_per_cc", "log_m0",
                                 "amd_um", "dam_um", "dg_um", "sigma_g", "mass_loss_mg"],
        },
        unclear=[],
    ),
    "cfi": dict(
        num=["d0_mm", "p_atm", "x_o2", "x_n2", "x_he", "ign_power_w", "ign_time_ms"],
        cat=["fuel", "diluent", "fiber"],
        groups=["fuel", "diluent", "p_atm"],
        targets={
            "k_hot_mm2_s": dict(task="regression", subset="k_hot_mm2_s.notna()"),
            "hf_burn_time_s": dict(task="regression", subset="hf_burn_time_s.notna()"),
            "d_ext_hot_mm": dict(task="regression", subset="d_ext_hot_mm.notna()"),
            "has_cool_flame": dict(task="binary", subset="completed_analysis == 'Yes'"),
        },
        leakage={t: ["d_ext_hot_mm", "k_hot_mm2_s", "k_cool_mm2_s", "d_ext_cool_mm", "hf_burn_time_s", "reignitions",
                     "extrap_cf", "peak_hf_rad", "peak_h2o_rad", "rad_ratio", "rad_2p5mm", "rad_2p5mm_narrow",
                     "cf_rad_ratio", "rad_2p5mm_cf", "time_2p5mm", "actual_d_mm", "has_cool_flame"]
                 for t in ["k_hot_mm2_s", "hf_burn_time_s", "d_ext_hot_mm", "has_cool_flame"]},
        unclear=[],
    ),
}
for _t, _s in SPEC.items():          # a target never leaks into itself
    for _k in _s["leakage"]:
        _s["leakage"][_k] = [c for c in _s["leakage"][_k] if c != _k]


def target_frame(name: str, target: str, df: pd.DataFrame) -> pd.DataFrame:
    """Rows of table `df` (the `name` table) on which `target` is defined (SPEC subset query)."""
    q = SPEC[name]["targets"][target]["subset"]
    return df.query(q, engine="python") if q else df
