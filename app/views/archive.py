"""ISS Test Archive — BASS-II testlerinin filtrelenmesi, incelenmesi ve telemetri yeniden yapılandırması."""
from __future__ import annotations

import numpy as np
import plotly.graph_objects as go
import streamlit as st

from app import config as C
from app.i18n import labeler, t, tv
from app.ui import charts as CH
from app.ui import components as UI
from app.ui import state
from app.ui import theme as T

bundle = state.data()
df = bundle.df

UI.header(t("eyebrow.analysis"), t("arch.title"), t("arch.subtitle"), [UI.data_badge(bundle)])

# --- Filtreler (tek satır; değerler dilden bağımsız kodlar) -----------------
FLAGS = {"hrr": "Flag_HRR_100W", "co": "Flag_CO_Sat", "blind": "Flag_Earth_Safe_Space_Burn",
         "ign": "Flag_Ign_Over_25s"}
o2_lo, o2_hi = float(np.floor(df["O2_initial"].min())), float(np.ceil(df["O2_initial"].max()))
f1, f2, f3, f4 = st.columns([1.3, 1, 1.3, 1.2])
mats = f1.multiselect(t("lbl.material"), sorted(df["Material"].unique()), placeholder=t("arch.all"),
                      format_func=labeler("mat"))
outcome = f2.selectbox(t("col.outcome"), ["all", "burning", "extinguished"],
                       format_func=labeler("outcome", {"all": "arch.all"}))
o2_rng = f3.slider(t("arch.o2_range"), o2_lo, o2_hi, (o2_lo, o2_hi), 0.5)
flag = f4.selectbox(t("arch.flag"), ["any", *FLAGS], format_func=labeler("arch.flag"))

view = df[df["O2_initial"].between(*o2_rng)]
if mats:
    view = view[view["Material"].isin(mats)]
if outcome != "all":
    view = view[view["Outcome"] == outcome]
flag_col = FLAGS.get(flag)
if flag_col and flag_col in view:
    view = view[view[flag_col]]

# --- Özet ------------------------------------------------------------------
k = st.columns(5)
with k[0]:
    UI.kpi(t("arch.kpi_tests"), f"{len(view)}", f"/ {len(df)}", t("arch.kpi_tests_sub"))
with k[1]:
    UI.kpi(t("arch.kpi_ext_rate"), f"{view['Extinction'].mean() * 100:.0f}" if len(view) else "—", "%",
           t("arch.kpi_ext_rate_sub"))
with k[2]:
    n = int(view["Flag_HRR_100W"].sum())
    UI.kpi(t("arch.kpi_hrr"), f"{n}", t("unit.tests"), t("arch.kpi_hrr_sub"), "critical" if n else "good",
           t("arch.kpi_hrr_st") if n else t("arch.kpi_hrr_ok"))
with k[3]:
    n = int(view["Flag_CO_Sat"].sum())
    UI.kpi(t("arch.kpi_co"), f"{n}", t("unit.tests"), f"≥ {C.CO_SENSOR_SAT_PPM:.0f} ppm",
           "critical" if n else "good", t("arch.kpi_co_st") if n else t("arch.kpi_co_ok"))
with k[4]:
    n = int(view["Flag_Earth_Safe_Space_Burn"].sum())
    UI.kpi(t("arch.kpi_blind"), f"{n}", t("unit.tests"), t("flam.kpi_blind_sub", v=C.EARTH_PMMA_LOI_PCT),
           "serious" if n else "good", t("arch.kpi_blind_st") if n else t("arch.kpi_blind_ok"))

# --- Tablo -------------------------------------------------------------------
UI.section(t("arch.sec_table"))
cols = ["Test_ID", "Sample_No", "Material", "Geometry", "O2_initial", "O2_final", "Flow_Vel", "Radius_cm",
        "O2_Margin", "Outcome", "HRR_W", "CO_ppm", "Ignition_Time", "Burn_Time"]
cols = [c for c in cols if c in view]
shown = view[cols].assign(
    Material=view["Material"].map(lambda m: tv("mat", m)),
    Geometry=view["Geometry"].map(lambda g: tv("geo", g)),
    Outcome=view["Outcome"].map(lambda o: tv("outcome", o)),
)
event = st.dataframe(
    shown, hide_index=True, width="stretch", height=320, on_select="rerun", selection_mode="single-row",
    column_config={
        "Test_ID": t("col.test_id"), "Sample_No": t("col.sample"), "Material": t("col.material"),
        "Geometry": t("col.geometry"), "Outcome": t("col.outcome"),
        "O2_initial": st.column_config.NumberColumn(t("col.o2_init"), format="%.2f"),
        "O2_final": st.column_config.NumberColumn(t("col.o2_final"), format="%.2f"),
        "Flow_Vel": st.column_config.NumberColumn("U cm/s", format="%.2f"),
        "Radius_cm": st.column_config.NumberColumn("r cm", format="%.3f"),
        "O2_Margin": st.column_config.NumberColumn(t("col.margin"), format="%+.2f"),
        "HRR_W": st.column_config.ProgressColumn("HRR W", format="%.0f", min_value=0,
                                                 max_value=float(max(150, df["HRR_W"].max(skipna=True) or 150))),
        "CO_ppm": st.column_config.NumberColumn("CO ppm", format="%.0f"),
        "Ignition_Time": st.column_config.NumberColumn(t("col.ign_s"), format="%.0f"),
        "Burn_Time": st.column_config.NumberColumn(t("col.dur_s"), format="%.0f"),
    },
)
st.download_button(t("arch.download"), view.to_csv(index=False).encode("utf-8"),
                   "bass2_filtered.csv", "text/csv", icon=":material/download:")

