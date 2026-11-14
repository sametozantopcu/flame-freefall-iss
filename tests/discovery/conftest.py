"""Shared paths for the M1 discovery tests (plans/01_m1_discovery)."""
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
OUT = REPO / "data_analysis" / "Nasa_data" / "analysis" / "outputs"
sys.path.insert(0, str(REPO))
