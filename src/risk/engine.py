"""Oxygen and Pressure Risk Threshold Module — calculation engine.

Ported from PR #7 (risk-engine-integration) by sametozantopcu.

The module derives a "Critical Fire Risk Index" (0–100) for a cabin atmosphere
from empirical curves extracted from NASA PSI (Payload Safety Investigation)
combustion experiments. It is independent of any user interface, depends
only on ``numpy``/``pandas`` (the Feature Store is imported lazily, and only by
``Anchors.from_feature_store``), and is imported as ``src.risk.engine``.

Data sources (Feature Store tables, ``src.data_layer``)
-------------------------------------------------------
* **PSI-25 / BASS-II** — table ``bass2``. Solid-material tests (PMMA, SIBAL,
  Nomex, wax): initial/final O2, CO2, CO. Material-specific burn share and the
  O2 threshold come from here. Columns: ``material_raw``, ``o2_init_pct``,
  ``co2_init_pct``, ``co2_final_pct``.
* **PSI-159 / CFI-G** — tables ``acme_normal`` and ``acme_inverse`` (rows with
  ``psi_id = 'PSI-159'``). Columns: ``xo2_init``/``xo2``, ``p_bar``,
  ``burn_time_s``, ``hot_ignition_raw``, ``ext_mode_raw``.
* **PSI-39 / CFI** — table ``cfi`` (rows in the experimental table; ``pressure_raw``,
  ``x_o2``, ``k_hot_mm2_s``, ``hf_burn_time_s``).


Physical basis
--------------
Ignition and flame spread depend on the oxygen **partial pressure** (pO2);
total pressure alone is not decisive (Architecture.md §Severity engine). This
module therefore builds every curve on pO2 = (O2/100)·p. In the literature
(NASA CFI, NASA-STD-6001) the ignition delay shortens exponentially as pO2
rises:

    t_ig ∝ pO2^(-n)        (n > 0, default 1.0)

Two quantities tested against the dataset confirm this trend:
* CFI-G (n=333) ignition logistic: ``logit P = 2.32 + 1.05 ln(pO2)``.
* PSI-39 (n=74) hot flame spread coefficient: ``ln khot = -1.08 + 0.45 ln(pO2)``.

Index scale
-----------
The Critical Fire Risk Index is a **relative escalation scale**:

* ``0``   → Earth-air reference (21 % O2, 1 atm, pO2 = 0.21 atm).
* ``100`` → top of the design envelope (40 % O2, 1 atm, pO2 = 0.40 atm).
* Levels: ``< 35`` "Low", ``35–65`` "Medium", ``≥ 65`` "Critical".

Six components (``RiskAssessment.components``) are combined by weight:
``oxygen`` (pO2 escalation), ``ignition`` (CFI-G logistic), ``duration``
(CFI-G duration law), ``spread`` (PSI-39 khot), ``margin`` (BASS-II threshold
margin) and ``material`` (BASS-II burn share). The weights are transparent in
``RISK_WEIGHTS`` and can be overridden via ``RiskEngine(weights=...)``.

Example
-------
>>> from src.risk.engine import RiskEngine
>>> eng = RiskEngine()
>>> r = eng.assess(oxygen_pct=30.0, pressure=101.3, material_type="Nomex")
>>> round(r.risk_index, 1), r.risk_label
(28.6, 'Low')
>>> r = eng.assess(oxygen_pct=40.0, pressure=101.3, material_type="PMMA")
>>> round(r.risk_index, 1), r.risk_label
(97.6, 'Critical')
"""
from __future__ import annotations

import math
import re
from dataclasses import dataclass, field, replace
from functools import lru_cache
from typing import Any, Mapping, Sequence

import numpy as np
import pandas as pd


# --------------------------------------------------------------------------- #
# Reference conditions and unit conversions
# --------------------------------------------------------------------------- #
REF_O2_PCT = 21.0                 # Earth sea-level air
REF_PRESSURE_KPA = 101.325        # 1 atm

O2_ENVELOPE = (21.0, 40.0)        # design envelope permitted by the interface
PRESSURE_ENVELOPE_KPA = (30.0, 320.0)

#: Risk-index calibration anchors: reference (21 % O2, 1 atm) → 0 points,
#: ``CEILING_PO2_ATM`` → all components equal 1 (index 100).
REF_PO2_ATM = REF_O2_PCT / 100.0
CEILING_PO2_ATM = 0.40            # 40 % O2 / 1 atm: upper end of the envelope
CEILING_O2_PCT = CEILING_PO2_ATM * 100.0

#: PMMA microgravity combustion threshold [% O2] — BASS-II. Anchor of the
#: threshold-margin component: 7.5 points above the threshold at 21 % O2 and
#: 26.5 points above it at 40 % O2.
PMMA_THRESHOLD_PCT = 13.5

#: Ignition-delay reference [s] — NASA-STD-6001 Test 1 igniter duration
#: (NASA-STD-6001 Test 1 igniter duration).
REF_IGNITION_DELAY_S = 25.0

#: Literature power law: ``t_ig ∝ pO2^(-n)``. As the oxygen partial pressure
#: rises the ignition delay shortens exponentially (narrowing of the ignition
#: threshold). n = 1 was chosen from the CFI pressure sensitivity and the
#: NASA-STD-6001 trend.
IGNITION_DELAY_PO2_EXPONENT = 1.0

#: Supported pressure units -> multiplier to kPa.
PRESSURE_UNITS: dict[str, float] = {
    "kpa": 1.0,
    "kpaa": 1.0,
    "atm": 101.325,
    "bar": 100.0,
    "bara": 100.0,
    "psia": 6.894757,
    "psi": 6.894757,
    "mmhg": 0.1333224,
    "torr": 0.1333224,
}

#: Risk level codes — the interface translates these (translations live in app/i18n.js).
RISK_LEVELS = ("low", "medium", "critical")
RISK_LEVEL_LABELS = {"low": "Low", "medium": "Medium", "critical": "Critical"}

# --------------------------------------------------------------------------- #
# Material profiles
# --------------------------------------------------------------------------- #
@dataclass(frozen=True)
class MaterialProfile:
    """Combustion-behaviour constants for one material class.

    Attributes
    ----------
    key : str
        Language-independent code (``PMMA``, ``SIBAL``, ...).
    label : str
        Human-readable name shown in the interface.
    aliases : tuple[str, ...]
        Lower-case keywords for free-text matching
        ("acrylic", "plexiglas", "pmma film" ...).
    loi_pct : float
        Literature Limiting Oxygen Index [% vol, 1 atm, Earth].
    threshold_o2_pct : float
        Lower limit of sustainable combustion in microgravity [% O2].
        The BASS-II value (13.5) is fixed for PMMA; the others are derived from
        the LOI with a -3.8 point microgravity shift.
    burn_share : float | None
        Burn share observed in BASS-II (fraction of tests with ΔCO2 > 0.1);
        ``None`` when the material is absent from BASS-II.
    n_tests : int
        Number of BASS-II tests (0 = no data).
    o2_median_pct : float | None
        Median initial O2 of the BASS-II tests.
    duration_multiplier : float
        Burn-lifetime multiplier observed at the same pO2 (PMMA = 1.0
        reference). Flame-retardant / charring materials are < 1, high-energy
        polymers > 1.
    inert : bool
        When True the material does not burn (metal, glass, ceramic): the risk
        index is forced to 0 and an ``inert_material`` warning is added.
    source : str
        Origin of the constant (``"BASS-II"``, ``"lit"``, ``"estimate"``).
    """

    key: str
    label: str
    aliases: tuple[str, ...]
    loi_pct: float
    threshold_o2_pct: float
    burn_share: float | None = None
    n_tests: int = 0
    o2_median_pct: float | None = None
    duration_multiplier: float = 1.0
    inert: bool = False
    source: str = "lit"


