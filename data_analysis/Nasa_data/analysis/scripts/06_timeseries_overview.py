"""Faz 6 - time-series overview: SAFFIRE-III sample sensors + 1 Hz smoke telemetry, SAME-R HKP segmentation.
Exports are NOT merged with each other. Only needed columns are read."""
import numpy as np
import pandas as pd

from _common import CAT, CSV, FIG, INK2, OUT, append_assumption, md_table, setup_mpl

plt = setup_mpl()
L = ["# Zaman serisi özeti (Faz 6)", ""]

# ============================================================ SAFFIRE-III sample sensor files
S3 = {1: "PSI-100/PSI-100_Raw_Data_Saffire_III_Sample_1_Sensors__Calibrated_Data.csv",
      2: "PSI-100/PSI-100_Raw_Data_Saffire_III_Sample_2_Sensors__Calibrated_Data.csv"}
USE = ["elapsed time (s)", "co2", "o2", "ambient pressure", "radiometer 1", "radiometer 2", "radiometer 3",
       "radiometer 4", "plume temp 1 (tc1)", "plume temp 3 (tc3)", "plume temp 6 (tc6)", "sample temp 1 (tc7)",
       "igniter current", "anemometer 1"]
ev_rows, ch_rows = [], []
fig, axes = plt.subplots(4, 2, figsize=(12, 9), sharex="col")
for j, (k, f) in enumerate(S3.items()):
    head = pd.read_csv(CSV / f, nrows=1)
    units = dict(zip(head.columns, head.iloc[0].astype(str)))
    d = pd.read_csv(CSV / f, skiprows=[1], usecols=lambda c: c in USE, low_memory=False)
    d = d.apply(pd.to_numeric, errors="coerce")
    t = d["elapsed time (s)"]
    bad_t = (t < 0) | t.isna() | (t.diff() <= 0)
    d = d[~bad_t].reset_index(drop=True)
    t = d["elapsed time (s)"]
    dt = t.diff().median()
    for c in USE[1:]:
        ch_rows.append(dict(sample=k, channel=c, unit=units.get(c, "unit_unknown"), n=int(d[c].notna().sum()),
                            min=d[c].min(), median=d[c].median(), max=d[c].max()))
    # --- descriptive event detection
    rad = d[["radiometer 1", "radiometer 2", "radiometer 3", "radiometer 4"]].mean(axis=1).rolling(5, center=True, min_periods=1).median()
    base = rad.iloc[: max(10, int(60 / dt))].median()
    ign_i = d.index[d["igniter current"] > 0.5]
    t_ign = t[ign_i[0]] if len(ign_i) else np.nan
    t_ign_off = t[ign_i[-1]] if len(ign_i) else np.nan
    pk = rad.idxmax()
    amp = rad[pk] - base
    after = rad.loc[pk:]
    below = after.index[(after - base) < 0.1 * amp]
    t_ext = t[below[0]] if len(below) else np.nan
    over = (rad - base) > 0.5 * amp
    auc = np.trapezoid((rad - base).clip(lower=0), t)
    o2_drop = d["o2"].iloc[: int(60 / dt)].median() - d["o2"].min()
    co2_rise = d["co2"].max() - d["co2"].iloc[: int(60 / dt)].median()
    ev_rows.append(dict(sample=k, n_rows=len(d), dropped_time_rows=int(bad_t.sum()), dt_s=dt,
                        duration_s=t.iloc[-1] - t.iloc[0], t_igniter_on_s=t_ign, t_igniter_off_s=t_ign_off,
                        t_rad_peak_s=t[pk], rad_peak_mw_cm2=rad[pk], rad_baseline=base, t_extinction_s=t_ext,
                        flame_duration_est_s=(t_ext - t_ign) if np.isfinite(t_ext) and np.isfinite(t_ign) else np.nan,
                        time_above_half_peak_s=float(over.sum() * dt), rad_auc=auc,
                        plume_T_peak_C=d["plume temp 3 (tc3)"].max(), o2_drop_pct=o2_drop, co2_rise_pct=co2_rise))
    # --- plots
    ax = axes[0, j]
    for i, c in enumerate(["radiometer 1", "radiometer 2", "radiometer 3", "radiometer 4"]):
        ax.plot(t, d[c], lw=1, color=CAT[i], label=c)
    ax.set_title(f"SAFFIRE-III numune {k}: radyometreler ({units.get('radiometer 1')})")
    ax.legend(fontsize=6, ncol=2)
    ax = axes[1, j]
    for i, c in enumerate(["plume temp 1 (tc1)", "plume temp 3 (tc3)", "plume temp 6 (tc6)", "sample temp 1 (tc7)"]):
        ax.plot(t, d[c], lw=1, color=CAT[i], label=c)
    ax.set_title("sıcaklıklar (°C)")
    ax.legend(fontsize=6, ncol=2)
    ax = axes[2, j]
    ax.plot(t, d["o2"], color=CAT[0], lw=1.2, label="O2 (%)")
    ax.set_ylabel("O2 (%)")
    ax2 = ax.inset_axes([0, 0, 1, 1], facecolor="none")
    ax.set_title("O2 (%) — CO2 aşağıda ayrı panelde")
    ax2.remove()
    ax = axes[3, j]
    ax.plot(t, d["co2"], color=CAT[1], lw=1.2)
    ax.set_title("CO2 (%)")
    ax.set_xlabel("elapsed time (s)")
    for ax in axes[:, j]:
        for tt, lab in [(t_ign, "ateşleme"), (t[pk], "pik"), (t_ext, "sönme (tahmini)")]:
            if np.isfinite(tt):
                ax.axvline(tt, color=INK2, ls=":", lw=0.9)
        if np.isfinite(t_ign):
            ax.annotate("ateşleme", (t_ign, 1), xycoords=("data", "axes fraction"), fontsize=6, color=INK2, va="top")
