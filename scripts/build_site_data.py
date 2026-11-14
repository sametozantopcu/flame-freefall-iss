#!/usr/bin/env python
"""Build the static-site data bridge (plans/mvp S5): src/ outputs -> app/data/site_data.{js,json}.

Output: `window.FF.site = {...}` (alias `window.FF.siteData`). Same content in site_data.json. Deterministic (sorted keys),
missing values are `null` (never 0), no NaN/Infinity.

Contract (consumed by S6/S7/S8):
  generated        data version string (latest investigation modified_date), not wall-clock
  meta             {source_dois[], model_cv{primary, fuel_diluent{r2,mae,n}, year{...}}, score_assumptions{weights, habitat,
                    min_known, kpa_per_atm}, no_partial_gravity_data: true, notes[]}
  investigations[] (rank order) {rank, psi_id, name, title, doi, score|null, score_status, components{<name>: 0..1|null},
                    n_components_known, missing_components[], rationale, summary,
                    envelope{o2_pct{min,max}|null, pressure_atm{min,max}|null, flow_cm_s{min,max}|null, fuels[], diluents[],
                    materials[], gravity[], phenomena[], n_rows|null}}
  model            fit_flex() dict (target, doi, n, features, coef, impute, cv, known_combos, ranges, fuels, diluents)
  cards[]          4 insight cards (id,title,finding,value,unit,n,psi_id,doi,source_file,caveat,equipment_implication,values)
  series           {psi_id: {table, x{col,label,unit}, y{...}, n_total, n_plotted, source_files[], points[[x,y,source_row,file_idx]],
                    reference|null}} measured points only (rows with x or y missing are omitted, not zero-filled)
  flamesense       {concept: true, built: false, dimensions_mm, mcu, sensors[], images[]}
  risk             precomputed material risk grid (plan R3; engine: src/risk, PR #7 by sametozantopcu, embedded coefficients):
                    {source{pr, author}, reference{o2_pct, pressure_kpa}, weights{}, level_thresholds{medium, critical},
                    materials[{key,label,inert,threshold_o2_pct_ref,basis}], provenance[] (src.risk.provenance table),
                    axes{o2_pct[], pressure_kpa[]}, presets[{key,o2_pct,pressure_kpa}], warning_keys[],
                    fields[] (cell field names; component_keys give the 6 `components.<key>` entries),
                    grid{<material_key>: [pressure_index][o2_index] -> [values in `fields` order]}}
                    cell `warnings` = list of integer indexes into `warning_keys`. Missing = null, never 0.
"""
from __future__ import annotations

import json
import math
import sys
from pathlib import Path

import numpy as np
import pandas as pd

REPO = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO))

from src.data_layer import metadata, store  # noqa: E402
from src.discovery import ranking  # noqa: E402
from src.discovery.envelope import envelope_from_tables  # noqa: E402
from src.insight.cards import load_cards  # noqa: E402
from src.prediction.flex_model import fit_flex  # noqa: E402
from src.risk import engine as risk_engine  # noqa: E402
from src.risk import provenance as risk_prov  # noqa: E402

OUT = REPO / "app" / "data"
SUMMARY_CHARS = 420

FLAMESENSE = {
    "concept": True, "built": False, "dimensions_mm": [140, 90, 45], "mcu": "ESP32-S3",
    "sensors": ["O2 (LuminOx)", "CO", "CO2 (SCD41)", "hot-wire flow", "particulate (SPS30)", "thermal array (MLX90640)"],
    "ionization": "concept only",
    "images": ["assets/flamesense_box/render_assembled.png", "assets/flamesense_box/render_internal.png",
               "assets/flamesense_box/render_exploded.png", "assets/flamesense_box/render_detail.png"],
}


