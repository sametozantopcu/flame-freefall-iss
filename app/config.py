"""Central configuration: paths, physical constants, operational thresholds,
hardware calibration.

Every scientific constant lives in one place, so a correction coming from a
report is applied only here and propagates to the whole interface.
"""
from __future__ import annotations

from pathlib import Path

# --------------------------------------------------------------------------- #
# Yollar
# --------------------------------------------------------------------------- #
ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / "src"
DATA_PATH = ROOT / "data" / "processed" / "bass2_clean.csv"
MODELS_DIR = ROOT / "models"
MODEL_EXTENSIONS = (".joblib", ".pkl", ".pickle")

# --------------------------------------------------------------------------- #
# Data schema (kept in sync with src/features.py)
# --------------------------------------------------------------------------- #
TARGET_COL = "Extinction"   # 1 = flame extinguished itself, 0 = burning continued
GROUP_COL = "Sample_No"     # one sample spans several tests -> GroupKFold
REQUIRED_COLS = ["O2_initial", "O2_final", "CO2", "CO", "Thickness", "Flow_Vel"]
N_ISS_TESTS = 129

# --------------------------------------------------------------------------- #
# Physics: Olson U-shaped flammability limit (BASS-II Summary Report)
#   X_O2 = 6 exp(-0.5 a) + 0.0167 a + 13.4        [% hacim O2]
#   a    = 1.5 (U / r) (r / 0.318)^0.5            [1/s], U [cm/s], r [cm]
# --------------------------------------------------------------------------- #
OLSON_A = 6.0
OLSON_B = 0.5
OLSON_C = 0.0167
OLSON_D = 13.4
R_REF_CM = 0.318            # 1/8 inch reference radius

# Huggett oxygen-consumption calorimetry
HUGGETT_KJ_PER_G_O2 = 13.1
MSG_VOLUME_L = 250.0        # internal volume of the Microgravity Science Glovebox
M_O2_G_MOL = 32.0
R_GAS = 8.314462618         # J/(mol K)
STD_P_KPA = 101.325
STD_T_K = 298.15

# --------------------------------------------------------------------------- #
# Operational thresholds
# --------------------------------------------------------------------------- #
HRR_WINDOW_DAMAGE_W = 100.0     # level that damaged the MSG front window in test M5
HRR_CAUTION_W = 60.0
CO_SENSOR_SAT_PPM = 1000.0      # CO sensor saturation
CO_CAUTION_PPM = 500.0
EARTH_PMMA_LOI_PCT = 15.4       # O2 level at which PMMA self-extinguishes on Earth
MICROG_PMMA_LIMIT_PCT = 13.5    # BASS-II: lowest O2 sustaining combustion at low flow
STD6001_IGNITION_S = 25.0       # NASA-STD-6001 Test 1 igniter duration
BASS2_MAX_IGNITION_S = 230.0    # longest ignition delay observed in BASS-II
GOLDILOCKS_CM_S = (1.0, 5.0)    # cabin-ventilation "Goldilocks" band
CO_MAX_ENHANCEMENT = 10.0       # ~10x CO versus Earth near the limit

# --------------------------------------------------------------------------- #
# MSG fan kalibrasyonu — Restrictor 2
# Source: NASA "Fan calibration data.xlsx" (full table transcribed into the team
# NOTES.pdf). Nominal flow = midpoint of the measured interval; the interval is
# shown in the interface as an uncertainty band. Linear interpolation between
# anchors; values beyond the table are flagged as "extrapolation".
# --------------------------------------------------------------------------- #
FAN_CAL_RESTRICTOR_2 = [
    # (pot, voltage [V], nominal [cm/s], low [cm/s], high [cm/s])
    (0.35, 3.80, 0.00, 0.0, 0.0),     # zero-flow threshold: Pot <= 0.35 or V <= 3.8
    (0.50, 4.20, 0.50, 0.5, 0.5),
    (1.00, 4.65, 1.75, 1.0, 2.5),
    (2.00, 5.50, 4.50, 4.0, 5.0),
    (4.00, 7.20, 8.00, 7.0, 9.0),
    (6.00, 8.85, 11.75, 10.5, 13.0),
    (8.00, 10.50, 15.75, 14.5, 17.0),
    (10.00, 12.20, 20.00, 18.0, 22.0),
]
FAN_POT_MAX = 10.0
FAN_V_MAX = 12.5

# --------------------------------------------------------------------------- #
# Cabin atmosphere presets (O2 %, total pressure kPa)
# --------------------------------------------------------------------------- #
# Keys are language-independent codes; the labels live in app/i18n.py (atm.<code>).
ATMOSPHERES = {
    "iss": (21.0, 101.3),
    "exploration": (34.0, 56.5),       # 8.2 psia
    "gateway": (26.5, 70.3),           # 10.2 psia
    "bass_low_o2": (16.0, 101.3),
    "bass_limit": (14.0, 101.3),
    "custom": None,
}

# Simulation codes; display labels in app/i18n.py (mat.<code>, geo.<code>).
# Free-text values coming from the real data are shown verbatim.
MATERIALS = ["PMMA", "Delrin (POM)", "Ultem 1000", "Cotton/Fiberglass fabric"]
GEOMETRIES = ["sphere", "cylinder", "flat"]
