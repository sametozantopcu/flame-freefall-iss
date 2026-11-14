"""Shared fixtures for the data-layer tests (plans/00_data_layer)."""
import sys
from pathlib import Path

import pandas as pd
import pytest

REPO = Path(__file__).resolve().parents[2]
ANALYSIS = REPO / "data_analysis" / "Nasa_data" / "analysis"
DATA = ANALYSIS / "data"
OUT = ANALYSIS / "outputs"
sys.path.insert(0, str(REPO))  # `src.data_layer` (SPEC lives in src/data_layer/spec.py since step C1)

TABLES = ["acme_normal", "acme_inverse", "acme_testdays", "flex", "bass2", "smoke",
          "cfi", "saffire1", "saffire2", "saffire3", "spice"]


@pytest.fixture(scope="session")
def tables():
    """All parquet tables. Missing files FAIL (never skip) so a box cannot be ticked by accident."""
    missing = [t for t in TABLES if not (DATA / f"{t}.parquet").exists()]
    assert not missing, f"missing parquet tables: {missing}"
    return {t: pd.read_parquet(DATA / f"{t}.parquet") for t in TABLES}
