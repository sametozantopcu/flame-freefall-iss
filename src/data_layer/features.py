"""get_features (plans/00_data_layer, step C4): the model-input columns of a table for one target.

Rule: catalog role == 'feature', minus the target's leakage list (spec.SPEC is the source of truth), minus the target
itself and the other targets of the same table. With today's catalog the subtraction removes nothing (leakage columns
are already role=leakage); it is a guard that keeps leakage out even if the catalog or SPEC drifts.
"""
from __future__ import annotations

import duckdb

from .spec import SPEC
from .store import connect


def _check(table: str, target: str) -> None:
    if table not in SPEC:
        raise ValueError(f"unknown or target-less table {table!r}; valid: {sorted(SPEC)}")
    if target not in SPEC[table]["targets"]:
        raise ValueError(f"unknown target {target!r} for {table!r}; valid: {sorted(SPEC[table]['targets'])}")


def get_features(table: str, target: str, con: duckdb.DuckDBPyConnection | None = None) -> list[str]:
    """Feature columns (parquet column order) usable to model `target` of `table`, leakage removed."""
    _check(table, target)
    own = con is None
    con = con or connect()
    try:
        order = [r[0] for r in con.execute(f"DESCRIBE {table}").fetchall()]
        feats = {r[0] for r in con.execute("SELECT \"column\" FROM catalog WHERE dataset = ? AND role = 'feature'",
                                           [table]).fetchall()}
    finally:
        if own:
            con.close()
    banned = set(SPEC[table]["leakage"][target]) | set(SPEC[table]["targets"])   # leakage + target + other targets
    return [c for c in order if c in feats and c not in banned]
