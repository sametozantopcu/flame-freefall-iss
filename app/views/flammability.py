"""Flammability Boundary Map — Olson U-eğrisi, ISS verisinin gerilme hızı uzayında doğrulanması."""
from __future__ import annotations

import numpy as np
import plotly.graph_objects as go
import streamlit as st

from app import config as C
from app.core import physics as P
from app.i18n import t
from app.ui import charts as CH
from app.ui import components as UI
from app.ui import state
from app.ui import theme as T

bundle = state.data()
df = bundle.df
sc = state.scenario()

UI.header(t("eyebrow.analysis"), t("flam.title"), t("flam.subtitle"), [UI.data_badge(bundle)])

# --- Neden Dünya testleri yetmez -------------------------------------------
UI.section(t("flam.sec_earth_vs_space"))
k1, k2, k3 = st.columns(3)
with k1:
    UI.kpi(t("flam.kpi_loi"), f"{C.EARTH_PMMA_LOI_PCT} → {C.MICROG_PMMA_LIMIT_PCT}", "%",
           t("flam.kpi_loi_sub"), "serious", t("flam.kpi_loi_st"))
with k2:
    UI.kpi(t("flam.kpi_ign"), f"{C.STD6001_IGNITION_S:.0f} → {C.BASS2_MAX_IGNITION_S:.0f}", "s",
           t("flam.kpi_ign_sub"), "serious", t("flam.kpi_ign_st"))
with k3:
    UI.kpi(t("flam.kpi_co"), f"1 → {C.CO_MAX_ENHANCEMENT:.0f}", "×", t("flam.kpi_co_sub"),
           "critical", t("flam.kpi_co_st"))

# --- Grafik 1: arşiv, gerilme hızı uzayında --------------------------------
UI.section(t("flam.sec_archive"))
a_grid = np.geomspace(0.05, max(80.0, df["Strain_Rate"].max() * 1.1), 300)
fig = CH.outcome_scatter(df, "Strain_Rate", "O2_initial", height=460, title=t("flam.scatter_title"),
                         xaxis_title=t("axis.strain_log"), yaxis_title=t("axis.o2_initial"))
fig.add_trace(go.Scatter(x=a_grid, y=P.olson_limit(a_grid), mode="lines", name=t("chart.olson_limit"),
                         line=dict(color=T.INK, width=2),
                         hovertemplate=t("hover.a_limit") + "<extra>Olson</extra>"))
fig.add_hline(y=C.EARTH_PMMA_LOI_PCT, line=dict(color=T.MUTED, width=1, dash="dot"),
              annotation=dict(text=t("chart.earth_loi", v=C.EARTH_PMMA_LOI_PCT), font=dict(color=T.MUTED, size=11)),
              annotation_position="bottom right")
fig.update_xaxes(type="log", tickvals=[0.1, 0.3, 1, 3, 10, 30, 100],
                 ticktext=["0.1", "0.3", "1", "3", "10", "30", "100"])
c_left, c_right = st.columns([1.6, 1], gap="large")
with c_left:
    st.plotly_chart(fig, config=CH.CFG, width="stretch")
with c_right:
    pred_burn = df["O2_Margin"] > 0
    actual_burn = df["Extinction"] == 0
    agree = (pred_burn == actual_burn).mean()
    above = df[pred_burn]
    UI.kpi(t("flam.kpi_agree"), f"{agree * 100:.0f}", "%", t("flam.kpi_agree_sub", n=len(df)))
    st.markdown("<div style='height:8px'></div>", unsafe_allow_html=True)
    UI.kpi(t("flam.kpi_above_ext"), f"{int((above['Extinction'] == 1).sum())}", t("unit.tests"),
           t("flam.kpi_above_ext_sub"))
    st.markdown("<div style='height:8px'></div>", unsafe_allow_html=True)
    UI.kpi(t("flam.kpi_blind"), f"{int(df['Flag_Earth_Safe_Space_Burn'].sum())}", t("unit.tests"),
           t("flam.kpi_blind_sub", v=C.EARTH_PMMA_LOI_PCT), "critical", t("flam.kpi_blind_st"))
    st.caption(t("flam.collapse_caption"))

