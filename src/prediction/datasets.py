"""Modeling datasets (plans/02_m2_prediction, step A1): four faithful, traceable tables for other teams and for M2.

    python -m src.prediction.datasets build [out_dir]      # default data/modeling/ (git-ignored, reproducible): .parquet + .csv

Rules
- Rows of a family are unioned; every row keeps psi_id/source_file/source_row and gets `source_table`.
- Only columns that are the SAME physical quantity share a name across sources (declared in `shared`; any other name
  clash raises). Different quantities stay separate and are empty for the other source (gas flame: `xo2_init` of normal
  flames vs `xo2` of inverse flames).
- Droplet targets are NOT merged (FLEX burn_rate_K_mm2_s vs CFI k_hot_mm2_s): equating them is a modelling decision.
- `in_subset__<target>` (bool) says on which rows a target is defined (SPEC subset query). It is a row selector, not a
  feature; the filter columns behind it (e.g. o2_final_anomaly_flag) are not part of the dataset. False on rows of a
  source that does not have that target.
- Columns = trace + source_table + extra descriptive source columns (gas flame: flame_type, from the source table)
  + features + groups + targets + masks. `cv_group` names the grouped-CV key (02/C1); it must be complete. Measured outputs that are leakage
  for a target (xo2_final, peak temperatures, comments, ...) never enter. Targets of the same family are leakage for
  each other; they are present but explicitly marked as targets.
- Nothing is filled or transformed: missing stays missing (CFI has no x_co2 column -> empty, never 0).
- Censoring labels (step A2), nullable boolean, NA whenever unknown (never False by default). They are labels for
  survival / truncation-aware models, not features:
    gas_flame.burn_time_censored  = ext_mode == 'FT' (flow terminated -> burn time right-censored), on burn_time rows
                                    whose ext_mode is SE or FT
    droplet.burn_time_truncated   = test_end != 'Completion' (extinction / disruption cut the burn short), on FLEX
                                    burn_time rows with a known test_end; CFI has no test_end -> NA
"""
from __future__ import annotations

import sys
from pathlib import Path

import pandas as pd

from src.data_layer.features import get_features
from src.data_layer.spec import SPEC, TRACE, target_frame
from src.data_layer.store import REPO, connect

DEFAULT_OUT = REPO / "data" / "modeling"
MASK = "in_subset__"

DATASETS = {
    "droplet": dict(sources={"flex": None, "cfi": None},
                    shared=["d0_mm", "p_atm", "x_o2", "x_n2", "x_he", "fuel", "diluent"],
                    cv_group=["fuel", "diluent"]),
    "gas_flame": dict(sources={"acme_normal": "experiment == 'CFI-G'", "acme_inverse": "experiment == 'CFI-G'"},
                      shared=["p_atm", "zst", "tad_k_calc", "day", "fuel_base", "experiment", "flame_type",
                              "burn_time_s", "hot_ignition", "ext_mode"],
                      extra=["flame_type"], cv_group=["flame_type", "day"]),
    "smoke": dict(sources={"smoke": "campaign != 'ground'"}, shared=[], cv_group=["material"]),
    "solid_atm": dict(sources={"bass2": None}, shared=[], cv_group=["pi"]),
}


LABELS = {"gas_flame": ["burn_time_censored"], "droplet": ["burn_time_truncated"]}


def _labels(name: str, df: pd.DataFrame) -> pd.DataFrame:
    if name == "gas_flame":
        flag = pd.Series(pd.NA, index=df.index, dtype="boolean")
        known = df[MASK + "burn_time_s"] & df["ext_mode"].isin(["FT", "SE"])
        flag[known] = df.loc[known, "ext_mode"].eq("FT")
        df["burn_time_censored"] = flag
    elif name == "droplet":
        flag = pd.Series(pd.NA, index=df.index, dtype="boolean")
        known = df["source_table"].eq("flex") & df[MASK + "burn_time_s"] & df["test_end"].notna()
        flag[known] = df.loc[known, "test_end"].ne("Completion")
        df["burn_time_truncated"] = flag
    return df


def targets_of(name: str) -> list[str]:
    seen = []
    for table in DATASETS[name]["sources"]:
        seen += [t for t in SPEC[table]["targets"] if t not in seen]
    return seen


def _source_frame(name: str, table: str, rows_query, con) -> pd.DataFrame:
    full = con.execute(f"SELECT * FROM {table}").df()
    df = full.query(rows_query, engine="python") if rows_query else full
    spec = SPEC[table]
    feats = []
    for t in spec["targets"]:
        feats += [c for c in get_features(table, t, con) if c not in feats]
    extra = DATASETS[name].get("extra", [])                       # descriptive source columns (e.g. flame_type)
    cols = list(dict.fromkeys(TRACE + extra + feats + spec["groups"] + list(spec["targets"])))
    out = df[cols].copy()
    for t in spec["targets"]:
        out[MASK + t] = df.index.isin(target_frame(table, t, df).index)
    out.insert(len(TRACE), "source_table", table)
    return out.reset_index(drop=True)


def build_dataset(name: str, con=None) -> pd.DataFrame:
    if name not in DATASETS:
        raise ValueError(f"unknown dataset {name!r}; valid: {sorted(DATASETS)}")
    own = con is None
    con = con or connect()
    try:
        parts = [_source_frame(name, t, q, con) for t, q in DATASETS[name]["sources"].items()]
    finally:
        if own:
            con.close()
    meta = set(TRACE) | {"source_table"}
    if len(parts) > 1:                                   # same name must mean the same quantity: only declared ones
        common = set.intersection(*[set(p.columns) for p in parts]) - meta - {c for c in parts[0] if c.startswith(MASK)}
        undeclared = common - set(DATASETS[name]["shared"])
        if undeclared:
            raise ValueError(f"{name}: columns shared by sources but not declared as the same quantity: {sorted(undeclared)}")
    df = pd.concat(parts, ignore_index=True)
    for c in [c for c in df.columns if c.startswith(MASK)]:
        df[c] = df[c].astype("boolean").fillna(False).astype(bool)   # target not defined for that source -> False
    df = _labels(name, df)
    masks = [c for c in df.columns if c.startswith(MASK)]
    return df[[c for c in df.columns if c not in masks] + masks]


def build_all(out_dir: str | Path = DEFAULT_OUT) -> list[Path]:
    """Write <name>.parquet and <name>.csv (same content; step A4) for every dataset. CSV: UTF-8, no index column,
    missing values as empty cells, booleans as True/False."""
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    con = connect()
    paths = []
    for name in DATASETS:
        df = build_dataset(name, con)
        p, c = out / f"{name}.parquet", out / f"{name}.csv"
        df.to_parquet(p, index=False)
        df.to_csv(c, index=False, encoding="utf-8", lineterminator="\n")
        paths += [p, c]
    return paths


if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] != "build":
        sys.exit("usage: python -m src.prediction.datasets build [out_dir]")
    for p in build_all(*sys.argv[2:3]):
        rows = len(pd.read_parquet(p)) if p.suffix == ".parquet" else len(pd.read_csv(p))
        print(f"wrote {p} ({rows} rows)")
