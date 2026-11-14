"""AI Insights — model card, explainability, what-if analysis, batch prediction."""
from __future__ import annotations

import numpy as np
import pandas as pd
import plotly.graph_objects as go
import streamlit as st
from sklearn.metrics import roc_curve

from app import config as C
from app.core import data as D
from app.core import physics as P
from app.i18n import t
from app.ui import charts as CH
from app.ui import components as UI
from app.ui import state
from app.ui import theme as T

bundle = state.data()
model, notes = state.model()
sc = state.scenario()

UI.header(t("eyebrow.analysis"), t("ai.title"), t("ai.subtitle"), [UI.data_badge(bundle), UI.model_badge(model)])
UI.warnings(notes)

# --- Model card ------------------------------------------------------------
trained = model.source == "trained"
name = UI.model_name(model)
m1, m2, m3, m4 = st.columns(4)
with m1:
    UI.kpi(t("ai.kpi_model"), t("ai.trained") if trained else t("ai.surrogate"), "",
           name if len(name) < 40 else name[:38] + "…", "good" if trained else "warning",
           t("ai.from_models") if trained else t("ai.auto_trained"))
with m2:
    auc = model.metrics.get("oof_auc")
    UI.kpi("OOF ROC-AUC", f"{auc:.3f}" if auc else "—", "",
           t("ai.auc_sub", k=int(model.metrics.get("n_folds", 0)) or "?") if auc else t("ai.no_meta"))
with m3:
    acc = model.metrics.get("accuracy@0.5")
    UI.kpi(t("ai.kpi_acc"), f"{acc * 100:.0f}" if acc else "—", "%" if acc else "", "OOF")
with m4:
    UI.kpi(t("ai.kpi_features"), f"{len(model.feature_cols)}", "", t("ai.features_sub"))

st.markdown("<div style='height:10px'></div>", unsafe_allow_html=True)
st.info(t("ai.leakage_body"), title=t("ai.leakage_title"), icon=":material/science:")

# --- Explainability -------------------------------------------------------
UI.section(t("ai.sec_explain"))
e1, e2 = st.columns(2, gap="large")
with e1:
    imp = model.importances()
    if imp is not None:
        imp = imp.head(12).iloc[::-1]
        f = go.Figure(go.Bar(x=imp.values, y=imp.index, orientation="h", marker=dict(color=T.BLUE),
                             hovertemplate="%{y}: %{x:.1%}<extra></extra>"))
        f.update_layout(height=380, title=t("ai.importance_title"), xaxis_tickformat=".0%", margin=dict(l=150))
        st.plotly_chart(f, config=CH.CFG, width="stretch")
    else:
        st.info(t("ai.no_importance"))
with e2:
    if model.oof is not None and model.oof["y"].nunique() > 1:
        fpr, tpr, _ = roc_curve(model.oof["y"], model.oof["p"])
        title = t("ai.roc_oof", auc=model.metrics.get("oof_auc", float("nan")))
    else:
        # Trained model: fit on the current archive (may be the training data)
        try:
            fpr, tpr, _ = roc_curve(bundle.df[C.TARGET_COL], model.predict_proba(bundle.df))
            title = t("ai.roc_archive")
        except Exception as exc:  # noqa: BLE001
            fpr = tpr = None
            st.info(t("ai.roc_failed", err=exc))
    if fpr is not None:
        f = go.Figure()
        f.add_trace(go.Scatter(x=[0, 1], y=[0, 1], mode="lines", line=dict(color=T.AXIS, dash="dot", width=1),
                               hoverinfo="skip", showlegend=False))
        f.add_trace(go.Scatter(x=fpr, y=tpr, mode="lines", line=dict(color=T.BLUE, width=2), showlegend=False,
                               hovertemplate="FPR %{x:.2f}<br>TPR %{y:.2f}<extra></extra>"))
        f.update_layout(height=380, title=title, xaxis_title=t("axis.fpr"), yaxis_title=t("axis.tpr"))
        st.plotly_chart(f, config=CH.CFG, width="stretch")