#: Materials measured in BASS-II plus a literature-based extension.
#: The ``burn_share``/``n_tests``/``o2_median_pct`` values are refreshed with
#: Feature Store data by ``Anchors.from_feature_store``.
MATERIAL_PROFILES: dict[str, MaterialProfile] = {
    "PMMA": MaterialProfile(
        key="PMMA",
        label="PMMA / acrylic",
        aliases=("pmma", "akrilik", "acrylic", "plexiglas", "perspex", "lucite",
                 "polymethyl methacrylate", "polimetil metakrilat"),
        loi_pct=17.3,
        threshold_o2_pct=13.5,        # BASS-II microgravity limit
        burn_share=0.763,             # 71 of 98 tests burned
        n_tests=98,
        o2_median_pct=18.1,
        duration_multiplier=1.0,
        source="BASS-II",
    ),
    "SIBAL": MaterialProfile(
        key="SIBAL",
        label="SIBAL fabric",
        aliases=("sibal", "silica", "beta cloth", "betacloth", "cam kumaş"),
        loi_pct=30.0,
        threshold_o2_pct=26.2,
        burn_share=0.0,               # no burn in 27 tests
        n_tests=27,
        o2_median_pct=17.6,
        duration_multiplier=0.5,
        source="BASS-II",
    ),
    "Nomex": MaterialProfile(
        key="Nomex",
        label="Nomex",
        aliases=("nomex", "aramid", "kevlar", "meta-aramid"),
        loi_pct=28.5,
        threshold_o2_pct=24.7,
        burn_share=0.0,               # no burn in 3 tests
        n_tests=3,
        o2_median_pct=21.7,
        duration_multiplier=0.5,
        source="BASS-II",
    ),
    "Wax candle": MaterialProfile(
        key="Wax candle",
        label="Wax / paraffin",
        aliases=("wax", "candle", "mum", "parafin", "paraffin"),
        loi_pct=17.0,
        threshold_o2_pct=13.2,
        burn_share=0.0,               # single BASS-II test (no burn)
        n_tests=1,
        o2_median_pct=17.4,
        duration_multiplier=1.2,
        source="BASS-II",
    ),
    "Kapton": MaterialProfile(
        key="Kapton",
        label="Kapton (polyimide)",
        aliases=("kapton", "polyimide", "poliimid"),
        loi_pct=23.0,
        threshold_o2_pct=19.2,
        duration_multiplier=1.2,
        source="lit",
    ),
    "PTFE": MaterialProfile(
        key="PTFE",
        label="PTFE / Teflon",
        aliases=("ptfe", "teflon", "politetrafloroetilen"),
        loi_pct=95.0,
        threshold_o2_pct=91.2,
        duration_multiplier=0.3,
        inert=True,
        source="lit",
    ),
    "Silicone": MaterialProfile(
        key="Silicone",
        label="Silicone rubber",
        aliases=("silicone", "silikon", "silastic", "pdms"),
        loi_pct=26.0,
        threshold_o2_pct=22.2,
        duration_multiplier=1.3,
        source="lit",
    ),
    "Polyethylene": MaterialProfile(
        key="Polyethylene",
        label="Polyethylene",
        aliases=("polyethylene", "polietilen", "hdpe", "ldpe", "pe film"),
        loi_pct=17.4,
        threshold_o2_pct=13.6,
        duration_multiplier=1.0,
        source="lit",
    ),
    "Cotton": MaterialProfile(
        key="Cotton",
        label="Cotton",
        aliases=("cotton", "pamuk", "cellulose", "selüloz"),
        loi_pct=18.4,
        threshold_o2_pct=14.6,
        duration_multiplier=0.9,
        source="lit",
    ),
    "PU foam": MaterialProfile(
        key="PU foam",
        label="Polyurethane foam",
        aliases=("polyurethane", "poliüretan", "pu foam", "foam", "sünger"),
        loi_pct=17.0,
        threshold_o2_pct=13.2,
        duration_multiplier=0.7,      # high surface-to-volume ratio, burns fast
        source="lit",
    ),
    "Inert": MaterialProfile(
        key="Inert",
        label="Metal / ceramic / glass",
        aliases=("aluminum", "aluminium", "alüminyum", "steel", "çelik", "metal",
                 "glass", "cam", "ceramic", "seramik", "titanium", "stainless"),
        loi_pct=100.0,
        threshold_o2_pct=100.0,
        duration_multiplier=0.0,
        inert=True,
        source="lit",
    ),
}

#: Conservative default for an unknown material (acrylic-like polymer).
FALLBACK_MATERIAL_KEY = "PMMA"

# --------------------------------------------------------------------------- #
# Pressure and partial-pressure helpers
# --------------------------------------------------------------------------- #
def to_kpa(pressure: float, unit: str = "kPa") -> float:
    """Convert the given pressure to kPa.

    Parameters
    ----------
    pressure : float
        Numeric pressure value.
    unit : str, default "kPa"
        ``"kPa"``, ``"atm"``, ``"bar"``, ``"psia"``, ``"mmHg"``/``"torr"``
        (case-insensitive).

    Returns
    -------
    float
        Pressure [kPa].

    Raises
    ------
    ValueError
        If the pressure is negative or the unit is not recognised.

    Examples
    --------
    >>> round(to_kpa(1.0, "atm"), 2)
    101.33
    >>> round(to_kpa(14.7, "psia"), 1)
    101.4
    """
    val = float(pressure)
    if not math.isfinite(val) or val < 0:
        raise ValueError(f"Invalid pressure value: {pressure!r}")
    key = str(unit).strip().lower().replace(" ", "")
    if key not in PRESSURE_UNITS:
        raise ValueError(
            f"Unknown pressure unit {unit!r}. Supported units: "
            + ", ".join(sorted(PRESSURE_UNITS))
        )
    return val * PRESSURE_UNITS[key]


def o2_partial_pressure_atm(oxygen_pct: float, pressure_kpa: float = REF_PRESSURE_KPA) -> float:
    """Oxygen partial pressure [atm] = (O2/100) · (p / 101.325).

    This is the common variable of the ignition and spread curves: at the same
    pO2, 30 % O2 / 0.7 atm and 21 % O2 / 1 atm give roughly the same risk.

    Examples
    --------
    >>> round(o2_partial_pressure_atm(21.0, 101.325), 3)
    0.21
    >>> round(o2_partial_pressure_atm(42.0, 50.66), 3)
    0.21
    """
    if not 0.0 <= float(oxygen_pct) <= 100.0:
        raise ValueError(f"Oxygen percentage must be within 0–100: {oxygen_pct!r}")
    return float(oxygen_pct) / 100.0 * float(pressure_kpa) / REF_PRESSURE_KPA


def equivalent_sea_level_o2_pct(oxygen_pct: float, pressure_kpa: float) -> float:
    """Sea-level-equivalent O2 percentage of the given atmosphere [%].

    The O2 fraction that would be required at 1 atm to keep pO2 unchanged; used
    in the interface for the sentence "this cabin atmosphere behaves like %X O2
    on Earth".
    """
    return float(oxygen_pct) * float(pressure_kpa) / REF_PRESSURE_KPA


def _clamp(x: float, lo: float = 0.0, hi: float = 1.0) -> float:
    """Clamp ``x`` to the interval [lo, hi] (NaN-safe)."""
    if not math.isfinite(x):
        return lo
    return float(min(max(x, lo), hi))


