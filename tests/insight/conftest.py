"""Paths for the M3 insight tests (plans/mvp, step S4)."""
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO))
