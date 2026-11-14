"""Condition envelopes from the tables (plans/01_m1_discovery, step A1).

One row per (investigation, parquet table) mapped in `table_map` (coverage 'table' or 'inferred'). Values come from the
rows themselves; nothing is assumed (no "21 % O2" for tables without an O2 column) and nothing is filled.
- O2 in percent: mole fractions (xo2_init, xo2, x_o2) x 100; o2_init_pct / o2_pct_approx are already percent.
  `o2_basis` says what the number means: ambient atmosphere, oxidizer stream (inverse flames) or initial chamber O2.
- Pressure in atm from p_atm; values <= 0 are physically impossible and excluded (counted in p_invalid_n).
- Flow in cm/s; text like "20 cm/s" is parsed; negative values excluded (counted in flow_invalid_n).
- Phenomenon tags from outcome columns that have at least one value.
"""
from __future__ import annotations

import re

import pandas as pd

from src.data_layer.store import connect_all

O2 = {"acme_normal": ("xo2_init", "ambient", 100.0), "acme_inverse": ("xo2", "oxidizer_stream", 100.0),
      "flex": ("x_o2", "ambient", 100.0), "cfi": ("x_o2", "ambient", 100.0),
      "bass2": ("o2_init_pct", "ambient_initial", 1.0),
      "saffire1": ("o2_pct_approx", "ambient", 1.0), "saffire2": ("o2_pct_approx", "ambient", 1.0)}
PRESSURE = {"acme_normal", "acme_inverse", "flex", "cfi"}
FLOW = {"smoke": "inlet_velocity_cm_s", "saffire1": "Air Flow (cm/s)", "saffire2": "Air Flow (cm/s)",
        "saffire3": "Air Flow", "spice": "Air Rate (cm/s)"}
DILUENT = {"flex": "diluent", "cfi": "diluent"}
FUEL = {"acme_normal": "fuel_base", "acme_inverse": "fuel_base", "flex": "fuel", "cfi": "fuel", "spice": "Fuel",
        "acme_testdays": "fuel_bottle"}
MATERIAL = {"bass2": "material", "smoke": "material", "saffire1": "Material", "saffire2": "Material", "saffire3": "Material"}
CLASS = {"acme_normal": "gas", "acme_inverse": "gas", "acme_testdays": "gas", "spice": "gas", "flex": "liquid_droplet",
         "cfi": "liquid_droplet", "bass2": "solid", "smoke": "solid", "saffire1": "solid", "saffire2": "solid", "saffire3": "solid"}
TAGS = {"hot_ignition": "ignition", "flames_ignited": "ignition", "ext_mode": "extinction", "test_end": "extinction",
        "d_ext_mm": "extinction", "d_ext_hot_mm": "extinction", "burn_time_s": "burn_time", "hf_burn_time_s": "burn_time",
        "flame_duration_s": "burn_time", "Burn Time (s)": "burn_time", "amd_um": "smoke", "dusttrak_b_mg_m3": "smoke",
        "d_o2_pct": "combustion_products", "d_co2_pct": "combustion_products", "co_final_ppm": "combustion_products",
        "has_cool_flame": "cool_flame", "k_cool_mm2_s": "cool_flame", "burn_rate_K_mm2_s": "burning_rate",
        "k_hot_mm2_s": "burning_rate", "ug Spread Length": "flame_spread"}
GRAVITY = {"flight": "µg", "ground": "1g"}
COLUMNS = ["psi_id", "table", "relation", "source", "n_rows", "o2_basis", "o2_min_pct", "o2_max_pct", "p_min_atm", "p_max_atm",
           "p_invalid_n", "flow_min_cm_s", "flow_max_cm_s", "flow_invalid_n", "diluents", "fuels", "materials",
           "material_class", "gravity", "phenomena"]
_NUM = re.compile(r"(-?\d+(?:\.\d+)?)\s*cm/s")