# --- What if ---------------------------------------------------------------
UI.section(t("ai.sec_whatif", r=sc.radius_cm, u=sc.flow_cm_s, o2=sc.o2_pct))
nb = D.nearest_tests(bundle.df, sc.o2_pct, sc.flow_cm_s, sc.radius_cm, k=9)


def _sweep(o2s: np.ndarray, us: np.ndarray) -> np.ndarray:
    rows = pd.DataFrame({"O2_initial": o2s, "Flow_Vel": us, "Thickness": sc.thickness_cm})
    rows["O2_final"] = rows["O2_initial"] - nb["O2_Drop"].median()
    rows["CO2"], rows["CO"] = nb["CO2"].median(), nb["CO"].median()
    try:
        return 1 - model.predict_proba(rows)
    except Exception:  # noqa: BLE001
        return np.full(len(rows), np.nan)


def _whatif(x, phys, ml, xlab, title, hover_x, vline=None, band=None) -> go.Figure:
    f = go.Figure()
    f.add_trace(go.Scatter(x=x, y=phys, mode="lines", name=t("ai.physics_series"),
                           line=dict(color=T.INK_2, width=2, dash="dash"),
                           hovertemplate=hover_x + "<br>P = %{y:.0%}<extra>" + t("src.physics") + "</extra>"))
    f.add_trace(go.Scatter(x=x, y=ml, mode="lines", name=t("ai.ml_series"), line=dict(color=T.ORANGE, width=2),
                           hovertemplate=hover_x + "<br>P = %{y:.0%}<extra>" + t("src.model") + "</extra>"))
    if vline is not None:
        f.add_vline(x=vline, line=dict(color=T.MUTED, width=1),
                    annotation=dict(text=t("ai.scenario_marker"), font=dict(color=T.MUTED, size=11)))
    if band:
        f.add_vrect(x0=band[0], x1=band[1], fillcolor=T.ORANGE, opacity=0.07, line_width=0)
    f.update_layout(height=340, title=title, xaxis_title=xlab, yaxis_title=t("axis.p_burn"),
                    yaxis_tickformat=".0%", yaxis_range=[-0.03, 1.03])
    return f


w1, w2 = st.columns(2, gap="large")
with w1:
    o2s = np.linspace(12, 24, 61)
    phys = P.flame_probability(o2s - P.olson_limit(P.strain_rate(sc.flow_cm_s, sc.radius_cm)))
    st.plotly_chart(_whatif(o2s, phys, _sweep(o2s, np.full_like(o2s, sc.flow_cm_s)), t("axis.o2_pct"),
                            t("ai.whatif_o2"), "O₂ %{x:.1f}%", vline=sc.o2_pct), config=CH.CFG, width="stretch")
with w2:
    us = np.linspace(0, 12, 61)
    phys = P.flame_probability(sc.o2_pct - P.limit_vs_velocity(us, sc.radius_cm))
    st.plotly_chart(_whatif(us, phys, _sweep(np.full_like(us, sc.o2_pct), us), "U [cm/s]",
                            t("ai.whatif_u"), "U %{x:.1f} cm/s", band=C.GOLDILOCKS_CM_S),
                    config=CH.CFG, width="stretch")
st.caption(t("ai.whatif_caption"))

# --- Toplu tahmin --------------------------------------------------------
UI.section(t("ai.sec_batch"))
up = st.file_uploader(t("ai.upload_label"), type="csv")
if up is not None:
    try:
        raw, _ = D.harmonize_columns(pd.read_csv(up))
        raw["P_Extinction"] = model.predict_proba(raw)
        raw["Model_Decision"] = np.where(raw["P_Extinction"] >= 0.5, "extinguished", "burning")
        if "Radius_cm" not in raw:
            raw["Radius_cm"] = C.R_REF_CM
        raw["Olson_Margin"] = raw["O2_initial"] - P.olson_limit(P.strain_rate(raw["Flow_Vel"], raw["Radius_cm"]))
        st.dataframe(raw, hide_index=True, width="stretch")
        st.download_button(t("ai.download"), raw.to_csv(index=False).encode("utf-8"), "predictions.csv",
                           "text/csv", icon=":material/download:")
    except Exception as exc:  # noqa: BLE001
        st.error(t("ai.batch_failed", err=exc))
