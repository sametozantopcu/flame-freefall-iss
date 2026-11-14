"""M1 habitat-relevance ranking (plans/mvp, step S3).

ASSUMPTION (planner's, not validated by NASA or the team): every constant in this file (weights, habitat ranges) is an
assumption chosen for prioritisation only. The score is not a safety certification. There is NO gravity component:
no partial-gravity (Moon/Mars) data exists; `has_flight` only says that micro-g flight data exists.

Output of `rank_investigations()` (one row per investigation, sorted: scored by score desc, then low_confidence, then not_scorable last):
  psi_id, doi, score (0-100, None unless scored), score_status ('scored' | 'low_confidence' | 'not_scorable'),
  components in [0,1] or None: o2_overlap, pressure_overlap, low_flow_overlap, has_flight, has_solid, data_volume,
  n_components_known, missing_components (list of keys), rationale (one English sentence from a template).
Fewer than MIN_KNOWN known components: score = None, status 'low_confidence' (known components are kept).
Missing component = None (never 0); score = 100 * sum(w*c) / sum(w) over the known components only.
Inputs come only from `envelope_from_tables`, meta/inv_envelope_text.parquet (accepted facts) and meta/investigations.parquet.
"""
from __future__ import annotations

import math

import pandas as pd

from src.data_layer import metadata
from src.discovery.envelope import envelope_from_tables

# --- ASSUMPTIONS (single configuration place) ---------------------------------------------------------------------
WEIGHTS = {"o2_overlap": 0.25, "pressure_overlap": 0.20, "low_flow_overlap": 0.15,
           "has_flight": 0.15, "has_solid": 0.10, "data_volume": 0.15}
HABITAT = {"o2_pct": (17.0, 35.0), "pressure_kpa": (56.0, 101.0), "low_flow_cm_s": (0.0, 20.0)}
KPA_PER_ATM = 101.325
MIN_KNOWN = 3          # fewer known components -> no headline score (status 'low_confidence'), listed after scored ones
# -------------------------------------------------------------------------------------------------------------------
COMPONENTS = list(WEIGHTS)
FLIGHT_WORDS = ("µg", "microgravity")


def overlap_fraction(lo: float, hi: float, h_lo: float, h_hi: float) -> float:
    """Share of the investigation range [lo, hi] lying inside [h_lo, h_hi]; a point value is 1 if inside, else 0."""
    if hi <= lo:
        return 1.0 if h_lo <= lo <= h_hi else 0.0
    return max(0.0, min(hi, h_hi) - max(lo, h_lo)) / (hi - lo)


def _range(values_lo, values_hi):
    lo = [float(v) for v in values_lo if pd.notna(v)]
    hi = [float(v) for v in values_hi if pd.notna(v)]
    return (min(lo), max(hi)) if lo and hi else None


def _text_range(text: pd.DataFrame, psi: str, field: str):
    if text is None or text.empty:
        return None
    t = text[(text.psi_id == psi) & (text.field == field) & (text.accepted == True)]  # noqa: E712
    return _range(t["value_min_std"], t["value_max_std"])


def _merge(*rs):
    rs = [r for r in rs if r]
    return (min(r[0] for r in rs), max(r[1] for r in rs)) if rs else None


def _components(psi: str, env: pd.DataFrame, text: pd.DataFrame) -> dict:
    e = env[env.psi_id == psi] if "psi_id" in env.columns else env.iloc[0:0]
    c = dict.fromkeys(COMPONENTS)
    o2 = _merge(_range(e.get("o2_min_pct", []), e.get("o2_max_pct", [])), _text_range(text, psi, "o2"))
    if o2:
        c["o2_overlap"] = overlap_fraction(*o2, *HABITAT["o2_pct"])
    p = _merge(_range(e.get("p_min_atm", []), e.get("p_max_atm", [])), _text_range(text, psi, "pressure"))
    if p:
        c["pressure_overlap"] = overlap_fraction(p[0] * KPA_PER_ATM, p[1] * KPA_PER_ATM, *HABITAT["pressure_kpa"])
    f = _merge(_range(e.get("flow_min_cm_s", []), e.get("flow_max_cm_s", [])), _text_range(text, psi, "flow"))
    if f:
        c["low_flow_overlap"] = overlap_fraction(*f, *HABITAT["low_flow_cm_s"])
    grav = [g for v in e.get("gravity", []) if isinstance(v, str) for g in v.split("; ") if g != "unknown"]
    if text is not None and not text.empty:
        t = text[(text.psi_id == psi) & (text.field == "gravity") & (text.accepted == True)]  # noqa: E712
        grav += [str(v) for v in t["value_text"].dropna()]
    if grav:
        c["has_flight"] = 1.0 if any(w in g.lower() for g in grav for w in FLIGHT_WORDS) else 0.0
    classes = [v for v in e.get("material_class", []) if isinstance(v, str)]
    if classes:
        c["has_solid"] = 1.0 if "solid" in classes else 0.0
    n = int(e["n_rows"].sum()) if len(e) else 0
    if n > 0:
        c["data_volume"] = math.log10(1 + n)          # normalised by the maximum over all investigations in the caller
    return c