def _flow(values: pd.Series) -> pd.Series:
    if pd.api.types.is_numeric_dtype(values):
        return values.astype(float)
    return values.map(lambda v: float(m.group(1)) if isinstance(v, str) and (m := _NUM.search(v)) else float("nan"))


def _join(values) -> str | None:
    vals = sorted({str(v) for v in values if pd.notna(v)})
    return "; ".join(vals) if vals else None


def _row(psi: str, table: str, relation: str, rows: pd.DataFrame, flight_program) -> dict:
    out = dict(psi_id=psi, table=table, relation=relation, source="table", n_rows=len(rows), o2_basis=None,
               o2_min_pct=float("nan"), o2_max_pct=float("nan"), p_min_atm=float("nan"), p_max_atm=float("nan"),
               p_invalid_n=0, flow_min_cm_s=float("nan"), flow_max_cm_s=float("nan"), flow_invalid_n=0,
               diluents=None, fuels=None, materials=None, material_class=CLASS[table], gravity=None, phenomena=None)
    if table in O2:
        col, basis, scale = O2[table]
        v = rows[col].dropna().astype(float) * scale
        out["o2_basis"] = basis
        if len(v):
            out["o2_min_pct"], out["o2_max_pct"] = float(v.min()), float(v.max())
    if table in PRESSURE:
        p = rows["p_atm"].dropna().astype(float)
        out["p_invalid_n"] = int((p <= 0).sum())
        p = p[p > 0]
        if len(p):
            out["p_min_atm"], out["p_max_atm"] = float(p.min()), float(p.max())
    if table in FLOW:
        f = _flow(rows[FLOW[table]]).dropna()
        out["flow_invalid_n"] = int((f < 0).sum())
        f = f[f >= 0]
        if len(f):
            out["flow_min_cm_s"], out["flow_max_cm_s"] = float(f.min()), float(f.max())
    if table in DILUENT:
        out["diluents"] = _join(rows[DILUENT[table]])
    if table in FUEL:
        out["fuels"] = _join(rows[FUEL[table]])
    if table in MATERIAL:
        out["materials"] = _join(v for v in rows[MATERIAL[table]] if not (isinstance(v, str) and v.startswith("Pre-test")))
    if "gravity" in rows.columns:
        out["gravity"] = _join(GRAVITY.get(g, g) for g in rows["gravity"])
    else:
        fp = flight_program if isinstance(flight_program, str) else ""
        out["gravity"] = "µg" if ("International Space Station" in fp or "Cygnus" in fp) else "unknown"
    out["phenomena"] = _join(tag for col, tag in TAGS.items() if col in rows.columns and rows[col].notna().any())
    return out


def envelope_from_tables(con=None) -> pd.DataFrame:
    con = con or connect_all()
    tm = con.execute("SELECT psi_id, \"table\", relation FROM table_map WHERE coverage IN ('table', 'inferred')").fetchall()
    fp = dict(con.execute("SELECT psi_id, flight_program FROM investigations").fetchall())
    cache, rows = {}, []
    for psi, table, relation in tm:
        df = cache.setdefault(table, con.execute(f"SELECT * FROM {table}").df())
        if relation == "inferred":            # only table_map knows which rows: smoke campaign == acronym of psi
            acr = con.execute("SELECT acronym FROM investigations WHERE psi_id = ?", [psi]).fetchone()[0]
            part = df[df["campaign"] == acr]
        else:
            part = df[df["psi_id"] == psi]
        rows.append(_row(psi, table, relation, part, fp.get(psi)))
    out = pd.DataFrame(rows, columns=COLUMNS)
    order = out["psi_id"].str.extract(r"(\d+)")[0].astype(int)
    out = out.assign(_n=order).sort_values(["_n", "table"]).drop(columns="_n").reset_index(drop=True)
    return out.astype({"n_rows": "int64", "p_invalid_n": "int64", "flow_invalid_n": "int64"})
