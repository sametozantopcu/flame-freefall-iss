"""ISS BASS-II yangın söndürme ve temizlik prosedürü (durum makinesi).

Adım kodları ve komutlar BASS-II operasyon prosedüründen alınmıştır:
  Step 9.6   — FAN FLOW = 0.00 (akışı kes) -> sönmezse GN2 ENA -> ON (azotla boğ)
  Step 10.4  — AIR CIRC purge, 3 dk (Freon kaynaklı HCl / CO temizliği)
  Step 10.5  — 6 dk soğutma
Bu modül Streamlit'ten bağımsızdır; arayüz yalnızca durumu gösterir/ilerletir.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

from app import config as C
from app.core import physics as P


@dataclass(frozen=True)
class Step:
    """Prosedür adımı. Başlık/gerekçe metinleri app/i18n.py: step.<key>.title / .why.

    `command` ISS konsol komutudur (FAN FLOW, GN2 ENA, AIR CIRC); dilden bağımsızdır
    ve çevrilmez. None ise i18n'deki step.<key>.cmd kullanılır.
    """
    key: str
    code: str
    command: str | None = None
    duration_s: float | None = None   # zamanlı adım ise süre
    decision: bool = False            # operatör "söndü mü?" kararı bekleniyor mu


STEPS: dict[str, Step] = {
    "standby": Step("standby", "—", "STANDBY"),
    "fire": Step("fire", "ALARM", None),
    "fan_off": Step("fan_off", "9.6", "FAN FLOW = 0.00", decision=True),
    "gn2": Step("gn2", "9.6", "GN2 ENA -> ON", decision=True),
    "purge": Step("purge", "10.4", "AIR CIRC -> PURGE (3:00)", duration_s=180),
    "cool": Step("cool", "10.5", None, duration_s=360),
    "safe": Step("safe", "✓", None),
}

ORDER = ["standby", "fire", "fan_off", "gn2", "purge", "cool", "safe"]


def next_step(current: str, extinguished: bool | None = None) -> str:
    """Durum geçişleri. Karar adımlarında `extinguished` gerekir."""
    if current == "standby":
        return "fire"
    if current == "fire":
        return "fan_off"
    if current == "fan_off":
        return "purge" if extinguished else "gn2"
    if current == "gn2":
        return "purge" if extinguished else "gn2"
    if current == "purge":
        return "cool"
    if current == "cool":
        return "safe"
    return "standby"


def quiescent_limit() -> float:
    """Sıfır akışta (a -> 0) Olson sınırı: 6 + 13.4 = %19.4."""
    return float(P.olson_limit(0.0))


def fan_off_sufficient(o2_pct: float, safety_pct: float = 0.5) -> bool:
    """Yalnız akışı kesmenin fiziksel olarak yeterli olması beklenir mi?"""
    return o2_pct < quiescent_limit() - safety_pct


def gn2_volume_l(o2_pct: float, target_pct: float | None = None, volume_l: float = C.MSG_VOLUME_L) -> float:
    """İyi karışmış, sabit basınçlı (tahliyeli) seyreltme: X = X0 exp(-V_N2 / V)."""
    target = target_pct if target_pct is not None else quiescent_limit() - 1.0
    if o2_pct <= target:
        return 0.0
    return volume_l * math.log(o2_pct / target)