def clean(x):
    """Recursively convert to plain JSON types; NaN/NA/inf -> None."""
    if isinstance(x, dict):
        return {str(k): clean(v) for k, v in x.items()}
    if isinstance(x, (list, tuple, set)):
        return [clean(v) for v in x]
    if isinstance(x, np.ndarray):
        return [clean(v) for v in x.tolist()]
    if isinstance(x, (np.integer,)):
        return int(x)
    if isinstance(x, (np.floating, float)):
        return float(x) if math.isfinite(x) else None
    if isinstance(x, (np.bool_,)):
        return bool(x)
    if x is None or isinstance(x, (str, bool, int)):
        return x
    return None if pd.isna(x) else str(x)


def _rng(r):
    return None if r is None else {"min": float(r[0]), "max": float(r[1])}


def _labels(values, split="; "):
    out = set()
    for v in values:
        if isinstance(v, str) and v.strip():
            out.update(s.strip() for s in v.split(split) if s.strip() and s.strip() != "unknown")
    return sorted(out)


def _envelope(psi: str, env: pd.DataFrame, text: pd.DataFrame) -> dict:
    e = env[env.psi_id == psi]
    R, M = ranking._range, ranking._merge
    t = text[(text.psi_id == psi) & (text.accepted == True)]  # noqa: E712
    fuels = _labels(e["fuels"].tolist() + e["materials"].tolist()) if len(e) else []
    fuels = sorted(set(fuels) | {str(v) for v in t[t.field == "fuel_or_material"]["value_text"].dropna()})
    dil = sorted(set(_labels(e["diluents"].tolist())) | {str(v) for v in t[t.field == "diluent"]["value_text"].dropna()})
    grav = sorted(set(_labels(e["gravity"].tolist())) | {str(v) for v in t[t.field == "gravity"]["value_text"].dropna()})
    phen = sorted(set(_labels(e["phenomena"].tolist())) | {str(v) for v in t[t.field == "phenomenon"]["value_text"].dropna()})
    mats = _labels(e["materials"].tolist()) if len(e) else []
    return {
        "o2_pct": _rng(M(R(e["o2_min_pct"], e["o2_max_pct"]), ranking._text_range(text, psi, "o2"))),
        "pressure_atm": _rng(M(R(e["p_min_atm"], e["p_max_atm"]), ranking._text_range(text, psi, "pressure"))),
        "flow_cm_s": _rng(M(R(e["flow_min_cm_s"], e["flow_max_cm_s"]), ranking._text_range(text, psi, "flow"))),
        "fuels": fuels, "diluents": dil, "materials": mats, "gravity": grav, "phenomena": phen,
        "n_rows": int(e["n_rows"].sum()) if len(e) else None,
    }


def _summary(title, objective) -> str | None:
    s = objective if isinstance(objective, str) and objective.strip() else None
    if s is None:
        return None
    s = " ".join(s.split())
    return s if len(s) <= SUMMARY_CHARS else s[:SUMMARY_CHARS].rsplit(" ", 1)[0] + "..."


# Measured (x, y) series for the Explore chart, read from the Feature Store only. One pair per investigation that has a
# table with a meaningful pair; others get no chart. `clean_nonpos`: values <= 0 in that column are treated as missing
# (same rule as flex_model._clean for p_atm). Rows where x or y is missing are left out (never filled with 0).
SERIES = {
    "PSI-25": {"table": "bass2", "x": ("o2_init_pct", "Initial O2", "% vol"), "y": ("o2_final_pct", "Final O2", "% vol"),
               "reference": {"kind": "identity", "label": "reference: no O2 change"}},
    "PSI-69": {"table": "flex", "x": ("x_o2_pct", "Oxygen in ambient gas", "%"),
               "y": ("burn_rate_K_mm2_s", "Burn rate K", "mm2/s (assumed)")},
    "PSI-101": {"table": "smoke", "x": ("inlet_velocity_cm_s", "Inlet velocity", "cm/s"),
                "y": ("amd_um", "Aerosol mean diameter (AMD)", "um")},
    "PSI-39": {"table": "cfi", "x": ("x_o2_pct", "Oxygen in ambient gas", "%"),
               "y": ("k_hot_mm2_s", "Hot-flame burn rate K", "mm2/s")},
}