fig.suptitle("SAFFIRE-III numune sensörleri (dikey noktalı çizgiler: ateşleme / radyometre piki / tahmini sönme)",
             fontweight="bold", fontsize=9)
fig.tight_layout()
fig.savefig(FIG / "ts_saffire3_samples.png")
plt.close(fig)
EV = pd.DataFrame(ev_rows)
CH = pd.DataFrame(ch_rows)
EV.to_csv(OUT / "ts_saffire3_events.csv", index=False)
CH.to_csv(OUT / "ts_saffire3_channels.csv", index=False)
append_assumption("ts_events", "SAFFIRE-III olay tespiti betimseldir: ateşleme = igniter current > 0.5 A ilk an; pik = 4 radyometre ortalamasının (5 nokta medyan) maksimumu; sönme = pikten sonra sinyalin (taban + %10·genlik) altına ilk düştüğü an. Taban = ilk 60 s medyanı.")

# ============================================================ SAFFIRE-III 1 Hz Cygnus smoke detector
f = "PSI-100/PSI-100_Raw_Data_Saffire-III_1_Hz_Telemetry_Data__CygnusData.csv"
cy = pd.read_csv(CSV / f, usecols=["relative time (ms)", "fiz1 smoke detector obscuration (v)",
                                    "fiz 2 smoke detector obscuration (v)", "pcm air temp (degc)",
                                    "pcm press eps 1 (psi)"])