# --------------------------------------------------------------------------- #
# Empirical coefficients (Anchors)
# --------------------------------------------------------------------------- #
@dataclass(frozen=True)
class Anchors:
    """Empirical curve coefficients extracted from the PSI data.

    All coefficients are defined either on the oxygen **partial pressure**
    (pO2, atm) or directly on the (O2 %, p atm) pair. The default values come
    from the fits below (``Anchors.from_feature_store`` reproduces the same fits with
    fresh data):

    ``burn_time``  PSI-159 CFI-G, hot-igniting + self-extinguishing tests,
                   n=175, R²=0.402::

                       ln t [s] = -0.487 + 1.017 ln(O2%) - 1.573 ln(p/atm)

    ``ignition``   PSI-159 CFI-G, binary "Hot ignition" target, n=333::

                       logit P = 2.324 + 1.045 ln(pO2/atm)

    ``spread``     PSI-39 ``khot`` (mm²/s), flex table + DATA join,
                   n=74::

                       ln khot = -1.080 + 0.454 ln(pO2/atm)

    ``burn_prob``  BASS-II PMMA, binary ΔCO2 > 0.1 target, n=93::

                       logit P = 0.971 - 0.086 (O2% - 21)
    """

    # --- burn time (PSI-159) ---------------------------------------------- #
    burn_time_intercept: float = -0.487
    burn_time_o2_exp: float = 1.017
    burn_time_p_exp: float = -1.573
    burn_time_r2: float = 0.402
    burn_time_n: int = 175

    # --- ignition probability (PSI-159) ----------------------------------- #
    ignition_logit_intercept: float = 2.324
    ignition_logit_po2: float = 1.045
    ignition_n: int = 333

    # --- flame spread coefficient (PSI-39) -------------------------------- #
    spread_intercept: float = -1.080
    spread_po2_exp: float = 0.454
    spread_r2: float = 0.044
    spread_n: int = 74

    # --- PMMA burn share (BASS-II) ---------------------------------------- #
    burn_logit_intercept: float = 0.971
    burn_logit_o2_slope: float = -0.086
    burn_n: int = 93

    # --- material statistics ---------------------------------------------- #
    material_burn_share: Mapping[str, float] = field(default_factory=lambda: {
        k: v.burn_share for k, v in MATERIAL_PROFILES.items() if v.burn_share is not None
    })
    material_n_tests: Mapping[str, int] = field(default_factory=lambda: {
        k: v.n_tests for k, v in MATERIAL_PROFILES.items() if v.n_tests
    })

    # --- provenance ------------------------------------------------------- #
    sources: tuple[str, ...] = (
        "PSI-25 (BASS-II): feature store table bass2",
        "PSI-159 (CFI-G): feature store tables acme_normal + acme_inverse (psi_id PSI-159)",
        "PSI-39 (CFI): feature store table cfi (experimental-table rows, k_hot_mm2_s)",
    )
    refreshed_from_store: bool = False
    #: Coefficient groups replaced by ``from_feature_store`` (``burn_time``,
    #: ``ignition``, ``spread``, ``burn_logit``, ``material_burn_share``);
    #: every other coefficient keeps its embedded value.
    refreshed_fields: tuple[str, ...] = ()

    # ------------------------------------------------------------------ #
    @classmethod
    def default(cls) -> "Anchors":
        """Coefficients fitted into the code (the built-in defaults)."""
        return cls()

    @classmethod
    def from_feature_store(cls, con: Any = None) -> "Anchors":
        """Refit the coefficients from the Feature Store (``src.data_layer``).

        Tables read (the same investigations the embedded fits came from):

        * ``acme_normal`` + ``acme_inverse``, rows ``psi_id = 'PSI-159'``
          (CFI-G: burn time and hot-ignition logistic)
        * ``cfi``, experimental-table rows (PSI-39: ``k_hot_mm2_s``)
        * ``bass2`` (PSI-25: material burn shares + PMMA logistic)

        The store columns are given the original PSI header names and then go
        through the original column detection, unit conversion, filters and
        fits (``detect_columns``, ``pressure_unit_from_header`` ...). Missing
        values stay missing (never zero-filled). Coefficients without enough
        data keep their ``Anchors.default()`` value; the groups that were
        actually refitted are listed in ``refreshed_fields``.

        Parameters
        ----------
        con : duckdb.DuckDBPyConnection | None, default None
            An open Feature Store connection (``src.data_layer.store.connect``).
            ``None`` → a private connection is opened and closed here. If the
            data layer is unavailable the embedded default set is returned.

        Returns
        -------
        Anchors
            A new coefficient set; ``refreshed_from_store`` is True when a
            refit succeeded.

        Examples
        --------
        >>> a = Anchors.from_feature_store()          # doctest: +SKIP
        >>> a.refreshed_fields                        # doctest: +SKIP
        ('burn_time', 'ignition', 'spread', 'burn_logit', 'material_burn_share')
        """
        base = cls.default()
        own = con is None
        if own:
            try:
                from src.data_layer import store  # lazy: the engine itself needs only numpy/pandas
                con = store.connect()
            except Exception:  # noqa: BLE001 - data layer/parquet absent -> embedded values
                return base
        try:
            return cls._refit(con, base)
        finally:
            if own:
                con.close()

    @classmethod
    def _refit(cls, con: Any, base: "Anchors") -> "Anchors":
        frames: list[pd.DataFrame] = []
        banch: dict[str, float] = {}
        bn: dict[str, int] = {}
        fields: list[str] = []

        # --- PSI-159 / CFI-G -------------------------------------------- #
        for sql in (
            'SELECT xo2_init AS "XO2 before test", p_bar AS "approx p (bar)", '
            'burn_time_s AS "burn time (sec)", hot_ignition_raw AS "Hot ignition", '
            'ext_mode_raw AS "Self-ext or flow term" FROM acme_normal WHERE psi_id = \'PSI-159\'',
            'SELECT xo2 AS "XO2", p_bar AS "approx p (bar)", '
            'burn_time_s AS "burn time (sec)", hot_ignition_raw AS "Hot ignition", '
            'ext_mode_raw AS "Self-ext or flow term" FROM acme_inverse WHERE psi_id = \'PSI-159\'',
        ):
            df = _query(con, sql)
            if df is None:
                continue
            cols = detect_columns(list(df.columns))
            if not {"o2_initial", "pressure"}.issubset(cols):
                continue
            out = pd.DataFrame(index=df.index)
            out["o2_pct"] = _to_pct(df[cols["o2_initial"]])
            p_unit = pressure_unit_from_header(cols["pressure"])
            out["p_atm"] = (_numeric(df[cols["pressure"]]) * PRESSURE_UNITS[p_unit]
                            / REF_PRESSURE_KPA)
            out["t_burn"] = _numeric(df[cols["burn_time"]]) if "burn_time" in cols else np.nan
            out["ign"] = _binary_yes(df[cols["ignition"]]) if "ignition" in cols else np.nan
            out["ext"] = (df[cols["extinction"]].astype("string").str.strip().str.upper()
                          if "extinction" in cols else pd.NA)
            out["src"] = "CFI-G"
            frames.append(out)

        # --- PSI-39 / CFI (experimental-table rows; khot already joined) -- #
        exp = _query(
            con,
            'SELECT x_o2 AS "XO2 before test", pressure_raw AS "Pressure", '
            'k_hot_mm2_s AS "khot", hf_burn_time_s AS "hf burn time" '
            "FROM cfi WHERE psi_id = 'PSI-39' AND in_experimental_table",
        )
        if exp is not None:
            ecols = detect_columns(list(exp.columns))
            if {"o2_initial", "pressure", "spread_coeff"}.issubset(ecols):
                e = pd.DataFrame(index=exp.index)
                e["o2_pct"] = _to_pct(exp[ecols["o2_initial"]])
                p_txt = exp[ecols["pressure"]].astype("string").str.extract(r"([\d.]+)")[0]
                e["p_atm"] = pd.to_numeric(p_txt, errors="coerce")
                e["khot"] = _numeric(exp[ecols["spread_coeff"]])
                e = e.dropna(subset=["o2_pct", "p_atm"])
                if e["khot"].notna().sum() >= 5:
                    a, b, r2, n = _ols_log_log(e["khot"], e["o2_pct"] / 100.0 * e["p_atm"])
                    if n >= 5:
                        base = replace(base, spread_intercept=a, spread_po2_exp=b,
                                       spread_r2=round(r2, 4), spread_n=n)
                        fields.append("spread")

        # --- shared fits: burn time + ignition ------------------------- #
        # Note: the burn-time and ignition laws are fitted on CFI-G (PSI-159)
        # ONLY; PSI-39 is used solely for the spread coefficient (khot).
        # The two experiments measure different samples/physics (gas-jet
        # flame vs. solid spread), so merging them corrupts the curve
        # (combined fit R² ≈ 0.09).
        refreshed = False
        if frames:
            g = pd.concat(frames, ignore_index=True).dropna(subset=["o2_pct", "p_atm"])
            g = g[(g.o2_pct > 0) & (g.p_atm > 0)]
            g["po2"] = g.o2_pct / 100.0 * g.p_atm
            cfi = g[g["src"] == "CFI-G"]

            burn = cfi[(cfi.t_burn > 0) & (cfi.ign == 1)
                       & (cfi.ext.astype("string").str.upper() == "SE")]
            c0, coefs, r2_1, n1 = _ols_log_multi(burn["t_burn"], burn["o2_pct"], burn["p_atm"])
            if n1 >= 20:
                base = replace(base, burn_time_intercept=c0,
                               burn_time_o2_exp=coefs[0], burn_time_p_exp=coefs[1],
                               burn_time_r2=round(r2_1, 4), burn_time_n=n1)
                fields.append("burn_time")
                refreshed = True

            ig = cfi.dropna(subset=["ign"])
            ig = ig[ig.po2 > 0]
            a3, b3, n3 = _logit_fit(ig["ign"], np.log(ig["po2"].clip(lower=1e-6)))
            if n3 >= 50 and b3 > 0:
                base = replace(base, ignition_logit_intercept=a3,
                               ignition_logit_po2=b3, ignition_n=n3)
                fields.append("ignition")
                refreshed = True

        # --- BASS-II: material burn shares + PMMA logistic --------------- #
        df = _query(
            con,
            'SELECT material_raw AS "Fuel Sample Material", '
            'o2_init_pct AS "Calibrated initial O2 % by vol", '
            'co2_init_pct AS "Initial CO2 % by vol", co2_final_pct AS "Final CO2 % by vol" '
            "FROM bass2 WHERE psi_id = 'PSI-25'",
        )
        if df is not None:
            cols = detect_columns(list(df.columns))
            if {"material", "o2_initial", "co2_initial", "co2_final"}.issubset(cols):
                tbl = pd.DataFrame({
                    "mat": df[cols["material"]].map(_material_bucket),
                    "o2": _to_pct(df[cols["o2_initial"]]),
                    "burned": ((_numeric(df[cols["co2_final"]])
                                - _numeric(df[cols["co2_initial"]])) > 0.1).astype(float),
                })
                tbl.loc[_numeric(df[cols["co2_final"]]).isna()
                        | _numeric(df[cols["co2_initial"]]).isna(), "burned"] = np.nan
                for key, grp in tbl.groupby("mat"):
                    if key not in MATERIAL_PROFILES:
                        continue
                    flags = grp["burned"].dropna()
                    if flags.empty:
                        continue
                    banch[key] = round(float(flags.mean()), 4)
                    bn[key] = int(len(grp))
                if banch:
                    fields.append("material_burn_share")
                pm = tbl[tbl.mat == "PMMA"]
                a4, b4, n4 = _logit_fit(pm["burned"], pm["o2"] - REF_O2_PCT)
                if n4 >= 20:
                    base = replace(base, burn_logit_intercept=a4,
                                   burn_logit_o2_slope=b4, burn_n=n4)
                    fields.append("burn_logit")
                    refreshed = True

        if not refreshed:
            return replace(base, refreshed_fields=tuple(fields))
        return replace(
            base,
            material_burn_share={**dict(base.material_burn_share), **banch},
            material_n_tests={**dict(base.material_n_tests), **bn},
            refreshed_from_store=True,
            refreshed_fields=tuple(fields),
        )





    def profile(self, key: str) -> MaterialProfile:
        """Return the material profile together with the refreshed burn share."""
        base = MATERIAL_PROFILES.get(key, MATERIAL_PROFILES[FALLBACK_MATERIAL_KEY])
        share = self.material_burn_share.get(key)
        n = self.material_n_tests.get(key, base.n_tests)
        return replace(base, burn_share=share if share is not None else base.burn_share,
                       n_tests=int(n))

    @property
    def reference_burn_time_s(self) -> float:
        """Burn time at the reference condition (21 % O2, 1 atm) [s] — from the curve."""
        return float(math.exp(
            self.burn_time_intercept
            + self.burn_time_o2_exp * math.log(REF_O2_PCT)
            + self.burn_time_p_exp * math.log(1.0)
        ))

    def as_dict(self) -> dict[str, Any]:
        """Flat dictionary for the "evidence" panel in Streamlit."""
        d = {
            f.name: getattr(self, f.name)
            for f in self.__dataclass_fields__.values()  # type: ignore[attr-defined]
            if f.name not in {"material_burn_share", "material_n_tests", "sources"}
        }
        d["reference_burn_time_s"] = self.reference_burn_time_s
        d["sources"] = list(self.sources)
        return d


