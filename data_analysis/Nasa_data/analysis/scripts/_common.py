"""Shared helpers for the EDA scripts. No model training anywhere in this package."""
from __future__ import annotations

import json
import re
import warnings
from pathlib import Path

import numpy as np
import pandas as pd

warnings.filterwarnings("ignore")

ROOT = Path(__file__).resolve().parents[2]          # .../Nasa_data
CSV = ROOT / "csv"
AUDIT = ROOT / "audit"
A = ROOT / "analysis"
DATA = A / "data"
OUT = A / "outputs"
FIG = A / "figures"
LOGS = A / "logs"
for _d in (DATA, OUT, FIG, LOGS):
    _d.mkdir(parents=True, exist_ok=True)

RANDOM_STATE = 42

import sys  # noqa: E402
sys.path.insert(0, str(ROOT.parents[1]))  # repo root, so `src.data_layer` is importable from the scripts
from src.data_layer import spec as _spec  # noqa: E402
from src.data_layer.spec import SPEC, TIER1, TIER2, TRACE, UNITS, unit_of  # noqa: E402,F401

# Reference categorical palette (fixed order, never cycled) + neutrals
CAT = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#6250d6", "#e34948"]
INK = "#0b0b0b"
INK2 = "#52514e"
GRID = "#e4e3df"
SURFACE = "#fcfcfb"
OTHER = "#a3a29c"



def setup_mpl():
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    plt.rcParams.update({
        "figure.dpi": 120, "savefig.dpi": 120, "savefig.bbox": "tight",
        "figure.facecolor": SURFACE, "axes.facecolor": SURFACE,
        "axes.edgecolor": INK2, "axes.labelcolor": INK, "text.color": INK,
        "xtick.color": INK2, "ytick.color": INK2,
        "axes.grid": True, "grid.color": GRID, "grid.linewidth": 0.6,
        "axes.spines.top": False, "axes.spines.right": False,
        "axes.prop_cycle": matplotlib.cycler(color=CAT),
        "font.size": 9, "axes.titlesize": 10, "axes.titleweight": "bold",
        "legend.frameon": False, "lines.linewidth": 2,
    })
    return plt


def cat_colors(levels):
    """Stable entity->color map; >8 levels fold into OTHER gray."""
    levels = list(levels)
    return {lv: (CAT[i] if i < len(CAT) else OTHER) for i, lv in enumerate(levels)}


def read_csv(rel: str, **kw) -> pd.DataFrame:
    return pd.read_csv(CSV / rel, low_memory=False, **kw)


def clean_name(c: str) -> str:
    c = re.sub(r"\s+", " ", str(c).replace("\n", " ")).strip()
    return c


def to_num_flag(df: pd.DataFrame, col: str, tokens=None, flag_name=None):
    """Coerce to numeric. Non-numeric tokens -> NaN and recorded in <col>_flag (the token text).
    Never fills with 0. Returns count of flagged cells."""
    s = df[col]
    if pd.api.types.is_numeric_dtype(s):
        return 0, set()
    raw = s.astype("string").str.strip()
    num = pd.to_numeric(raw.str.replace(",", "", regex=False), errors="coerce")
    bad = raw.notna() & (raw != "") & num.isna()
    if tokens is not None:
        unexpected = set(raw[bad].unique()) - set(tokens)
    else:
        unexpected = set()
    df[col] = num
    if bad.any():
        fn = flag_name or f"{col}_flag"
        df[fn] = raw.where(bad)
    return int(bad.sum()), unexpected


def add_trace(df: pd.DataFrame, psi_id: str, source_file: str, row_offset: int = 0):
    df = df.copy()
    df.insert(0, "source_row", np.arange(len(df)) + row_offset)
    df.insert(0, "source_file", source_file)
    df.insert(0, "psi_id", psi_id)
    return df


def save(df: pd.DataFrame, name: str):
    df = df.copy()
    for c in df.columns:  # parquet-safe object columns
        if df[c].dtype == object:
            df[c] = df[c].astype("string")
    df.to_parquet(DATA / f"{name}.parquet", index=False)


def load(name: str) -> pd.DataFrame:
    return pd.read_parquet(DATA / f"{name}.parquet")




def numeric_cols(df, exclude=()):
    ex = set(TRACE) | set(exclude)
    return [c for c in df.columns if c not in ex and pd.api.types.is_numeric_dtype(df[c])
            and not pd.api.types.is_bool_dtype(df[c]) and df[c].nunique(dropna=True) > 1]


def categorical_cols(df, exclude=(), max_levels=25):
    ex = set(TRACE) | set(exclude)
    out = []
    for c in df.columns:
        if c in ex or c.endswith("_flag"):
            continue
        if not pd.api.types.is_numeric_dtype(df[c]) or pd.api.types.is_bool_dtype(df[c]):
            k = df[c].nunique(dropna=True)
            if 2 <= k <= max_levels:
                out.append(c)
    return out


def append_assumption(key: str, text: str):
    """Idempotent: assumptions stored as json, re-rendered to md."""
    js = OUT / "assumptions.json"
    d = json.loads(js.read_text()) if js.exists() else {}
    d[key] = text
    js.write_text(json.dumps(d, ensure_ascii=False, indent=1, sort_keys=True))
    lines = ["# Varsayımlar ve kararlar", "",
             "Scriptler tarafından otomatik üretilir (anahtar: açıklama).", ""]
    lines += [f"- **{k}**: {v}" for k, v in sorted(d.items())]
    (OUT / "assumptions.md").write_text("\n".join(lines) + "\n")


def md_table(df: pd.DataFrame, floatfmt=".3g") -> str:
    try:
        return df.to_markdown(index=False, floatfmt=floatfmt)
    except ImportError:
        return df.to_string(index=False)


def slug(s: str) -> str:
    return re.sub(r"[^A-Za-z0-9]+", "_", str(s)).strip("_")[:60]


def target_frame(name, target):
    """Same signature as before: loads the parquet table, then applies the SPEC subset query."""
    return _spec.target_frame(name, target, load(name))