cy = cy.apply(pd.to_numeric, errors="coerce")
n0 = len(cy)
cy = cy[(cy["relative time (ms)"] >= 0)].copy()
cy["t_s"] = cy["relative time (ms)"] / 1000.0
cy = cy.sort_values("t_s").drop_duplicates("t_s")
sentinel = cy[["pcm air temp (degc)", "pcm press eps 1 (psi)"]].eq(0).all(axis=1)
cy = cy[~sentinel]
fig, axes = plt.subplots(3, 1, figsize=(10, 6), sharex=True)
axes[0].plot(cy.t_s / 3600, cy["fiz1 smoke detector obscuration (v)"], lw=0.8, color=CAT[0], label="FIZ1")
axes[0].plot(cy.t_s / 3600, cy["fiz 2 smoke detector obscuration (v)"], lw=0.8, color=CAT[1], label="FIZ2")
axes[0].set_title("Cygnus duman dedektörü örtme (obscuration, V)")
axes[0].legend(fontsize=7)
axes[1].plot(cy.t_s / 3600, cy["pcm air temp (degc)"], lw=0.8, color=CAT[2])
axes[1].set_title("PCM hava sıcaklığı (°C)")
axes[2].plot(cy.t_s / 3600, cy["pcm press eps 1 (psi)"], lw=0.8, color=CAT[6])
axes[2].set_title("PCM basınç EPS1 (psi)")
axes[2].set_xlabel("relative time (saat)  [kaynak: 'relative time (ms)' / 1000]")
fig.suptitle("SAFFIRE-III 1 Hz telemetri (CygnusData export'u, diğer export'larla BİRLEŞTİRİLMEDİ)", fontweight="bold", fontsize=9)
fig.tight_layout()
fig.savefig(FIG / "ts_saffire3_cygnus_1hz.png")
plt.close(fig)
cy_info = dict(rows_raw=n0, rows_used=len(cy), dropped_negative_or_sentinel=n0 - len(cy),
               median_dt_s=float(cy.t_s.diff().median()), span_h=float((cy.t_s.max() - cy.t_s.min()) / 3600))
append_assumption("saffire3_time", "SAFFIRE-III 1 Hz export'larında zaman = 'relative time (ms)'/1000 (RelativeSeconds başlıklı sütunlar da aslında ms). Negatif zaman satırları ve tüm kanalların 0 olduğu sentinel satırlar atıldı. 3 telemetri export'u birleştirilmedi.")

# ============================================================ SAME-R HKP
files = sorted((CSV / "PSI-101").glob("PSI-101_Raw_Data_HKPData_gmt*.csv"))
HC = ["elapsedtesttime(secs)", "time", "samplenumber", "testnumber", "gasplumetemperature(degc)",
      "issdetectorobscurationmeasurement(volts)", "iondetectorameasurement(volts)", "iondetectorbmeasurement(volts)",
      "ptrakmeasurement(ptpercc)", "dusttrakameasurement(mgperm3)", "stsdetectormeasurement(volts)"]
seg_rows = []
store = {}
for fp in files:
    d = pd.read_csv(fp, usecols=lambda c: c.strip().lower() in HC, low_memory=False)
    d.columns = [c.strip().lower() for c in d.columns]
    d = d.apply(pd.to_numeric, errors="coerce")
    if "elapsedtesttime(secs)" not in d:
        continue
    et = d["elapsedtesttime(secs)"]
    d["segment"] = (et.diff() < 0).cumsum()
    pt = d.get("ptrakmeasurement(ptpercc)")
    if pt is not None:
        sent = pt.isin([-999, 9999, 99999]) | (pt < 0)
        d.loc[sent, "ptrakmeasurement(ptpercc)"] = np.nan
    for sgi, s in d.groupby("segment"):
        r = dict(file=fp.name, segment=int(sgi), n_rows=len(s),
                 duration_s=float(s["elapsedtesttime(secs)"].max() - s["elapsedtesttime(secs)"].min()),
                 sample=s["samplenumber"].mode().iat[0] if "samplenumber" in s and s["samplenumber"].notna().any() else np.nan,
                 test=s["testnumber"].mode().iat[0] if "testnumber" in s and s["testnumber"].notna().any() else np.nan,
                 ptrak_sentinel_n=int(sent.loc[s.index].sum()) if pt is not None else 0)
        for c in HC[4:]:
            if c in s:
                r[f"max_{c.split('(')[0]}"] = s[c].max()
        seg_rows.append(r)
        store[(fp.name, int(sgi))] = s
SG = pd.DataFrame(seg_rows)
SG.to_csv(OUT / "ts_hkp_segments.csv", index=False)
long = SG[SG.duration_s > 60].sort_values("duration_s", ascending=False)
pick = long.drop_duplicates("file").head(3)
fig, axes = plt.subplots(3, 3, figsize=(12, 7))
for i, (_, r) in enumerate(pick.iterrows()):
    s = store[(r.file, r.segment)]
    t = s["elapsedtesttime(secs)"]
    for j, (c, lab) in enumerate([("gasplumetemperature(degc)", "gaz plume sıcaklığı (°C)"),
                                  ("iondetectorbmeasurement(volts)", "iyon dedektörü B (V)"),
                                  ("ptrakmeasurement(ptpercc)", "P-Trak (pt/cc)")]):
        ax = axes[i, j]
        ax.plot(t, s[c], lw=1, color=CAT[j])
        ax.set_title(f"{r.file.replace('PSI-101_Raw_Data_HKPData_', '')} seg {r.segment}: {lab}", fontsize=7)
        ax.tick_params(labelsize=7)
    axes[i, 0].set_ylabel("değer")
