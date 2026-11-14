"""Condition envelopes from text for investigations without tables (plans/01_m1_discovery, step A2).

    python -m src.discovery.text_envelope generate      # one-off, calls the LLM; writes meta/inv_envelope_text.parquet

The LLM only proposes facts; every fact must carry a VERBATIM quote that is found in the source section, and every number
must appear in that quote. Units are converted here, deterministically, never by the LLM. Rejected facts are kept with
their reason (nothing silently dropped). Answers are cached so the stored output is reproducible without the API.
"""
from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path

import pandas as pd

from src.data_layer import metadata
from src.data_layer.store import connect_all

SECTIONS = ["title", "objective", "approach", "hypothesis", "research_impacts"]
FIELDS = ["o2", "pressure", "flow", "diluent", "fuel_or_material", "material_class", "gravity", "phenomenon"]
NUMERIC = {"o2", "pressure", "flow"}
UNITS = {"o2": {"%": 1.0, "percent": 1.0, "mole fraction": 100.0, "mol fraction": 100.0},
         "pressure": {"atm": 1.0, "psia": 0.068046, "psi": 0.068046, "kpa": 1 / 101.325, "bar": 1 / 1.01325,
                      "mmhg": 1 / 760, "torr": 1 / 760},
         "flow": {"cm/s": 1.0, "mm/s": 0.1, "m/s": 100.0}}
STD = {"o2": "%", "pressure": "atm", "flow": "cm/s"}
COLUMNS = ["psi_id", "field", "value_min", "value_max", "unit_raw", "value_text", "section", "source_span",
           "value_min_std", "value_max_std", "unit_std", "source", "accepted", "reject_reason"]
OUT = metadata.META_DIR / "inv_envelope_text.parquet"
REVIEW = metadata.META_DIR / "inv_envelope_text_review.csv"          # step A3: human/developer decisions per row
REVIEW_MD = Path(__file__).resolve().parents[2] / "docs" / "evidence" / "envelope_review.md"
REVIEWER = "İnceleyen: Claude (geliştirici), 2026-11-14"
CACHE = metadata.META_DIR / "llm_cache"
_WS = re.compile(r"\s+", re.UNICODE)
_NUMS = re.compile(r"(?<![\d.])-?\d+(?:\.\d+)?|\d+(?:\.\d+)?")   # "20-40": the dash after a digit is a range, not a minus

SYSTEM = """You extract experimental CONDITIONS of a microgravity combustion investigation from its description.
Return ONLY JSON: {"facts": [{"field", "value_min", "value_max", "unit", "value_text", "section", "source_span"}]}.
field is one of: o2, pressure, flow, diluent, fuel_or_material, material_class, gravity, phenomenon.
- o2 / pressure / flow: numbers in value_min (value_max if a range) and the unit exactly as written (e.g. "%", "atm",
  "psia", "kPa", "cm/s"); value_text null.
- other fields: value_text = the word(s) as written; numbers and unit null.
- section: the section name the quote comes from (title, objective, approach, hypothesis, research_impacts).
- source_span: a VERBATIM quote copied character by character from that section containing the value. Never paraphrase.
Only report conditions of the investigation's own experiments or analyses that are stated in the text. If nothing is
stated, return {"facts": []}. Do not guess, do not use outside knowledge."""


def _norm(s) -> str:
    return _WS.sub(" ", str(s or "")).strip()


def tableless_ids(con=None) -> list[str]:
    con = con or connect_all()
    ids = [r[0] for r in con.execute("SELECT psi_id FROM table_map WHERE coverage = 'none'").fetchall()]
    return sorted(ids, key=lambda p: int(p.split("-")[1]))


def source_sections(psi_id: str, con=None) -> dict:
    con = con or connect_all()
    row = con.execute(f"SELECT {', '.join(SECTIONS)} FROM investigations WHERE psi_id = ?", [psi_id]).fetchone()
    if row is None:
        raise ValueError(f"unknown investigation {psi_id!r}")
    return {s: ("" if v is None or (isinstance(v, float) and pd.isna(v)) else str(v)) for s, v in zip(SECTIONS, row)}


def build_prompt(psi_id: str, sections: dict) -> tuple[str, str]:
    body = "\n\n".join(f"[{s}]\n{sections.get(s, '')}" for s in SECTIONS)
    return SYSTEM, f"Investigation {psi_id}. Sections:\n\n{body}\n\nReturn the JSON now. Quotes must be verbatim."