def _rationale(r: dict) -> str:
    if r["score_status"] == "low_confidence":
        known = [lbl for key, lbl in [("o2_overlap", "O2 overlap"), ("pressure_overlap", "pressure overlap"),
                 ("low_flow_overlap", "low-flow overlap"), ("has_flight", "micro-g flight flag"),
                 ("has_solid", "solid-material flag"), ("data_volume", "data volume")] if r[key] is not None]
        return (f"Low confidence: only {r['n_components_known']} of {len(COMPONENTS)} components known "
                f"({', '.join(known)}); no headline score.")
    if r["score"] is None:
        return "Not scorable: no habitat-relevant condition is known for this investigation."
    parts = []
    for key, label in [("o2_overlap", "O2"), ("pressure_overlap", "pressure"), ("low_flow_overlap", "low-flow")]:
        if r[key] is not None:
            parts.append(f"{label} overlap {r[key]:.0%}")
    parts.append("micro-g flight data" if r["has_flight"] == 1.0 else "no micro-g flight data" if r["has_flight"] == 0.0
                 else "flight status unknown")
    miss = f"; {len(r['missing_components'])} component(s) unknown" if r["missing_components"] else ""
    return f"Score {r['score']:.0f}/100 from {r['n_components_known']} known components ({', '.join(parts)}){miss}."


def rank_investigations(con=None, env=None, text=None, inv=None) -> pd.DataFrame:
    env = envelope_from_tables(con) if env is None else env
    if text is None:
        text = pd.read_parquet(metadata.META_DIR / "inv_envelope_text.parquet")
    if inv is None:
        inv = pd.read_parquet(metadata.META_DIR / "investigations.parquet", columns=["psi_id", "doi"])
    comps = {psi: _components(psi, env, text) for psi in inv["psi_id"]}
    vols = [c["data_volume"] for c in comps.values() if c["data_volume"] is not None]
    vmax = max(vols) if vols else None
    rows = []
    for psi, doi in zip(inv["psi_id"], inv["doi"]):
        c = comps[psi]
        if c["data_volume"] is not None:
            c["data_volume"] = c["data_volume"] / vmax
        known = {k: v for k, v in c.items() if v is not None}
        status = "not_scorable" if not known else "scored" if len(known) >= MIN_KNOWN else "low_confidence"
        score = 100 * sum(WEIGHTS[k] * v for k, v in known.items()) / sum(WEIGHTS[k] for k in known) if status == "scored" else None
        r = dict(psi_id=psi, doi=doi if isinstance(doi, str) and doi else None, score=score,
                 score_status=status, **c, n_components_known=len(known),
                 missing_components=[k for k in COMPONENTS if k not in known])
        r["rationale"] = _rationale(r)
        rows.append(r)
    out = pd.DataFrame(rows).astype({k: "object" for k in ["score", *COMPONENTS]})
    tier = {"scored": 0, "low_confidence": 1, "not_scorable": 2}
    out["_t"] = out["score_status"].map(tier)
    out["_s"] = out["score"].map(lambda s: 0.0 if s is None else -s)
    out["_k"] = -out["n_components_known"]
    out = out.sort_values(["_t", "_s", "_k", "psi_id"], kind="stable").drop(columns=["_s", "_t", "_k"])
    return out.reset_index(drop=True)
