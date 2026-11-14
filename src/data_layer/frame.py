"""get_modeling_frame (plans/00_data_layer, step C5): rows + features + target + groups + trace for one target.

The target's subset query lives only in spec.SPEC (applied via spec.target_frame). Columns used only to filter
(e.g. hot_ignition, o2_final_anomaly_flag) are NOT returned. Values are never filled or transformed: missing stays
missing, targets keep their source dtype (binary/categorical encoding is the modeller's job).

`df.attrs` carries target/task/features/groups as a convenience for the grouped-CV splitter; pandas drops attrs in
some operations, so treat it as a convenience, not a contract.
"""
from __future__ import annotations

import duckdb
import pandas as pd

from .features import _check, get_features
from .spec import SPEC, TRACE, target_frame
from .store import connect


def get_modeling_frame(table: str, target: str, con: duckdb.DuckDBPyConnection | None = None) -> pd.DataFrame:
    _check(table, target)
    own = con is None
    con = con or connect()
    try:
        full = con.execute(f"SELECT * FROM {table}").df()
        feats = get_features(table, target, con)
    finally:
        if own:
            con.close()
    s = SPEC[table]
    groups = list(s["groups"])
    cols = list(dict.fromkeys(TRACE + [target] + feats + groups))        # order kept, duplicates dropped
    out = target_frame(table, target, full)[cols].reset_index(drop=True)
    out.attrs.update(target=target, task=s["targets"][target]["task"], features=feats, groups=groups)
    return out
