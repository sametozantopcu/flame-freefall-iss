"""Evidence (provenance) table for the risk engine.

Every number the risk index is built from is labelled with how it was obtained:

``data``        fitted on PSI measurements (Feature Store); carries ``psi_id``, ``doi``, ``n``, ``r2``
``literature``  taken from a literature law / standard, not fitted here
``assumption``  chosen by the engine's author; neither measured nor calibrated
``mixed``       part data, part literature/assumption (the record says which in ``params``)

This module never produces UI text: records carry i18n *keys* (``note_key``) and numbers only; the
translations live in ``app/i18n.py`` / ``app/i18n.js``. Values are read from the engine (``Anchors``,
``RISK_WEIGHTS``, ``RISK_THRESHOLDS``, ``MATERIAL_PROFILES``), never retyped. The engine formulas are not
touched; ``extra_warnings`` only flags situations in which the index and the margin disagree.

Classification (checked against ``RiskEngine.assess``):

* ``oxygen``    log-scaled pO2 between 0.21 atm (->0) and 0.40 atm (->1): calibration choice (assumption).
* ``ignition``  CFI-G logistic of pO2 (PSI-159) (data).
* ``duration``  PSI-159 power law, then multiplied by a per-material ``duration_multiplier`` that is not
  fitted (mixed).
* ``spread``    PSI-39 ``khot`` power law, very low R^2 (data).
* ``margin``    O2 minus the material threshold, normalised on the PMMA anchors (mixed: PMMA threshold is
  BASS-II, the other thresholds are literature LOI minus a fixed shift).
* ``material``  BASS-II burn share per material, PMMA logistic proxy when the material has no BASS-II
  data (mixed).
"""
from __future__ import annotations

import math
from typing import Any

from . import engine as R

BASES = ("data", "literature", "assumption", "mixed")
COMPONENT_KEYS = tuple(R.RISK_WEIGHTS)  # oxygen, ignition, duration, spread, margin, material
RECORD_COMPONENTS = (*COMPONENT_KEYS, "ignition_delay", "material_thresholds", "weights",
                     "level_thresholds", "pressure_scaling")

#: Spread coefficient is compared between embedded and refitted values; below this the fits are "the same".
_SAME_TOL = 1e-6


def _doi_by_psi() -> dict[str, str | None]:
    """PSI id -> DOI from the Metadata layer (``investigations``); empty when the export is unavailable."""
    try:
        import pandas as pd
        from src.data_layer import metadata
        inv = pd.read_parquet(metadata.META_DIR / "investigations.parquet", columns=["psi_id", "doi"])
    except Exception:  # noqa: BLE001 - metadata export absent -> DOIs stay null, never invented
        return {}
    out: dict[str, str | None] = {}
    for psi, doi in zip(inv["psi_id"], inv["doi"]):
        out[str(psi)] = doi.strip() if isinstance(doi, str) and doi.strip() else None
    return out


def pressure_scaling_exponent() -> float:
    """Exponent e of ``X_th(p) = X_th(1 atm) * (101.325 / p)^e``, measured from ``threshold_o2_pct`` itself."""
    prof = R.MATERIAL_PROFILES[R.FALLBACK_MATERIAL_KEY]
    p = R.REF_PRESSURE_KPA / 2.0
    return round(math.log(R.threshold_o2_pct(prof, p) / prof.threshold_o2_pct) / math.log(2.0), 6)


def material_basis(key: str) -> str:
    """``data`` for the PMMA threshold (BASS-II, fixed), ``literature`` for the LOI-derived others."""
    return "data" if key == R.FALLBACK_MATERIAL_KEY else "literature"


def material_thresholds_table() -> list[dict[str, Any]]:
    """Per-material threshold constants straight from ``MATERIAL_PROFILES``."""
    return [{"key": k, "threshold_o2_pct_ref": p.threshold_o2_pct, "loi_pct": p.loi_pct, "inert": p.inert,
             "basis": material_basis(k), "profile_source": p.source, "bass2_n_tests": p.n_tests or None}
            for k, p in R.MATERIAL_PROFILES.items()]


def _rec(component: str, basis: str, note_key: str, *, psi_id: str | None = None, dois: dict | None = None,
         n: int | None = None, r2: float | None = None, **extra: Any) -> dict[str, Any]:
    assert basis in BASES and component in RECORD_COMPONENTS
    out = {"component": component, "basis": basis, "psi_id": psi_id,
           "doi": (dois or {}).get(psi_id) if psi_id else None,
           "n": n, "r2": r2, "note_key": note_key}
    out.update(extra)
    return out


def _spread_fit(a: R.Anchors) -> dict[str, Any]:
    return {"coef": a.spread_po2_exp, "intercept": a.spread_intercept, "n": a.spread_n, "r2": a.spread_r2}


