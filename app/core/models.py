"""Model registry: discovers and loads the trained models in the models/ folder.

Contract (for the data-science team)
--------------------------------
One of the following forms may be placed in models/:

* ``<name>.joblib`` / ``.pkl`` — a single sklearn-compatible estimator (or Pipeline),
* a **list** in the same file — fold models; the predictions are averaged,
* a **dictionary** in the same file — ``{"model": est | [est...], "feature_cols": [...], ...}``.

Optional sidecar file ``<name>.json``:
``{"feature_cols": [...], "target": "Extinction", "task": "classification",
   "description": "...", "metrics": {"oof_auc": 0.91}}``

The feature list is resolved in this order: metadata -> ``feature_names_in_`` ->
the same rule as src/train.py (all numeric columns in the output of
features.add_physics_features, excluding target/group/fold).

If no model exists, a **surrogate model** is trained on the available data
(real or simulated) using the GroupKFold scheme of src/cv.py.
"""
from __future__ import annotations

import json
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import roc_auc_score

from app import config as C

if str(C.SRC_DIR) not in sys.path:
    sys.path.insert(0, str(C.SRC_DIR))

import cv as team_cv  # noqa: E402  (src/cv.py)
import features as team_features  # noqa: E402  (src/features.py)

IGNORE = {C.TARGET_COL, C.GROUP_COL, "fold"}


def team_feature_frame(df: pd.DataFrame) -> pd.DataFrame:
    """Applies the team feature engineering (src/features.py)."""
    return team_features.add_physics_features(df)


def default_feature_cols() -> list[str]:
    """Reproduces the src/train.py rule on the raw schema."""
    probe = pd.DataFrame([{c: 1.0 for c in C.REQUIRED_COLS}])
    return [c for c in team_feature_frame(probe).columns if c not in IGNORE]


@dataclass
class ModelBundle:
    name: str
    estimators: list[Any]
    feature_cols: list[str]
    source: str                                  # "trained" | "surrogate"
    path: Path | None = None
    task: str = "classification"
    description: str = ""
    metrics: dict[str, float] = field(default_factory=dict)
    oof: pd.DataFrame | None = None              # OOF predictions for the surrogate model

    def _features(self, df: pd.DataFrame) -> pd.DataFrame:
        X = team_feature_frame(df)
        missing = [c for c in self.feature_cols if c not in X]
        if missing:
            raise KeyError(f"features expected by the model are missing from the data: {missing}")
        return X[self.feature_cols]

    def predict_proba(self, df: pd.DataFrame) -> np.ndarray:
        """Probability of the positive class (Extinction = 1, the flame goes out)."""
        X = self._features(df)
        preds = []
        for est in self.estimators:
            if hasattr(est, "predict_proba"):
                preds.append(est.predict_proba(X)[:, 1])
            else:
                preds.append(np.clip(np.asarray(est.predict(X), dtype=float), 0, 1))
        return np.mean(preds, axis=0)

    def importances(self) -> pd.Series | None:
        vals = []
        for est in self.estimators:
            final = est.steps[-1][1] if hasattr(est, "steps") else est
            if hasattr(final, "feature_importances_"):
                vals.append(np.asarray(final.feature_importances_, dtype=float))
            elif hasattr(final, "coef_"):
                vals.append(np.abs(np.ravel(final.coef_)).astype(float))
        if not vals or len(vals[0]) != len(self.feature_cols):
            return None
        s = pd.Series(np.mean(vals, axis=0), index=self.feature_cols)
        return (s / s.sum()).sort_values(ascending=False)


# --------------------------------------------------------------------------- #
# Discovery and loading
# --------------------------------------------------------------------------- #
def discover(models_dir: Path = C.MODELS_DIR) -> list[Path]:
    if not models_dir.exists():
        return []
    return sorted(p for p in models_dir.iterdir() if p.suffix.lower() in C.MODEL_EXTENSIONS)


def dir_signature(models_dir: Path = C.MODELS_DIR) -> str:
    files = [*discover(models_dir), *(models_dir.glob("*.json") if models_dir.exists() else [])]
    return "|".join(f"{p.name}:{p.stat().st_mtime_ns}" for p in sorted(files)) or "none"


