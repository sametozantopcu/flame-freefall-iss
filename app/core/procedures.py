"""ISS BASS-II fire suppression and cleanup procedure (state machine).

Step codes and commands are taken from the BASS-II operations procedure:
  Step 9.6   — FAN FLOW = 0.00 (cut the flow) -> if not extinguished: GN2 ENA -> ON (nitrogen purge)
  Step 10.4  — AIR CIRC purge, 3 min (removal of Freon-derived HCl / CO)
  Step 10.5  — 6 min cooldown
This module is independent of Streamlit; the interface only displays/advances
the state.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

from app import config as C
from app.core import physics as P


@dataclass(frozen=True)
class Step:
    """Procedure step. Title/reason texts live in app/i18n.py: step.<key>.title / .why.

    `command` is the ISS console command (FAN FLOW, GN2 ENA, AIR CIRC); it is
    language-independent and is not translated. When None, step.<key>.cmd from
    i18n is used.
    """
    key: str
    code: str
    command: str | None = None
    duration_s: float | None = None   # duration if this is a timed step
    decision: bool = False            # is an operator "did it go out?" decision pending


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
    """State transitions. Decision steps require `extinguished`."""
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
    """Olson limit at zero flow (a -> 0): 6 + 13.4 = 19.4 %."""
    return float(P.olson_limit(0.0))


def fan_off_sufficient(o2_pct: float, safety_pct: float = 0.5) -> bool:
    """Is cutting the flow alone expected to be physically sufficient?"""
    return o2_pct < quiescent_limit() - safety_pct


def gn2_volume_l(o2_pct: float, target_pct: float | None = None, volume_l: float = C.MSG_VOLUME_L) -> float:
    """Well-mixed, constant-pressure (vented) dilution: X = X0 exp(-V_N2 / V)."""
    target = target_pct if target_pct is not None else quiescent_limit() - 1.0
    if o2_pct <= target:
        return 0.0
    return volume_l * math.log(o2_pct / target)