def _series() -> dict:
    con = store.connect()
    out = {}
    for psi, c in SERIES.items():
        xc, yc = c["x"][0], c["y"][0]
        df = con.execute(f"SELECT psi_id, source_file, source_row, {xc} AS x, {yc} AS y FROM {c['table']} "
                         "WHERE psi_id = ? ORDER BY source_row", [psi]).df()
        n_total = int(len(df))
        ok = df.dropna(subset=["x", "y"])
        files = sorted(ok["source_file"].astype(str).unique().tolist())
        pts = [[float(r.x), float(r.y), int(r.source_row), files.index(str(r.source_file))] for r in ok.itertuples()]
        out[psi] = {"table": c["table"], "psi_id": psi, "x": {"col": xc, "label": c["x"][1], "unit": c["x"][2]},
                    "y": {"col": yc, "label": c["y"][1], "unit": c["y"][2]}, "n_total": n_total, "n_plotted": len(pts),
                    "source_files": files, "points": pts, "reference": c.get("reference")}
    return out


RISK_O2_AXIS = [round(15.0 + 0.5 * i, 1) for i in range(51)]                      # 15.0 .. 40.0
RISK_PRESSURE_AXIS = sorted({*(float(p) for p in range(50, 101, 5)), 56.5, 70.3, 101.3})
RISK_PRESETS = [
    {"key": "iss", "o2_pct": 21.0, "pressure_kpa": 101.3},
    {"key": "exploration", "o2_pct": 34.0, "pressure_kpa": 56.5},
    {"key": "iss_reduced", "o2_pct": 26.5, "pressure_kpa": 70.3},
    {"key": "ceiling", "o2_pct": 40.0, "pressure_kpa": 101.3},
]
RISK_WARNING_KEYS = ["material_fallback", "outside_envelope", "pressure_outside_envelope", "below_threshold",
                     "inert_material", "ignition_saturated", "above_threshold_low_index", "clipped_below_reference"]
RISK_FIELDS = ["risk_index", "risk_level", *(f"components.{k}" for k in risk_engine.RISK_WEIGHTS),
               "ignition_probability", "burn_time_s", "ignition_delay_s", "spread_coefficient_mm2_s", "pO2_atm",
               "threshold_o2_pct", "margin_pct", "warnings"]


def _risk_cell(a) -> list:
    codes = [*a.warnings, *risk_prov.extra_warnings(a)]
    return [a.risk_index, a.risk_level, *(a.components[k] for k in risk_engine.RISK_WEIGHTS),
            a.ignition_probability, a.burn_time_s, a.ignition_delay_s, a.spread_coefficient_mm2_s, a.pO2_atm,
            a.threshold_o2_pct, a.margin_pct, sorted(RISK_WARNING_KEYS.index(c) for c in codes)]


def _risk() -> dict:
    """Precomputed risk grid: the static site cannot run Python, so every slider position is a table lookup.
    Engine runs with its embedded coefficients (Anchors.default()), default `extrapolate=True`."""
    anchors = risk_engine.Anchors.default()
    eng = risk_engine.RiskEngine(anchors)
    for pr in RISK_PRESETS:   # presets must sit exactly on the axes (lookups, no interpolation)
        assert pr["o2_pct"] in RISK_O2_AXIS and pr["pressure_kpa"] in RISK_PRESSURE_AXIS, pr
    grid = {
        key: [[_risk_cell(eng.assess(o2, p, key)) for o2 in RISK_O2_AXIS] for p in RISK_PRESSURE_AXIS]
        for key in risk_engine.MATERIAL_PROFILES
    }
    return {
        "source": {"pr": 7, "author": "sametozantopcu"},
        "reference": {"o2_pct": risk_engine.REF_O2_PCT, "pressure_kpa": risk_engine.REF_PRESSURE_KPA},
        "weights": dict(eng.weights), "level_thresholds": dict(eng.thresholds),
        "materials": [{"key": k, "label": p.label, "inert": p.inert, "threshold_o2_pct_ref": p.threshold_o2_pct,
                       "basis": risk_prov.material_basis(k)} for k, p in risk_engine.MATERIAL_PROFILES.items()],
        "provenance": risk_prov.build_provenance(anchors, refit=True),
        "axes": {"o2_pct": RISK_O2_AXIS, "pressure_kpa": RISK_PRESSURE_AXIS},
        "presets": RISK_PRESETS, "warning_keys": RISK_WARNING_KEYS,
        "component_keys": list(risk_engine.RISK_WEIGHTS), "fields": RISK_FIELDS, "grid": grid,
    }


