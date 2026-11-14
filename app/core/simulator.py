"""Physics-aware synthetic BASS-II archive (placeholder until real data arrives).

The generated table matches the schema expected by src/features.py exactly, so
the same feature/training pipeline runs on both the simulation and real data.
The results are derived from the Olson limit and Huggett calorimetry, with noise.
It is always labelled "SIMULATION" in the interface.
"""
from __future__ import annotations

import numpy as np
import pandas as pd

from app import config as C
from app.core import hardware as H
from app.core import physics as P


def generate(n_tests: int = C.N_ISS_TESTS, n_samples: int = 38, seed: int = 2026) -> pd.DataFrame:
    rng = np.random.default_rng(seed)

    # --- Sample catalogue: each sample is tested under several conditions -----
    mat_p = [0.62, 0.14, 0.12, 0.12]
    samples = pd.DataFrame({
        "Sample_No": np.arange(1, n_samples + 1),
        "Material": rng.choice(C.MATERIALS, size=n_samples, p=mat_p),
        "Geometry": rng.choice(C.GEOMETRIES, size=n_samples, p=[0.4, 0.35, 0.25]),
    })
    samples["Radius_cm"] = np.where(
        samples["Geometry"] == "flat",
        rng.choice([0.5, 1.0], size=n_samples),
        rng.choice([0.159, 0.318, 0.476, 0.635, 0.953], size=n_samples),
    )
    samples["Thickness"] = np.where(
        samples["Geometry"] == "flat",
        rng.choice([0.1, 0.2, 0.5], size=n_samples),
        samples["Radius_cm"] * 2,
    )
    # Per-material limit shift (PMMA reference). Adds variety to the simulation.
    mat_shift = {"PMMA": 0.0, "Delrin (POM)": -0.4, "Ultem 1000": 4.5, "Cotton/Fiberglass fabric": 0.8}

    idx = rng.integers(0, n_samples, size=n_tests)
    df = samples.iloc[idx].reset_index(drop=True)
    df.insert(0, "Test_ID", [f"BASS2-{i:03d}" for i in range(1, n_tests + 1)])
    df["Run_Date"] = pd.Timestamp("2014-01-15") + pd.to_timedelta(np.sort(rng.integers(0, 620, n_tests)), unit="D")

    # --- Control variables ----------------------------------------------------
    df["Fan_Pot"] = np.round(rng.choice(
        [0.2, 0.5, 0.8, 1.0, 1.5, 2.0, 3.0, 4.0], size=n_tests, p=[0.1, 0.1, 0.15, 0.15, 0.15, 0.15, 0.12, 0.08]
    ) + rng.normal(0, 0.03, n_tests), 2)
    # Real calibration table + random deviation within the table measurement range
    readings = [H.from_pot(p) for p in df["Fan_Pot"]]
    df["Flow_Vel"] = np.round([rng.uniform(r.range_lo, r.range_hi) if r.range_hi > r.range_lo else r.velocity_cm_s
                               for r in readings], 3) + np.abs(rng.normal(0, 0.05, n_tests))
    df["O2_initial"] = np.round(np.where(rng.random(n_tests) < 0.15, 21.0, rng.uniform(13.0, 19.0, n_tests)), 2)
    df["Pressure_kPa"] = 101.3

    # --- Physical outcome -----------------------------------------------------
    a = P.strain_rate(df["Flow_Vel"].to_numpy(), df["Radius_cm"].to_numpy())
    limit = P.olson_limit(a) + df["Material"].map(mat_shift).to_numpy()
    margin = df["O2_initial"].to_numpy() - limit
    p_burn = P.flame_probability(margin, width=0.45)
    burning = rng.random(n_tests) < p_burn
    df["Extinction"] = (~burning).astype(int)

    # Heat release: grows with margin and sample size; scaled to the ~M5 (~100 W) upper end
    size = (df["Radius_cm"].to_numpy() / C.R_REF_CM) ** 0.8
    hrr = np.where(
        burning,
        np.clip(8 + 9 * np.maximum(margin, 0) * size, 4, 125),
        np.clip(3 + 6 * np.maximum(margin + 1.5, 0), 1, 20),
    ) * rng.lognormal(0, 0.18, n_tests)
    burn_time = np.where(burning, rng.uniform(150, 420, n_tests), rng.uniform(20, 140, n_tests))
    df["Burn_Time"] = np.round(burn_time, 1)
    drop = P.o2_drop_for_hrr(hrr, burn_time)
    df["O2_final"] = np.round(df["O2_initial"] - drop, 3)

    # Ignition delay: stretches up to 230 s as the limit is approached
    df["Ignition_Time"] = np.round(
        np.clip(P.ignition_delay_s(margin + 0.6) * rng.lognormal(0, 0.15, n_tests), 3, C.BASS2_MAX_IGNITION_S), 1
    )

    # Gazlar: PMMA C5H8O2 + 6 O2 -> 5 CO2 + 4 H2O  (CO2 / O2 ≈ 5/6)
    co2_pct = drop * (5 / 6) * rng.normal(1, 0.05, n_tests)
    co_frac = 0.07 * P.co_enhancement(np.maximum(margin, 0), df["Flow_Vel"].to_numpy())
    df["CO2"] = np.round(co2_pct, 4)                                  # % hacim
    df["CO"] = np.round(co2_pct * 1e4 * co_frac * rng.lognormal(0, 0.2, n_tests), 1)  # ppm
    df["CO"] = df["CO"].clip(upper=C.CO_SENSOR_SAT_PPM * 1.0)       # sensor saturation

    return df