def _num(x):
    if x is None or (isinstance(x, float) and pd.isna(x)):
        return None
    try:
        return float(x)
    except (TypeError, ValueError):
        return "bad"


def _check(field, f, sections):
    """-> (reject_reason or None, min_std, max_std, unit_std)"""
    if field not in FIELDS:
        return "unknown_field", None, None, None
    sec = f.get("section")
    if sec not in SECTIONS:
        return "unknown_section", None, None, None
    span = _norm(f.get("source_span"))
    if not span or span not in _norm(sections.get(sec, "")):
        return "span_not_in_source", None, None, None
    if field in NUMERIC:
        lo, hi = _num(f.get("value_min")), _num(f.get("value_max"))
        if lo is None or lo == "bad" or hi == "bad":
            return "missing_value", None, None, None
        hi = lo if hi is None else hi
        found = {float(n) for n in _NUMS.findall(span)}
        if any(v not in found for v in (lo, hi)):
            return "number_not_in_span", None, None, None
        factor = UNITS[field].get(str(f.get("unit") or "").strip().lower())
        if factor is None:
            return "unknown_unit", None, None, None
        a, b = lo * factor, hi * factor
        if a > b:
            return "min_gt_max", None, None, None
        if (field == "o2" and not (0 <= a and b <= 100)) or (field == "pressure" and a <= 0) or (field == "flow" and a < 0):
            return "out_of_range", None, None, None
        return None, a, b, STD[field]
    text = _norm(f.get("value_text"))
    if not text:
        return "missing_value", None, None, None
    if text.lower() not in span.lower():
        return "text_not_in_span", None, None, None
    return None, None, None, None


def validate_facts(psi_id: str, facts, sections: dict) -> pd.DataFrame:
    rows = []
    for f in facts or []:
        f = f if isinstance(f, dict) else {}
        field = f.get("field")
        reason, a, b, unit = _check(field, f, sections)
        rows.append(dict(psi_id=psi_id, field=field, value_min=f.get("value_min"), value_max=f.get("value_max"),
                         unit_raw=f.get("unit"), value_text=f.get("value_text"), section=f.get("section"),
                         source_span=f.get("source_span"), value_min_std=a if reason is None else None,
                         value_max_std=b if reason is None else None, unit_std=unit if reason is None else None,
                         source="text", accepted=reason is None, reject_reason=reason))
    df = pd.DataFrame(rows, columns=COLUMNS)
    df["value_min_std"] = pd.to_numeric(df["value_min_std"], errors="coerce").astype(float)
    df["value_max_std"] = pd.to_numeric(df["value_max_std"], errors="coerce").astype(float)
    df["accepted"] = df["accepted"].astype(bool)
    return df


