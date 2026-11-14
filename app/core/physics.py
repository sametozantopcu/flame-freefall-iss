"""Mikro-yerçekimi yanma fiziği: saf, test edilebilir fonksiyonlar (Streamlit bağımsız).

Kaynaklar
---------
* Olson, S. L. — BASS-II Summary Report: U-şekilli yanabilirlik sınırı.
* Huggett, C. (1980) — oksijen tüketim kalorimetrisi, 13.1 kJ / g O2.

"Sezgisel" (heuristic) olarak işaretli fonksiyonlar, BASS-II'nin iki ana
gözlemine (230 s'ye varan tutuşma gecikmesi, sınır yakınında ~10x CO) kalibre
edilmiş yüzey modelleridir; birinci prensip modeli değildir ve arayüzde bu
şekilde etiketlenir.
"""
from __future__ import annotations

import numpy as np

from app import config as C

ArrayLike = float | np.ndarray


# --------------------------------------------------------------------------- #
# Olson U-eğrisi
# --------------------------------------------------------------------------- #
def strain_rate(u_cm_s: ArrayLike, r_cm: ArrayLike) -> ArrayLike:
    """Gerilme hızı a [1/s] = 1.5 (U/r) (r/0.318)^0.5."""
    u = np.asarray(u_cm_s, dtype=float)
    r = np.maximum(np.asarray(r_cm, dtype=float), 1e-6)
    a = 1.5 * (u / r) * np.sqrt(r / C.R_REF_CM)
    return a if a.ndim else float(a)


def olson_limit(a: ArrayLike) -> ArrayLike:
    """Sınır O2 mol yüzdesi X_O2 = 6 exp(-0.5a) + 0.0167a + 13.4."""
    a = np.asarray(a, dtype=float)
    x = C.OLSON_A * np.exp(-C.OLSON_B * a) + C.OLSON_C * a + C.OLSON_D
    return x if x.ndim else float(x)


def limit_vs_velocity(u_cm_s: ArrayLike, r_cm: float) -> ArrayLike:
    return olson_limit(strain_rate(u_cm_s, r_cm))


def optimal_strain_rate() -> float:
    """U-eğrisinin minimumu: dX/da = 0  ->  a* = (1/B) ln(A·B / C)."""
    return float(np.log(C.OLSON_A * C.OLSON_B / C.OLSON_C) / C.OLSON_B)


def minimum_limit() -> float:
    return float(olson_limit(optimal_strain_rate()))


def velocity_for_strain(a: float, r_cm: float) -> float:
    """a'yı veren akış hızı (strain_rate'in tersi)."""
    return float(a * r_cm / (1.5 * np.sqrt(r_cm / C.R_REF_CM)))


def most_dangerous_velocity(r_cm: float) -> float:
    """Sınırın en düşük olduğu, yani alevin en dirençli olduğu akış hızı."""
    return velocity_for_strain(optimal_strain_rate(), r_cm)


def regime(a: float) -> str:
    """U-eğrisinin hangi kolunda olduğumuz (dilden bağımsız kod)."""
    a_star = optimal_strain_rate()
    if a < 0.15 * a_star:
        return "quiescent"       # neredeyse sıfır akış: O2 difüzyonu + radyasyon kaybı
    if a < a_star:
        return "radiative"       # sol kol: radyasyon kaybı / O2 taşınım sınırı
    return "blowoff"             # sağ kol: kalış süresi kısa, alev üflenir (blow-off)


# --------------------------------------------------------------------------- #
# Huggett kalorimetrisi
# --------------------------------------------------------------------------- #
def gas_molar_density(p_kpa: float = C.STD_P_KPA, t_k: float = C.STD_T_K) -> float:
    """İdeal gaz mol yoğunluğu [mol/L]."""
    return (p_kpa * 1e3) / (C.R_GAS * t_k) / 1e3


def o2_mass_consumed_g(
    delta_o2_pct: ArrayLike,
    volume_l: float = C.MSG_VOLUME_L,
    p_kpa: float = C.STD_P_KPA,
    t_k: float = C.STD_T_K,
) -> ArrayLike:
    """Kapalı hacimde O2 mol yüzdesindeki düşüşe karşılık gelen tüketilen O2 kütlesi [g]."""
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
    """Ortalama ısı salınım hızı [W] = 13.1 kJ/g · ṁ_O2."""
    m = np.asarray(o2_mass_consumed_g(delta_o2_pct, volume_l, p_kpa, t_k))
    dt = np.maximum(np.asarray(duration_s, dtype=float), 1e-6)
    q = C.HUGGETT_KJ_PER_G_O2 * 1e3 * m / dt
    return q if q.ndim else float(q)


def o2_drop_for_hrr(hrr_w: ArrayLike, duration_s: ArrayLike, **kw) -> ArrayLike:
    """hrr_watts'ın tersi: verilen HRR ve süre için beklenen O2 düşüşü [% puan]."""
    per_pct = hrr_watts(1.0, 1.0, **kw)  # 1 puanlık düşüş / 1 s -> W
    return np.asarray(hrr_w, dtype=float) * np.asarray(duration_s, dtype=float) / per_pct


# --------------------------------------------------------------------------- #
# Sezgisel yüzey modelleri (BASS-II çapa noktalarına kalibre)
# --------------------------------------------------------------------------- #
def flame_probability(margin_pct: ArrayLike, width: float = 0.5) -> ArrayLike:
    """Sınıra uzaklığa göre yanmanın sürme olasılığı (lojistik geçiş)."""
    p = 1.0 / (1.0 + np.exp(-np.asarray(margin_pct, dtype=float) / width))
    return p if p.ndim else float(p)


def ignition_delay_s(margin_pct: ArrayLike) -> ArrayLike:
    """Sezgisel: sınırdan uzakta ~10 s, sınıra yaklaşırken 230 s'ye yükselir."""
    m = np.maximum(np.asarray(margin_pct, dtype=float), 0.0)
    t = 10.0 + (C.BASS2_MAX_IGNITION_S - 10.0) * np.exp(-m / 1.2)
    return t if t.ndim else float(t)


def co_enhancement(margin_pct: ArrayLike, u_cm_s: ArrayLike) -> ArrayLike:
    """Sezgisel: Dünya'ya göre CO çarpanı (1x … 10x).

    Eksik yanma sınıra yakın ve düşük akışta (O2 taşınımıyla sınırlı alev)
    en yüksektir; yüksek akışta karışım iyileştiği için azalır.
    """
    m = np.maximum(np.asarray(margin_pct, dtype=float), 0.0)
    u = np.asarray(u_cm_s, dtype=float)
    low_flow_w = np.where(u <= C.GOLDILOCKS_CM_S[1], 1.0, np.exp(-(u - C.GOLDILOCKS_CM_S[1]) / 3.0))
    f = 1.0 + (C.CO_MAX_ENHANCEMENT - 1.0) * np.exp(-m / 1.5) * low_flow_w
    return f if f.ndim else float(f)


def in_goldilocks(u_cm_s: float) -> bool:
    lo, hi = C.GOLDILOCKS_CM_S
    return lo <= u_cm_s <= hi