def build_provenance(anchors: R.Anchors | None = None, refit: R.Anchors | None | bool = True,
                     weights: dict | None = None, thresholds: dict | None = None) -> list[dict[str, Any]]:
    """Machine-readable evidence table, one record per component (see ``RECORD_COMPONENTS``).

    ``anchors`` defaults to ``Anchors.default()`` (the coefficients the engine really runs with).
    ``refit`` is the Feature Store refit used for the comparison: ``True`` -> compute it with
    ``Anchors.from_feature_store()``; ``False``/``None`` -> skip; an ``Anchors`` instance -> use it.
    """
    a = anchors or R.Anchors.default()
    if refit is True:
        refit = R.Anchors.from_feature_store()
    w = dict(weights or R.RISK_WEIGHTS)
    th = dict(thresholds or R.RISK_THRESHOLDS)
    dois = _doi_by_psi()
    recs: list[dict[str, Any]] = []

    recs.append(_rec("oxygen", "assumption", "risk.prov.oxygen", weight=w["oxygen"],
                     params={"ref_po2_atm": R.REF_PO2_ATM, "ceiling_po2_atm": R.CEILING_PO2_ATM}))
    recs.append(_rec("ignition", "data", "risk.prov.ignition", psi_id="PSI-159", dois=dois,
                     n=a.ignition_n, r2=None, weight=w["ignition"],
                     params={"intercept": a.ignition_logit_intercept, "coef": a.ignition_logit_po2}))
    recs.append(_rec("duration", "mixed", "risk.prov.duration", psi_id="PSI-159", dois=dois,
                     n=a.burn_time_n, r2=a.burn_time_r2, weight=w["duration"],
                     params={"intercept": a.burn_time_intercept, "o2_exp": a.burn_time_o2_exp,
                             "p_exp": a.burn_time_p_exp,
                             "duration_multiplier": {k: p.duration_multiplier
                                                     for k, p in R.MATERIAL_PROFILES.items()}}))

    embedded = _spread_fit(a)
    fs = _spread_fit(refit) if isinstance(refit, R.Anchors) and "spread" in refit.refreshed_fields else None
    differs = None
    if fs is not None:
        differs = bool(abs(fs["coef"] - embedded["coef"]) > _SAME_TOL or fs["n"] != embedded["n"])
    recs.append(_rec("spread", "data",
                     "risk.prov.spread_low_r2_refit_differs" if differs else "risk.prov.spread_low_r2",
                     psi_id="PSI-39", dois=dois, n=embedded["n"], r2=embedded["r2"], weight=w["spread"],
                     embedded={k: embedded[k] for k in ("coef", "n", "r2")},
                     feature_store_refit=None if fs is None else {k: fs[k] for k in ("coef", "n", "r2")},
                     refit_differs=differs,
                     params={"intercept": embedded["intercept"], "coef": embedded["coef"]}))

    recs.append(_rec("margin", "mixed", "risk.prov.margin", psi_id="PSI-25", dois=dois,
                     n=R.MATERIAL_PROFILES["PMMA"].n_tests, weight=w["margin"],
                     params={"pmma_threshold_pct": R.PMMA_THRESHOLD_PCT}))
    recs.append(_rec("material", "mixed", "risk.prov.material", psi_id="PSI-25", dois=dois,
                     n=a.burn_n, weight=w["material"],
                     params={"pmma_logit_intercept": a.burn_logit_intercept,
                             "pmma_logit_o2_slope": a.burn_logit_o2_slope,
                             "burn_share": dict(a.material_burn_share),
                             "n_tests": dict(a.material_n_tests)}))

    recs.append(_rec("ignition_delay", "literature", "risk.prov.ignition_delay", ref="NASA-STD-6001",
                     params={"t_ref_s": R.REF_IGNITION_DELAY_S, "po2_exponent": R.IGNITION_DELAY_PO2_EXPONENT}))
    recs.append(_rec("material_thresholds", "mixed", "risk.prov.material_thresholds",
                     psi_id="PSI-25", dois=dois, n=R.MATERIAL_PROFILES["PMMA"].n_tests,
                     params={"materials": material_thresholds_table()}))
    recs.append(_rec("weights", "assumption", "risk.prov.weights", params=w))
    recs.append(_rec("level_thresholds", "assumption", "risk.prov.level_thresholds", params=th))
    recs.append(_rec("pressure_scaling", "assumption", "risk.prov.pressure_scaling",
                     params={"exponent": pressure_scaling_exponent()}))
    return recs


def extra_warnings(assessment: R.RiskAssessment) -> list[str]:
    """Consistency warnings the engine does not raise itself (the index formula is unchanged).

    ``above_threshold_low_index``  ``margin_pct > 0`` (O2 above the pressure-scaled material threshold), the
        material is not inert, yet ``risk_level == "low"``: "low" does not mean "cannot burn".
    ``clipped_below_reference``    ``pO2_atm`` is below the 0.21 atm reference (the oxygen component is clipped
        to its floor of 0) while ``margin_pct > 0``: the index hides that the material is above its threshold.
    """
    out: list[str] = []
    above = assessment.margin_pct > 0
    inert = "inert_material" in assessment.warnings
    if above and not inert and assessment.risk_level == "low":
        out.append("above_threshold_low_index")
    if above and not inert and assessment.pO2_atm < R.REF_PO2_ATM:
        out.append("clipped_below_reference")
    return out