def _cached_llm(cache_dir: Path):
    from src.discovery import llm as L
    settings = L.load_settings()
    cache_dir.mkdir(parents=True, exist_ok=True)

    def call(system, user):
        key = hashlib.sha256(json.dumps([settings.model, system, user]).encode()).hexdigest()
        p = cache_dir / f"{key}.json"
        if p.exists():
            return json.loads(p.read_text(encoding="utf-8"))["answer"]
        answer = L.chat_json(system, user, settings=settings)
        p.write_text(json.dumps({"model": settings.model, "answer": answer}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        return answer
    return call


def extract_text_envelope(psi_ids=None, llm=None, con=None) -> pd.DataFrame:
    con = con or connect_all()
    psi_ids = psi_ids if psi_ids is not None else tableless_ids(con)
    if llm is None:
        from src.discovery import llm as L
        settings = L.load_settings()
        llm = lambda s, u: L.chat_json(s, u, settings=settings)  # noqa: E731
    frames = []
    for p in psi_ids:
        sections = source_sections(p, con)
        answer = llm(*build_prompt(p, sections)) or {}
        frames.append(validate_facts(p, answer.get("facts", []), sections))
    if not frames:
        return validate_facts("", [], {})
    out = pd.concat([f for f in frames if len(f)] or [frames[0]], ignore_index=True)
    return out.reindex(columns=COLUMNS)


def load_review(path: str | Path = REVIEW) -> pd.DataFrame:
    """Review decisions (step A3). Blank cells stay empty strings; numbers are parsed in apply_review."""
    return pd.read_csv(path, dtype=str, keep_default_na=False, encoding="utf-8").astype({"row": int})


def _corr_num(cell: str, original):
    """'' -> unchanged, 'unknown' -> NaN, otherwise a number (validated elsewhere to be one of the originals)."""
    cell = (cell or "").strip()
    if cell == "":
        return original
    if cell == "unknown":
        return float("nan")
    return float(cell)


def apply_review(facts: pd.DataFrame, review: pd.DataFrame) -> pd.DataFrame:
    """Reviewed facts: 'silindi' rows dropped, corrections applied, decision/context/note added; `row` = original index."""
    rv = review.set_index("row")
    out = []
    for i, r in facts.reset_index(drop=True).iterrows():
        d = rv.loc[i]
        if d["decision"] == "silindi":
            continue
        rec = r.to_dict()
        rec["row"] = i
        if d["corrected_field"]:
            rec["field"] = d["corrected_field"]
        if d["corrected_value_text"]:
            rec["value_text"] = d["corrected_value_text"]
        rec["value_min_std"] = _corr_num(d["corrected_value_min_std"], r["value_min_std"])
        rec["value_max_std"] = _corr_num(d["corrected_value_max_std"], r["value_max_std"])
        rec.update(review_decision=d["decision"], context=d["context"], note=d["note"])
        out.append(rec)
    cols = ["row"] + COLUMNS + ["review_decision", "context", "note"]
    df = pd.DataFrame(out, columns=cols)
    return df.astype({"value_min_std": float, "value_max_std": float})


def _value(r) -> str:
    if r["field"] in NUMERIC and r.get("unit_std"):
        lo, hi = r["value_min_std"], r["value_max_std"]
        f = lambda v: "?" if pd.isna(v) else f"{v:g}"  # noqa: E731
        return f"{f(lo)}–{f(hi)} {r['unit_std']}" if lo != hi or pd.isna(lo) else f"{f(lo)} {r['unit_std']}"
    return str(r["value_text"] if isinstance(r["value_text"], str) else "—")


def render_review_md(facts: pd.DataFrame, review: pd.DataFrame) -> str:
    rv = review.set_index("row")
    counts = rv["decision"].value_counts()
    L = ["# Metinden gelen koşul zarfı: inceleme (01/A3)", "",
         "Kaynak: `data_analysis/Nasa_data/meta/inv_envelope_text.parquet` (01/A2, LLM önerisi + birebir alıntı doğrulaması). "
         "Kararlar: `data_analysis/Nasa_data/meta/inv_envelope_text_review.csv`. Bu dosya ondan üretilir "
         "(`python -m src.discovery.text_envelope review-md`).", "", REVIEWER, "",
         "Özet: " + ", ".join(f"{k} {int(counts.get(k, 0))}" for k in ("doğru", "düzeltildi", "silindi")) + f" (toplam {len(rv)})", "",
         "| row | psi_id | alan | değer | karar | bağlam | not |", "|---|---|---|---|---|---|---|"]
    for i, r in facts.reset_index(drop=True).iterrows():
        d = rv.loc[i]
        note = (d["note"] or "").replace("|", "/")
        L.append(f"| {i} | {r['psi_id']} | {r['field']} | {_value(r).replace('|', '/')} | {d['decision']} | {d['context']} | {note} |")
    L += ["", "Bağlam: `experiment` = değer investigation'ın kendi uçuş/zemin deneyini tanımlar; `modeling` = sayısal/analiz çalışması "
          "(zarfta ayrı işaretlenir, ISS deney koşulu sayılmaz).", ""]
    return "\n".join(L)


def write_review_md(path: Path | None = None) -> Path:
    path = Path(path or REVIEW_MD)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(render_review_md(pd.read_parquet(OUT), load_review()), encoding="utf-8")
    return path


def generate(out: Path = OUT, cache_dir: Path = CACHE) -> pd.DataFrame:
    df = extract_text_envelope(llm=_cached_llm(cache_dir))
    df.to_parquet(out, index=False)
    return df


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "review-md":
        print(f"wrote {write_review_md()}")
        sys.exit(0)
    if cmd != "generate":
        sys.exit("usage: python -m src.discovery.text_envelope generate | review-md")
    d = generate()
    print(f"wrote {OUT}: {len(d)} facts, {int(d.accepted.sum())} accepted, {int((~d.accepted).sum())} rejected")
