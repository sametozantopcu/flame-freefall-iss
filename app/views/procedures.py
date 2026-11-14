"""Suppression Protocol — ISS BASS-II adımlarının etkileşimli yürütücüsü + donanım araçları."""
from __future__ import annotations

import time

import numpy as np
import plotly.graph_objects as go
import streamlit as st

from app import config as C
from app.core import hardware as H
from app.core import physics as P
from app.core import procedures as PR
from app.core.risk import Insight
from app.i18n import t
from app.ui import charts as CH
from app.ui import components as UI
from app.ui import state
from app.ui import theme as T

sc = state.scenario()

UI.header(t("eyebrow.ops"), t("proc.title"), t("proc.subtitle"),
          [UI.badge(t("badge.scenario", o2=sc.o2_pct, u=sc.flow_cm_s), T.MUTED)])

# --------------------------------------------------------------------------- #
# Durum — olay kaydı (MET, adım, not anahtarı) olarak tutulur ve çizim anında
# çevrilir; dil değiştirildiğinde geçmiş kayıtlar da yeni dilde görünür.
# --------------------------------------------------------------------------- #
if "proc" not in st.session_state:
    st.session_state.proc = {"step": "standby", "t_step": None, "t_start": None, "log": []}
proc = st.session_state.proc


def _cmd(step: PR.Step) -> str:
    return step.command or t(f"step.{step.key}.cmd")


def _met() -> str:
    if not proc["t_start"]:
        return "--:--"
    s = int((time.time() - proc["t_start"]) * (st.session_state.get("proc_speed") or 1))
    return f"{s // 60:02d}:{s % 60:02d}"


def _go(step: str, note: str = "") -> None:
    if step == "fire" and not proc["t_start"]:
        proc["t_start"] = time.time()
    proc["step"] = step
    proc["t_step"] = time.time()
    proc["log"].append((_met(), step, note))


def _reset() -> None:
    st.session_state.proc = {"step": "standby", "t_step": None, "t_start": None, "log": []}


step = PR.STEPS[proc["step"]]

c_steps, c_main, c_side = st.columns([0.9, 1.8, 1.25], gap="large")

with c_steps:
    UI.section(t("proc.sec_flow"))
    cur_i = PR.ORDER.index(proc["step"])
    html = ""
    for i, key in enumerate(PR.ORDER):
        s = PR.STEPS[key]
        cls = "on" if i == cur_i else ("done" if i < cur_i else "")
        mark = "●" if i == cur_i else ("✓" if i < cur_i else "○")
        html += f'<div class="ff-step {cls}"><span>{mark}</span><code>{s.code}</code>{t(f"step.{key}.title")}</div>'
    st.markdown(html, unsafe_allow_html=True)
    st.markdown("<div style='height:10px'></div>", unsafe_allow_html=True)
    st.segmented_control(t("proc.time_scale"), [1, 10, 60], key="proc_speed", default=1,
                         format_func=lambda v: f"{v}×", help=t("proc.time_scale_help"))
    st.button(t("proc.reset"), on_click=_reset, icon=":material/restart_alt:", width="stretch")

