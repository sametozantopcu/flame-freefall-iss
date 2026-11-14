"""Scenario risk assessment and fire-safety insight engine.

Combines three independent evidence sources:
  1. Physics — Olson limit, regime, heuristic ignition/CO models
  2. Archive — physically closest ISS experiments (HRR, CO, outcome)
  3. Model   — extinction probability of a trained (or surrogate) ML model
When the sources disagree this is reported explicitly as an inference.

This module produces no prose: levels and insights are returned as
language-independent key + parameters, and the interface translates them
with app/i18n.py.
"""
from __future__ import annotations

from dataclasses import dataclass, field

import numpy as np
import pandas as pd

from app import config as C
from app.core import data as D
from app.core import physics as P
from app.core.models import ModelBundle

LEVELS = ["nominal", "caution", "warning", "critical"]
LEVEL_STATUS = {"nominal": "good", "caution": "warning", "warning": "serious", "critical": "critical"}


@dataclass
class Scenario:
    o2_pct: float = 21.0
    pressure_kpa: float = 101.3
    flow_cm_s: float = 3.0
    radius_cm: float = C.R_REF_CM
    thickness_cm: float = 2 * C.R_REF_CM
    material: str = "PMMA"
    geometry: str = "sphere"


@dataclass
class Insight:
    level: str                    # info | good | warning | serious | critical
    key: str                      # i18n: ins.<key>.title / ins.<key>.body
    params: dict = field(default_factory=dict)
    source: str = "physics"       # physics | archive | model | procedure


@dataclass
class Assessment:
    scenario: Scenario
    strain_rate: float
    limit_pct: float
    margin_pct: float
    regime: str
    p_flame_physics: float
    ignition_delay_s: float | None
    co_factor: float
    hrr_est_w: float
    co_est_ppm: float
    p_ext_model: float | None
    neighbors: pd.DataFrame
    level: str
    score: float
    insights: list[Insight] = field(default_factory=list)

    @property
    def status(self) -> str:
        return LEVEL_STATUS[self.level]


def _model_probability(model: ModelBundle | None, sc: Scenario, nb: pd.DataFrame) -> float | None:
    """Extinction probability of the model for the scenario.

    O2_final / CO / CO2 are POST-test measurements and are unknown in a forward
    scenario, so they are filled with the median of the nearest archive tests
    (kNN assignment).
    """
    if model is None or nb.empty:
        return None
    drop = float(nb["O2_Drop"].median())
    row = pd.DataFrame([{
        "O2_initial": sc.o2_pct,
        "O2_final": sc.o2_pct - drop,
        "CO2": float(nb["CO2"].median()),
        "CO": float(nb["CO"].median()),
        "Thickness": sc.thickness_cm,
        "Flow_Vel": sc.flow_cm_s,
    }])
    try:
        return float(model.predict_proba(row)[0])
    except Exception:  # noqa: BLE001
        return None


def assess(sc: Scenario, archive: pd.DataFrame, model: ModelBundle | None = None) -> Assessment:
    a = float(P.strain_rate(sc.flow_cm_s, sc.radius_cm))
    limit = float(P.olson_limit(a))
    margin = sc.o2_pct - limit
    reg = P.regime(a)
    p_flame = float(P.flame_probability(margin))
    flammable = margin > 0
    t_ign = float(P.ignition_delay_s(margin)) if flammable else None
    co_f = float(P.co_enhancement(margin, sc.flow_cm_s)) if flammable else 1.0

    nb = D.nearest_tests(archive, sc.o2_pct, sc.flow_cm_s, sc.radius_cm)
    burning_nb = nb[nb["Extinction"] == 0]
    ref = burning_nb if len(burning_nb) >= 2 else nb
    hrr = float(np.nanmedian(ref["HRR_W"])) if ref["HRR_W"].notna().any() else float("nan")
    co_ppm = float(np.nanmedian(ref["CO_ppm"]))
    # Pressure effect: calorimetry depends on O2 mass; the archive was measured at 1 atm
    hrr_scaled = hrr * sc.pressure_kpa / C.STD_P_KPA * p_flame if np.isfinite(hrr) else float("nan")

    p_ext = _model_probability(model, sc, nb)

    # --- Seviye -------------------------------------------------------------
    hrr_n = min((hrr_scaled if np.isfinite(hrr_scaled) else 0) / C.HRR_WINDOW_DAMAGE_W, 1.0)
    co_n = min(co_ppm * p_flame / C.CO_SENSOR_SAT_PPM, 1.0)
    score = 100 * p_flame * (0.45 + 0.30 * hrr_n + 0.25 * co_n)
    earth_safe_space_burn = flammable and sc.o2_pct < C.EARTH_PMMA_LOI_PCT
    if margin < -0.5:
        level = "nominal"
    elif flammable and (hrr_scaled >= C.HRR_WINDOW_DAMAGE_W or co_ppm >= C.CO_SENSOR_SAT_PPM):
        level = "critical"
    elif flammable and (earth_safe_space_burn or hrr_scaled >= C.HRR_CAUTION_W
                        or co_ppm >= C.CO_CAUTION_PPM or (t_ign or 0) > C.STD6001_IGNITION_S):
        level = "warning"
    else:
        level = "caution"

    asm = Assessment(sc, a, limit, margin, reg, p_flame, t_ign, co_f, hrr_scaled, co_ppm,
                     p_ext, nb, level, float(score))
    asm.insights = build_insights(asm)
    return asm