DEFAULT_ANCHORS = Anchors.default()

# --------------------------------------------------------------------------- #
# Refreshing from data (column detection + refit)
# --------------------------------------------------------------------------- #
#: Column-name matching patterns (applied to the normalised header).
_COLUMN_PATTERNS: dict[str, tuple[str, ...]] = {
    "material": (r"materials?", r"samplematerial", r"fuelsample", r"specimen", r"^fuel$",
                 r"fueltype", r"malzeme"),
    "o2_initial": (r"initialo2", r"o2initial", r"o2before", r"xo2before", r"xbefortest",
                   r"calibratedinitialo2", r"o2init", r"^xo2", r"^o2$", r"o2pct",
                   r"oxygenpct", r"^oxygen$"),
    "o2_final": (r"finalo2", r"o2final", r"o2after", r"xo2after", r"xaftertest",
                 r"calibratedfinalo2", r"o2f$"),
    "pressure": (r"approxp", r"pressure", r"pmean", r"pbar", r"patm", r"^p$", r"basinc"),
    "burn_time": (r"burntime", r"hfburtime", r"burnduration", r"flametime", r"duration"),
    "ignition": (r"hotignition", r"ignition", r"ignited"),
    "extinction": (r"selfext", r"flowterm", r"extinction", r"extmode"),
    "co2_initial": (r"initialco2", r"co2init"),
    "co2_final": (r"finalco2", r"co2final", r"^co2$"),
    "spread_coeff": (r"khot", r"kspread"),
}


def _norm_col(name: str) -> str:
    """Normalise a column name: lower case, alphanumeric characters only."""
    return re.sub(r"[^a-z0-9]", "", str(name).lower())


def _find_col(df: pd.DataFrame, patterns: Sequence[str]) -> str:
    """Return the first column name matching the patterns on its normalised form.

    Raises
    ------
    KeyError
        If no column matches.
    """
    for col in df.columns:
        norm = _norm_col(col)
        if any(re.search(p, norm) for p in patterns):
            return col
    raise KeyError(f"Column not found: {patterns}")


#: Unit hints in the header -> ``PRESSURE_UNITS`` key (priority order).
_HEADER_UNITS: tuple[tuple[str, str], ...] = (
    (r"kpa", "kpa"),
    (r"psia|psig", "psia"),
    (r"mmhg|torr", "mmhg"),
    (r"bar", "bar"),
    (r"atm", "atm"),
)


def pressure_unit_from_header(column_name: str, default: str = "kpa") -> str:
    """Extract the pressure unit from a column header.

    In NASA tables the unit lives in the header (``approx p (bar)``,
    ``pmean (atm)``, ``Pressure (kPa)``); a wrong assumption corrupts the
    coefficients, so the unit is always read from the header.

    Parameters
    ----------
    column_name : str
        Raw column header.
    default : str, default "kpa"
        Unit to use when the header carries none.

    Returns
    -------
    str
        ``PRESSURE_UNITS`` key.

    Examples
    --------
    >>> pressure_unit_from_header("approx p (bar)")
    'bar'
    >>> pressure_unit_from_header("pmean (atm)")
    'atm'
    >>> pressure_unit_from_header("Pressure")
    'kpa'
    """
    norm = _norm_col(column_name)
    for pattern, unit in _HEADER_UNITS:
        if re.search(pattern, norm):
            return unit
    return default




def detect_columns(columns: Sequence[str]) -> dict[str, str]:
    """Locate the columns required for the risk calculation in a header list.

    For each target field the ``_COLUMN_PATTERNS`` patterns are matched against
    the normalised header; the first matching column wins. This reduces the
    free-form spelling differences across PSI tables ("Calibrated initial O2 %
    by vol" / "XO2 before test" / "Oxygen") to a single schema.

    Parameters
    ----------
    columns : Sequence[str]
        CSV headers (raw).

    Returns
    -------
    dict[str, str]
        ``{target_field: actual_column_name}``; fields that are not found are
        omitted.

    Examples
    --------
    >>> detect_columns(["Fuel Sample Material", "Calibrated initial O2 % by vol"])
    {'material': 'Fuel Sample Material', 'o2_initial': 'Calibrated initial O2 % by vol'}
    """
    normalized = [(c, _norm_col(c)) for c in columns]
    found: dict[str, str] = {}
    for field_name, patterns in _COLUMN_PATTERNS.items():
        for original, norm in normalized:
            if any(re.search(p, norm) for p in patterns):
                found[field_name] = original
                break
    return found


def _numeric(series: pd.Series) -> pd.Series:
    """Convert free text to numbers; tokens such as 'none', 'OR', '>500' become NaN."""
    txt = series.astype("string").str.strip().str.replace(">", "", regex=False)
    return pd.to_numeric(txt, errors="coerce")


def _to_pct(series: pd.Series) -> pd.Series:
    """Convert O2 given as a 0–1 mole fraction to percent (threshold: 1.5)."""
    num = _numeric(series)
    if num.dropna().empty:
        return num
    if float(num.dropna().median()) <= 1.5:
        return num * 100.0
    return num


def _binary_yes(series: pd.Series) -> pd.Series:
    """Map 'yes'/'no'/'flash' text to 1/0 (flash = 0, no sustained flame)."""
    txt = series.astype("string").str.strip().str.lower()
    return txt.map({"yes": 1.0, "no": 0.0, "flash": 0.0, "y": 1.0, "n": 0.0}).astype(float)



def _query(con: Any, sql: str) -> pd.DataFrame | None:
    """Run a Feature Store query; None when the table/column is missing."""
    try:
        return con.execute(sql).df()
    except Exception:  # noqa: BLE001 - duckdb.Error (missing table/column) and friends
        return None


def _ols_log_multi(
    y: pd.Series, *xs: pd.Series
) -> tuple[float, list[float], float, int]:
    """Multivariate power-law fit: ``ln y = c0 + Σ ci·ln xi``.

    Because the oxygen percentage and the pressure are correlated in the data,
    single-variable fits are misleading (they misallocate the combined effect);
    the coefficients are therefore always estimated together.

    Parameters
    ----------
    y : pandas.Series
        Positive target (e.g. burn time [s]).
    *xs : pandas.Series
        Positive explanatory variables (e.g. O2 %, p/atm).

    Returns
    -------
    tuple[float, list[float], float, int]
        ``(c0, [c1, c2, ...], r2, n)``. With insufficient data
        ``(0.0, [0.0]*len(xs), 0.0, n)``.

    Examples
    --------
    >>> import pandas as pd
    >>> x = pd.Series([1.0, 2.0, 4.0, 8.0, 16.0])
    >>> c0, c, r2, n = _ols_log_multi(x ** 2, x)
    >>> (round(abs(c0), 6), round(c[0], 6), n)
    (0.0, 2.0, 5)
    """
    mask = y.notna() & (y > 0)
    for x in xs:
        mask &= x.notna() & (x > 0)
    n = int(mask.sum())
    if n < max(5, len(xs) + 3):
        return 0.0, [0.0] * len(xs), 0.0, n
    ly = np.log(y[mask].astype(float).to_numpy())
    cols = [np.log(x[mask].astype(float).to_numpy()) for x in xs]
    A = np.column_stack([np.ones(n)] + cols)
    beta, *_ = np.linalg.lstsq(A, ly, rcond=None)
    pred = A @ beta
    ss_tot = float(((ly - ly.mean()) ** 2).sum())
    r2 = 1.0 - float(((ly - pred) ** 2).sum()) / ss_tot if ss_tot > 0 else 0.0
    return float(beta[0]), [float(b) for b in beta[1:]], float(r2), n


