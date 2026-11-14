"""Data & Model Status — entegrasyon paneli ve ekip sözleşmesi."""
from __future__ import annotations

import pandas as pd
import streamlit as st

from app import config as C
from app.core import models as M
from app.i18n import t
from app.ui import components as UI
from app.ui import state

bundle = state.data()
model, notes = state.model()

UI.header(t("eyebrow.system"), t("sys.title"), t("sys.subtitle"), [UI.data_badge(bundle), UI.model_badge(model)])

c1, c2 = st.columns(2, gap="large")
with c1:
    UI.section(t("sys.sec_data"))
    try:
        rel = C.DATA_PATH.relative_to(C.ROOT).as_posix()
    except ValueError:
        rel = str(C.DATA_PATH)
    if bundle.is_real:
        UI.kpi(t("sys.source"), t("sys.real"), "", rel, "good", t("sys.loaded", n=len(bundle.df)))
    else:
        UI.kpi(t("sys.source"), t("sys.simulation"), "", t("sys.not_found", path=rel), "warning", t("sys.sim_st"))
    UI.warnings(bundle.warnings)

    present, default = t("sys.present"), t("sys.default")
    rows = []
    for col in [*C.REQUIRED_COLS, C.TARGET_COL]:
        rows.append({t("sys.col"): col, t("sys.type"): t("sys.required"),
                     t("sys.status"): present if col in bundle.df else t("sys.missing"),
                     t("sys.src_col"): bundle.column_map.get(col, col if bundle.is_real else t("sys.sim_src"))})
    for col in ["Sample_No", "Radius_cm", "Burn_Time", "Ignition_Time", "Material", "Geometry",
                "Pressure_kPa", "Fan_Pot", "HRR_W"]:
        rows.append({t("sys.col"): col, t("sys.type"): t("sys.optional"),
                     t("sys.status"): present if col in bundle.df else default,
                     t("sys.src_col"): bundle.column_map.get(col, "—" if bundle.is_real else t("sys.sim_src"))})
    st.dataframe(pd.DataFrame(rows), hide_index=True, width="stretch")

with c2:
    UI.section(t("sys.sec_model"))
    found = M.discover()
    if model.source == "trained":
        UI.kpi(t("sys.active_model"), model.name, "", model.path.name if model.path else "", "good",
               t("ai.from_models"))
    else:
        UI.kpi(t("sys.active_model"), UI.model_name(model), "", t("sys.no_model"), "warning", t("sys.auto_trained"))
    UI.warnings(notes)
    st.dataframe(pd.DataFrame({t("sys.file"): [p.name for p in found] or ["—"],
                               t("sys.size_kb"): [round(p.stat().st_size / 1024, 1) for p in found] or [None]}),
                 hide_index=True, width="stretch")
    with st.expander(t("sys.features", n=len(model.feature_cols))):
        st.write(", ".join(f"`{c}`" for c in model.feature_cols))
    if model.metrics:
        st.json(model.metrics, expanded=False)

UI.section(t("sys.sec_contract"))
st.markdown(t("sys.contract_data", required="`, `".join(C.REQUIRED_COLS), target=C.TARGET_COL))
st.code('''import joblib
# src/train.py — after the fold loop:
joblib.dump({
    "model": fold_models,              # single estimator or list of fold models (averaged)
    "feature_cols": feature_cols,      # ordered columns used in training
    "target": "Extinction",
    "task": "classification",
    "description": "RF · physics features · GroupKFold",
    "metrics": {"oof_auc": overall_auc},
}, "models/extinction_rf.joblib")''', language="python")
st.markdown(t("sys.contract_behavior"))