# --- Grafik 2: boyut etkisi + Grafik 3: marj ısı haritası -----------------
UI.section(t("flam.sec_size"))
RADII = [0.159, 0.318, 0.476, 0.635, 0.953, 1.27]
g1, g2 = st.columns(2, gap="large")
with g1:
    us = np.linspace(0, 12, 300)
    f2 = go.Figure()
    for color, r in zip(T.SERIES, [0.159, 0.318, 0.953]):
        lim = P.limit_vs_velocity(us, r)
        f2.add_trace(go.Scatter(x=us, y=lim, mode="lines", name=f"r = {r:.3f} cm", line=dict(color=color, width=2),
                                hovertemplate=f"r = {r} cm<br>" + t("hover.u_limit") + "<extra></extra>"))
        u_star = P.most_dangerous_velocity(r)
        f2.add_annotation(x=min(u_star, 11.5), y=P.minimum_limit(), text=f"{u_star:.1f}", showarrow=True,
                          arrowhead=0, arrowcolor=color, ay=-26, font=dict(color=T.INK_2, size=11))
    f2.add_vrect(x0=C.GOLDILOCKS_CM_S[0], x1=C.GOLDILOCKS_CM_S[1], fillcolor=T.ORANGE, opacity=0.07, line_width=0)
    f2.update_layout(height=380, title=t("flam.size_title"), xaxis_title=t("axis.velocity"),
                     yaxis_title=t("axis.limit_o2"))
    f2.update_yaxes(range=[13, 20])
    st.plotly_chart(f2, config=CH.CFG, width="stretch")
    st.caption(t("flam.size_caption"))

with g2:
    r = st.select_slider(t("flam.heat_radius"), options=RADII,
                         value=sc.radius_cm if sc.radius_cm in RADII else 0.318)
    ug = np.linspace(0, 12, 121)
    og = np.linspace(12, 30, 91)
    margin = og[:, None] - P.limit_vs_velocity(ug, r)[None, :]
    lim = 6
    f3 = go.Figure(go.Heatmap(
        x=ug, y=og, z=np.clip(margin, -lim, lim), zmin=-lim, zmax=lim, zmid=0, colorscale=T.DIVERGING,
        colorbar=dict(title=dict(text=t("hover.margin"), font=dict(color=T.MUTED)), tickfont=dict(color=T.MUTED),
                      outlinewidth=0, thickness=12),
        customdata=margin,
        hovertemplate="U = %{x:.1f} cm/s<br>O₂ = %{y:.1f}%<br>" + t("hover.margin")
                      + " = %{customdata:+.2f}<extra></extra>"))
    f3.add_trace(go.Scatter(x=ug, y=P.limit_vs_velocity(ug, r), mode="lines", line=dict(color=T.INK, width=2),
                            hoverinfo="skip", showlegend=False))
    f3.add_trace(go.Scatter(x=[sc.flow_cm_s], y=[sc.o2_pct], mode="markers+text", text=["  " + t("chart.scenario")],
                            textposition="middle right", textfont=dict(color=T.INK),
                            marker=dict(symbol="diamond", size=13, color=T.INK, line=dict(color=T.SURFACE, width=2)),
                            showlegend=False, hovertemplate=t("chart.scenario") + "<extra></extra>"))
    f3.update_layout(height=380, title=t("flam.heat_title"), xaxis_title=t("axis.velocity"),
                     yaxis_title=t("axis.o2_pct"))
    st.plotly_chart(f3, config=CH.CFG, width="stretch")

with st.expander(t("flam.equations")):
    st.latex(r"X_{O_2} = 6\,e^{-0.5a} + 0.0167\,a + 13.4 \qquad a = 1.5\,\frac{U}{r}\left(\frac{r}{0.318}\right)^{0.5}")
    st.markdown(t("flam.equations_body", a_star=P.optimal_strain_rate(), x_min=P.minimum_limit(),
                  x0=P.olson_limit(0.0)))