def _ols_log_log(y: pd.Series, x: pd.Series) -> tuple[float, float, float, int]:
    """Single-variable ``ln y = a + b·ln x`` fit (``_ols_log_multi`` wrapper).

    Returns
    -------
    tuple[float, float, float, int]
        ``(a, b, r2, n)``. With insufficient data ``(0.0, 0.0, 0.0, n)``.
    """
    a, coefs, r2, n = _ols_log_multi(y, x)
    return a, (coefs[0] if coefs else 0.0), r2, n



def _logit_fit(y: pd.Series, x: pd.Series) -> tuple[float, float, int]:
    """Newton-Raphson logistic regression (numpy) for ``logit P = a + b·x``.

    Returns
    -------
    tuple[float, float, int]
        ``(a, b, n)``; ``(0.0, 0.0, 0)`` when the data are insufficient.
    """
    mask = y.notna() & x.notna()
    yy = y[mask].astype(float).to_numpy()
    xx = x[mask].astype(float).to_numpy()
    n = int(len(yy))
    if n < 10 or len(np.unique(yy)) < 2:
        return 0.0, 0.0, n
    A = np.column_stack([np.ones(n), xx])
    w = np.zeros(2)
    for _ in range(200):
        eta = np.clip(A @ w, -40, 40)
        mu = 1.0 / (1.0 + np.exp(-eta))
        var = np.clip(mu * (1.0 - mu), 1e-9, None)
        hess = A.T @ (A * var[:, None]) + 1e-6 * np.eye(2)
        grad = A.T @ (yy - mu)
        step = np.linalg.solve(hess, grad)
        w += step
        if float(np.abs(step).max()) < 1e-9:
            break
    return float(w[0]), float(w[1]), n


def _material_bucket(raw: str) -> str:
    """Reduce BASS-II free text to a profile key."""
    key, _fb, _alias = resolve_material(raw)
    return key




# --------------------------------------------------------------------------- #
# Empirical curves (pure functions, Streamlit-independent)
# --------------------------------------------------------------------------- #
def ignition_probability(
    oxygen_pct: float,
    pressure_kpa: float = REF_PRESSURE_KPA,
    anchors: Anchors = DEFAULT_ANCHORS,
) -> float:
    """Ignition probability P(ign) — PSI-159 CFI-G logistic fit.

    Model
    -----
    ``logit P = a + b·ln(pO2)``, a = ``ignition_logit_intercept``,
    b = ``ignition_logit_po2``, pO2 = (O2/100)·(p/101.325) [atm].

    As the oxygen partial pressure rises, the ignition probability increases and
    saturates at 1; this is the continuous counterpart of the observation that
    "higher O2 narrows the ignition threshold".

    Parameters
    ----------
    oxygen_pct : float
        Oxygen concentration [% vol].
    pressure_kpa : float, default 101.325
        Total pressure [kPa].
    anchors : Anchors, default DEFAULT_ANCHORS
        Coefficient set to use.

    Returns
    -------
    float
        Probability within [0, 1].

    Examples
    --------
    >>> round(ignition_probability(21.0), 3)
    0.667
    >>> ignition_probability(40.0) > ignition_probability(21.0)
    True
    """
    po2 = o2_partial_pressure_atm(oxygen_pct, pressure_kpa)
    if po2 <= 0:
        return 0.0
    z = anchors.ignition_logit_intercept + anchors.ignition_logit_po2 * math.log(po2)
    return _clamp(1.0 / (1.0 + math.exp(-_clip_exp(z))))


def _clip_exp(z: float, limit: float = 60.0) -> float:
    """Clip z to prevent ``exp(-z)`` overflow."""
    return float(min(max(z, -limit), limit))


def burn_time_s(
    oxygen_pct: float,
    pressure_kpa: float = REF_PRESSURE_KPA,
    anchors: Anchors = DEFAULT_ANCHORS,
) -> float:
    """Expected burn time [s] — PSI-159 CFI-G power-law fit.

    Model
    -----
    ``ln t = c0 + c1·ln(O2%) + c2·ln(p/atm)``

    c1 > 0: in the measured tests the burn time lengthens as the oxygen
    fraction rises (the flame survives longer and self-extinction decreases).
    c2 < 0: the duration shortens as the pressure rises (mass flux and
    radiative losses increase). 13.6 s at the reference (21 %, 1 atm).

    Parameters
    ----------
    oxygen_pct, pressure_kpa : float
        Atmosphere conditions.
    anchors : Anchors, default DEFAULT_ANCHORS
        Coefficient set to use.

    Returns
    -------
    float
        Burn time [s]; it stays positive even for out-of-envelope
        extrapolations.

    Examples
    --------
    >>> round(burn_time_s(21.0, 101.325), 1)
    13.6
    """
    o2 = max(float(oxygen_pct), 1e-3)
    p_atm = max(float(pressure_kpa) / REF_PRESSURE_KPA, 1e-3)
    ln_t = (anchors.burn_time_intercept
            + anchors.burn_time_o2_exp * math.log(o2)
            + anchors.burn_time_p_exp * math.log(p_atm))
    return float(math.exp(min(ln_t, 20.0)))


def spread_coefficient_mm2_s(
    oxygen_pct: float,
    pressure_kpa: float = REF_PRESSURE_KPA,
    anchors: Anchors = DEFAULT_ANCHORS,
) -> float:
    """Hot flame spread coefficient K [mm²/s] — PSI-39 ``khot`` fit.

    ``ln K = d0 + d1·ln(pO2)``. The flame spread rate is related to K and the
    sample size by ``t_b = (d0² − d_ext²)/K``; as K grows the same sample is
    consumed faster.

    Examples
    --------
    >>> round(spread_coefficient_mm2_s(21.0), 3)
    0.167
    """
    po2 = max(o2_partial_pressure_atm(oxygen_pct, pressure_kpa), 1e-6)
    ln_k = anchors.spread_intercept + anchors.spread_po2_exp * math.log(po2)
    return float(math.exp(min(ln_k, 10.0)))


def pmma_burn_probability(oxygen_pct: float, anchors: Anchors = DEFAULT_ANCHORS) -> float:
    """Probability that combustion persists in a BASS-II PMMA test (ΔCO2 > 0.1).

    ``logit P = b0 + b1·(O2% − 21)``. Note: the BASS-II matrix sweeps O2 over
    13.6–22.2 %; values above 21 % are an **extrapolation** of the fit and are
    therefore never used alone at high O2 — they are blended with
    ``ignition_probability`` (see ``RiskEngine.assess``).

    Examples
    --------
    >>> round(pmma_burn_probability(21.0), 2)
    0.73
    """
    z = anchors.burn_logit_intercept + anchors.burn_logit_o2_slope * (float(oxygen_pct) - REF_O2_PCT)
    return _clamp(1.0 / (1.0 + math.exp(-_clip_exp(z))))


def ignition_delay_s(
    oxygen_pct: float,
    pressure_kpa: float = REF_PRESSURE_KPA,
    exponent: float = IGNITION_DELAY_PO2_EXPONENT,
) -> float:
    """Ignition delay [s] — literature power law (fallback / simulation).

    ``t_ig = t_ref · (pO2 / 0.21)^(-n)``, ``t_ref = 25 s``
    (NASA-STD-6001 Test 1 igniter duration), n = 1.

    The "burn time" measured in the dataset is the lifetime of a sustained
    flame; the *ignition delay* was observed in only a limited number of BASS-II
    tests (range 0–230 s, mostly censored), so a full regression cannot be
    established. The delay is therefore modelled with a power law on the oxygen
    partial pressure: if pO2 doubles, the delay halves. This is the direct
    counterpart of the principle "an increase in oxygen narrows the ignition
    threshold exponentially" and is flagged as
    ``"ignition_delay_literature"`` in ``warnings``.

    Parameters
    ----------
    oxygen_pct, pressure_kpa : float
        Atmosphere conditions.
    exponent : float, default 1.0
        Power-law exponent n; when 0 the delay becomes independent of pO2.

    Returns
    -------
    float
        Ignition delay [s], clipped to ``[1, 600]``.

    Examples
    --------
    >>> round(ignition_delay_s(21.0, 101.325), 1)
    25.0
    >>> round(ignition_delay_s(42.0, 101.325), 1)
    12.5
    >>> ignition_delay_s(21.0, 50.66) > 25.0
    True
    """
    po2 = max(o2_partial_pressure_atm(oxygen_pct, pressure_kpa), 1e-6)
    t = REF_IGNITION_DELAY_S * (po2 / REF_PO2_ATM) ** (-float(exponent))
    return float(min(max(t, 1.0), 600.0))