for ax in axes[-1]:
    ax.set_xlabel("elapsedtesttime (s)")
fig.suptitle("SAME-R HKP: en uzun 3 run (segment = elapsedtesttime geri düştüğünde yeni run)", fontweight="bold", fontsize=9)
fig.tight_layout()
fig.savefig(FIG / "ts_same_hkp_runs.png")
plt.close(fig)
append_assumption("hkp_segments", "SAME-R HKP: yalnızca PSI-101 'Raw_Data_HKPData_gmt*' (44 dosya) kullanıldı (PSI-102 HKP'leri kopya/ortalama sayfaları içeriyor). elapsedtesttime geri düştüğünde yeni segment; ana zaman elapsedtesttime (positionerclock değil). ptrak -999/9999/negatif -> NaN.")

FEATS = pd.DataFrame([
    ("peak_value", "kanal maksimumu (radyometre, plume T, CO2, duman örtme, iyon B)", "SAFFIRE, HKP"),
    ("time_to_peak_s", "ateşlemeden pike süre", "SAFFIRE"),
    ("flame_duration_est_s", "ateşleme → sönme (eşik altı)", "SAFFIRE"),
    ("time_above_threshold_s", "sinyalin %50 pik üstünde kaldığı süre", "SAFFIRE, HKP"),
    ("rise_slope", "ateşleme sonrası ilk N s'de eğim (ör. radyometre, CO2)", "SAFFIRE"),
    ("decay_slope", "pik sonrası sönüm eğimi / zaman sabiti", "SAFFIRE"),
    ("auc", "taban çıkarılmış eğri altı alan (toplam radyatif enerji vekili)", "SAFFIRE, HKP"),
    ("o2_drop / co2_rise", "test başı–min/max farkı (tüketim/üretim)", "SAFFIRE"),
    ("baseline / noise", "ilk 60 s medyan ve MAD (sensör ofseti)", "tümü"),
    ("run_duration_s, n_rows", "segment süresi, örnek sayısı", "HKP"),
    ("ptrak/dusttrak peak & mean", "partikül sayısı/kütle konsantrasyonu özeti", "HKP"),
], columns=["feature", "tanım", "kaynak"])
L += ["## SAFFIRE-III numune sensörleri", "", md_table(EV.round(2)), "",
      "Kanallar ve birimler: `outputs/ts_saffire3_channels.csv`. Figür: `figures/ts_saffire3_samples.png`.", "",
      "## SAFFIRE-III 1 Hz Cygnus telemetri", "", md_table(pd.DataFrame([cy_info]).round(2)), "",
      "## SAME-R HKP segmentasyonu", "",
      f"- {len(files)} dosya, {len(SG)} segment; >60 s segment: {len(long)}; süre medyanı {long.duration_s.median():.0f} s.",
      f"- P-Trak sentinel/negatif hücre: {int(SG.ptrak_sentinel_n.sum())}", "",
      md_table(long.head(10).round(2)), "",
      "## Run başına üretilebilecek feature'lar", "", md_table(FEATS)]
(OUT / "timeseries_summary.md").write_text("\n".join(L) + "\n")
print(EV[["sample", "n_rows", "dt_s", "t_igniter_on_s", "t_rad_peak_s", "t_extinction_s", "flame_duration_est_s",
          "rad_peak_mw_cm2", "o2_drop_pct", "co2_rise_pct"]].round(2).to_string(index=False))
print(cy_info)
print(f"HKP files={len(files)} segments={len(SG)} long={len(long)} ptrak_sentinel={int(SG.ptrak_sentinel_n.sum())}")