with c_main:
    UI.section(t("proc.step_label", code=step.code))
    st.markdown(f"### {t(f'step.{step.key}.title')}")
    st.markdown(f'<div class="ff-cmd">{_cmd(step)}</div>', unsafe_allow_html=True)
    st.markdown(f"<span style='color:{T.INK_2}'>{t(f'step.{step.key}.why')}</span>", unsafe_allow_html=True)
    st.markdown("<div style='height:12px'></div>", unsafe_allow_html=True)

    if proc["step"] == "standby":
        st.button(t("proc.btn_alarm"), type="primary", icon=":material/local_fire_department:",
                  on_click=_go, args=("fire",), width="stretch")
    elif proc["step"] == "fire":
        st.button(t("proc.btn_start_96"), type="primary", on_click=_go, args=("fan_off",), width="stretch")
    elif step.decision:
        b1, b2 = st.columns(2)
        b1.button(t("proc.btn_out"), type="primary", icon=":material/check_circle:", width="stretch",
                  on_click=lambda: _go(PR.next_step(proc["step"], True), "note.confirmed_out"))
        label = t("proc.btn_not_out_fan") if proc["step"] == "fan_off" else t("proc.btn_not_out_gn2")
        b2.button(label, icon=":material/cancel:", width="stretch",
                  on_click=lambda: _go(PR.next_step(proc["step"], False), "note.still_burning"))
    elif step.duration_s:
        speed = st.session_state.get("proc_speed") or 1

        @st.fragment(run_every=1.0)
        def _timer():
            elapsed = (time.time() - proc["t_step"]) * speed
            remaining = max(step.duration_s - elapsed, 0)
            st.markdown(f'<div class="ff-timer">{int(remaining) // 60}:{int(remaining) % 60:02d}</div>',
                        unsafe_allow_html=True)
            st.progress(min(elapsed / step.duration_s, 1.0))
            if remaining <= 0 and st.session_state.proc["step"] == step.key:
                _go(PR.next_step(step.key), "note.timer_done")
                st.rerun(scope="app")

        _timer()
        st.button(t("proc.btn_manual"), on_click=lambda: _go(PR.next_step(step.key), "note.manual"),
                  icon=":material/skip_next:")
    elif proc["step"] == "safe":
        st.success(t("proc.done"), icon=":material/verified:")

with c_side:
    UI.section(t("proc.sec_advice"))
    q = PR.quiescent_limit()
    if PR.fan_off_sufficient(sc.o2_pct):
        UI.insight(Insight("good", "fan_off_ok", dict(q=q, o2=sc.o2_pct), "physics"))
    else:
        UI.insight(Insight("critical", "gn2_ready", dict(q=q, o2=sc.o2_pct, target=q - 1,
                                                         v=PR.gn2_volume_l(sc.o2_pct)), "physics"))
    UI.insight(Insight("warning", "purge_full", {}, "procedure"))
    UI.section(t("proc.sec_log"))
    lines = []
    for met, key, note in reversed(proc["log"]):
        s = PR.STEPS[key]
        lines.append(f"[MET {met}] {s.code:>5}  {_cmd(s)}" + (f" — {t(note)}" if note else ""))
    st.markdown(f'<div class="ff-card ff-log">{"<br>".join(lines) or t("proc.log_empty")}</div>',
                unsafe_allow_html=True)

# --------------------------------------------------------------------------- #
# Donanım araçları
# --------------------------------------------------------------------------- #
UI.section(t("proc.sec_tools"))
t1, t2 = st.columns(2, gap="large")

