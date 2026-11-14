"""Mission Control — kabin atmosferi + malzeme senaryosu için anlık yangın riski."""
from __future__ import annotations

import numpy as np
import streamlit as st

from app import config as C
from app.core import hardware as H
from app.core.risk import Scenario, assess
from app.i18n import labeler, t, tv
from app.ui import charts as CH
from app.ui import components as UI
from app.ui import state

bundle = state.data()
model, _ = state.model()

UI.header(t("mission.eyebrow"), t("mission.title"), t("mission.subtitle"),
          [UI.data_badge(bundle), UI.model_badge(model)])

# --------------------------------------------------------------------------- #
# Senaryo girdileri (widget değerleri dilden bağımsız kodlardır)
# --------------------------------------------------------------------------- #
KEYS = ["w_atm", "w_o2", "w_p", "w_flowmode", "w_u", "w_pot", "w_v", "w_mat", "w_geo", "w_r", "w_th"]
d = Scenario()
state.bind("w_atm", "iss")
state.bind("w_o2", d.o2_pct)
state.bind("w_p", d.pressure_kpa)
state.bind("w_flowmode", "velocity")
state.bind("w_u", d.flow_cm_s)
state.bind("w_pot", 1.4)
state.bind("w_v", 4.9)
state.bind("w_mat", d.material)
state.bind("w_geo", d.geometry)
state.bind("w_r", d.radius_cm)
state.bind("w_th", 0.2)


def _apply_preset():
    preset = C.ATMOSPHERES.get(st.session_state.w_atm)
    if preset:
        st.session_state.w_o2, st.session_state.w_p = preset


left, right = st.columns([1, 2.3], gap="large")

with left:
    with st.container(border=True):
        UI.section(t("mission.sec_atmosphere"))
        st.selectbox(t("lbl.scenario"), list(C.ATMOSPHERES), key="w_atm", on_change=_apply_preset,
                     format_func=labeler("atm"))
        st.slider(t("lbl.o2"), 10.0, 40.0, step=0.1, key="w_o2")
        st.slider(t("lbl.pressure"), 30.0, 105.0, step=0.1, key="w_p")

        UI.section(t("mission.sec_ventilation"))
        mode = st.segmented_control(t("lbl.flow_input"), ["velocity", "pot", "volts"], key="w_flowmode",
                                    format_func=labeler("flowmode"),
                                    label_visibility="collapsed") or "velocity"
        if mode == "pot":
            st.slider(t("lbl.fan_pot"), 0.0, C.FAN_POT_MAX, step=0.05, key="w_pot")
            reading = H.from_pot(st.session_state.w_pot)
        elif mode == "volts":
            st.slider(t("lbl.fan_volts"), 0.0, C.FAN_V_MAX, step=0.05, key="w_v")
            reading = H.from_volts(st.session_state.w_v)
        else:
            st.slider(t("lbl.velocity"), 0.0, 20.0, step=0.1, key="w_u")
            reading = H.to_setpoint(st.session_state.w_u)
        flow = reading.velocity_cm_s
        note = (t("fan.zero") if reading.zero_flow else
                t("fan.extrap") if reading.extrapolated else t("fan.range", range=reading.range_text))
        st.caption(t("mission.flow_caption", u=flow, pot=reading.pot, v=reading.volts, note=note))

        UI.section(t("mission.sec_material"))
        st.selectbox(t("lbl.material"), C.MATERIALS, key="w_mat", format_func=labeler("mat"))
        geo = st.selectbox(t("lbl.geometry"), C.GEOMETRIES, key="w_geo", format_func=labeler("geo"))
        st.select_slider(t("lbl.radius"), options=[0.159, 0.318, 0.476, 0.635, 0.953, 1.27],
                         key="w_r", format_func=lambda v: f"{v:.3f}")
        if geo == "flat":
            st.select_slider(t("lbl.thickness"), options=[0.1, 0.2, 0.5, 1.0], key="w_th")
            thickness = st.session_state.w_th
        else:
            thickness = 2 * st.session_state.w_r

state.save(*KEYS)
sc = Scenario(o2_pct=st.session_state.w_o2, pressure_kpa=st.session_state.w_p, flow_cm_s=flow,
              radius_cm=st.session_state.w_r, thickness_cm=thickness,
              material=st.session_state.w_mat, geometry=geo)
st.session_state.scenario = sc
asm = assess(sc, bundle.df, model)

