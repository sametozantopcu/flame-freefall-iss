"""Data access layer.

Priority order:
  1. If data/processed/bass2_clean.csv exists -> read and adapted to the schema.
  2. Otherwise (or if unreadable) -> a physics-aware simulated archive is built.

Column names are matched flexibly (case, underscores, common synonyms), units
are detected heuristically, and every derived physical quantity (strain rate,
Olson margin, HRR, warning flags) is computed in one place.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path

import numpy as np
import pandas as pd

from app import config as C
from app.core import physics as P
from app.core import simulator

# Canonical name -> accepted synonyms (normalised: lower case, alphanumeric only)
ALIASES: dict[str, list[str]] = {
    "Test_ID": ["testid", "test", "run", "runid", "testno", "experiment", "expid"],
    "Sample_No": ["sampleno", "sample", "sampleid", "samplenumber", "specimen"],
    "Material": ["material", "fuel", "fueltype"],
    "Geometry": ["geometry", "shape", "samplegeometry"],
    "Radius_cm": ["radiuscm", "radius", "r", "rcm"],
    "Thickness": ["thickness", "thicknesscm", "thick"],
    "O2_initial": ["o2initial", "o2init", "initialo2", "o2start", "o2i", "xo2", "o2pct"],
    "O2_final": ["o2final", "finalo2", "o2end", "o2f"],
    "CO2": ["co2", "co2pct", "co2final"],
    "CO": ["co", "coppm", "cofinal"],
    "Flow_Vel": ["flowvel", "flowvelocity", "velocity", "u", "ucms", "flow", "flowcms"],
    "Fan_Pot": ["fanpot", "pot", "potentiometer"],
    "Fan_Volts": ["fanvolts", "fanvoltage", "voltage", "volts"],
    "Burn_Time": ["burntime", "duration", "burnduration", "durations", "flametime"],
    "Ignition_Time": ["ignitiontime", "ignitiondelay", "tign", "ignition"],
    "Pressure_kPa": ["pressurekpa", "pressure", "pkpa"],
    "HRR_W": ["hrrw", "hrr", "heatreleaserate"],
    "Extinction": ["extinction", "extinguished", "ext", "flameout", "target"],
}


# Warnings are language-independent (key, parameters) pairs; the texts live in app/i18n.py.
Msg = tuple[str, dict]


def _norm(name: str) -> str:
    return re.sub(r"[^a-z0-9]", "", str(name).lower())


@dataclass
class DataBundle:
    df: pd.DataFrame
    source: str                       # "real" | "simulated"
    path: Path | None
    warnings: list[Msg] = field(default_factory=list)
    column_map: dict[str, str] = field(default_factory=dict)  # kanonik <- orijinal
    signature: str = ""               # cache key (file mtime/size)

    @property
    def is_real(self) -> bool:
        return self.source == "real"


def file_signature(path: Path = C.DATA_PATH) -> str:
    """Used to invalidate the cache when the file changes."""
    if not path.exists():
        return "simulated"
    st = path.stat()
    return f"{path}:{st.st_mtime_ns}:{st.st_size}"


def harmonize_columns(raw: pd.DataFrame) -> tuple[pd.DataFrame, dict[str, str]]:
    lookup = {_norm(c): c for c in raw.columns}
    mapping: dict[str, str] = {}
    for canon, alts in ALIASES.items():
        for key in [_norm(canon), *alts]:
            if key in lookup and lookup[key] not in mapping.values():
                mapping[canon] = lookup[key]
                break
    df = raw.rename(columns={v: k for k, v in mapping.items()})
    return df, mapping


def enrich(df: pd.DataFrame, warnings: list[Msg] | None = None) -> pd.DataFrame:
    """Adds the derived physical quantities and operational flags."""
    w = warnings if warnings is not None else []
    df = df.copy()

    if "Test_ID" not in df:
        df.insert(0, "Test_ID", [f"T{i:03d}" for i in range(1, len(df) + 1)])
    if "Sample_No" not in df:
        df["Sample_No"] = np.arange(1, len(df) + 1)
        w.append(("warn.no_sample_no", {}))
    for col, default in [("Material", "unknown"), ("Geometry", "unknown")]:
        if col not in df:
            df[col] = default
        df[col] = df[col].fillna(default).astype(str)
    if "Pressure_kPa" not in df:
        df["Pressure_kPa"] = C.STD_P_KPA
    if "Radius_cm" not in df:
        df["Radius_cm"] = C.R_REF_CM
        w.append(("warn.no_radius", {"r": C.R_REF_CM}))

    # Birim tespiti: CO ppm mi % mi? CO2 % mi ppm mi?
    co = pd.to_numeric(df["CO"], errors="coerce")
    if co.max() <= 5:
        df["CO_ppm"] = co * 1e4
        w.append(("warn.co_percent", {}))
    else:
        df["CO_ppm"] = co
    co2 = pd.to_numeric(df["CO2"], errors="coerce")
    df["CO2_pct"] = co2 / 1e4 if co2.max() > 100 else co2

    # Fizik
    df["Strain_Rate"] = P.strain_rate(df["Flow_Vel"].to_numpy(float), df["Radius_cm"].to_numpy(float))
    df["Olson_Limit"] = P.olson_limit(df["Strain_Rate"].to_numpy())
    df["O2_Margin"] = df["O2_initial"] - df["Olson_Limit"]
    df["O2_Drop"] = df["O2_initial"] - df["O2_final"]

    if "HRR_W" not in df:
        if "Burn_Time" in df:
            df["HRR_W"] = P.hrr_watts(df["O2_Drop"].to_numpy(float), df["Burn_Time"].to_numpy(float),
                                      p_kpa=df["Pressure_kPa"].to_numpy(float))
        else:
            df["HRR_W"] = np.nan
            w.append(("warn.no_burn_time", {}))
    df["O2_Consumed_g"] = P.o2_mass_consumed_g(df["O2_Drop"].to_numpy(float),
                                               p_kpa=df["Pressure_kPa"].to_numpy(float))

    # Operasyonel bayraklar
    df["Flag_HRR_100W"] = df["HRR_W"] >= C.HRR_WINDOW_DAMAGE_W
    df["Flag_CO_Sat"] = df["CO_ppm"] >= C.CO_SENSOR_SAT_PPM
    df["Flag_Earth_Safe_Space_Burn"] = (df["O2_initial"] < C.EARTH_PMMA_LOI_PCT) & (df["Extinction"] == 0)
    if "Ignition_Time" in df:
        df["Flag_Ign_Over_25s"] = df["Ignition_Time"] > C.STD6001_IGNITION_S
    df["Regime"] = [P.regime(a) for a in df["Strain_Rate"]]
    df["Outcome"] = np.where(df["Extinction"] == 1, "extinguished", "burning")
    return df


def load_real(path: Path = C.DATA_PATH) -> DataBundle:
    raw = pd.read_csv(path)
    df, mapping = harmonize_columns(raw)
    warnings: list[Msg] = []
    missing = [c for c in [*C.REQUIRED_COLS, C.TARGET_COL] if c not in df]
    if missing:
        raise ValueError(f"missing required column(s): {', '.join(missing)}")
    for c in C.REQUIRED_COLS:
        df[c] = pd.to_numeric(df[c], errors="coerce")
    n0 = len(df)
    df = df.dropna(subset=[*C.REQUIRED_COLS, C.TARGET_COL]).reset_index(drop=True)
    if len(df) < n0:
        warnings.append(("warn.rows_dropped", {"n": n0 - len(df)}))
    df[C.TARGET_COL] = df[C.TARGET_COL].astype(int)
    df = enrich(df, warnings)
    return DataBundle(df, "real", path, warnings, mapping, file_signature(path))


def load(path: Path = C.DATA_PATH) -> DataBundle:
    if path.exists():
        try:
            return load_real(path)
        except Exception as exc:  # noqa: BLE001 — the UI must not crash; show the cause
            sim = load_simulated()
            sim.warnings.insert(0, ("warn.csv_fallback", {"name": path.name, "err": str(exc)}))
            return sim
    return load_simulated()


def load_simulated() -> DataBundle:
    df = enrich(simulator.generate())
    return DataBundle(df, "simulated", None, [], {}, "simulated")


def nearest_tests(df: pd.DataFrame, o2: float, u: float, r: float, k: int = 7) -> pd.DataFrame:
    """Archive experiments physically closest to the scenario (in margin + strain-rate space)."""
    a = P.strain_rate(u, r)
    margin = o2 - P.olson_limit(a)
    d = np.sqrt(((df["O2_Margin"] - margin) / 1.0) ** 2 + ((np.log1p(df["Strain_Rate"]) - np.log1p(a)) / 0.5) ** 2)
    return df.assign(_dist=d).nsmallest(k, "_dist")