# --- Tek test detayı -----------------------------------------------------
rows = event.selection.rows if event and event.selection else []
if rows:
    row = view.iloc[rows[0]]
    burning = row["Extinction"] == 0
    UI.section(t("arch.detail", id=row["Test_ID"], mat=tv("mat", row["Material"]),
                 geo=tv("geo", row["Geometry"]).lower(), r=row["Radius_cm"]))
    d1, d2, d3, d4 = st.columns(4)
    with d1:
        UI.kpi(t("arch.kpi_outcome"), tv("outcome", row["Outcome"]), "",
               t("arch.kpi_regime", regime=t("regime." + row["Regime"])),
               "serious" if burning else "good", t("arch.flame_sustained") if burning else t("arch.flame_out"))
    with d2:
        UI.kpi(t("kpi.margin"), f"{row['O2_Margin']:+.2f}", t("unit.points"),
               t("arch.kpi_margin_sub", lim=row["Olson_Limit"], a=row["Strain_Rate"]))
    with d3:
        s, txt = UI.status_for(row["HRR_W"], C.HRR_CAUTION_W, C.HRR_WINDOW_DAMAGE_W)
        UI.kpi(t("arch.kpi_avg_hrr"), f"{row['HRR_W']:.0f}", "W", t("arch.kpi_avg_hrr_sub", g=row["O2_Consumed_g"]),
               s, txt)
    with d4:
        s, txt = UI.status_for(row["CO_ppm"], C.CO_CAUTION_PPM, C.CO_SENSOR_SAT_PPM)
        UI.kpi("CO", f"{row['CO_ppm']:.0f}", "ppm", f"CO₂ {row['CO2_pct']:.3f}%", s,
               t("arch.co_saturated") if row["Flag_CO_Sat"] else txt)

    if "Burn_Time" in row and np.isfinite(row["Burn_Time"]):
        tt = np.linspace(0, row["Burn_Time"], 120)
        ign = float(row.get("Ignition_Time", 0) or 0)
        frac = np.clip((tt - ign) / max(row["Burn_Time"] - ign, 1), 0, 1)
        o2 = row["O2_initial"] - frac * row["O2_Drop"]
        co = np.minimum(frac * row["CO_ppm"], C.CO_SENSOR_SAT_PPM)
        p1, p2 = st.columns(2, gap="large")
        with p1:
            f = go.Figure(go.Scatter(x=tt, y=o2, mode="lines", line=dict(color=T.BLUE, width=2),
                                     hovertemplate="t = %{x:.0f} s<br>O₂ = %{y:.3f}%<extra></extra>"))
            f.add_hline(y=row["Olson_Limit"], line=dict(color=T.MUTED, dash="dot", width=1),
                        annotation=dict(text=t("arch.olson_line", v=row["Olson_Limit"]),
                                        font=dict(color=T.MUTED, size=11)))
            if ign:
                f.add_vline(x=ign, line=dict(color=T.INK_2, dash="dash", width=1),
                            annotation=dict(text=t("arch.ignition_line", v=ign), font=dict(color=T.INK_2, size=11)))
            f.update_layout(height=300, title=t("arch.o2_title"), xaxis_title=t("axis.time"),
                            yaxis_title=t("axis.o2_pct"))
            st.plotly_chart(f, config=CH.CFG, width="stretch")
        with p2:
            f = go.Figure(go.Scatter(x=tt, y=co, mode="lines", line=dict(color=T.ORANGE, width=2),
                                     hovertemplate="t = %{x:.0f} s<br>CO = %{y:.0f} ppm<extra></extra>"))
            f.add_hline(y=C.CO_SENSOR_SAT_PPM, line=dict(color=T.STATUS["critical"], dash="dash", width=1),
                        annotation=dict(text=t("arch.co_sat_line"), font=dict(color=T.INK_2, size=11)))
            f.update_layout(height=300, title=t("arch.co_title"), xaxis_title=t("axis.time"),
                            yaxis_title="CO [ppm]", yaxis_range=[0, C.CO_SENSOR_SAT_PPM * 1.15])
            st.plotly_chart(f, config=CH.CFG, width="stretch")
        st.caption(t("arch.reconstruct_caption"))
else:
    st.info(t("arch.select_hint"), icon=":material/touch_app:")

# --- Dağılımlar ----------------------------------------------------------
UI.section(t("arch.sec_dist"))
h1, h2 = st.columns(2, gap="large")
with h1:
    if "Ignition_Time" in view:
        st.plotly_chart(CH.hist_with_threshold(view["Ignition_Time"], C.STD6001_IGNITION_S, t("arch.std_line"),
                                               t("arch.ign_hist_title"), t("axis.ignition_s"),
                                               extra=(C.BASS2_MAX_IGNITION_S, "230 s")),
                        config=CH.CFG, width="stretch")
with h2:
    st.plotly_chart(CH.hist_with_threshold(view["HRR_W"], C.HRR_WINDOW_DAMAGE_W, t("arch.m5_line"),
                                           t("arch.hrr_hist_title"), "HRR [W]", color=T.ORANGE),
                    config=CH.CFG, width="stretch")
