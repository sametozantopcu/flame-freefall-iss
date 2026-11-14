"""M3 insight cards: number-sourced, DOI-cited findings for the Equipment screen and LLM context (plans/mvp, S4).

    build_cards() -> list[dict]     # computed from EDA outputs + Feature Store; DOI from the metadata layer
    load_cards()  -> list[dict]     # same, cached per process (used by the S5 bridge)

Card schema (FIELDS):
    id, title, finding (English), value (primary number, read from the source, never hard-coded), unit, n,
    psi_id, doi (metadata layer; None if not found), source_file (path relative to the repo), caveat,
    equipment_implication, values (dict of supporting numbers; additive to the PLAN schema).
Missing source value -> value None and the caveat says so (never 0). Card prose is English card data, not UI chrome.
"""
from __future__ import annotations

import json
import math
from functools import lru_cache
from pathlib import Path

import pandas as pd

from src.data_layer.store import connect_all

REPO = Path(__file__).resolve().parents[2]
OUT = REPO / "data_analysis" / "Nasa_data" / "analysis" / "outputs"
FIELDS = ("id", "title", "finding", "value", "unit", "n", "psi_id", "doi", "source_file", "caveat",
          "equipment_implication", "values")


def _rel(p: Path) -> str:
    return p.relative_to(REPO).as_posix()


def _num(x):
    """float or None; NaN/missing never becomes 0."""
    try:
        x = float(x)
    except (TypeError, ValueError):
        return None
    return None if math.isnan(x) else x


def _fmt(x, nd=2):
    return "n/a" if x is None else f"{x:.{nd}f}"


def _doi(con, psi: str):
    r = con.execute("SELECT doi FROM investigations WHERE psi_id = ?", [psi]).fetchone()
    return r[0] if r and r[0] and str(r[0]).startswith("10.") else None


def _card(con, **kw) -> dict:
    doi = _doi(con, kw["psi_id"])
    if doi is None:
        kw["caveat"] += " DOI not found in the metadata layer."
    if kw["value"] is None:
        kw["caveat"] += " Source value not found; value left null (not zero-filled)."
    kw["doi"] = doi
    return {k: kw.get(k) for k in FIELDS}


def _flex(con) -> dict:
    src = OUT / "d2_law_flex.csv"
    d = pd.read_csv(src).set_index("subset")
    r = d.loc["Completion"] if "Completion" in d.index else None
    slope, lo, hi, n = (None,) * 4 if r is None else (_num(r.ols_slope), _num(r.ci_lo), _num(r.ci_hi), int(r.n))
    allr = d.loc["tümü"]
    ext = d.loc["Extinction"]
    cfi = _num(json.load(open(OUT / "group_effects_numbers.json")).get("cfi_slope"))
    cfi_doi = _doi(con, "PSI-39")
    return _card(
        con, id="flex_d2_slope", title="FLEX droplets: burn time follows the d-squared law only when the burn completes",
        finding=f"For FLEX droplets that burned to completion, log burn time rises with log initial diameter with slope "
                f"{_fmt(slope)} (95% CI {_fmt(lo)} to {_fmt(hi)}, n={n}), close to the d-squared value of 2. Over all "
                f"tests the slope drops to {_fmt(_num(allr.ols_slope))} (n={int(allr.n)}) and for tests ending in "
                f"extinction to {_fmt(_num(ext.ols_slope))} (n={int(ext.n)}).",
        value=slope, unit="log-log slope", n=n, psi_id="PSI-69", source_file=_rel(src),
        caveat="Only the completion subset (a small share of tests) supports d-squared scaling; burn time of "
               "extinguished droplets is cut short and must not be read without the end-of-test flag. In the CFI "
               f"data (PSI-39, DOI {cfi_doi}) the hot-flame burn time vs d0 slope is reversed ({_fmt(cfi)}, from "
               "group_effects_numbers.json): large droplets reach radiative extinction earlier.",
        equipment_implication="Droplet-combustion sizing or burn-time planning must condition on completion vs "
                              "extinction; do not extrapolate a single d-squared law across both outcomes.",
        values={"ci_lo": lo, "ci_hi": hi, "slope_all": _num(allr.ols_slope), "n_all": int(allr.n),
                "slope_extinction": _num(ext.ols_slope), "n_extinction": int(ext.n), "cfi_hf_slope": cfi,
                "cfi_psi_id": "PSI-39", "cfi_doi": cfi_doi})