def build_insights(asm: Assessment) -> list[Insight]:
    sc, out = asm.scenario, []

    # Fizik --------------------------------------------------------------------
    if asm.margin_pct > 0:
        out.append(Insight("serious" if asm.margin_pct > 1 else "warning", "flammable",
                           dict(margin=asm.margin_pct, r=sc.radius_cm, u=sc.flow_cm_s,
                                limit=asm.limit_pct, o2=sc.o2_pct)))
    else:
        out.append(Insight("good", "not_flammable", dict(margin=abs(asm.margin_pct), limit=asm.limit_pct)))

    if sc.o2_pct < C.EARTH_PMMA_LOI_PCT and asm.margin_pct > 0:
        out.append(Insight("critical", "earth_safe_space_burn",
                           dict(o2=sc.o2_pct, earth=C.EARTH_PMMA_LOI_PCT, lo=C.GOLDILOCKS_CM_S[0],
                                hi=C.GOLDILOCKS_CM_S[1], microg=C.MICROG_PMMA_LIMIT_PCT)))

    out.append(Insight("info", f"regime_{asm.regime}",
                       dict(u_star=P.most_dangerous_velocity(sc.radius_cm), min_lim=P.minimum_limit())))

    if P.in_goldilocks(sc.flow_cm_s) and asm.margin_pct > 0:
        out.append(Insight("warning", "goldilocks", dict(u=sc.flow_cm_s, co_factor=asm.co_factor)))

    if asm.ignition_delay_s and asm.ignition_delay_s > C.STD6001_IGNITION_S:
        out.append(Insight("serious", "ignition_delay",
                           dict(t=asm.ignition_delay_s, std=C.STD6001_IGNITION_S, max=C.BASS2_MAX_IGNITION_S)))

    if sc.material != "PMMA":
        out.append(Insight("info", "material_scope", dict(material=sc.material)))
    if abs(sc.pressure_kpa - C.STD_P_KPA) > 5:
        out.append(Insight("warning", "low_pressure", dict(ppo2=sc.o2_pct / 100 * sc.pressure_kpa)))

    # Archive ------------------------------------------------------------------
    nb = asm.neighbors
    out.append(Insight("info", "neighbors",
                       dict(n=len(nb), n_burn=int((nb["Extinction"] == 0).sum()),
                            ids=", ".join(nb["Test_ID"].astype(str).head(5))), "archive"))
    if np.isfinite(asm.hrr_est_w) and asm.hrr_est_w >= C.HRR_WINDOW_DAMAGE_W:
        out.append(Insight("critical", "hrr_window",
                           dict(hrr=asm.hrr_est_w, thr=C.HRR_WINDOW_DAMAGE_W), "archive"))
    if asm.co_est_ppm >= C.CO_SENSOR_SAT_PPM:
        out.append(Insight("critical", "co_saturation", dict(thr=C.CO_SENSOR_SAT_PPM), "archive"))

    # Model --------------------------------------------------------------------
    if asm.p_ext_model is not None:
        agree = ((1 - asm.p_ext_model) >= 0.5) == (asm.p_flame_physics >= 0.5)
        out.append(Insight("info" if agree else "warning", "model_agree" if agree else "model_conflict",
                           dict(p=asm.p_ext_model * 100), "model"))

    order = {"critical": 0, "serious": 1, "warning": 2, "info": 3, "good": 4}
    return sorted(out, key=lambda i: order.get(i.level, 9))