def load_bundle(path: Path) -> ModelBundle:
    obj = joblib.load(path)
    meta: dict[str, Any] = {}
    sidecar = path.with_suffix(".json")
    if sidecar.exists():
        meta = json.loads(sidecar.read_text(encoding="utf-8"))
    if isinstance(obj, dict):
        meta = {**{k: v for k, v in obj.items() if k != "model"}, **meta}
        obj = obj["model"]
    estimators = list(obj) if isinstance(obj, (list, tuple)) else [obj]

    feature_cols = meta.get("feature_cols")
    if not feature_cols and hasattr(estimators[0], "feature_names_in_"):
        feature_cols = list(estimators[0].feature_names_in_)
    if not feature_cols:
        feature_cols = default_feature_cols()

    return ModelBundle(
        name=meta.get("name", path.stem),
        estimators=estimators,
        feature_cols=list(feature_cols),
        source="trained",
        path=path,
        task=meta.get("task", "classification"),
        description=meta.get("description", ""),
        metrics={k: float(v) for k, v in meta.get("metrics", {}).items()},
    )


def train_surrogate(df: pd.DataFrame, n_splits: int = 5, seed: int = 42) -> ModelBundle:
    """Same pipeline as src/train.py: add_physics_features -> create_folds -> RF."""
    base = df[[C.GROUP_COL, *C.REQUIRED_COLS, C.TARGET_COL]].copy().reset_index(drop=True)
    feats = team_feature_frame(base)
    feature_cols = [c for c in feats.columns if c not in IGNORE]

    n_groups = feats[C.GROUP_COL].nunique()
    k = int(min(n_splits, max(2, n_groups)))
    folded = team_cv.create_folds(feats, C.TARGET_COL, C.GROUP_COL, n_splits=k, is_classification=True)

    oof = np.zeros(len(folded))
    fold_auc = []
    for f in range(k):
        tr, va = folded[folded.fold != f], folded[folded.fold == f]
        m = RandomForestClassifier(n_estimators=300, min_samples_leaf=2, random_state=seed, n_jobs=1)
        m.fit(tr[feature_cols], tr[C.TARGET_COL])
        oof[va.index] = m.predict_proba(va[feature_cols])[:, 1]
        if va[C.TARGET_COL].nunique() > 1:
            fold_auc.append(roc_auc_score(va[C.TARGET_COL], oof[va.index]))

    final = RandomForestClassifier(n_estimators=300, min_samples_leaf=2, random_state=seed, n_jobs=1)
    final.fit(folded[feature_cols], folded[C.TARGET_COL])

    metrics = {"n_folds": float(k)}
    if folded[C.TARGET_COL].nunique() > 1:
        metrics["oof_auc"] = float(roc_auc_score(folded[C.TARGET_COL], oof))
        metrics["fold_auc_std"] = float(np.std(fold_auc)) if fold_auc else float("nan")
    metrics["accuracy@0.5"] = float(((oof >= 0.5).astype(int) == folded[C.TARGET_COL]).mean())

    return ModelBundle(
        name="surrogate_rf",                      # display label: app/i18n.py
        estimators=[final],
        feature_cols=feature_cols,
        source="surrogate",
        description="",
        metrics=metrics,
        oof=pd.DataFrame({"y": folded[C.TARGET_COL].to_numpy(), "p": oof, "fold": folded["fold"].to_numpy()}),
    )


def resolve(df: pd.DataFrame, models_dir: Path = C.MODELS_DIR) -> tuple[ModelBundle, list[str]]:
    """Selects the model to use; returns a warning for files that fail to load."""
    notes: list[tuple[str, dict]] = []    # (i18n key, parameters)
    for path in discover(models_dir):
        try:
            bundle = load_bundle(path)
            bundle.predict_proba(df.head(3))  # smoke test: schema compatibility
            return bundle, notes
        except Exception as exc:  # noqa: BLE001
            notes.append(("warn.model_unusable", {"name": path.name, "err": f"{type(exc).__name__}: {exc}"}))
    return train_surrogate(df), notes