def threshold_o2_pct(profile: MaterialProfile, pressure_kpa: float) -> float:
    """O2 percentage the material needs for sustainable combustion at this pressure.

    The microgravity threshold is given for 1 atm; at low pressure the **O2
    fraction** required to sustain ignition increases (it is scaled inversely so
    that pO2 stays constant) and at high pressure it decreases::

        X_th(p) = X_th(1 atm) · (101.325 / p)^0.35

    The exponent 0.35 was taken from the pressure sensitivity of the CFI-G
    ignition fit (small) and the literature trend "LOI increases as pressure
    drops".

    Examples
    --------
    >>> p = MATERIAL_PROFILES["PMMA"]
    >>> round(threshold_o2_pct(p, 101.325), 1)
    13.5
    >>> threshold_o2_pct(p, 55.0) > threshold_o2_pct(p, 101.325)
    True
    """
    ratio = REF_PRESSURE_KPA / max(float(pressure_kpa), 1e-3)
    return float(profile.threshold_o2_pct * ratio ** 0.35)


# --------------------------------------------------------------------------- #
# Material resolution (smart fallback)
# --------------------------------------------------------------------------- #
def _normalize_text(text: str) -> str:
    """Fold Turkish characters and lower-case the text."""
    s = str(text).strip().lower()
    table = str.maketrans("çğıöşüâîû", "cgiosuaiu")
    return s.translate(table)


def resolve_material(material_type: str | None) -> tuple[str, bool, str | None]:
    """Map a free-text material name to a profile.

    Matching order: (1) exact key (``"PMMA"``), (2) substring search inside
    ``aliases``, (3) smart fallback. When the material name is not recognised
    the fallback behaves **conservatively**: the PMMA profile is used and the
    result is flagged as ``fallback=True`` / ``matched=None`` so that the
    interface can raise a "this material is not in the dataset" warning.

    Parameters
    ----------
    material_type : str | None
        User input ("Nomex", "acrylic", "SIBAL 2 cm", ``None`` ...).

    Returns
    -------
    tuple[str, bool, str | None]
        ``(profile key, whether the fallback was used, matching alias)``.

    Examples
    --------
    >>> resolve_material("acrylic sheet")
    ('PMMA', False, 'acrylic')
    >>> resolve_material("unobtainium")
    ('PMMA', True, None)
    """
    if material_type is None or str(material_type).strip() == "":
        return FALLBACK_MATERIAL_KEY, True, None

    raw = _normalize_text(material_type)
    for key in MATERIAL_PROFILES:
        if raw == _normalize_text(key):
            return key, False, key

    # The longest alias is tried first: "beta cloth" > "cloth", "pu foam" > "foam"
    candidates: list[tuple[int, str, str]] = []
    for key, prof in MATERIAL_PROFILES.items():
        for alias in prof.aliases:
            a = _normalize_text(alias)
            if a and a in raw:
                candidates.append((len(a), key, alias))
    if candidates:
        candidates.sort(reverse=True)
        _, key, alias = candidates[0]
        return key, False, alias

    return FALLBACK_MATERIAL_KEY, True, None


# --------------------------------------------------------------------------- #
# Result object
# --------------------------------------------------------------------------- #
@dataclass(frozen=True)
class RiskAssessment:
    """Output of ``RiskEngine.assess`` — a single, flat data object for the UI.

    Attributes
    ----------
    oxygen_pct, pressure_kpa : float
        Input atmosphere (normalised to kPa).
    pressure_input, pressure_unit : float, str
        Raw value and unit supplied by the user (for display).
    material_key, material_label : str
        Resolved material code and human-readable name.
    material_fallback : bool
        True when the material was not found in the dataset and the
        conservative default was used.
    risk_index : float
        Critical Fire Risk Index, 0–100.
    risk_level, risk_label : str
        ``"low" | "medium" | "critical"`` and the display label
        ("Low", "Medium", "Critical").
    ignition_change_pct : float
        Percentage change in ignition time; negative = shortening (faster
        ignition, higher risk). Reference 21 % O2 / 1 atm.
    ignition_ratio, burn_time_ratio : float
        Scenario / reference duration ratios (1.0 = no change).
    ignition_probability : float
        Ignition probability from the CFI-G logistic model [0, 1].
    burn_time_s, spread_coefficient_mm2_s : float
        Duration [s] and spread coefficient [mm²/s] produced by the empirical
        curves.
    pO2_atm, equivalent_o2_pct, threshold_o2_pct, margin_pct : float
        Partial pressure [atm], sea-level-equivalent O2 [%], material threshold
        [%] and ``oxygen_pct - threshold_o2_pct``.
    components : dict[str, float]
        The 0–1 sub-components that form the index (transparency panel).
    warnings : tuple[str, ...]
        Language-independent warning codes: ``material_fallback``,
        ``inert_material``, ``below_threshold``, ``outside_envelope``,
        ``pressure_outside_envelope``, ``ignition_saturated``.
    anchors : Anchors
        Coefficient set used in the calculation.
    """

    oxygen_pct: float
    pressure_kpa: float
    pressure_input: float
    pressure_unit: str
    material_key: str
    material_label: str
    material_fallback: bool
    risk_index: float
    risk_level: str
    risk_label: str
    ignition_change_pct: float
    ignition_ratio: float
    ignition_delay_s: float
    burn_time_change_pct: float
    burn_time_ratio: float
    ignition_probability: float
    burn_time_s: float
    spread_coefficient_mm2_s: float
    pO2_atm: float
    equivalent_o2_pct: float
    threshold_o2_pct: float
    margin_pct: float
    components: dict[str, float] = field(default_factory=dict)
    warnings: tuple[str, ...] = ()
    anchors: Anchors = DEFAULT_ANCHORS

    # ------------------------------------------------------------------ #
    def as_dict(self) -> dict[str, Any]:
        """Flat dictionary (for ``st.json``, the JSON API and tests)."""
        return {
            "oxygen_pct": self.oxygen_pct,
            "pressure_kpa": self.pressure_kpa,
            "pressure_input": self.pressure_input,
            "pressure_unit": self.pressure_unit,
            "material_key": self.material_key,
            "material_label": self.material_label,
            "material_fallback": self.material_fallback,
            "risk_index": self.risk_index,
            "risk_level": self.risk_level,
            "risk_label": self.risk_label,
            "ignition_change_pct": self.ignition_change_pct,
            "ignition_ratio": self.ignition_ratio,
            "ignition_delay_s": self.ignition_delay_s,
            "burn_time_change_pct": self.burn_time_change_pct,
            "burn_time_ratio": self.burn_time_ratio,
            "ignition_probability": self.ignition_probability,
            "burn_time_s": self.burn_time_s,
            "spread_coefficient_mm2_s": self.spread_coefficient_mm2_s,
            "pO2_atm": self.pO2_atm,
            "equivalent_o2_pct": self.equivalent_o2_pct,
            "threshold_o2_pct": self.threshold_o2_pct,
            "margin_pct": self.margin_pct,
            "components": dict(self.components),
            "warnings": list(self.warnings),
        }

    def summary(self) -> str:
        """Single-line summary (log / card title / terminal).

        An ASCII arrow keeps the text safe on Windows consoles (cp1254).
        """
        return (
            f"{self.material_label}: O2 %{self.oxygen_pct:.1f}, "
            f"{self.pressure_kpa:.1f} kPa (pO2 {self.pO2_atm:.2f} atm) -> "
            f"risk {self.risk_index:.1f}/100 ({self.risk_label}), "
            f"ignition-time change {self.ignition_change_pct:+.1f} %"
        )



# --------------------------------------------------------------------------- #
# Main engine
# --------------------------------------------------------------------------- #
#: Default weights of the risk-index components (sum 1.00).
#:   oxygen   : pO2 escalation (the common axis of all curves, log scale)
#:   ignition : ignition probability (PSI-159 CFI-G logistic)
#:   duration : burn-time lengthening (PSI-159 CFI-G power law)
#:   spread   : flame spread coefficient increase (PSI-39 khot)
#:   margin   : how far the material threshold is exceeded (BASS-II / LOI)
#:   material : burn share of the material in BASS-II (ΔCO2 observation)
RISK_WEIGHTS: dict[str, float] = {
    "oxygen": 0.15,
    "ignition": 0.25,
    "duration": 0.15,
    "spread": 0.10,
    "margin": 0.25,
    "material": 0.10,
}

#: Index -> level thresholds (inclusive).
RISK_THRESHOLDS = {"medium": 35.0, "critical": 65.0}


def risk_level_for(index: float) -> str:
    """Convert a risk index into a level code.

    Thresholds: ``index < 35`` → ``"low"``, ``35 ≤ index < 65`` → ``"medium"``,
    ``index ≥ 65`` → ``"critical"``.

    Examples
    --------
    >>> [risk_level_for(v) for v in (10, 35, 64.9, 65, 90)]
    ['low', 'medium', 'medium', 'critical', 'critical']
    """
    x = float(index)
    if x >= RISK_THRESHOLDS["critical"]:
        return "critical"
    if x >= RISK_THRESHOLDS["medium"]:
        return "medium"
    return "low"


