"""Local server for the Flame in Freefall site (S8).

Serves only `app/` statically on 127.0.0.1 and exposes `POST /api/ask`.
Run: `python app/server.py [--port 8000]`  (env PORT also works).

The LLM key is read server-side via `src.discovery.llm.load_settings` (.env / environment) and never leaves
this process: not in responses, logs or static files. Without a key (or on any LLM error) the endpoint
answers HTTP 200 with mode "fallback" (plus a short `reason`) built from the investigations named in the question.

L2: investigations named in the question (name / acronym / PSI id, spelling-tolerant, derived from
`site_data.investigations`, no hard-coded list) always enter the context with their full record; topic parts
(risk, ranking, FlameSense, FLEX model) enter only when the question asks for them; low-scoring filler is dropped.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import mimetypes
import os
import re
import sys
import threading
import time
from collections import OrderedDict
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

APP_DIR = Path(__file__).resolve().parent
REPO = APP_DIR.parent
if str(REPO) not in sys.path:
    sys.path.insert(0, str(REPO))

from src.discovery.llm import load_settings  # noqa: E402  (reuses .env parsing and EVREN settings)

SITE_JSON = APP_DIR / "data" / "site_data.json"
MAX_QUESTION = 500
MAX_BODY = 8192
LLM_TIMEOUT = float(os.environ.get("LLM_TIMEOUT", 60))  # seconds per attempt (one retry follows)
LLM_RETRY_WAIT = 1.5  # seconds before the single retry
LLM_MAX_TOKENS = 500  # 120-220 word answers inside a JSON envelope
MAX_CONTEXT_CHARS = 4500
CACHE_SIZE = 64
MAX_ENTITIES = 4
ENTITY_QA_CHARS = {1: 1200, 2: 900, 3: 700}  # per-entity text budget by number of named investigations (else 550)
MIN_INV_SCORE = 20   # keyword score an un-named investigation needs to enter the context
MIN_CARD_SCORE = 10
BLOCKED_SUFFIXES = {".py", ".pyc", ".env"}

SYSTEM_PROMPT = (
    "You are a fire-safety analyst working on NASA PSI microgravity combustion data (ISS experiments). "
    "Rules. "
    "(1) Every data claim (a number, a condition, a finding) must come from the provided context and be tied to its "
    "PSI id (and DOI when useful). "
    "(2) For 'how can X be combined', 'what does this mean' or 'what do you recommend' questions, REASON from the data in "
    "the context and give a concrete, step-by-step answer that combines the named investigations' conditions "
    "(O2, pressure, flow, fuels, phenomena, n) and findings. Do not refuse because the context holds no ready-made "
    "answer; do not refuse when named investigations are in the context. "
    "(3) You may add general combustion science, but separate it explicitly with the prefix 'General combustion "
    "knowledge, not from this dataset: ...'. "
    "(4) Never invent a number or an experimental result that is not in the context; if something needed is missing, say so "
    "in one sentence and continue. "
    "(5) Reply 'Not in the data' only when the question is entirely outside this scope (unrelated to combustion, fire, "
    "smoke or these investigations). "
    "(6) Format: 120-220 words, short paragraphs or 3-5 bullets, direct answer first; no filler. "
    "(7) Caveats only when relevant: say there is no partial-gravity (Moon/Mars) data only if the question is about "
    "Moon, Mars or partial gravity; say the risk index is relative and heuristic, not an absolute fire probability, only "
    "if you use the risk index. Do not add generic disclaimers or notes about intended use; the interface shows one. "
    'Reply as JSON only: {"answer": "...", "sources": ["PSI-101", "flex_d2_slope", ...]} using ids from the context.'
)

_STOP = set("the a an of and or to in on for is are was were what which how does do with by at from it this that "
            "be as about can i we you me my".split())


def load_site() -> dict:
    return json.loads(SITE_JSON.read_text(encoding="utf-8"))


def _tokens(text: str) -> list[str]:
    return [t for t in re.findall(r"[a-z0-9\-\.]+", (text or "").lower()) if t not in _STOP and len(t) > 1]


def _flat(obj) -> str:
    if isinstance(obj, dict):
        return " ".join(_flat(v) for v in obj.values())
    if isinstance(obj, (list, tuple)):
        return " ".join(_flat(v) for v in obj)
    return "" if obj is None else str(obj)


# ---- entity matching: investigations named in the question (name / acronym / PSI id) ----
_ROMAN = {"i": "1", "ii": "2", "iii": "3", "iv": "4", "v": "5"}
_PSI_RE = re.compile(r"psi[\s\-_#]*0*(\d+)\b", re.I)


def _compact(words: list[str]) -> str:
    """Spelling-tolerant key: lowercase, no separators, trailing roman numerals -> digits (SAFFIRE-II == saffire 2)."""
    ws = [w.lower() for w in words]
    ws = [(_ROMAN.get(w, w) if k > 0 else w) for k, w in enumerate(ws)]
    return "".join(ws)


def _alias_index(site: dict) -> tuple[dict, dict]:
    """exact: compact name -> [psi]; family: first word of multi-word names -> [psi]. Built from the data itself."""
    exact: dict[str, list[str]] = {}
    family: dict[str, list[str]] = {}
    for inv in site.get("investigations", []):
        psi = inv.get("psi_id")
        for part in str(inv.get("name") or "").split("/"):
            words = re.findall(r"[A-Za-z0-9]+", part)
            if not words or len(words) > 4:      # long names are titles; reachable via PSI id or keywords
                continue
            exact.setdefault(_compact(words), []).append(psi)
            if len(words) > 1 and len(words[0]) >= 4:
                family.setdefault(words[0].lower(), []).append(psi)
    return exact, family


def mentioned_investigations(question: str, site: dict, limit: int = MAX_ENTITIES) -> list[dict]:
    """Investigations named in the question, in order of mention. Longest span wins (SAME-R is not also SAME)."""
    invs = {i.get("psi_id"): i for i in site.get("investigations", [])}
    found: list[tuple[int, str]] = []
    for m in _PSI_RE.finditer(question):
        psi = f"PSI-{int(m.group(1))}"
        if psi in invs:
            found.append((m.start(), psi))
    words = [(m.group(0), m.start()) for m in re.finditer(r"[A-Za-z0-9]+", question)]
    exact, family = _alias_index(site)
    taken: set[int] = set()
    spans = []
    for n in (4, 3, 2, 1):
        for s in range(len(words) - n + 1):
            spans.append((n, s))
    for n, s in spans:
        idx = set(range(s, s + n))
        if idx & taken:
            continue
        ws = [w for w, _ in words[s:s + n]]
        key = _compact(ws)
        if n == 1:   # bare short words ("same", "slice") are only names when written as acronyms/with digits
            w = ws[0]
            if not (len(w) >= 6 or any(c.isdigit() for c in w) or w.isupper()):
                continue
        psis = exact.get(key)
        if not psis and n == 1:
            psis = sorted(family.get(key, []), key=lambda p: invs[p].get("rank") or 999)[:3]
        if psis:
            taken |= idx
            found += [(words[s][1], p) for p in psis]
    out, seen = [], set()
    for _, psi in sorted(found, key=lambda x: x[0]):
        if psi not in seen:
            seen.add(psi)
            out.append(invs[psi])
    return out[:limit]


_TRIGGERS = {
    "flamesense_concept": ("flamesense", "sensor", "detector", "hardware", "device", "esp32", "prototype box"),
    "investigation_ranking": ("most relevant", "rank", "priorit", "which experiment", "which investigation",
                              "matter most", "most important", "score", "relevan"),
    "risk_engine": ("risk", "flammab", "ignit", "threshold", "hazard", "danger", "limiting oxygen"),
    "flex_model": ("flex model", "burn rate", "burning rate", "burn-rate", "regress", "ridge", "cross-valid",
                   "reliab", "accura", "predict", "model"),
}
_HABITAT_CTX = ("mars", "moon", "lunar", "exploration", "which", "best", "most")
_GRAVITY = ("moon", "lunar", "mars", "martian", "partial", "hypogravity", "reduced gravity", "fractional", "0.38 g",
            "1/6")
_MARKERS = {"flamesense_concept": "flamesense", "investigation_ranking": "rank", "risk_engine": "risk",
            "flex_model": "flex"}
_PRESET_KEYS = ("iss", "exploration", "ceiling")


def _nearest(axis: list, v: float) -> int:
    return min(range(len(axis)), key=lambda i: abs(axis[i] - v))


def _risk_index(risk: dict, mat: str, o2: float, kpa: float):
    try:
        grid, ax = risk["grid"][mat], risk["axes"]
        row = grid[_nearest(ax["pressure_kpa"], kpa)][_nearest(ax["o2_pct"], o2)]
        return row[risk["fields"].index("risk_index")]
    except (KeyError, IndexError, ValueError, TypeError):
        return None


def _preset_text(risk: dict, mat: str) -> str:
    out = []
    for p in risk.get("presets") or []:
        if p.get("key") in _PRESET_KEYS:
            v = _risk_index(risk, mat, p["o2_pct"], p["pressure_kpa"])
            if v is not None:
                out.append(f"{p['key']} ({p['o2_pct']:g}% O2, {p['pressure_kpa']:g} kPa)={v:.0f}")
    return ", ".join(out)


def _mentioned_materials(question: str, risk: dict) -> list[dict]:
    ql = question.lower()
    found = []
    for m in risk.get("materials") or []:
        names = {str(m.get("key", "")).lower(), *(s.strip().lower() for s in str(m.get("label", "")).split("/"))}
        if any(n and n in ql for n in names):
            found.append(m)
    return found[:2]


def _flamesense_text(site: dict) -> str | None:
    fs = site.get("flamesense")
    if not fs:
        return None
    state = "concept - designed, not built" if fs.get("concept") and not fs.get("built") else \
        ("built" if fs.get("built") else "concept")
    dims = fs.get("dimensions_mm")
    why = "; ".join(f"{c.get('psi_id')} card {c.get('id')}: {str(c.get('equipment_implication'))[:170]}"
                    for c in site.get("cards") or [] if c.get("equipment_implication"))
    return (f"[FLAMESENSE] FlameSense is a {state} sensor box (no hardware exists yet) | "
            f"size {'x'.join(str(d) for d in dims) + ' mm' if dims else 'n/a'} | MCU {fs.get('mcu')} | "
            f"sensors: {', '.join(str(s) for s in fs.get('sensors') or [])}"
            + (f" | equipment implications of the PSI result cards: {why}" if why else ""))


def _ranking_text(site: dict) -> str | None:
    invs = site.get("investigations") or []
    scored = sorted((i for i in invs if i.get("score_status") == "scored" and i.get("rank") is not None),
                    key=lambda i: i["rank"])[:5]
    if not scored:
        return None
    n_low = sum(1 for i in invs if i.get("score_status") == "low_confidence")
    n_ns = sum(1 for i in invs if i.get("score_status") == "not_scorable")
    top = "; ".join(f"#{i['rank']} {i['psi_id']} {i.get('name')} ({i.get('score', 0):.0f}: "
                    f"{(re.search(r'[(]([^)]*)[)]', str(i.get('rationale') or '')) or [None, 'n/a'])[1]})" for i in scored)
    return (f"[RANKING] Habitat relevance, top {len(scored)}: {top} | scores rest on hypothetical weights "
            f"(not validated) | {n_low} low-confidence, {n_ns} not scorable")


def _asked_point(question: str, risk: dict) -> str | None:
    """Index at the O2 % (and pressure) written in the question, from the precomputed grid (nearest grid point)."""
    m = re.search(r"(\d+(?:\.\d+)?)\s*(?:%|percent|per cent)", question.lower())
    if not m or not risk.get("grid"):
        return None
    o2 = float(m.group(1))
    pm = re.search(r"(\d+(?:\.\d+)?)\s*(kpa|atm)\b", question.lower())
    kpa = (float(pm.group(1)) * (101.325 if pm.group(2) == "atm" else 1)) if pm else float(
        (risk.get("reference") or {}).get("pressure_kpa", 101.3))
    ax, f = risk["axes"], risk["fields"]
    mats = [x.get("key") for x in _mentioned_materials(question, risk)] or (["PMMA"] if "PMMA" in risk["grid"] else [])
    out = []
    for k in mats:
        if k not in risk["grid"]:
            continue
        try:
            row = risk["grid"][k][_nearest(ax["pressure_kpa"], kpa)][_nearest(ax["o2_pct"], o2)]
            out.append(f"{k}={row[f.index('risk_index')]:.0f} ({row[f.index('risk_level')]})")
        except (KeyError, IndexError, ValueError, TypeError):
            continue
    if not out:
        return None
    return (f"index at the asked point {ax['o2_pct'][_nearest(ax['o2_pct'], o2)]:g}% O2, "
            f"{ax['pressure_kpa'][_nearest(ax['pressure_kpa'], kpa)]:g} kPa (nearest grid point): " + ", ".join(out))


def _risk_text(site: dict, question: str) -> str | None:
    risk = site.get("risk")
    if not risk or not risk.get("grid"):
        return None
    ref = risk.get("reference") or {}
    data_mats = [str(m.get("key")) for m in risk.get("materials") or [] if m.get("basis") == "data"]
    th = risk.get("level_thresholds") or {}
    parts = [f"[RISK] Relative index, 0 = {ref.get('o2_pct', 21):g}% O2 / 1 atm, 100 = 40% O2; weights and level "
             f"thresholds ({', '.join(f'{k} {v}' for k, v in th.items())}) are uncalibrated assumptions, not "
             f"absolute fire probability; only the {'/'.join(data_mats) or 'n/a'} limit comes from ISS data"]
    if "PMMA" in (risk.get("grid") or {}):
        parts.append("PMMA index at " + _preset_text(risk, "PMMA"))
    for m in _mentioned_materials(question, risk):
        k = m.get("key")
        if k != "PMMA" and k in risk["grid"]:
            parts.append(f"{m.get('label')}: limit O2 {m.get('threshold_o2_pct_ref')}% ({m.get('basis')}); index at "
                         + _preset_text(risk, k))
        elif k == "PMMA":
            parts.append(f"PMMA limit O2 {m.get('threshold_o2_pct_ref')}% (ISS data)")
    pt = _asked_point(question, risk)
    if pt:
        parts.insert(1, pt)
    prov = []
    for p in risk.get("provenance") or []:
        s = f"{p.get('component')} {p.get('basis')}"
        if p.get("n"):
            s += f" n={p['n']}"
        if p.get("r2") is not None:
            s += f" R2={p['r2']:.2f}" + (" (low)" if p["r2"] < 0.2 else "")
        prov.append(s)
    if prov:
        parts.append("basis: " + "; ".join(prov))
    return " | ".join(parts)



def _model_text(site: dict) -> tuple[str, str | None] | None:
    m = site.get("model")
    if not m or not m.get("cv"):
        return None
    cv = m["cv"]
    prim = cv.get(cv.get("primary") or "fuel_diluent") or {}
    yr = cv.get("year") or {}
    rg = m.get("ranges") or {}
    o2, p = rg.get("x_o2") or {}, rg.get("p_atm") or {}
    combos = ", ".join(f"{c['fuel']}/{c['diluent']}" for c in m.get("known_combos") or [])
    text = (f"[MODEL] FLEX burn-rate model (Ridge regression, target {m.get('target')}, n={m.get('n')} droplet tests, "
            f"DOI {m.get('doi')}) | validation {cv.get('method')}: held-out fuel/diluent groups R2={prim.get('r2', float('nan')):.2f}, "
            f"MAE={prim.get('mae', float('nan')):.3f} (n_groups={prim.get('n_groups')}); held-out years R2="
            f"{yr.get('r2', float('nan')):.2f} | valid only for fuel/diluent combinations in the data ({combos}), "
            f"O2 {o2.get('min', 0) * 100:g}-{o2.get('max', 0) * 100:g} %, pressure {p.get('min', 0):.2f}-{p.get('max', 0):.2f} atm | "
            f"leakage columns excluded: {', '.join(m.get('leakage_excluded') or [])}")
    return text, m.get("doi")


def _special_items(question: str, site: dict, entities: list[dict] | None = None) -> list[dict]:
    ql = question.lower()
    mats = _mentioned_materials(question, site["risk"]) if site.get("risk") else []
    mt = _model_text(site)
    model_psi = next((i.get("psi_id") for i in site.get("investigations", [])
                      if mt and i.get("doi") and i.get("doi") == mt[1]), None)
    habitat = "habitat" in ql and any(k in ql for k in _HABITAT_CTX)
    out = []
    for ident, text, doi in (("flamesense_concept", _flamesense_text(site), None),
                             ("investigation_ranking", _ranking_text(site), None),
                             ("risk_engine", _risk_text(site, question), None),
                             ("flex_model", mt[0] if mt else None, mt[1] if mt else None)):
        if not text:
            continue
        s = 5 * sum(1 for k in _TRIGGERS[ident] if k in ql)
        if ident == "risk_engine" and mats:
            s += 10
        if ident == "investigation_ranking" and habitat:
            s += 5
        if ident == "flex_model" and any(e.get("psi_id") == model_psi for e in entities or []):
            s += 10
        if s > 0:
            out.append({"type": "special", "id": ident, "doi": doi, "raw": {"text": text}, "score": s})
    return sorted(out, key=lambda x: -x["score"])


def _kw_score(q: set, question_lower: str, ident, text: str) -> int:
    wset = set(_tokens(text))
    s = sum(2 for t in q if t in wset) + sum(1 for t in q if any(t in w for w in wset if w != t))
    if ident and str(ident).lower() in question_lower:
        s += 10
    return s


def select_context(question: str, site: dict, n_inv: int = 3, n_cards: int = 2) -> list[dict]:
    """Entities named in the question first (with their cards), then topic parts, then keyword-scored extras.

    Un-named investigations/cards must clear MIN_INV_SCORE / MIN_CARD_SCORE, so unrelated records stay out.
    """
    ql = question.lower()
    q = set(_tokens(question))
    ents = mentioned_investigations(question, site)
    named = {e.get("psi_id") for e in ents}
    per = 2 if len(ents) <= 2 else 1
    items: list[dict] = []
    cards = site.get("cards", [])
    for inv in ents:
        items.append({"type": "entity", "id": inv.get("psi_id"), "doi": inv.get("doi"), "raw": inv, "score": 100})
        mine = [c for c in cards if c.get("psi_id") == inv.get("psi_id")][:per]
        items += [{"type": "card", "id": c.get("id"), "doi": c.get("doi"), "raw": c, "score": 50} for c in mine]
    used_cards = {i["id"] for i in items if i["type"] == "card"}
    items += _special_items(question, site, ents)
    if not ents:
        n_inv = max(n_inv, 3)
    invs, crds = [], []
    for inv in site.get("investigations", []):
        if inv.get("psi_id") in named:
            continue
        env = inv.get("envelope") or {}
        text = (f"{inv.get('psi_id')} {inv.get('name')} {inv.get('title')} {inv.get('summary')} "
                f"{inv.get('rationale')} {_flat(env)}")
        invs.append((_kw_score(q, ql, inv.get("psi_id"), text), inv))
    for c in cards:
        if c.get("id") in used_cards:
            continue
        text = f"{c.get('id')} {c.get('title')} {c.get('finding')} {c.get('caveat')} {c.get('equipment_implication')} {c.get('psi_id')}"
        crds.append((_kw_score(q, ql, c.get("id"), text), c))
    for s, inv in sorted(invs, key=lambda x: -x[0])[:n_inv]:
        if s >= MIN_INV_SCORE:
            items.append({"type": "investigation", "id": inv.get("psi_id"), "doi": inv.get("doi"), "raw": inv, "score": s})
    for s, c in sorted(crds, key=lambda x: -x[0])[:n_cards]:
        if s >= MIN_CARD_SCORE:
            items.append({"type": "card", "id": c.get("id"), "doi": c.get("doi"), "raw": c, "score": s})
    if any(k in ql for k in _GRAVITY):
        model = site.get("model") or {}
        notes = (site.get("meta") or {}).get("notes") or model.get("notes") or []
        text = ("[LIMITS] No partial-gravity (Moon/Mars) data exists. " + " ".join(str(n) for n in notes))[:350]
        items.append({"type": "limits", "id": "limits", "doi": None, "raw": {"text": text}, "score": 1})
    return items


def _fmt_rng(v, unit: str) -> str | None:
    if not isinstance(v, dict) or v.get("min") is None:
        return None
    lo, hi = v["min"], v.get("max", v["min"])
    return f"{lo:g} {unit}" if lo == hi else f"{lo:g}-{hi:g} {unit}"


def _conditions(env: dict) -> str:
    """Condition envelope as text; unreported fields say 'not reported' (never 0)."""
    def lst(k):
        v = env.get(k) or []
        return ", ".join(str(x) for x in v) if v else "not reported"
    parts = [f"O2 {_fmt_rng(env.get('o2_pct'), '%') or 'not reported'}",
             f"pressure {_fmt_rng(env.get('pressure_atm'), 'atm') or 'not reported'}",
             f"flow {_fmt_rng(env.get('flow_cm_s'), 'cm/s') or 'not reported'}",
             f"fuels {lst('fuels')}"]
    if env.get("materials") and env.get("materials") != env.get("fuels"):
        parts.append(f"materials {lst('materials')}")
    if env.get("diluents"):
        parts.append(f"diluents {lst('diluents')}")
    parts += [f"gravity {lst('gravity')}", f"phenomena {lst('phenomena')}", f"n_rows={env.get('n_rows')}"]
    return ", ".join(parts)


def _series_text(site: dict, psi) -> str | None:
    s = (site.get("series") or {}).get(psi)
    if not s or not s.get("points"):
        return None
    def rng(i):
        vals = [p[i] for p in s["points"] if p[i] is not None and not (isinstance(p[i], float) and math.isnan(p[i]))]
        return f"{min(vals):g}-{max(vals):g}" if vals else "n/a"
    x, y = s.get("x") or {}, s.get("y") or {}
    return (f"measured series: {y.get('label')} ({y.get('unit')}) {rng(1)} vs {x.get('label')} ({x.get('unit')}) {rng(0)}, "
            f"n={s.get('n_plotted')} of {s.get('n_total')}")


def _entity_line(it: dict, site: dict | None, qa_chars: int) -> str:
    r = it["raw"]
    if r.get("score_status") == "scored" and r.get("rank") is not None:
        rank = f"habitat-relevance rank #{r['rank']}, score {r.get('score', 0):.0f} (hypothetical weights, not validated)"
    else:
        rank = f"no habitat score ({r.get('score_status')})"
    text = (r.get("qa_text") or r.get("summary") or "")
    if len(text) > qa_chars:
        text = text[:qa_chars - 3].rsplit(" ", 1)[0] + "..."
    parts = [f"[{it['id']}] {r.get('name')} - {r.get('title')}", f"DOI {it['doi']}", rank,
             f"conditions: {_conditions(r.get('envelope') or {})}"]
    ser = _series_text(site or {}, it["id"])
    if ser:
        parts.append(ser)
    if text:
        parts.append(f"text: {text}")
    return " | ".join(parts)


def _render_item(it: dict, site: dict | None = None, qa_chars: int = 1200) -> str:
    r = it["raw"]
    if it["type"] in ("special", "limits"):
        return r["text"]
    if it["type"] == "card":
        return (f"[CARD {it['id']}] {r.get('title')} | value {r.get('value')} {r.get('unit')} (n={r.get('n')}) | "
                f"{r.get('finding')} | caveat: {r.get('caveat')} | DOI {it['doi']}")[:520]
    if it["type"] == "entity":
        return _entity_line(it, site, qa_chars)
    env = r.get("envelope") or {}
    return (f"[{it['id']}] {r.get('name')} - {r.get('title')} | DOI {it['doi']} | score {r.get('score')} | "
            f"conditions: {_conditions(env)} | {r.get('summary')}")


def build_context(items: list[dict], site: dict) -> str:
    """Items in priority order (entities, topic parts, extras) within MAX_CONTEXT_CHARS; [LIMITS] is kept when present."""
    n_ent = sum(1 for i in items if i["type"] == "entity")
    qa_chars = ENTITY_QA_CHARS.get(n_ent, 550)
    limits = [_render_item(i) for i in items if i["type"] == "limits"]
    left = MAX_CONTEXT_CHARS - sum(len(x) + 1 for x in limits)
    parts = []
    for it in items:
        if it["type"] == "limits":
            continue
        line = _render_item(it, site, qa_chars)
        if len(line) + 1 > left:
            if left < 250:
                continue
            line = line[:left - 1]
        parts.append(line)
        left -= len(line) + 1
    return "\n".join(parts + limits)[:MAX_CONTEXT_CHARS]


def _source(it: dict) -> dict:
    return {("psi_id" if it["type"] in ("investigation", "entity") else "card_id"): it["id"], "doi": it["doi"]}


def fallback_answer(question: str, items: list[dict], reason: str | None = None) -> dict:
    ents = [i for i in items if i["type"] == "entity"]
    rest = [i for i in items if i["type"] not in ("entity", "limits") and i["score"] > 0]
    top = (ents + rest)[:max(3, len(ents))] or [i for i in items if i["type"] != "limits"][:1]
    lines = []
    for it in top:
        r = it["raw"]
        if it["type"] == "special":
            lines.append(r["text"][:400])
        elif it["type"] == "card":
            lines.append(f"{r.get('title')}: {r.get('finding')} (caveat: {r.get('caveat')})")
        else:
            body = (r.get("summary") or r.get("title") or "")[:400]
            lines.append(f"{it['id']} {r.get('name')}: {body} Conditions: {_conditions(r.get('envelope') or {})}.")
    head = "LLM unavailable - showing closest cards. "  # exact prefix: app/ui/ask.js strips it for display
    answer = (head + " | ".join(lines)) if lines else \
        "LLM unavailable and nothing in the data matches this question."
    return {"answer": answer, "sources": [_source(i) for i in top], "mode": "fallback",
            "reason": reason or "error"}


class LLMCallError(Exception):
    """Carries only a short reason code (never request data or credentials)."""


def classify_error(exc: BaseException) -> str:
    if isinstance(exc, LLMCallError):
        return str(exc)
    if isinstance(exc, TimeoutError):
        return "timeout"
    if isinstance(exc, ConnectionError):
        return "connection"
    if type(exc).__name__ == "LLMError":
        return "no_key"
    return "bad_response" if isinstance(exc, (ValueError, KeyError, TypeError)) else "error"


def _log(reason: str, secs: float, attempt: int) -> None:
    sys.stderr.write(f"LLM fail reason={reason} attempt={attempt} after={secs:.1f}s\n")  # no key/headers/body


def _salvage(content: str) -> dict | None:
    """Truncated JSON envelope: recover the answer text typed so far."""
    m = re.search(r'"answer"\s*:\s*"((?:[^"\\]|\\.)*)', content or "", re.S)
    if not m:
        return None
    txt = m.group(1)
    try:
        txt = json.loads('"' + txt + '"')
    except ValueError:
        txt = txt.replace('\\n', "\n").replace('\\"', '"')
    return {"answer": txt.strip(), "sources": []} if txt.strip() else None


def call_llm(system: str, user: str) -> dict:
    """Single OpenAI-compatible chat call (same endpoint/model/body shape as src.discovery.llm.chat_json)."""
    import requests
    from src.discovery.llm import _parse_json
    st = load_settings()
    body = {"model": st.model, "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
            "max_tokens": LLM_MAX_TOKENS, "temperature": 0, "thinking": False}
    try:
        r = requests.post(st.base_url.rstrip("/") + "/chat/completions", json=body, timeout=LLM_TIMEOUT,
                          headers={"Authorization": f"Bearer {st.api_key}", "Content-Type": "application/json"})
    except requests.Timeout:
        raise TimeoutError("timeout") from None
    except requests.ConnectionError:
        raise ConnectionError("connection") from None
    if r.status_code != 200:
        raise LLMCallError(f"http_{r.status_code}")
    try:
        choice = r.json()["choices"][0]
        content = choice["message"]["content"]
    except Exception:
        raise LLMCallError("bad_response") from None
    truncated = choice.get("finish_reason") == "length"
    if truncated:
        sys.stderr.write(f"LLM finish_reason=length max_tokens={LLM_MAX_TOKENS} (answer may be cut)\n")
    try:
        return _parse_json(content)
    except Exception:
        salvaged = _salvage(content) if truncated else None
        if salvaged:
            return salvaged
        raise LLMCallError("bad_response") from None


# ---- small in-memory LRU of llm-mode answers (same normalised question + data/prompt version) ----
_CACHE: "OrderedDict[str, dict]" = OrderedDict()
_CACHE_LOCK = threading.Lock()


def _cache_key(question: str, site: dict) -> str:
    norm = re.sub(r"\s+", " ", question.strip().lower()).rstrip("?.! ")
    ver = hashlib.sha1(json.dumps([site.get("generated"), site.get("investigations"), site.get("cards"),
                                   site.get("risk", {}).get("provenance") if site.get("risk") else None,
                                   SYSTEM_PROMPT], sort_keys=True, default=str).encode()).hexdigest()[:16]
    return f"{ver}|{norm}"


def _cache_get(key: str) -> dict | None:
    with _CACHE_LOCK:
        hit = _CACHE.get(key)
        if hit is not None:
            _CACHE.move_to_end(key)
            return json.loads(json.dumps(hit))
    return None


def _cache_put(key: str, res: dict) -> None:
    with _CACHE_LOCK:
        _CACHE[key] = json.loads(json.dumps(res))
        _CACHE.move_to_end(key)
        while len(_CACHE) > CACHE_SIZE:
            _CACHE.popitem(last=False)


def _log_refusal(kind: str, items: list[dict]) -> None:
    n = sum(1 for i in items if i["type"] == "entity")
    if n:  # a refusal/empty answer although named investigations were in the context
        sys.stderr.write(f"LLM refusal kind={kind} entities_in_context={n}\n")


def _is_refusal(answer: str) -> bool:
    return answer.lower().startswith("not in the data") and len(answer) < 200


def answer_question(question: str, site: dict | None = None) -> dict:
    site = site or load_site()
    items = select_context(question, site)
    key = _cache_key(question, site)
    hit = _cache_get(key)
    if hit:
        return hit
    try:
        load_settings()  # raises when no key; fast path to fallback
    except Exception:
        return fallback_answer(question, items, "no_key")
    user = f"Context:\n{build_context(items, site)}\n\nQuestion: {question}"
    reason = "error"
    for attempt in (1, 2):
        t0 = time.monotonic()
        try:
            res = call_llm(SYSTEM_PROMPT, user)
            answer = str(res.get("answer") or "").strip()
            if not answer:
                _log_refusal("empty", items)
                raise LLMCallError("bad_response")
            if _is_refusal(answer):
                _log_refusal("not_in_data", items)
            wanted = {str(s) for s in (res.get("sources") or res.get("cards") or [])}
            real = [i for i in items if i["type"] != "limits"]
            used = [i for i in real if str(i["id"]) in wanted] or [i for i in real if i["id"] and str(i["id"]) in answer]
            al = answer.lower()
            for i in real:  # special parts are rarely cited by id; match on their topic word in the answer
                if i["type"] == "special" and i not in used and _MARKERS[i["id"]] in al:
                    used.append(i)
            out = {"answer": answer, "sources": [_source(i) for i in used], "mode": "llm", "reason": None}
            _cache_put(key, out)
            return out
        except Exception as e:
            reason = classify_error(e)
            _log(reason, time.monotonic() - t0, attempt)
            if attempt == 2 or reason not in ("timeout", "connection", "http_429", "http_503"):
                break
            time.sleep(LLM_RETRY_WAIT)
    return fallback_answer(question, items, reason)


class Handler(BaseHTTPRequestHandler):
    server_version = "FlameSite/1"

    def log_message(self, fmt, *args):  # no query strings / bodies in logs
        sys.stderr.write("%s %s\n" % (self.command, urlsplit(self.path).path))

    def _send(self, code: int, body: bytes, ctype: str):
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def _json(self, code: int, obj: dict):
        self._send(code, json.dumps(obj).encode("utf-8"), "application/json; charset=utf-8")

    def _static(self):
        raw = unquote(urlsplit(self.path).path)
        if "\x00" in raw:
            return self._json(400, {"error": "bad path"})
        rel = raw.lstrip("/") or "index.html"
        target = (APP_DIR / rel).resolve()
        try:
            parts = target.relative_to(APP_DIR).parts
        except ValueError:
            return self._json(403, {"error": "forbidden"})
        if any(p.startswith(".") for p in parts) or target.suffix.lower() in BLOCKED_SUFFIXES or "__pycache__" in parts:
            return self._json(404, {"error": "not found"})
        if target.is_dir():
            target = target / "index.html"
        if not target.is_file():
            return self._json(404, {"error": "not found"})
        ctype = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
        if ctype.startswith("text/") or ctype in ("application/javascript", "application/json"):
            ctype += "; charset=utf-8"
        self._send(200, target.read_bytes(), ctype)

    do_HEAD = do_GET = lambda self: self._static()

    def do_POST(self):
        if urlsplit(self.path).path != "/api/ask":
            return self._json(404, {"error": "not found"})
        try:
            n = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            n = -1
        if n < 0 or n > MAX_BODY:
            return self._json(413, {"error": "request too large"})
        try:
            data = json.loads(self.rfile.read(n) or b"{}")
            question = str(data.get("question", "")).strip()
        except Exception:
            return self._json(400, {"error": "invalid JSON"})
        if not question:
            return self._json(400, {"error": "question is empty"})
        if len(question) > MAX_QUESTION:
            return self._json(400, {"error": f"question longer than {MAX_QUESTION} characters"})
        self._json(200, answer_question(question))


def make_server(port: int = 0, host: str = "127.0.0.1") -> ThreadingHTTPServer:
    return ThreadingHTTPServer((host, port), Handler)


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=int(os.environ.get("PORT", 8000)))
    args = ap.parse_args(argv)
    srv = make_server(args.port)
    print(f"Serving app/ at http://127.0.0.1:{srv.server_address[1]}/  (Ctrl+C to stop)")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        srv.server_close()


if __name__ == "__main__":
    main()