def _acme(con) -> dict:
    where = ("psi_id='PSI-159' AND fuel_base IN ('butane','propane') AND xo2_init_pct BETWEEN 20.5 AND 21.5 "
             "AND hot_ignition IS NOT NULL")
    n, hot = con.execute(f"SELECT count(*), sum(hot_ignition::int) FROM acme_normal WHERE {where}").fetchone()
    rate = _num(hot / n) if n else None
    per = {f: (int(h), int(k)) for f, k, h in con.execute(
        f"SELECT fuel_base, count(*), sum(hot_ignition::int) FROM acme_normal WHERE {where} GROUP BY 1 ORDER BY 1").fetchall()}
    hi = con.execute("SELECT count(*), sum(hot_ignition::int) FROM acme_normal WHERE psi_id='PSI-159' AND fuel_base IN "
                     "('butane','propane') AND xo2_init_pct >= 35 AND hot_ignition IS NOT NULL").fetchone()
    parts = ", ".join(f"{f} {h}/{k}" for f, (h, k) in per.items())
    return _card(
        con, id="acme_ignition_21pct_o2", title="ACME normal flames: hot ignition at about 21% O2 is partial, not absent",
        finding=f"At 20.5-21.5% initial O2 (butane and propane, ACME CFI-G normal flames) {hot} of {n} tests hot-ignited "
                f"(rate {_fmt(rate)}; {parts}). At 35% O2 and above the rate is {_fmt(hi[1] / hi[0] if hi[0] else None)} "
                f"(n={hi[0]}).",
        value=rate, unit="hot-ignition fraction", n=int(n), psi_id="PSI-159",
        source_file="data_analysis/Nasa_data/analysis/data/acme_normal.parquet",
        caveat="The EDA report (section 6.1) states there is no hot ignition at ~21% O2 for butane/propane; this is "
               "not reproduced by the Feature Store rows (hot_ignition_raw), so the card reports the measured rate. "
               "Small n, mixed fuel fractions and pressures, test-day effects are strong; flames that ignite mostly "
               "self-extinguish (SE). PSI-10 (Flame Design) rows carry no outcome column and are not used.",
        equipment_implication="Do not assume a cabin-air (~21% O2) flame will fail to ignite: treat ignition as "
                              "possible but uncertain and keep ignition sources controlled in the habitat.",
        values={"hot": int(hot), "n": int(n), "per_fuel": {f: {"hot": h, "n": k} for f, (h, k) in per.items()},
                "rate_o2_ge_35": _num(hi[1] / hi[0]) if hi[0] else None, "n_o2_ge_35": int(hi[0])})


def _smoke(con) -> dict:
    src = OUT / "partial_correlations.csv"
    p = pd.read_csv(src)
    r = p[(p.table == "smoke") & (p.target == "amd_um") & (p.feature == "rt_r0") & (p.control == "material")]
    r = r.iloc[0] if len(r) else None
    marg, part, n = (None,) * 3 if r is None else (_num(r.marginal_rho), _num(r.partial_rho), int(r.n))
    wm = pd.read_csv(OUT / "smoke_within_material.csv")
    pos = int((wm.rho_rt_amd > 0).sum())
    return _card(
        con, id="smoke_simpson_rt_r0", title="Smoke particle size: Simpson's paradox hides the heater-temperature effect",
        finding=f"Across all smoke tests, heater temperature ratio Rt/R0 correlates negatively with particle mean "
                f"diameter (Spearman rho {_fmt(marg)}, n={n}); with material held fixed the partial rho is "
                f"{_fmt(part)}, and within each material it is positive in {pos} of {len(wm)} materials.",
        value=part, unit="partial Spearman rho (material fixed)", n=n, psi_id="PSI-101", source_file=_rel(src),
        caveat="Smoke rows (SAME and SAME-R flight data) sit in the PSI-101 workbook; the pooled n includes 10 ground "
               "rows whose column mapping is unverified (the within-material check is flight only). Correlation, "
               "not a causal model; materials are not balanced across campaigns.",
        equipment_implication="Smoke-detector or particle-size models must include material as a feature; without it "
                              "the learned heater-temperature trend points the wrong way.",
        values={"marginal_rho": marg, "partial_rho": part, "materials_positive": pos, "materials_total": len(wm)})


def _bass(con) -> dict:
    src = OUT / "group_effects_numbers.json"
    ratio = _num(json.load(open(src)).get("bass_pmma_ratio_median"))
    n = con.execute("SELECT count(*) FROM bass2 WHERE material='PMMA' AND d_o2_pct < -0.2 AND d_co2_pct IS NOT NULL").fetchone()[0]
    theory = -5 / 6                      # PMMA C5H8O2 + 6 O2 -> 5 CO2 + 4 H2O
    return _card(
        con, id="bass2_co2_o2_ratio", title="BASS-II PMMA: CO2 gain per O2 lost matches stoichiometry",
        finding=f"Median change in CO2 over change in O2 for PMMA burns is {_fmt(ratio)} (n={n}), against the "
                f"theoretical {theory:.2f} (-5/6).",
        value=ratio, unit="dCO2/dO2 (median)", n=int(n), psi_id="PSI-25", source_file=_rel(src),
        caveat="PMMA only, burns with an O2 drop larger than 0.2 points; O2 and CO2 changes carry nearly the same "
               "information, so they are not independent targets. Median ratio, not a fit uncertainty.",
        equipment_implication="O2 and CO2 sensors in the enclosure cross-check each other; a ratio far from about "
                              "-0.8 for a PMMA-like fuel signals a sensor fault.",
        values={"theoretical": theory})


@lru_cache(maxsize=1)
def _build() -> tuple:
    con = connect_all()
    return tuple(f(con) for f in (_flex, _acme, _smoke, _bass))


def build_cards() -> list[dict]:
    return [dict(c) for c in _build()]


def load_cards() -> list[dict]:
    return build_cards()
