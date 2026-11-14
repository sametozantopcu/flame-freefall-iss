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
  flamesense       {concept: true, built: false, dimensions_mm, mcu, sensors[], images[]}
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

from src.data_layer import metadata  # noqa: E402
from src.discovery import ranking  # noqa: E402
from src.discovery.envelope import envelope_from_tables  # noqa: E402
from src.insight.cards import load_cards  # noqa: E402
from src.prediction.flex_model import fit_flex  # noqa: E402

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
        "investigations": rows, "model": model, "cards": cards, "flamesense": FLAMESENSE,
    }
    return clean(site)


def main() -> None:
    site = build()
    OUT.mkdir(parents=True, exist_ok=True)
    body = json.dumps(site, ensure_ascii=False, sort_keys=True, indent=1, allow_nan=False)
    (OUT / "site_data.json").write_text(body + "\n", encoding="utf-8")
    (OUT / "site_data.js").write_text(
        f"window.FF = window.FF || {{}};\nwindow.FF.site = {body};\nwindow.FF.siteData = window.FF.site;\n", encoding="utf-8")
    print(f"wrote {OUT/'site_data.js'} ({len(site['investigations'])} investigations, {len(site['cards'])} cards)")


if __name__ == "__main__":
    main()