class RiskEngine:
    """Oxygen / pressure / material -> Critical Fire Risk Index engine.

    The class holds the fitted empirical coefficients (``Anchors``) and the
    material profiles; the calculation is fully deterministic (no randomness),
    so it is safe for tests and for Streamlit caching.

    Parameters
    ----------
    anchors : Anchors | None, default None
        Coefficient set. ``None`` → ``Anchors.default()`` (in-code fits).
        A set refreshed from data can be supplied via ``Anchors.from_feature_store(...)``.
    weights : Mapping[str, float] | None, default None
        Component weights; they are normalised to sum to 1. ``None`` →
        ``RISK_WEIGHTS``.
    thresholds : Mapping[str, float] | None, default None
        Level thresholds (``medium``, ``critical``). ``None`` →
        ``RISK_THRESHOLDS``.

    Attributes
    ----------
    anchors : Anchors
        Active coefficient set.
    weights : dict[str, float]
        Normalised weights.

    Examples
    --------
    >>> eng = RiskEngine()
    >>> r = eng.assess(30.0, 101.3, "Nomex")
    >>> 0.0 <= r.risk_index <= 100.0
    True
    >>> r.risk_level in RISK_LEVELS
    True
    """

    def __init__(
        self,
        anchors: Anchors | None = None,
        weights: Mapping[str, float] | None = None,
        thresholds: Mapping[str, float] | None = None,
    ) -> None:
        self.anchors = anchors or DEFAULT_ANCHORS
        w = dict(weights or RISK_WEIGHTS)
        missing = set(RISK_WEIGHTS) - set(w)
        if missing:
            raise ValueError(f"Missing weight(s): {sorted(missing)}")
        total = float(sum(w.values()))
        if total <= 0:
            raise ValueError("The sum of the weights must be positive")
        self.weights = {k: float(v) / total for k, v in w.items()}
        self.thresholds = dict(thresholds or RISK_THRESHOLDS)
        if not 0 < self.thresholds["medium"] < self.thresholds["critical"] < 100:
            raise ValueError("Thresholds must satisfy 0 < medium < critical < 100")

        # Reference values: 21 % O2, 1 atm, PMMA profile.
        self._ref_burn = burn_time_s(REF_O2_PCT, REF_PRESSURE_KPA, self.anchors)
        self._ref_spread = spread_coefficient_mm2_s(REF_O2_PCT, REF_PRESSURE_KPA, self.anchors)

    # ------------------------------------------------------------------ #
    # Convenience accessors
    # ------------------------------------------------------------------ #
    @property
    def reference_burn_time_s(self) -> float:
        """Reference burn time (21 %, 1 atm) [s]."""
        return self._ref_burn

    @property
    def reference_spread_mm2_s(self) -> float:
        """Reference spread coefficient (21 %, 1 atm) [mm²/s]."""
        return self._ref_spread

    @staticmethod
    def available_materials() -> list[str]:
        """Material keys for the interface drop-down."""
        return list(MATERIAL_PROFILES)

    @staticmethod
    def material_label(key: str) -> str:
        """Human-readable name of the material code."""
        return MATERIAL_PROFILES.get(key, MATERIAL_PROFILES[FALLBACK_MATERIAL_KEY]).label

    def _level(self, index: float) -> str:
        if index >= self.thresholds["critical"]:
            return "critical"
        if index >= self.thresholds["medium"]:
            return "medium"
        return "low"

    # ------------------------------------------------------------------ #
    # Main calculation
    # ------------------------------------------------------------------ #
    def assess(
        self,
        oxygen_pct: float,
        pressure: float = REF_PRESSURE_KPA,
        material_type: str | None = FALLBACK_MATERIAL_KEY,
        pressure_unit: str = "kPa",
        *,
        extrapolate: bool = True,
    ) -> RiskAssessment:
        """Compute the risk index for a cabin atmosphere.

        Parameters
        ----------
        oxygen_pct : float
            Oxygen concentration [% vol]. Design envelope 21–40 %; values
            outside it are computed when ``extrapolate=True`` together with an
            ``outside_envelope`` warning, otherwise a ``ValueError`` is raised.
        pressure : float, default 101.325
            Total pressure; its unit is given by ``pressure_unit``.
        material_type : str | None, default "PMMA"
            Free-text material name. If not recognised the smart fallback takes
            over (see ``resolve_material``) and a ``material_fallback`` warning
            is added.
        pressure_unit : str, default "kPa"
            ``"kPa"``, ``"atm"``, ``"bar"``, ``"psia"``, ``"mmHg"``.
        extrapolate : bool, default True
            Allow going outside the O2 envelope.

        Returns
        -------
        RiskAssessment
            Index, level, ignition-time change and component breakdown.

        Raises
        ------
        ValueError
            O2 outside the envelope and ``extrapolate=False``; or an invalid
            pressure/unit.

        Examples
        --------
        >>> eng = RiskEngine()
        >>> r = eng.assess(21.0, 1.0, "PMMA", pressure_unit="atm")
        >>> round(r.pO2_atm, 2), r.risk_level
        (0.21, 'low')
        >>> eng.assess(40.0, 101.3, "SIBAL").risk_level in RISK_LEVELS
        True
        """
        o2 = float(oxygen_pct)
        if not math.isfinite(o2) or o2 <= 0:
            raise ValueError(f"Oxygen percentage must be positive: {oxygen_pct!r}")
        p_kpa = to_kpa(pressure, pressure_unit)

        lo, hi = O2_ENVELOPE
        outside = not (lo <= o2 <= hi)
        if outside and not extrapolate:
            raise ValueError(f"O2 %{o2:.1f} is outside the design envelope ({lo:.0f}–{hi:.0f} %)")

        key, fallback, _matched = resolve_material(material_type)
        prof = self.anchors.profile(key)
        warnings: list[str] = []
        if fallback:
            warnings.append("material_fallback")
        if outside:
            warnings.append("outside_envelope")
        if not (PRESSURE_ENVELOPE_KPA[0] <= p_kpa <= PRESSURE_ENVELOPE_KPA[1]):
            warnings.append("pressure_outside_envelope")

        # --- empirical curves ------------------------------------------ #
        po2 = o2_partial_pressure_atm(o2, p_kpa)
        dur_mult = max(prof.duration_multiplier, 0.0)

        # --- components (0–1) ------------------------------------------ #
        # KEY DESIGN DECISION: every component is computed from the oxygen
        # PARTIAL PRESSURE (pO2) (Architecture.md §Severity engine: ignition and
        # spread depend far more on pO2 than on total pressure). Hence 34 % O2 @
        # 8.2 psia (pO2 = 0.19 atm) and 19 % O2 @ 1 atm score the same.
        # Calibration: reference pO2 = 0.21 -> 0, envelope top pO2 = 0.40 -> 1.
        # pO2 > 1 atm (e.g. 100 % O2 @ 3 atm) lies outside the valid range of
        # the curves and is clipped to the 100 % equivalent due to saturation.
        o2_eq = min(po2, 1.0) * 100.0              # sea-level-equivalent O2 %

        def _norm_mask(value: float, ref: float, ceiling: float) -> float:
            """Map ``value`` linearly so that ref→0 and ceiling→1."""
            if ceiling <= ref:
                return 0.0
            return _clamp((value - ref) / (ceiling - ref))

        ln_lo = math.log(REF_PO2_ATM)
        ln_hi = math.log(CEILING_PO2_ATM)
        c_po2 = _clamp((math.log(max(po2, 1e-6)) - ln_lo) / (ln_hi - ln_lo))

        # 1) Ignition: CFI-G logistic (evaluated at the 1 atm equivalent).
        p_ign_eq = ignition_probability(o2_eq, REF_PRESSURE_KPA, self.anchors)
        p_ref_ign = ignition_probability(REF_O2_PCT, REF_PRESSURE_KPA, self.anchors)
        p_ceil_ign = ignition_probability(CEILING_O2_PCT, REF_PRESSURE_KPA, self.anchors)
        c_ign = _norm_mask(p_ign_eq, p_ref_ign, p_ceil_ign)

        # 2) Burn-time lengthening (log ratio): CFI-G power law.
        t_eq = burn_time_s(o2_eq, REF_PRESSURE_KPA, self.anchors) * dur_mult
        t_ceil = burn_time_s(CEILING_O2_PCT, REF_PRESSURE_KPA, self.anchors) * dur_mult
        ratio_t = t_eq / self._ref_burn if self._ref_burn > 0 else 1.0
        c_dur = _clamp(math.log(max(ratio_t, 1e-6))
                       / math.log(max(t_ceil / self._ref_burn, 1.0001)))


        # 3) Flame spread coefficient (PSI-39 khot) log ratio.
        k_eq = spread_coefficient_mm2_s(o2_eq, REF_PRESSURE_KPA, self.anchors)
        k_ceil = spread_coefficient_mm2_s(CEILING_O2_PCT, REF_PRESSURE_KPA, self.anchors)
        ratio_k = k_eq / self._ref_spread if self._ref_spread > 0 else 1.0
        c_spread = _clamp(math.log(max(ratio_k, 1e-6))
                          / math.log(max(k_ceil / self._ref_spread, 1.0001)))

        # 4) Threshold margin: expressed in pO2, excess over the PMMA reference
        #    margin. The anchors are pinned to PMMA so that harder-to-burn
        #    materials (SIBAL, Nomex) score lower at the same pO2. The material
        #    threshold is scaled with pressure, hence converted to a pO2 value.
        thr = threshold_o2_pct(prof, p_kpa)
        margin = o2 - thr
        thr_po2 = thr / 100.0 * p_kpa / REF_PRESSURE_KPA
        margin_po2 = po2 - thr_po2
        ref_margin_po2 = REF_PO2_ATM - PMMA_THRESHOLD_PCT / 100.0
        ceil_margin_po2 = CEILING_PO2_ATM - PMMA_THRESHOLD_PCT / 100.0
        c_margin = _norm_mask(margin_po2, ref_margin_po2,
                              max(ceil_margin_po2, ref_margin_po2 + 1e-6))
        if margin <= 0:
            warnings.append("below_threshold")


        # 5) Material burn share (BASS-II ΔCO2 observation); PMMA logistic if no data.
        share = prof.burn_share if prof.burn_share is not None else pmma_burn_probability(o2, self.anchors)
        c_mat = _clamp(share) * c_po2

        components = {
            "oxygen": round(c_po2, 4),
            "ignition": round(c_ign, 4),
            "duration": round(c_dur, 4),
            "spread": round(c_spread, 4),
            "margin": round(c_margin, 4),
            "material": round(c_mat, 4),
        }
        raw = sum(self.weights[k] * v for k, v in components.items())
        index = round(_clamp(raw) * 100.0, 1)
        level = self._level(index)

        # Inert material (metal/glass/ceramic): the index is forced to zero.
        if prof.inert:
            components = {k: 0.0 for k in components}
            index, level = 0.0, "low"
            warnings.append("inert_material")

        # --- percentage change in ignition delay (shortening) ---------- #
        t_ig = ignition_delay_s(o2, p_kpa)
        ig_ratio = t_ig / REF_IGNITION_DELAY_S
        ignite_change = (ig_ratio - 1.0) * 100.0     # negative = shortening

        # --- physical (reported) quantities: at the real O2 and pressure --- #
        t_burn = burn_time_s(o2, p_kpa, self.anchors) * dur_mult
        k_spread = spread_coefficient_mm2_s(o2, p_kpa, self.anchors)
        t_burn_ref = self._ref_burn * dur_mult
        burn_ratio_phys = t_burn / t_burn_ref if t_burn_ref > 0 else 1.0
        burn_change = (burn_ratio_phys - 1.0) * 100.0

        if p_ign_eq >= p_ceil_ign:
            warnings.append("ignition_saturated")

        return RiskAssessment(
            oxygen_pct=o2,
            pressure_kpa=round(p_kpa, 3),
            pressure_input=float(pressure),
            pressure_unit=str(pressure_unit),
            material_key=key,
            material_label=prof.label,
            material_fallback=fallback,
            risk_index=index,
            risk_level=level,
            risk_label=RISK_LEVEL_LABELS[level],
            ignition_change_pct=round(ignite_change, 1),
            ignition_ratio=round(ig_ratio, 4),
            ignition_delay_s=round(t_ig, 2),
            burn_time_change_pct=round(burn_change, 1),
            burn_time_ratio=round(burn_ratio_phys, 4),
            ignition_probability=round(p_ign_eq, 4),
            burn_time_s=round(t_burn, 2),
            spread_coefficient_mm2_s=round(k_spread, 4),
            pO2_atm=round(po2, 4),
            equivalent_o2_pct=round(equivalent_sea_level_o2_pct(o2, p_kpa), 2),
            threshold_o2_pct=round(thr, 2),
            margin_pct=round(margin, 2),
            components=components,
            warnings=tuple(warnings),
            anchors=self.anchors,
        )