with t1:
    st.markdown(f"#### {t('proc.fan_title')}")
    a, b = st.columns(2)
    pot = a.number_input(t("lbl.pot"), 0.0, C.FAN_POT_MAX, 2.0, 0.05)
    want = b.number_input(t("proc.target_flow"), 0.0, 22.0, 5.0, 0.5)
    r1, r2 = H.from_pot(pot), H.to_setpoint(want)
    k1, k2 = st.columns(2)
    with k1:
        UI.kpi(t("proc.pot_to_flow"), f"{r1.velocity_cm_s:.2f}", "cm/s",
               t("proc.pot_to_flow_sub", v=r1.volts, range=r1.range_text),
               "warning" if r1.extrapolated or r1.zero_flow else "good",
               t("fan.zero") if r1.zero_flow else (t("fan.extrap") if r1.extrapolated else t("fan.table")))
    with k2:
        UI.kpi(t("proc.flow_to_set"), f"Pot {r2.pot:.2f}", "", f"{r2.volts:.2f} V",
               "warning" if r2.extrapolated else "good", t("fan.extrap") if r2.extrapolated else t("fan.table"))

    pots, vel, lo, hi, extra = H.calibration_curve()
    f = go.Figure()
    f.add_vrect(x0=0, x1=C.FAN_CAL_RESTRICTOR_2[0][0], fillcolor=T.BLUE, opacity=0.08, line_width=0,
                annotation=dict(text=t("fan.zero_band"), font=dict(color=T.MUTED, size=11)),
                annotation_position="top left")
    # Ölçüm aralığı bandı (xlsx'teki min–maks)
    f.add_trace(go.Scatter(x=np.r_[pots, pots[::-1]], y=np.r_[hi, lo[::-1]], fill="toself",
                           fillcolor="rgba(57,135,229,0.16)", line=dict(width=0), hoverinfo="skip",
                           name=t("fan.band")))
    f.add_trace(go.Scatter(x=pots, y=vel, mode="lines", line=dict(color=T.BLUE, width=2), name=t("fan.nominal"),
                           customdata=np.stack([lo, hi], axis=-1),
                           hovertemplate="Pot %{x:.2f}<br>U %{y:.2f} cm/s<br>" + t("fan.range_hover")
                                         + " %{customdata[0]:.1f}–%{customdata[1]:.1f}<extra></extra>"))
    cal = np.array(C.FAN_CAL_RESTRICTOR_2)
    f.add_trace(go.Scatter(x=cal[:, 0], y=cal[:, 2], mode="markers", name=t("fan.cal_point"),
                           customdata=cal[:, [1, 3, 4]],
                           hovertemplate="Pot %{x:.2f} · %{customdata[0]:.2f} V<br>U %{y:.2f} cm/s "
                                         "(%{customdata[1]:.1f}–%{customdata[2]:.1f})<extra>NASA</extra>",
                           marker=dict(color=T.INK, size=8, line=dict(color=T.SURFACE, width=2))))
    f.add_trace(go.Scatter(x=[pot], y=[r1.velocity_cm_s], mode="markers", name=t("fan.selection"),
                           marker=dict(symbol="diamond", size=13, color=T.ORANGE, line=dict(color=T.SURFACE, width=2))))
    f.update_layout(height=320, xaxis_title=t("lbl.pot"), yaxis_title=t("axis.flow_speed"))
    st.plotly_chart(f, config=CH.CFG, width="stretch")

with t2:
    st.markdown(f"#### {t('proc.hrr_title')}")
    a, b, c = st.columns(3)
    d_o2 = a.number_input(t("proc.o2_drop"), 0.0, 5.0, 0.30, 0.01, format="%.2f")
    dur = b.number_input(t("proc.duration"), 1.0, 2000.0, 240.0, 10.0)
    p_kpa = c.number_input(t("lbl.pressure"), 30.0, 110.0, C.STD_P_KPA, 0.5)
    hrr = P.hrr_watts(d_o2, dur, p_kpa=p_kpa)
    m = P.o2_mass_consumed_g(d_o2, p_kpa=p_kpa)
    s, txt = UI.status_for(hrr, C.HRR_CAUTION_W, C.HRR_WINDOW_DAMAGE_W)
    k1, k2 = st.columns(2)
    with k1:
        UI.kpi(t("arch.kpi_avg_hrr"), f"{hrr:.1f}", "W",
               f"{C.HUGGETT_KJ_PER_G_O2} kJ/g O₂ · {C.MSG_VOLUME_L:.0f} L", s, txt)
    with k2:
        UI.kpi(t("proc.o2_consumed"), f"{m:.2f}", "g", t("proc.energy", e=m * C.HUGGETT_KJ_PER_G_O2))
    f = go.Figure()
    f.add_trace(go.Bar(x=[hrr], y=["HRR"], orientation="h", marker=dict(color=T.STATUS[s]), width=0.45,
                       hovertemplate="%{x:.1f} W<extra></extra>", showlegend=False))
    f.add_vline(x=C.HRR_WINDOW_DAMAGE_W, line=dict(color=T.INK_2, dash="dash", width=1.5),
                annotation=dict(text=t("arch.m5_line"), font=dict(color=T.INK_2, size=11)))
    f.update_layout(height=150, margin=dict(l=48, r=20, t=30, b=36), xaxis_range=[0, max(160, hrr * 1.1)],
                    xaxis_title="W")
    st.plotly_chart(f, config=CH.CFG, width="stretch")
    st.latex(r"\dot Q = 13.1\,\tfrac{kJ}{g}\cdot \frac{\Delta X_{O_2}\,\frac{P V}{R T}\,M_{O_2}}{\Delta t}")
