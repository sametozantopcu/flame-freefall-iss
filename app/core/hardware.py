"""MSG fan potentiometer / voltage -> flow-velocity calibration (Restrictor 2)."""
from __future__ import annotations

from dataclasses import dataclass

import numpy as np

from app import config as C


@dataclass(frozen=True)
class FanReading:
    velocity_cm_s: float
    zero_flow: bool
    extrapolated: bool
    pot: float
    volts: float
    range_lo: float = 0.0     # calibration measurement range (uncertainty band)
    range_hi: float = 0.0

    @property
    def range_text(self) -> str:
        if self.range_hi - self.range_lo < 0.05:
            return f"{self.velocity_cm_s:.2f} cm/s"
        return f"{self.range_lo:.1f}–{self.range_hi:.1f} cm/s"


def table() -> dict[str, np.ndarray]:
    t = np.array(sorted(C.FAN_CAL_RESTRICTOR_2), dtype=float)
    return {"pot": t[:, 0], "volts": t[:, 1], "vel": t[:, 2], "lo": t[:, 3], "hi": t[:, 4]}


def _interp_extrap(x: float, xs: np.ndarray, ys: np.ndarray) -> float:
    """Linear between anchors; outside the range, extrapolate with the end-segment slope."""
    if x < xs[0]:
        slope = (ys[1] - ys[0]) / (xs[1] - xs[0])
        return float(ys[0] + slope * (x - xs[0]))
    if x <= xs[-1]:
        return float(np.interp(x, xs, ys))
    slope = (ys[-1] - ys[-2]) / (xs[-1] - xs[-2])
    return float(ys[-1] + slope * (x - xs[-1]))


def _reading(x: float, key: str, t: dict[str, np.ndarray]) -> FanReading:
    """Resolve all quantities for the given x along the `key` axis (pot / volts / vel)."""
    xs = t[key]
    zero = key != "vel" and x <= xs[0]
    vals = {k: max(_interp_extrap(x, xs, t[k]), 0.0) for k in ("pot", "volts", "vel", "lo", "hi")}
    vals[key] = x
    if zero:
        vals["vel"] = vals["lo"] = vals["hi"] = 0.0
    return FanReading(vals["vel"], bool(zero), bool(x > xs[-1]), vals["pot"], vals["volts"],
                      vals["lo"], vals["hi"])


def from_pot(pot: float) -> FanReading:
    return _reading(pot, "pot", table())


def from_volts(v: float) -> FanReading:
    return _reading(v, "volts", table())


def to_setpoint(u_cm_s: float) -> FanReading:
    """Potentiometer / voltage setting required for the requested flow velocity."""
    if u_cm_s <= 0:
        return FanReading(0.0, True, False, 0.0, 0.0)
    t = table()
    # Skip the zero-flow plateau (same speed, different pot): the interpolation must be monotonic
    keep = np.r_[True, np.diff(t["vel"]) > 0]
    return _reading(u_cm_s, "vel", {k: v[keep] for k, v in t.items()})


def calibration_curve(n: int = 201):
    pots = np.linspace(0, C.FAN_POT_MAX, n)
    readings = [from_pot(p) for p in pots]
    return (pots,
            np.array([r.velocity_cm_s for r in readings]),
            np.array([r.range_lo for r in readings]),
            np.array([r.range_hi for r in readings]),
            np.array([r.extrapolated for r in readings]))