# --------------------------------------------------------------------------- #
# Sonuç
# --------------------------------------------------------------------------- #
with right:
    UI.banner(asm.level, asm.status, asm.score)

    c1, c2, c3, c4 = st.columns(4)
    with c1:
        UI.kpi(t("kpi.olson_limit"), f"{asm.limit_pct:.2f}", "% O₂",
               f"a = {asm.strain_rate:.1f} s⁻¹ · {t('regime.' + asm.regime)}")
    with c2:
        s = "critical" if asm.margin_pct > 1 else ("warning" if asm.margin_pct > -0.5 else "good")
        UI.kpi(t("kpi.margin"), f"{asm.margin_pct:+.2f}", t("unit.points"), t("kpi.margin_sub"), s,
               t(f"kpi.margin_{s}"))
    with c3:
        if asm.ignition_delay_s:
            s = "serious" if asm.ignition_delay_s > C.STD6001_IGNITION_S else "good"
            UI.kpi(t("kpi.ignition"), f"{asm.ignition_delay_s:.0f}", "s", t("kpi.ignition_sub"),
                   s, t("kpi.ignition_over") if s == "serious" else t("kpi.ignition_within"))
        else:
            UI.kpi(t("kpi.ignition"), "—", "", t("kpi.ignition_none_sub"), "good", t("kpi.ignition_none"))
    with c4:
        s, txt = UI.status_for(asm.hrr_est_w, C.HRR_CAUTION_W, C.HRR_WINDOW_DAMAGE_W)
        UI.kpi(t("kpi.hrr_est"), "—" if np.isnan(asm.hrr_est_w) else f"{asm.hrr_est_w:.0f}", "W",
               t("kpi.hrr_est_sub"), s, txt)

    st.markdown("<div style='height:10px'></div>", unsafe_allow_html=True)
    c5, c6, c7, c8 = st.columns(4)
    with c5:
        s, txt = UI.status_for(asm.co_est_ppm, C.CO_CAUTION_PPM, C.CO_SENSOR_SAT_PPM)
        UI.kpi(t("kpi.co_expected"), f"{asm.co_est_ppm:.0f}", "ppm",
               t("kpi.co_sat_sub", v=C.CO_SENSOR_SAT_PPM), s, txt)
    with c6:
        UI.kpi(t("kpi.co_factor"), f"{asm.co_factor:.1f}", t("unit.x_earth"), t("kpi.co_factor_sub"))
    with c7:
        UI.kpi(t("kpi.p_burn"), f"{asm.p_flame_physics * 100:.0f}", "%", t("kpi.p_burn_sub"))
    with c8:
        p = asm.p_ext_model
        UI.kpi(t("kpi.p_ext_model"), "—" if p is None else f"{p * 100:.0f}", "%",
               t("kpi.model_trained") if model.source == "trained" else t("kpi.model_surrogate"))

    st.plotly_chart(CH.ucurve(sc.radius_cm, sc.o2_pct, sc.flow_cm_s, asm.status,
                              u_max=max(12.0, float(np.ceil(sc.flow_cm_s + 1)))), config=CH.CFG,
                    width="stretch")

UI.section(t("mission.sec_insights"))
ci1, ci2 = st.columns(2, gap="medium")
for i, ins in enumerate(asm.insights):
    with (ci1 if i % 2 == 0 else ci2):
        UI.insight(ins)

with st.expander(t("mission.neighbors", n=len(asm.neighbors))):
    nb = asm.neighbors.assign(
        Material=asm.neighbors["Material"].map(lambda m: tv("mat", m)),
        Geometry=asm.neighbors["Geometry"].map(lambda g: tv("geo", g)),
        Outcome=asm.neighbors["Outcome"].map(lambda o: tv("outcome", o)),
    )
    cols = ["Test_ID", "Material", "Geometry", "O2_initial", "Flow_Vel", "Radius_cm", "O2_Margin",
            "Outcome", "HRR_W", "CO_ppm"]
    st.dataframe(nb[cols], hide_index=True, width="stretch",
                 column_config={"Test_ID": t("col.test_id"), "Material": t("col.material"),
                                "Geometry": t("col.geometry"), "Outcome": t("col.outcome"),
                                "Radius_cm": st.column_config.NumberColumn("r cm", format="%.3f"),
                                "O2_initial": st.column_config.NumberColumn(t("col.o2_init"), format="%.2f"),
                                "Flow_Vel": st.column_config.NumberColumn("U cm/s", format="%.2f"),
                                "O2_Margin": st.column_config.NumberColumn(t("col.margin"), format="%+.2f"),
                                "HRR_W": st.column_config.NumberColumn("HRR W", format="%.0f"),
                                "CO_ppm": st.column_config.NumberColumn("CO ppm", format="%.0f")})
