"""Shared Plotly figures."""
from __future__ import annotations

import numpy as np
import pandas as pd
import plotly.graph_objects as go

from app import config as C
from app.core import physics as P
from app.i18n import t, tv
from app.ui import theme as T

CFG = {"displaylogo": False, "modeBarButtonsToRemove": ["lasso2d", "select2d", "autoScale2d"]}


def _ref_line(fig: go.Figure, y: float, text: str, dash: str = "dot") -> None:
    fig.add_hline(y=y, line=dict(color=T.MUTED, width=1, dash=dash),
                  annotation=dict(text=text, font=dict(color=T.MUTED, size=11), xanchor="right", x=1),
                  annotation_position="top right")


def ucurve(r_cm: float, o2: float, u: float, status: str, u_max: float = 12.0, height: int = 380) -> go.Figure:
    us = np.linspace(0, u_max, 300)
    lim = P.limit_vs_velocity(us, r_cm)
    y_top = max(o2 + 2, 24)

    fig = go.Figure()
    lo, hi = C.GOLDILOCKS_CM_S
    fig.add_vrect(x0=lo, x1=hi, fillcolor=T.ORANGE, opacity=0.08, line_width=0,
                  annotation=dict(text=t("chart.goldilocks"), font=dict(color=T.INK_2, size=11)),
                  annotation_position="top left")
    # Flammable region: above the curve
    fig.add_trace(go.Scatter(x=us, y=np.full_like(us, y_top), mode="lines", line=dict(width=0),
                             hoverinfo="skip", showlegend=False))
    fig.add_trace(go.Scatter(x=us, y=lim, mode="lines", fill="tonexty", fillcolor="rgba(217,89,38,0.10)",
                             line=dict(color=T.INK, width=2), name=t("chart.olson_limit"),
                             hovertemplate=t("hover.u_limit") + "<extra></extra>"))
    _ref_line(fig, C.EARTH_PMMA_LOI_PCT, t("chart.earth_loi", v=C.EARTH_PMMA_LOI_PCT))
    u_star = P.most_dangerous_velocity(r_cm)
    fig.add_trace(go.Scatter(
        x=[u_star], y=[P.minimum_limit()], mode="markers+text", text=[f"min {P.minimum_limit():.2f}%"],
        textposition="bottom center", textfont=dict(color=T.INK_2, size=11),
        marker=dict(size=8, color=T.SURFACE, line=dict(color=T.INK, width=2)), showlegend=False,
        hovertemplate=t("hover.most_dangerous") + "<extra></extra>"))
    fig.add_trace(go.Scatter(
        x=[min(u, u_max)], y=[o2], mode="markers+text", text=["  " + t("chart.scenario")],
        textposition="middle right", textfont=dict(color=T.INK, size=12),
        marker=dict(size=14, color=T.STATUS[status], symbol="diamond", line=dict(color=T.SURFACE, width=2)),
        showlegend=False, hovertemplate=t("hover.scenario") + "<extra></extra>"))
    fig.add_annotation(x=u_max * 0.97, y=y_top - 0.6, text=t("chart.flammable"), showarrow=False,
                       xanchor="right", font=dict(color=T.ORANGE, size=11))
    fig.add_annotation(x=u_max * 0.97, y=13.0, text=t("chart.extinguishes"), showarrow=False, xanchor="right",
                       font=dict(color=T.BLUE, size=11))
    fig.update_layout(height=height, showlegend=False, title=t("chart.ucurve_title", r=r_cm),
                      xaxis_title=t("axis.velocity"), yaxis_title=t("axis.o2_vol"))
    fig.update_yaxes(range=[12.5, y_top])
    fig.update_xaxes(range=[0, u_max])
    return fig


def outcome_scatter(df: pd.DataFrame, x: str, y: str, height: int = 420, **layout) -> go.Figure:
    fig = go.Figure()
    for outcome in ["extinguished", "burning"]:
        d = df[df["Outcome"] == outcome]
        label = tv("outcome", outcome)
        fig.add_trace(go.Scatter(
            x=d[x], y=d[y], mode="markers", name=label,
            marker=dict(color=T.OUTCOME_COLOR[outcome], symbol=T.OUTCOME_SYMBOL[outcome], size=9,
                        line=dict(width=1.5,
                                  color=T.OUTCOME_COLOR[outcome] if outcome == "extinguished" else T.SURFACE)),
            customdata=np.stack([d["Test_ID"], d["Material"].map(lambda m: tv("mat", m)), d["Flow_Vel"],
                                 d["O2_Margin"], d["HRR_W"]], axis=-1),
            hovertemplate=("<b>%{customdata[0]}</b> · %{customdata[1]}<br>"
                           f"{x} = %{{x:.2f}}<br>{y} = %{{y:.2f}}<br>"
                           "U = %{customdata[2]:.2f} cm/s · " + t("hover.margin") + " = %{customdata[3]:+.2f}<br>"
                           "HRR = %{customdata[4]:.0f} W<extra>" + label + "</extra>"),
        ))
    fig.update_layout(height=height, **layout)
    return fig


def hist_with_threshold(series: pd.Series, threshold: float, label: str, title: str, xlab: str,
                        color: str = T.BLUE, extra: tuple[float, str] | None = None, nbins: int = 24) -> go.Figure:
    fig = go.Figure(go.Histogram(x=series.dropna(), nbinsx=nbins, marker=dict(color=color),
                                 hovertemplate=f"{xlab}: %{{x}}<br>{t('axis.test_count')}: %{{y}}<extra></extra>"))
    for v, txt in [(threshold, label), *([extra] if extra else [])]:
        fig.add_vline(x=v, line=dict(color=T.INK_2, width=1.5, dash="dash"),
                      annotation=dict(text=txt, font=dict(color=T.INK_2, size=11)), annotation_position="top")
    fig.update_layout(height=300, title=title, xaxis_title=xlab, yaxis_title=t("axis.test_count"), bargap=0.08)
    return fig
