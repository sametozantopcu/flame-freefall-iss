"""Shared paths for the M2 prediction tests (plans/02_m2_prediction)."""
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
OUT = REPO / "data_analysis" / "Nasa_data" / "analysis" / "outputs"
sys.path.insert(0, str(REPO))
