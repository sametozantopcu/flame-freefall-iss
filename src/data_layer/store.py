"""Feature Store (plans/00_data_layer, step C2): one DuckDB view per cleaned parquet table.

`connect()` registers the views itself on every call using absolute paths derived from this file, so it works
from any working directory (a DuckDB view with a relative parquet path breaks when opened from another folder).
`build()` additionally writes a .duckdb file for external SQL tools; it is git-ignored and regenerated at will.

    python -m src.data_layer.store build [out.duckdb]
"""
from __future__ import annotations

import sys
from pathlib import Path

import duckdb
import pandas as pd

from .spec import TIER1, TIER2, unit_of

REPO = Path(__file__).resolve().parents[2]
DATA_DIR = REPO / "data_analysis" / "Nasa_data" / "analysis" / "data"
DEFAULT_DB = REPO / "data_analysis" / "Nasa_data" / "feature_store.duckdb"
TABLES = TIER1 + TIER2          # 11 tables; names come from spec.py, never typed by hand
CATALOG_CSV = DATA_DIR.parent / "outputs" / "feature_catalog.csv"   # covers the 6 Tier-1 tables only
EXTRA_VIEWS = ["catalog", "units"]


def parquet_path(table: str) -> Path:
    return DATA_DIR / f"{table}.parquet"


def _register_views(con: duckdb.DuckDBPyConnection) -> None:
    missing = [t for t in TABLES if not parquet_path(t).exists()]
    if missing:
        raise FileNotFoundError(f"parquet tables missing in {DATA_DIR}: {missing} "
                                "(run analysis/scripts/01_load_core.py)")
    for t in TABLES:
        con.execute(f"CREATE OR REPLACE VIEW {t} AS SELECT * FROM read_parquet('{parquet_path(t).as_posix()}')")
    if not CATALOG_CSV.exists():
        raise FileNotFoundError(f"feature catalog missing: {CATALOG_CSV} (run analysis/scripts/07_catalog.py)")
    con.execute(f"CREATE OR REPLACE VIEW catalog AS SELECT * FROM read_csv('{CATALOG_CSV.as_posix()}', header=true, "
                "types={'missing_pct': 'DOUBLE', 'n_unique': 'BIGINT'})")
    # `units` is materialised (not a file view): a persisted .duckdb stays self-contained for this table
    con.register("_units_df", units_frame())
    con.execute("CREATE OR REPLACE TABLE units AS SELECT * FROM _units_df")
    con.unregister("_units_df")


def units_frame() -> pd.DataFrame:
    """(dataset, column, unit, is_numeric) for every column of the 11 tables. Unit comes from spec.unit_of
    (single source); unknown -> 'unit_unknown'. Categorical columns have no unit and stay 'unit_unknown'."""
    rows = []
    for t in TABLES:
        for c, dt in pd.read_parquet(parquet_path(t)).dtypes.items():
            rows.append((t, c, unit_of(c), bool(pd.api.types.is_numeric_dtype(dt) and not pd.api.types.is_bool_dtype(dt))))
    return pd.DataFrame(rows, columns=["dataset", "column", "unit", "is_numeric"])


def connect(db_path: str | Path | None = None) -> duckdb.DuckDBPyConnection:
    """In-memory store by default (or `db_path`); views are (re)created on every call."""
    con = duckdb.connect(str(db_path) if db_path else ":memory:")
    _register_views(con)
    return con


def build(out_path: str | Path = DEFAULT_DB) -> Path:
    """Write the store to a file. Idempotent: existing views are replaced."""
    out = Path(out_path)
    out.parent.mkdir(parents=True, exist_ok=True)
    connect(out).close()
    return out


if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] != "build":
        sys.exit("usage: python -m src.data_layer.store build [out.duckdb]")
    p = build(*sys.argv[2:3])
    with duckdb.connect(str(p), read_only=True) as c:
        n = c.execute("SELECT count(*) FROM duckdb_views() WHERE NOT internal").fetchone()[0] + 1  # + units table
    print(f"wrote {p} ({n} views)")
