"""M2 FLEX model (plans/mvp S2): Ridge on PSI-69 FLEX `burn_rate_K_mm2_s`, GroupKFold validation, browser export.

    fit_flex() -> dict          # JSON-serialisable, NaN -> None
    predict(model, rows) -> np.ndarray   # recomputes predictions from the exported coefficients only

Export schema (all plain JSON types):
  target, doi, n, features, leakage_excluded
  coef: {columns[], kind[] ("num"|"cat"), mean[], scale[] (num only, else None), coef[] (on standardised/one-hot cols),
         intercept, alpha}
  impute: {numeric_feature: median}      # applied only to missing numeric inputs (never 0)
  cv: {fuel_diluent: {r2, mae, n, n_groups, groups[]}, year: {...}, primary: "fuel_diluent", n_splits, method}
  known_combos: [{fuel, diluent, n}], ranges: {d0_mm|p_atm|x_o2|x_he|x_co2: {min, max}}, fuels[], diluents[]
Rows with missing target are dropped by the data layer. Year CV drops rows with unknown year (49 rows).
"""
from __future__ import annotations

import math

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import GroupKFold
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from src.data_layer.frame import get_modeling_frame
from src.data_layer.features import get_features

TABLE, TARGET = "flex", "burn_rate_K_mm2_s"
DOI = "10.60555/mbq8-0451"
NUM = ["d0_mm", "p_atm", "x_o2", "x_he", "x_co2"]
CAT = ["fuel", "diluent"]
FEATURES = NUM + CAT
ALPHA = 1.0
# Leakage for this target per the data-layer spec (never used as features).
LEAKAGE = ["burn_time_s", "d_ext_mm", "d_ext_over_d0", "K_from_d2_law", "test_end"]


def _pipeline() -> Pipeline:
    pre = ColumnTransformer([
        ("num", Pipeline([("imp", SimpleImputer(strategy="median")), ("sc", StandardScaler())]), NUM),
        ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), CAT),
    ])
    return Pipeline([("pre", pre), ("ridge", Ridge(alpha=ALPHA))])


def _f(x) -> float | None:
    x = float(x)
    return x if math.isfinite(x) else None


def _splits(groups: pd.Series, k: int):
    return list(GroupKFold(n_splits=k).split(np.zeros(len(groups)), groups=groups))


def _cv(df: pd.DataFrame, groups: pd.Series) -> dict:
    sp = _splits(groups, min(6, groups.nunique()))
    pred = np.full(len(df), np.nan)
    for tr, te in sp:
        m = _pipeline().fit(df.iloc[tr][FEATURES], df.iloc[tr][TARGET])
        pred[te] = m.predict(df.iloc[te][FEATURES])
    y = df[TARGET].to_numpy()
    return dict(r2=_f(r2_score(y, pred)), mae=_f(mean_absolute_error(y, pred)), n=int(len(df)),
                n_groups=int(groups.nunique()), groups=sorted(map(str, groups.unique())))


def _clean(df: pd.DataFrame) -> pd.DataFrame:
    """Treat ambient pressure <= 0 as missing: a burning droplet at 0 atm is impossible and the raw row
    (PSI-69 FLEX test 114, 0.0 mmHg between ~535 mmHg neighbours) is a placeholder. Source tables stay untouched."""
    df = df.copy()
    df.loc[df["p_atm"] <= 0, "p_atm"] = np.nan
    return df


def fit_flex() -> dict:
    df = _clean(get_modeling_frame(TABLE, TARGET))
    catalog = get_features(TABLE, TARGET)
    assert not set(LEAKAGE) & set(FEATURES) and set(FEATURES) <= set(catalog)
    combo = df["fuel"].astype(str) + "|" + df["diluent"].astype(str)
    dyr = df[df["year"].notna()].reset_index(drop=True)
    cv = dict(
        fuel_diluent=_cv(df, combo),
        year=_cv(dyr, dyr["year"].astype(int).astype(str)),
        primary="fuel_diluent", method="GroupKFold (pooled out-of-fold), Ridge alpha=%g" % ALPHA,
    )
    cv["n_splits"] = {"fuel_diluent": cv["fuel_diluent"]["n_groups"], "year": cv["year"]["n_groups"]}

    model = _pipeline().fit(df[FEATURES], df[TARGET])
    pre, ridge = model.named_steps["pre"], model.named_steps["ridge"]
    num_pipe = pre.named_transformers_["num"]
    imp = num_pipe.named_steps["imp"].statistics_
    sc = num_pipe.named_steps["sc"]
    enc = pre.named_transformers_["cat"]
    cat_cols = [f"{c}={v}" for c, cats in zip(CAT, enc.categories_) for v in cats]
    columns = NUM + cat_cols
    coef = dict(
        columns=columns, kind=["num"] * len(NUM) + ["cat"] * len(cat_cols),
        mean=[_f(v) for v in sc.mean_] + [None] * len(cat_cols),
        scale=[_f(v) for v in sc.scale_] + [None] * len(cat_cols),
        coef=[_f(v) for v in ridge.coef_], intercept=_f(ridge.intercept_), alpha=ALPHA,
    )
    combos = (df.groupby(["fuel", "diluent"]).size().reset_index(name="n")
              .sort_values(["fuel", "diluent"]))
    return dict(
        target=TARGET, doi=DOI, n=int(len(df)), features=FEATURES, leakage_excluded=LEAKAGE,
        coef=coef, impute={c: _f(v) for c, v in zip(NUM, imp)}, cv=cv,
        known_combos=[dict(fuel=str(r.fuel), diluent=str(r.diluent), n=int(r.n)) for r in combos.itertuples()],
        ranges={c: dict(min=_f(df[c].min()), max=_f(df[c].max())) for c in NUM},
        fuels=sorted(map(str, df["fuel"].unique())), diluents=sorted(map(str, df["diluent"].unique())),
    )


def predict(model: dict, rows: list[dict]) -> np.ndarray:
    """Recompute predictions from the export only (same arithmetic the browser performs)."""
    c = model["coef"]
    out = []
    for r in rows:
        s = c["intercept"]
        for name, kind, mu, sd, w in zip(c["columns"], c["kind"], c["mean"], c["scale"], c["coef"]):
            if kind == "num":
                v = r.get(name)
                if v is None or (isinstance(v, float) and math.isnan(v)):
                    v = model["impute"][name]
                s += w * (v - mu) / sd
            else:
                col, val = name.split("=", 1)
                s += w * (1.0 if str(r.get(col)) == val else 0.0)
        out.append(s)
    return np.array(out)