def build() -> dict:
    inv = pd.read_parquet(metadata.META_DIR / "investigations.parquet")
    text = pd.read_parquet(metadata.META_DIR / "inv_envelope_text.parquet")
    env = envelope_from_tables()
    rank = ranking.rank_investigations(env=env, text=text, inv=inv[["psi_id", "doi"]])
    info = inv.set_index("psi_id")
    rows = []
    for i, r in enumerate(rank.to_dict("records"), 1):
        a = info.loc[r["psi_id"]]
        title = a["title"] if isinstance(a["title"], str) else None
        name = a["acronym"] if isinstance(a["acronym"], str) and a["acronym"] else title or r["psi_id"]
        rows.append({
            "rank": i, "psi_id": r["psi_id"], "name": name, "title": title, "doi": r["doi"],
            "score": r["score"], "score_status": r["score_status"],
            "components": {k: r[k] for k in ranking.COMPONENTS},
            "n_components_known": r["n_components_known"], "missing_components": list(r["missing_components"]),
            "rationale": r["rationale"], "summary": _summary(title, a["objective"]),
            "envelope": _envelope(r["psi_id"], env, text),
        })
    model = fit_flex()
    cards = load_cards()
    dois = sorted({d for d in [*(r["doi"] for r in rows), model.get("doi"), *(c.get("doi") for c in cards)] if d})
    mod = pd.to_datetime(inv["modified_date"], errors="coerce", utc=True).max()
    site = {
        "generated": None if pd.isna(mod) else mod.strftime("%Y-%m-%d"),
        "meta": {
            "source_dois": dois,
            "model_cv": model["cv"],
            "score_assumptions": {"weights": ranking.WEIGHTS, "habitat": ranking.HABITAT, "min_known": ranking.MIN_KNOWN,
                                  "kpa_per_atm": ranking.KPA_PER_ATM},
            "no_partial_gravity_data": True,
            "notes": ["No partial-gravity (Moon/Mars) data exists in the datasets; scores are habitat-condition overlap only.",
                      "Valid only for fuel/diluent combinations present in FLEX data."],
        },
        "investigations": rows, "model": model, "cards": cards, "flamesense": FLAMESENSE, "series": _series(),
        "risk": _risk(),
    }
    return clean(site)


def main() -> None:
    site = build()
    OUT.mkdir(parents=True, exist_ok=True)
    # The risk grid is ~8k small arrays: written compactly (indent=1 would put every number on its own line).
    grid = site["risk"]["grid"]
    site["risk"]["grid"] = "@@RISK_GRID@@"
    body = json.dumps(site, ensure_ascii=False, sort_keys=True, indent=1, allow_nan=False)
    body = body.replace('"@@RISK_GRID@@"', json.dumps(grid, sort_keys=True, separators=(",", ":"), allow_nan=False))
    site["risk"]["grid"] = grid
    (OUT / "site_data.json").write_text(body + "\n", encoding="utf-8")
    (OUT / "site_data.js").write_text(
        f"window.FF = window.FF || {{}};\nwindow.FF.site = {body};\nwindow.FF.siteData = window.FF.site;\n", encoding="utf-8")
    print(f"wrote {OUT/'site_data.js'} ({len(site['investigations'])} investigations, {len(site['cards'])} cards)")


if __name__ == "__main__":
    main()
