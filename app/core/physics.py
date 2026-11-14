"""Microgravity combustion physics: pure, testable functions (Streamlit-independent).

Kaynaklar
---------
* Olson, S. L. — BASS-II Summary Report: U-shaped flammability limit.
* Huggett, C. (1980) — oxygen-consumption calorimetry, 13.1 kJ / g O2.

Functions marked "heuristic" are surface models calibrated to two key BASS-II
observations (ignition delays of up to 230 s, ~10x CO near the limit); they are
not first-principles models and are labelled as such in the interface.
"""
from __future__ import annotations

import numpy as np

from app import config as C

ArrayLike = float | np.ndarray


# --------------------------------------------------------------------------- #
# Olson U-curve
# --------------------------------------------------------------------------- #
def strain_rate(u_cm_s: ArrayLike, r_cm: ArrayLike) -> ArrayLike:
    """Strain rate a [1/s] = 1.5 (U/r) (r/0.318)^0.5."""
    u = np.asarray(u_cm_s, dtype=float)
    r = np.maximum(np.asarray(r_cm, dtype=float), 1e-6)
    a = 1.5 * (u / r) * np.sqrt(r / C.R_REF_CM)
    return a if a.ndim else float(a)


def olson_limit(a: ArrayLike) -> ArrayLike:
    """Limit O2 mole percent X_O2 = 6 exp(-0.5a) + 0.0167a + 13.4."""
    a = np.asarray(a, dtype=float)
    x = C.OLSON_A * np.exp(-C.OLSON_B * a) + C.OLSON_C * a + C.OLSON_D
    return x if x.ndim else float(x)


def limit_vs_velocity(u_cm_s: ArrayLike, r_cm: float) -> ArrayLike:
    return olson_limit(strain_rate(u_cm_s, r_cm))


def optimal_strain_rate() -> float:
    """Minimum of the U-curve: dX/da = 0  ->  a* = (1/B) ln(A·B / C)."""
    return float(np.log(C.OLSON_A * C.OLSON_B / C.OLSON_C) / C.OLSON_B)


def minimum_limit() -> float:
    return float(olson_limit(optimal_strain_rate()))


def velocity_for_strain(a: float, r_cm: float) -> float:
    """Flow velocity that produces a (inverse of strain_rate)."""
    return float(a * r_cm / (1.5 * np.sqrt(r_cm / C.R_REF_CM)))


def most_dangerous_velocity(r_cm: float) -> float:
    """Flow velocity at which the limit is lowest, i.e. the flame is most robust."""
    return velocity_for_strain(optimal_strain_rate(), r_cm)


def regime(a: float) -> str:
    """Which branch of the U-curve we are on (language-independent code)."""
    a_star = optimal_strain_rate()
    if a < 0.15 * a_star:
        return "quiescent"       # near-zero flow: O2 diffusion + radiative loss
    if a < a_star:
        return "radiative"       # left branch: radiative loss / O2 transport limit
    return "blowoff"             # right branch: short residence time, flame blows off


# --------------------------------------------------------------------------- #
# Huggett kalorimetrisi
# --------------------------------------------------------------------------- #
def gas_molar_density(p_kpa: float = C.STD_P_KPA, t_k: float = C.STD_T_K) -> float:
    """Ideal-gas molar density [mol/L]."""
    return (p_kpa * 1e3) / (C.R_GAS * t_k) / 1e3


def o2_mass_consumed_g(
    delta_o2_pct: ArrayLike,
    volume_l: float = C.MSG_VOLUME_L,
    p_kpa: float = C.STD_P_KPA,
    t_k: float = C.STD_T_K,
) -> ArrayLike:
    """O2 mass consumed [g] corresponding to a drop in O2 mole percent in a closed volume."""
    d = np.asarray(delta_o2_pct, dtype=float) / 100.0
    m = d * gas_molar_density(p_kpa, t_k) * volume_l * C.M_O2_G_MOL
    return m if m.ndim else float(m)


def hrr_watts(
    delta_o2_pct: ArrayLike,
    duration_s: ArrayLike,
    volume_l: float = C.MSG_VOLUME_L,
    p_kpa: float = C.STD_P_KPA,
    t_k: float = C.STD_T_K,
) -> ArrayLike:
    """Average heat release rate [W] = 13.1 kJ/g · ṁ_O2."""
    m = np.asarray(o2_mass_consumed_g(delta_o2_pct, volume_l, p_kpa, t_k))
    dt = np.maximum(np.asarray(duration_s, dtype=float), 1e-6)
    q = C.HUGGETT_KJ_PER_G_O2 * 1e3 * m / dt
    return q if q.ndim else float(q)


def o2_drop_for_hrr(hrr_w: ArrayLike, duration_s: ArrayLike, **kw) -> ArrayLike:
    """Inverse of hrr_watts: expected O2 drop [% points] for a given HRR and duration."""
    per_pct = hrr_watts(1.0, 1.0, **kw)  # 1 point drop / 1 s -> W
    return np.asarray(hrr_w, dtype=float) * np.asarray(duration_s, dtype=float) / per_pct


# --------------------------------------------------------------------------- #
# Heuristic surface models (calibrated to the BASS-II anchor points)
# --------------------------------------------------------------------------- #
def flame_probability(margin_pct: ArrayLike, width: float = 0.5) -> ArrayLike:
    """Probability that combustion persists versus distance from the limit (logistic)."""
    p = 1.0 / (1.0 + np.exp(-np.asarray(margin_pct, dtype=float) / width))
    return p if p.ndim else float(p)


def ignition_delay_s(margin_pct: ArrayLike) -> ArrayLike:
    """Heuristic: ~10 s far from the limit, rising to 230 s as the limit is approached."""
    m = np.maximum(np.asarray(margin_pct, dtype=float), 0.0)
    t = 10.0 + (C.BASS2_MAX_IGNITION_S - 10.0) * np.exp(-m / 1.2)
    return t if t.ndim else float(t)


def co_enhancement(margin_pct: ArrayLike, u_cm_s: ArrayLike) -> ArrayLike:
    """Heuristic: CO multiplier versus Earth (1x … 10x).

    Incomplete combustion peaks near the limit and at low flow (a
    transport-limited flame); at high flow it decreases as mixing improves.
    """
    m = np.maximum(np.asarray(margin_pct, dtype=float), 0.0)
    u = np.asarray(u_cm_s, dtype=float)
    low_flow_w = np.where(u <= C.GOLDILOCKS_CM_S[1], 1.0, np.exp(-(u - C.GOLDILOCKS_CM_S[1]) / 3.0))
    f = 1.0 + (C.CO_MAX_ENHANCEMENT - 1.0) * np.exp(-m / 1.5) * low_flow_w
    return f if f.ndim else float(f)


def in_goldilocks(u_cm_s: float) -> bool:
    lo, hi = C.GOLDILOCKS_CM_S
    return lo <= u_cm_s <= hi