# --------------------------------------------------------------------------- #
# Module-level convenience API (Streamlit / API)
# --------------------------------------------------------------------------- #
@lru_cache(maxsize=1)
def default_engine() -> RiskEngine:
    """Singleton ``RiskEngine`` built from the in-code coefficients (cached).

    Avoids rebuilding the engine on every Streamlit interaction.

    Examples
    --------
    >>> default_engine() is default_engine()
    True
    """
    return RiskEngine()


def assess_risk(
    oxygen_pct: float,
    pressure: float = REF_PRESSURE_KPA,
    material_type: str = FALLBACK_MATERIAL_KEY,
    pressure_unit: str = "kPa",
) -> RiskAssessment:
    """One-line risk assessment (wrapper around ``RiskEngine.assess``).

    Shortest usage in Streamlit::

        from src.risk.engine import assess_risk
        r = assess_risk(30.0, 8.2, "Nomex", pressure_unit="psia")
        st.metric("Risk index", r.risk_index, r.risk_label)

    Parameters
    ----------
    oxygen_pct, pressure, material_type, pressure_unit
        Same as ``RiskEngine.assess``.

    Returns
    -------
    RiskAssessment

    Examples
    --------
    >>> assess_risk(21.0).risk_label
    'Low'
    >>> assess_risk(40.0, 101.3, "PMMA").risk_level
    'critical'
    """
    return default_engine().assess(oxygen_pct, pressure, material_type, pressure_unit)


def risk_curve(
    material_type: str = FALLBACK_MATERIAL_KEY,
    pressure: float = REF_PRESSURE_KPA,
    pressure_unit: str = "kPa",
    o2_range: tuple[float, float] = O2_ENVELOPE,
    steps: int = 41,
) -> pd.DataFrame:
    """O2 sweep for the interface chart (risk curve).

    Parameters
    ----------
    material_type : str, default "PMMA"
        Material name (fallback included).
    pressure, pressure_unit : float, str
        Constant pressure and its unit.
    o2_range : tuple[float, float], default (21, 40)
        O2 range to sweep [%].
    steps : int, default 41
        Number of samples (at least 2).

    Returns
    -------
    pandas.DataFrame
        Columns: ``o2_pct``, ``risk_index``, ``risk_level``,
        ``ignition_delay_s``, ``ignition_change_pct``, ``burn_time_s``,
        ``pO2_atm``, ``threshold_o2_pct``.

    Examples
    --------
    >>> df = risk_curve("PMMA", steps=5)
    >>> list(df.columns)[:3]
    ['o2_pct', 'risk_index', 'risk_level']
    >>> len(df)
    5
    """
    n = max(int(steps), 2)
    lo, hi = o2_range
    grid = np.linspace(float(lo), float(hi), n)
    engine = default_engine()
    rows = []
    for o2 in grid:
        r = engine.assess(float(o2), pressure, material_type, pressure_unit)
        rows.append({
            "o2_pct": round(float(o2), 2),
            "risk_index": r.risk_index,
            "risk_level": r.risk_level,
            "ignition_delay_s": r.ignition_delay_s,
            "ignition_change_pct": r.ignition_change_pct,
            "burn_time_s": r.burn_time_s,
            "pO2_atm": r.pO2_atm,
            "threshold_o2_pct": r.threshold_o2_pct,
        })
    return pd.DataFrame(rows)


def material_table() -> pd.DataFrame:
    """Summary table of the material profiles (for the "material card" UI).

    Returns
    -------
    pandas.DataFrame
        Columns ``key, label, loi_pct, threshold_o2_pct, burn_share, n_tests,
        duration_multiplier, inert, source``.

    Examples
    --------
    >>> "PMMA" in set(material_table()["key"])
    True
    """
    rows = [{
        "key": p.key,
        "label": p.label,
        "loi_pct": p.loi_pct,
        "threshold_o2_pct": p.threshold_o2_pct,
        "burn_share": p.burn_share,
        "n_tests": p.n_tests,
        "duration_multiplier": p.duration_multiplier,
        "inert": p.inert,
        "source": p.source,
    } for p in MATERIAL_PROFILES.values()]
    return pd.DataFrame(rows)


__all__ = [
    "Anchors",
    "DEFAULT_ANCHORS",
    "FALLBACK_MATERIAL_KEY",
    "IGNITION_DELAY_PO2_EXPONENT",
    "MATERIAL_PROFILES",
    "MaterialProfile",
    "O2_ENVELOPE",
    "PRESSURE_UNITS",
    "REF_IGNITION_DELAY_S",
    "REF_O2_PCT",
    "REF_PRESSURE_KPA",
    "RISK_LEVELS",
    "RISK_LEVEL_LABELS",
    "RISK_THRESHOLDS",
    "RISK_WEIGHTS",
    "RiskAssessment",
    "RiskEngine",
    "assess_risk",
    "burn_time_s",
    "default_engine",
    "detect_columns",
    "equivalent_sea_level_o2_pct",
    "ignition_delay_s",
    "ignition_probability",
    "material_table",
    "o2_partial_pressure_atm",
    "pmma_burn_probability",
    "pressure_unit_from_header",
    "resolve_material",
    "risk_curve",
    "risk_level_for",
    "spread_coefficient_mm2_s",
    "threshold_o2_pct",
    "to_kpa",
]








