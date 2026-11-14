"""Faz 1 - load, clean and harmonize the core tables -> analysis/data/*.parquet.
Rules: never fill NaN with 0, non-numeric tokens -> NaN + <col>_flag, originals kept, trace columns kept."""
import re

import numpy as np
import pandas as pd

from _common import OUT, add_trace, append_assumption, md_table, read_csv, save

REPORT = []          # rows for load_report
NOTES = {}           # table -> list of notes


def rep(name, before, after, dropped_reason, flags):
    REPORT.append(dict(table=name, rows_before=before, rows_after=after,
                       dropped=before - after, drop_reason=dropped_reason,
                       flagged_cells=sum(flags.values()),
                       flag_detail="; ".join(f"{k}:{v}" for k, v in flags.items() if v)))


def numify(df, cols, tokens=None):
    flags = {}
    for c in cols:
        if c in df.columns:
            n, unexpected = (lambda r: r if isinstance(r, tuple) else (r, set()))(
                __import__("_common").to_num_flag(df, c, tokens))
            flags[c] = n
            if unexpected:
                NOTES.setdefault("unexpected_tokens", []).append(f"{c}: {sorted(unexpected)[:5]}")
    return flags


def yn(s):
    m = {"yes": 1, "no": 0}
    return s.astype("string").str.strip().str.lower().map(m).astype("Float64")


# ----------------------------------------------------------------------------- ACME normal
def acme_normal():
    f10 = "PSI-10/PSI-10_Experimental_table_Flame_Design_Normal_Flame.csv"
    f159 = "PSI-159/PSI-159_Experimental_table_CFI-G_Normal_Flames.csv"
    a = read_csv(f10, dtype=str)
    b = read_csv(f159, dtype=str)
    a.columns = [c.strip() for c in a.columns]
    b.columns = [re.sub(r"\s+", " ", c).strip() for c in b.columns]
    n0 = len(a) + len(b)
    a = add_trace(a.dropna(how="all"), "PSI-10", f10, 0)
    b = add_trace(b.dropna(how="all"), "PSI-159", f159, 0)
    a = a.rename(columns={"Flame Type": "flame_type", "Day": "day", "Fuel": "fuel_raw", "Test": "test",
                          "Xfuel": "x_fuel", "mfuel (mg/s)": "m_fuel_mg_s", "mN2 (mg/s)": "m_n2_mg_s",
                          "mtot (mg/s)": "m_tot_mg_s", "XO2 (init)": "xo2_init", "XO2 (final)": "xo2_final",
                          "pinit (atm)": "p_init_atm", "pfinal (atm)": "p_final_atm", "pmean (atm)": "p_atm",
                          "mean Zst": "zst", "Tad (K)": "tad_k_calc"})
    b = b.rename(columns={"Flame Type": "flame_type", "Day": "day", "Fuel": "fuel_raw", "Test": "test",
                          "Cool flame?": "cool_flame_raw", "XO2 before test": "xo2_init",
                          "XO2 after test": "xo2_final", "approx p (bar)": "p_bar", "Xf": "x_fuel",
                          "mHC (mg/s)": "m_fuel_mg_s", "TFP": "tfp", "Tad (K)": "tad_k_calc", "Zst": "zst",
                          "Hot ignition": "hot_ignition_raw", "burn time (sec)": "burn_time_s",
                          "Self-ext or flow term": "ext_mode_raw", "Peak burner T (C )": "peak_burner_T_C",
                          "Comments": "comments"})
    a["experiment"] = "FlameDesign"
    b["experiment"] = "CFI-G"
    tok = ["RAMP", "RAMPED", "LOW O2", "#DIV/0!", "#VALUE!", "-"]
    flags = numify(a, ["day", "x_fuel", "m_fuel_mg_s", "m_n2_mg_s", "m_tot_mg_s", "xo2_init", "xo2_final",
                       "p_init_atm", "p_final_atm", "p_atm", "zst", "tad_k_calc"], tok)
    flags.update({f"159:{k}": v for k, v in numify(
        b, ["day", "xo2_init", "xo2_final", "p_bar", "x_fuel", "m_fuel_mg_s", "tad_k_calc", "zst",
            "burn_time_s", "peak_burner_T_C"], tok).items()})
    b["p_atm"] = b["p_bar"] / 1.01325
    d = pd.concat([a, b], ignore_index=True, sort=False)
    d["test"] = d["test"].str.replace(" ", "", regex=False)
    fr = d["fuel_raw"].str.strip().str.lower()
    d["fuel_base"] = fr.str.replace(r"^\d+%\s*", "", regex=True).replace({"c2h4": "ethylene", "c3h8": "propane"})
    d["fuel_bottle_frac"] = fr.str.extract(r"^(\d+)%")[0].astype(float) / 100
    d.loc[d.fuel_bottle_frac.isna(), "fuel_bottle_frac"] = 1.0
    d["xo2_init_pct"] = d["xo2_init"] * 100       # added; original kept
    d["xo2_final_pct"] = d["xo2_final"] * 100
    d["d_xo2"] = d["xo2_final"] - d["xo2_init"]
    d["tfp"] = d["tfp"].str.strip()
    hi = d["hot_ignition_raw"].astype("string").str.strip().str.lower()
    d["hot_ignition"] = hi.map({"yes": 1, "no": 0}).astype("Float64")
    em = d["ext_mode_raw"].astype("string").str.strip()
    d["ext_mode"] = em.where(em.isin(["SE", "FT"]))        # '-' => not applicable (no ignition)
    d["cool_flame"] = d["cool_flame_raw"].astype("string").str.extract(r"^(yes|no)", flags=re.I)[0].str.lower()
    d["any_ramp_flag"] = d.filter(like="_flag").notna().any(axis=1)
    after = len(d)
    rep("acme_normal", n0, after, "tamamen boş satırlar", flags)
    append_assumption("acme_p_unit", "PSI-159 'approx p (bar)' -> p_atm = p_bar/1.01325 (yaklaşık basınç). PSI-10 'pmean (atm)' p_atm olarak kullanıldı.")
    append_assumption("acme_tad", "'Tad (K)' adyabatik alev sıcaklığı HESAPLANMIŞ bir büyüklük -> tad_k_calc adıyla tutuldu; ölçüm değil, girdilerin (XO2, yakıt, Zst) fonksiyonu.")
    append_assumption("acme_ext_mode", "'Self-ext or flow term' içindeki '-' = tutuşma olmadı/uygulanamaz -> ext_mode NaN; SE=self-extinction, FT=flow termination.")
    append_assumption("acme_ramp", "PSI-10 'RAMP/RAMPED/LOW O2' satırları akış rampası yapılan testler: sayısal değer NaN, token <col>_flag'de saklı, satır SİLİNMEDİ.")
    append_assumption("acme_tfp", "TFP (Yes/No) anlamı belgelenmemiş; kategorik olarak tutuldu, birim/anlam atanmadı.")
    append_assumption("acme_psi10_targets", "PSI-10 Flame Design tablolarında yanma süresi / tutuşma / söndürme sütunu YOK. Bu hedefler yalnızca PSI-159 (CFI-G) satırlarında tanımlı.")
    return d


def acme_inverse():
    f10 = "PSI-10/PSI-10_Experimental_table_Flame_Design_Inverse_Flame.csv"
    f159 = "PSI-159/PSI-159_Experimental_table_CFI-G_Inverse_Flames.csv"
    a = read_csv(f10, dtype=str)
    b = read_csv(f159, dtype=str)
    a.columns = [c.strip() for c in a.columns]
    b.columns = [re.sub(r"\s+", " ", c).strip() for c in b.columns]
    n0 = len(a) + len(b)
    a = add_trace(a, "PSI-10", f10).dropna(how="all", subset=a.columns)
    b = add_trace(b, "PSI-159", f159)
    nb_empty = int(b[[c for c in b.columns if c not in ("psi_id", "source_file", "source_row")]].isna().all(axis=1).sum())
    b = b.dropna(how="all", subset=[c for c in b.columns if c not in ("psi_id", "source_file", "source_row")])
    a = a.rename(columns={"Flame Type": "flame_type", "Day": "day", "Test": "test", "XO2": "xo2",
                          "mO2 (mg/s)": "m_o2_mg_s", "mN2 (mg/s)": "m_n2_mg_s", "mtot (mg/s)": "m_tot_mg_s",
                          "XC2H4 initial": "x_fuel_amb_init", "XC2H4 final": "x_fuel_amb_final",
                          "pinit (atm)": "p_init_atm", "pfinal (atm)": "p_final_atm", "pmean (atm)": "p_atm",
                          "mean Zst": "zst", "Tad (K)": "tad_k_calc"})
    a["fuel_raw"] = "C2H4"
    b = b.rename(columns={"Flame Type": "flame_type", "Day": "day", "Fuel": "fuel_raw", "Test": "test",
                          "Xf before test": "x_fuel_amb_init", "Xf after test": "x_fuel_amb_final",
                          "approx p (bar)": "p_bar", "XO2": "xo2", "HC burnrate (mg/s)": "hc_burnrate_mg_s",
                          "O2 flow rate (mg/s)": "m_o2_mg_s", "TFP": "tfp", "Tad (K)": "tad_k_calc", "Zst": "zst",
                          "Hot ignition": "hot_ignition_raw", "burn time (sec)": "burn_time_s",
                          "Self -ext or flow term": "ext_mode_raw", "Peak burner Temp (C)": "peak_burner_T_C",
                          "Peak burner temp (K)": "peak_burner_T_K", "Color": "color_raw", "Comments": "comments"})
    a["experiment"] = "FlameDesign"
    b["experiment"] = "CFI-G"
    tok = ["RAMP", "RAMPED", "LOW O2", "#DIV/0!", "#VALUE!", "-"]
    flags = numify(a, ["day", "xo2", "m_o2_mg_s", "m_n2_mg_s", "m_tot_mg_s", "x_fuel_amb_init", "x_fuel_amb_final",
                       "p_init_atm", "p_final_atm", "p_atm", "zst", "tad_k_calc"], tok)
    flags.update({f"159:{k}": v for k, v in numify(
        b, ["day", "x_fuel_amb_init", "x_fuel_amb_final", "p_bar", "xo2", "hc_burnrate_mg_s", "m_o2_mg_s",
            "tad_k_calc", "zst", "burn_time_s", "peak_burner_T_C", "peak_burner_T_K"], tok).items()})
    b["p_atm"] = b["p_bar"] / 1.01325
    d = pd.concat([a, b], ignore_index=True, sort=False)
    d["flame_type"] = d["flame_type"].str.strip().str.capitalize()
    d["test"] = d["test"].str.replace(" ", "", regex=False)
    d["fuel_base"] = d["fuel_raw"].str.strip().str.lower().replace({"c2h4": "ethylene"})
    d["xo2_pct"] = d["xo2"] * 100
    d["tfp"] = d["tfp"].astype("string").str.strip()
    hi = d["hot_ignition_raw"].astype("string").str.strip().str.lower()
    d["ignition_class"] = hi                                   # yes / no / flash
    d["hot_ignition"] = hi.map({"yes": 1, "no": 0, "flash": 0}).astype("Float64")
    em = d["ext_mode_raw"].astype("string").str.strip()
    d["ext_mode"] = em.where(em.isin(["SE", "FT"]))
    col = d["color_raw"].astype("string").str.strip().str.lower()
    d["flame_color"] = col.replace({"yellow then blue": "yellow-blue", "-": pd.NA, "limit": pd.NA})
    d["color_hit_limit"] = (col == "limit")
    rep("acme_inverse", n0, len(d), f"tamamen boş satırlar (PSI-159 inverse: {nb_empty} boş satır)", flags)
    append_assumption("acme_flash", "PSI-159 inverse 'Hot ignition'='flash': anlık parlama, sürekli alev değil -> ignition_class='flash' (3 sınıf korunur), ikili hot_ignition=0.")
    append_assumption("acme_color_limit", "PSI-159 inverse 'Color'='limit' bir renk değil (sıcaklık limitine ulaşıldı yorumu) -> flame_color NaN, color_hit_limit=True.")
    return d


# ----------------------------------------------------------------------------- FLEX
def flex():
    f = "PSI-69/PSI-69_Experimental_table_FLEX.csv"
    d = read_csv(f, dtype=str)
    n0 = len(d)
    d = add_trace(d.dropna(how="all"), "PSI-69", f)
    d = d.rename(columns={"FLEX Test #": "test_no", "FLEX Identifier": "flex_id", "Test Date": "date",
                          "Test GMT": "gmt", "Fuel": "fuel", "Ambient pressure; mmHg": "p_mmHg",
                          "O initial ambient composition; mole fraction": "x_o2",
                          "N initial ambient composition; mole fraction": "x_n2",
                          "CO initial ambient composition; mole fraction": "x_co2",
                          "He initial ambient composition; mole fraction": "x_he",
                          "Droplet initial diameter; mm": "d0_mm",
                          "Visible flame extinction diameter; mm": "d_ext_mm",
                          "Burning rate; mm": "burn_rate_K_mm2_s", "Burn time; s": "burn_time_s",
                          "Test end": "test_end"})
    approx = d["burn_time_s"].astype("string").str.strip().str.startswith("~")
    d["burn_time_approx"] = approx.fillna(False)
    d.loc[approx.fillna(False), "burn_time_s"] = d.loc[approx.fillna(False), "burn_time_s"].str.lstrip("~")
    flags = numify(d, ["test_no", "p_mmHg", "x_o2", "x_n2", "x_co2", "x_he", "d0_mm", "d_ext_mm",
                       "burn_rate_K_mm2_s", "burn_time_s"], ["–", "-"])
    flags["burn_time_approx(~)"] = int(d.burn_time_approx.sum())
    d["date"] = pd.to_datetime(d["date"], errors="coerce", format="%m/%d/%Y")
    d["year"] = d["date"].dt.year
    d["p_atm"] = d["p_mmHg"] / 760.0
    d["x_o2_pct"] = d["x_o2"] * 100
    d["diluent"] = np.select([d.x_he > 0, d.x_co2 > 0], ["He", "CO2"], "N2")
    d["d0_sq_mm2"] = d["d0_mm"] ** 2
    d["d_ext_over_d0"] = d["d_ext_mm"] / d["d0_mm"]
    d["K_from_d2_law"] = (d["d0_mm"] ** 2 - d["d_ext_mm"].fillna(0) ** 2) / d["burn_time_s"]   # informational
    d.loc[d["d_ext_mm"].isna(), "K_from_d2_law"] = np.nan
    rep("flex", n0, len(d), "tamamen boş satırlar", flags)
    append_assumption("flex_burn_rate_unit", "PSI-69 'Burning rate; mm' başlığındaki birim eksik; değer aralığı (~0.4-1 ) damlacık yanma sabiti K ile uyumlu -> burn_rate_K_mm2_s (mm²/s) VARSAYILDI.")
    append_assumption("flex_approx", "FLEX 'Burn time' içindeki '~6', '~9' -> 6, 9 sayısal + burn_time_approx=True. '–' -> NaN.")
    append_assumption("flex_K_d2", "K_from_d2_law = (d0² - d_ext²)/t_b yalnızca bilgi amaçlı türetildi; hedef K ile sızıntı ilişkisi var (hedef olarak kullanılamaz).")
    return d


# ----------------------------------------------------------------------------- BASS-II
MAT_RX = [("SIBAL", r"sibal"), ("Nomex", r"nomex"), ("Wax candle", r"candle|wax")]


def bass_material(s):
    s0 = str(s).lower()
    for name, rx in MAT_RX:
        if re.search(rx, s0):
            return name
    return "PMMA"   # films, slabs, rods, spherical section: all PMMA in BASS-II matrix


def bass_geometry(s):
    s0 = str(s).lower()
    if "rod" in s0:
        return "rod"
    if "spher" in s0:
        return "sphere_section"
    if "sibal" in s0 or "nomex" in s0:
        return "fabric"
    if "candle" in s0:
        return "candle"
    if "film" in s0 or "micron" in s0 or re.search(r"0\.\d\s*mm", s0):
        return "film"
    if "slab" in s0 or re.search(r"\d\s*mm thick", s0) or "mm thick" in s0 or re.search(r"\d\s*mm", s0):
        return "slab"
    return "other"


def bass_thickness_mm(s):
    s0 = str(s).lower().replace('"', ' in ')
    m = re.search(r"(\d+(?:\.\d+)?)\s*micron", s0)
    if m:
        return float(m.group(1)) / 1000
    m = re.search(r"(\d+(?:\.\d+)?)\s*mm", s0)
    if m:
        return float(m.group(1))
    m = re.search(r"(\d+)\s*/\s*(\d+)\s*(in)?", s0)
    if m and "rod" in s0:
        return float(m.group(1)) / float(m.group(2)) * 25.4
    m = re.search(r"(0?\.\d+)\s*in", s0)
    if m and "rod" in s0:
        return float(m.group(1)) * 25.4
    return np.nan


def first_num(s):
    m = re.match(r"\s*([<>]?)\s*(\d+(?:\.\d+)?)", str(s))
    return float(m.group(2)) if m else np.nan


def bass2():
    f = "PSI-25/PSI-25_Experimental_table_BASS-II.csv"
    d = read_csv(f, dtype=str)
    n0 = len(d)
    d = add_trace(d.dropna(how="all"), "PSI-25", f)
    d.columns = [re.sub(r"\s+", " ", c).strip() for c in d.columns]
    d = d.rename(columns={"PI": "pi", "Test #": "test", "Date": "date", "GMT": "gmt_day", "Sample #": "sample_no",
                          "Fuel Sample Material": "material_raw", "Flow restrictor": "flow_restrictor",
                          "Fan display": "fan_display_raw", "Air display": "air_display_raw",
                          "Radiometer gain (1000 250 50 10)": "radiometer_gain_raw",
                          "Total Frames Shot": "frames_raw",
                          "Calibrated initial O2 % by vol": "o2_init_pct", "Calibrated final O2 % by vol": "o2_final_pct",
                          "Initial CO2 % by vol": "co2_init_pct", "Final CO2 % by vol": "co2_final_pct",
                          "Initial CO (ppm)": "co_init_ppm", "Final CO (ppm)": "co_final_ppm"})
    # censored CO: 'OR' / 'over' / '>500' = over range -> NaN + flag (keep the info)
    for c in ["co_init_ppm", "co_final_ppm"]:
        raw = d[c].astype("string").str.strip()
        d[c + "_overrange"] = raw.str.lower().isin(["or", "over"]) | raw.str.startswith(">").fillna(False)
    flags = numify(d, ["o2_init_pct", "o2_final_pct", "co2_init_pct", "co2_final_pct", "co_init_ppm",
                       "co_final_ppm", "flow_restrictor"], ["none", "OR", "over", ">500"])
    d["material"] = d["material_raw"].map(bass_material)
    d["geometry"] = d["material_raw"].map(bass_geometry)
    d["thickness_mm"] = d["material_raw"].map(bass_thickness_mm)
    d.loc[d.material.isin(["SIBAL", "Nomex"]), "thickness_mm"] = np.nan   # '2 cm SIBAL' = width
    d["rod_color"] = d["material_raw"].str.lower().str.extract(r"(clear|black|blac)")[0].replace({"blac": "black"})
    d["one_sided"] = d["material_raw"].str.lower().str.contains("1 sided", na=False)
    d["air_display_initial"] = d["air_display_raw"].map(first_num)
    d["air_display_multi"] = d["air_display_raw"].astype("string").str.strip().str.contains(r"\s|>", na=False)
    d["fan_display_initial"] = d["fan_display_raw"].map(first_num)
    d["frames"] = pd.to_numeric(d["frames_raw"], errors="coerce")
    d["d_o2_pct"] = d["o2_final_pct"] - d["o2_init_pct"]
    d["d_co2_pct"] = d["co2_final_pct"] - d["co2_init_pct"]
    d["d_co_ppm"] = d["co_final_ppm"] - d["co_init_ppm"]
    d["co_negative_flag"] = ((d["co_init_ppm"] < 0) | (d["co_final_ppm"] < 0)).fillna(False).astype(bool)
    d["o2_final_anomaly_flag"] = ((d["o2_final_pct"] < 10) | (d["d_o2_pct"] > 0.5)).fillna(False).astype(bool)
    d["date"] = pd.to_datetime(d["date"], errors="coerce", format="%m/%d/%Y")
    flags["co_negative_rows"] = int(d.co_negative_flag.sum())
    flags["o2_final_anomaly_rows"] = int(d.o2_final_anomaly_flag.sum())
    flags["co_overrange_cells"] = int(d.co_init_ppm_overrange.sum() + d.co_final_ppm_overrange.sum())
    rep("bass2", n0, len(d), "tamamen boş satırlar", flags)
    # control: PI sheets row counts vs experimental table
    ctrl = []
    for pi in ["Bhattacharjee", "Ferkul", "Fernandez-Pello", "Miller", "Olson", "T_ien"]:
        p = read_csv(f"PSI-25/BASS-II_Test_Matrix_by_PI_Final__{pi}.csv", dtype=str).dropna(how="all")
        ctrl.append(dict(pi=pi, pi_sheet_rows=len(p), exp_table_rows=int((d.pi.str.replace("'", "_") == pi).sum())))
    NOTES["bass2_pi_control"] = md_table(pd.DataFrame(ctrl))
    append_assumption("bass2_material", "BASS-II 'Fuel Sample Material' serbest metin -> material (PMMA/SIBAL/Nomex/Wax candle), geometry (film/slab/rod/fabric/sphere_section/candle), thickness_mm (micron/mm/inç'ten). Çubuklarda 'thickness' = çap. '4 cm spherical section' PMMA VARSAYILDI. SIBAL'de '2 cm' genişliktir, kalınlık NaN.")
    append_assumption("bass2_co_censor", "BASS-II CO 'OR'/'over'/'>500' = ölçüm aralığı aşıldı (sağdan sansürlü) -> NaN + *_overrange=True. 'none' -> NaN.")
    append_assumption("bass2_negative_co", "Negatif CO değerleri DÜZELTİLMEDİ; co_negative_flag ile işaretlendi (sensör ofseti olası).")
    append_assumption("bass2_o2_anomaly", "o2_final_anomaly_flag: final O2 < %10 ya da O2'nin test boyunca >0.5 puan ARTMASI (fiziksel değil) -> işaretlendi, düzeltilmedi.")
    append_assumption("bass2_air_display", "Air/Fan display bir hız değil cihaz potansiyometre okuması; çoğu hücre test boyunca ayar dizisi ('5 3 2 ext'). air_display_initial = ilk sayı; birim unit_unknown.")
    return d


# ----------------------------------------------------------------------------- SMOKE (SAME / SAME-R)
def smoke():
    ff = "PSI-101/Combined_SAMER_Results_06_02_14__Reduced_data_sheet.csv"
    fg = "PSI-101/Combined_SAMER_Results_06_02_14__SAME_Ground_Test_Results.csv"
    fl = read_csv(ff, header=1, dtype=str)
    gr = read_csv(fg, header=1, dtype=str)
    fl.columns = [re.sub(r"\s+", " ", c).strip() for c in fl.columns]
    gr.columns = [re.sub(r"\s+", " ", c).strip() for c in gr.columns]
    n0 = len(fl) + len(gr)
    fl = add_trace(fl, "PSI-101", ff, 2)
    gr = add_trace(gr, "PSI-101", fg, 2)
    fl = fl.rename(columns={"Flight 1=same 2=sameR, g=ground": "flight_code", "Sample Type": "material",
                            "SAME #": "same_no", "Description": "description",
                            "Inlet Velocity (cm/sec)": "inlet_velocity_cm_s", "Rt/R0": "rt_r0",
                            "Net Aging Duration": "aging_s", "M0 best Diameter": "m0_per_cc",
                            "M1 (mm/cm^3)": "m1_mm_per_cc",
                            "Mpass_3rd offset and dilution corrected": "m3_mpass",
                            "DustTrak A (mg/m3) Mpass_2nd offset, dilution and Gain corrected": "dusttrak_a_mg_m3",
                            "DustTrak B calibratred and corrected for dilution (mg/m3)": "dusttrak_b_mg_m3",
                            "M1/M0 (micro-m)--AMD": "amd_um", "Diameter of Average mass (micro-m)": "dam_um",
                            "MPASS 3/2": "mpass_3_2", "Hatch Choate Sigma g": "sigma_g",
                            "Hatch Choate Dg": "dg_um", "Ion B Mment (mm/cm^3)": "ionb_moment",
                            "Sample Temperature C": "sample_temp_c", "Mass Loss (mg)": "mass_loss_mg"})
    gr = gr.rename(columns={"Sample Type": "material", "Description": "description",
                            "Inlet Velocity (cm/sec)": "inlet_velocity_cm_s", "Rt/R0": "rt_r0",
                            "Aging Duration (sec)": "aging_s", "Mo Best Diameter": "m0_per_cc",
                            "Ion B M1": "m1_mm_per_cc",
                            "Best Diameter Ion B/Ptrak Count Mean Diameter (microns)": "amd_um",
                            "DTRak B Diameter of average mass micrometers": "dam_um",
                            "DustTrak A corrected for dilution (mg/m3)": "dusttrak_a_mg_m3",
                            "DustTrak B corrected for dilution (mg/m3)": "dusttrak_b_mg_m3"})
    gr["flight_code"] = "g"
    keep = ["psi_id", "source_file", "source_row", "flight_code", "material", "description", "inlet_velocity_cm_s",
            "rt_r0", "aging_s", "m0_per_cc", "m1_mm_per_cc", "m3_mpass", "dusttrak_a_mg_m3", "dusttrak_b_mg_m3",
            "amd_um", "dam_um", "mpass_3_2", "sigma_g", "dg_um", "sample_temp_c", "mass_loss_mg"]
    d = pd.concat([fl.reindex(columns=keep), gr.reindex(columns=keep)], ignore_index=True)
    numc = keep[6:]
    flags = numify(d, numc)
    d["material"] = d["material"].astype("string").str.strip()
    n_nomat = int(d.material.isna().sum())
    d = d[d.material.notna()]
    n_dbp = int((d.material == "DBP").sum())
    d = d[d.material != "DBP"].copy()
    d["campaign"] = d["flight_code"].astype(str).map({"1": "SAME", "2": "SAME-R", "g": "ground"})
    d["gravity"] = np.where(d.flight_code.astype(str) == "g", "ground", "flight")
    # zero = not measured (a particle diameter/concentration of exactly 0 is not physical)
    zc = ["m0_per_cc", "m1_mm_per_cc", "m3_mpass", "dusttrak_a_mg_m3", "dusttrak_b_mg_m3", "amd_um", "dam_um",
          "mpass_3_2", "sigma_g", "dg_um", "inlet_velocity_cm_s", "sample_temp_c"]
    zero_counts = {}
    for c in zc:
        z = d[c] == 0
        zero_counts[c] = int(z.sum())
        d.loc[z, c] = np.nan
    d["zero_as_missing_any"] = False
    # verify amd = M1/M0 (flight): M1 in mm/cc, M0 in #/cc -> mm -> *1000 um
    fl_ = d[d.gravity == "flight"]
    ratio = fl_.m1_mm_per_cc / fl_.m0_per_cc * 1000
    rel = ((ratio - fl_.amd_um) / fl_.amd_um).abs()
    gr_ = d[d.gravity == "ground"]
    ratio_g = gr_.m1_mm_per_cc / gr_.m0_per_cc * 1000
    rel_g = ((ratio_g - gr_.amd_um) / gr_.amd_um).abs()
    NOTES["smoke_amd_check"] = (f"flight: amd_um vs 1000*M1/M0 medyan göreli fark = {rel.median():.4f} (n={rel.notna().sum()}); "
                                f"ground: {rel_g.median():.4f} (n={rel_g.notna().sum()})")
    d["log_m0"] = np.log10(d["m0_per_cc"])
    flags.update({f"zero->NaN:{k}": v for k, v in zero_counts.items()})
    rep("smoke", n0, len(d), f"malzemesiz {n_nomat} satır (ground sayfası alt notları) + DBP {n_dbp} satır (kalibrasyon aerosolü)", flags)
    append_assumption("smoke_source", "`smoke_dataset.csv` repoda YOK. Yerine PSI-101 'Combined_SAMER_Results_06_02_14' çalışma kitabından yeniden kuruldu: flight = 'Reduced_data_sheet' (SAME=1, SAME-R=2), ground = 'SAME_Ground_Test_Results'.")
    append_assumption("smoke_ground_map", "Ground eşlemesi DOĞRULANMADI: amd_um <- 'Best Diameter Ion B/Ptrak Count Mean Diameter', dam_um <- 'DTRak B Diameter of average mass', m0 <- 'Mo Best Diameter', m1 <- 'Ion B M1'. Analizlerde flight-only ve flight+ground AYRI raporlanır.")
    append_assumption("smoke_zero", "Duman tablosunda çap/konsantrasyon/hız = 0 değerleri fiziksel değil (ölçülmedi) -> NaN. Sayılar load_report'ta. BELİRSİZ: inlet_velocity_cm_s=0 olan 22 satırın tamamı SAME-R'da; düşük akışlı run'lar olduğu için gerçek 0 olma ihtimali var — feature olarak kullanmadan önce teyit edilmeli.")
    append_assumption("smoke_leak", "amd_um = M1/M0 olduğundan m0_per_cc, m1_mm_per_cc, log_m0 ve ionb_moment amd_um hedefi için SIZINTIDIR; dam_um, dg_um, sigma_g, dusttrak, mpass da aynı anda ölçülen çıktılardır.")
    return d


# ----------------------------------------------------------------------------- CFI (PSI-39)
def cfi():
    fm = "PSI-39/CFI_DataSummary_Spreadsheet_Jan2021__Master_Sheet.csv"
    fd = "PSI-39/CFI_DataSummary_Spreadsheet_Jan2021__DATA.csv"
    fi = "PSI-39/CFI_DataSummary_Spreadsheet_Jan2021__Igniter.csv"
    fe = "PSI-39/PSI-39_Experimental_table_CFI.csv"
    m = add_trace(read_csv(fm, dtype=str).dropna(how="all"), "PSI-39", fm)
    dd = read_csv(fd, dtype=str).dropna(how="all")
    ig = read_csv(fi, dtype=str).dropna(how="all")
    e = read_csv(fe, dtype=str).dropna(how="all")
    n0 = len(m)
    for x in (m, dd, ig):
        x.columns = [re.sub(r"\s+", " ", c).strip() for c in x.columns]
        x["flex number"] = x["flex number"].str.strip()
    d = m.merge(dd, on="flex number", how="left", validate="1:1").merge(ig, on="flex number", how="left", validate="1:1")
    d = d.rename(columns={"flex number": "flex_no", "test date": "date", "local time": "local_time", "cir": "cir",
                          "pressure": "pressure_raw", "oxygen": "x_o2", "nitrogen": "x_n2", "helium": "x_he",
                          "fiber": "fiber", "fuel": "fuel_raw", "d0 ( mm )": "d0_mm",
                          "dext, hot ( mm )": "d_ext_hot_mm", "khot ( mm^2/s )": "k_hot_mm2_s",
                          "kcool ( mm^2/s )": "k_cool_mm2_s", "dext,cool ( mm )": "d_ext_cool_mm",
                          "pressure (atm)": "p_atm_data", "reignitions": "reignitions", "extrap cf?": "extrap_cf",
                          "hf burn time": "hf_burn_time_s", "peak hf rad": "peak_hf_rad",
                          "peak water vapor rad": "peak_h2o_rad", "rad ratio": "rad_ratio",
                          "2.5mm rad": "rad_2p5mm", "2.5mm narrow": "rad_2p5mm_narrow",
                          "cf rad ratio": "cf_rad_ratio", "2.5mm cf": "rad_2p5mm_cf", "2.5mm time": "time_2p5mm",
                          "actual d": "actual_d_mm", "completed analysis?": "completed_analysis",
                          "ignition power ( w )": "ign_power_raw", "ignition time ( ms )": "ign_time_raw"})
    d["p_atm"] = d["pressure_raw"].str.extract(r"(\d*\.?\d+)")[0].astype(float)
    d["ign_power_w"] = d["ign_power_raw"].str.extract(r"(\d*\.?\d+)")[0].astype(float)
    d["ign_time_ms"] = d["ign_time_raw"].str.extract(r"(\d*\.?\d+)")[0].astype(float)
    flags = numify(d, ["x_o2", "x_n2", "x_he", "d0_mm", "d_ext_hot_mm", "k_hot_mm2_s", "k_cool_mm2_s",
                       "d_ext_cool_mm", "p_atm_data", "reignitions", "extrap_cf", "hf_burn_time_s", "peak_hf_rad",
                       "peak_h2o_rad", "rad_ratio", "rad_2p5mm", "rad_2p5mm_narrow", "cf_rad_ratio",
                       "rad_2p5mm_cf", "time_2p5mm", "actual_d_mm"])
    fr = d["fuel_raw"].str.strip()
    d["fuel"] = fr.replace({"[.60]/[.40] C12H26/iso-dodecane": "dodecane60/isododecane40",
                            "[.75]/[.25] C12H26/iso-dodecane": "dodecane75/isododecane25",
                            "C12H26": "n-dodecane"})
    d["diluent"] = np.where(d.x_he > 0, "He", "N2")
    d["x_o2_pct"] = d["x_o2"] * 100
    d["fiber"] = d["fiber"].str.strip()
    d["date"] = pd.to_datetime(d["date"], errors="coerce")
    d["in_experimental_table"] = d["flex_no"].isin(e["Flex Number"].astype(str).str.strip())
    d["has_cool_flame"] = d["k_cool_mm2_s"].notna().astype(int)
    d["p_mismatch"] = (d["p_atm"] - d["p_atm_data"]).abs() > 0.01
    flags["p_master_vs_data_mismatch"] = int(d.p_mismatch.sum())
    rep("cfi", n0, len(d), "-", flags)
    NOTES["cfi_merge"] = (f"Master {len(m)} satır, DATA eşleşen {d.d0_mm.notna().sum()} d0, "
                          f"Experimental table {len(e)} satır (master içinde: {int(d.in_experimental_table.sum())}).")
    append_assumption("cfi_merge", "PSI-39 cfi = Master_Sheet ⋈ DATA ⋈ Igniter (flex number, 1:1). Experimental_table (87) Master'ın alt kümesi; in_experimental_table ile işaretlendi.")
    append_assumption("cfi_hf_burn", "'hf burn time' sütununun birimi belirtilmemiş; değer aralığına göre saniye VARSAYILDI (hf = hot flame).")
    append_assumption("cfi_has_cool", "has_cool_flame = kcool ölçülmüş mü (1/0) - türetilmiş ikili hedef adayı; kcool analizi yapılmamış testlerde de 0 olabileceği için 'completed_analysis' ile birlikte yorumlanmalı.")
    return d


# ----------------------------------------------------------------------------- Tier 2
def tier2():
    out = {}
    f = "PSI-98/PSI-98_Experimental_table_SAFFIRE-1.csv"
    s1 = add_trace(read_csv(f, dtype=str).dropna(how="all"), "PSI-98", f)
    s1.columns = [c.strip() for c in s1.columns]
    for c in ["Sample Thickness (cm)", "Sample Length (cm)", "Sample Width (cm)", "Air Flow (cm/s)",
              "Ignition Power (W)", "Ignition Time (s)", "Burn Time (s)"]:
        numify(s1, [c])
    s1["o2_pct_approx"] = s1["Percent O2"].str.extract(r"(\d+\.?\d*)")[0].astype(float)
    out["saffire1"] = s1
    f = "PSI-99/PSI-99_Experimental_table_SAFFIRE-2.csv"
    s2 = add_trace(read_csv(f, dtype=str).dropna(how="all"), "PSI-99", f)
    s2.columns = [c.strip().replace("?-g", "ug") for c in s2.columns]
    s2["thickness_mm"] = s2["Samle Thickness"].str.extract(r"(\d*\.?\d+)")[0].astype(float)
    s2["o2_pct_approx"] = s2["Percent O2 (Note 1)"].str.extract(r"(\d+\.?\d*)")[0].astype(float)
    s2["spread_rate_1g_mm_s"] = s2["1-g Spread Rate"].str.extract(r"(\d*\.?\d+)\s*mm/s")[0].astype(float)
    s2["spread_rate_note"] = "1-g ölçümü (mikrogravite DEĞİL)"
    out["saffire2"] = s2
    f = "PSI-100/PSI-100_Experimental_table_SAFFIRE-3.csv"
    s3 = add_trace(read_csv(f, dtype=str).dropna(how="all"), "PSI-100", f)
    s3.columns = [c.strip() for c in s3.columns]
    out["saffire3"] = s3
    f = "PSI-107/PSI-107_Experimental_table_Spice.csv"
    sp = add_trace(read_csv(f, dtype=str).dropna(how="all"), "PSI-107", f)
    sp.columns = [re.sub(r"\s+", " ", c).strip() for c in sp.columns]
    numify(sp, ["GMT date", "Nozzle (mm)", "Fuel Rate (sccm)", "Fuel Rate (mg/s)", "HC Fuel Rate (mg/s)", "Air Rate (cm/s)"])
    t0 = pd.to_timedelta(sp["GMT ignition"].str.strip(), errors="coerce")
    t1 = pd.to_timedelta(sp["GMT Flame Off"].str.strip(), errors="coerce")
    dur = (t1 - t0).dt.total_seconds()
    sp["flame_duration_s"] = dur.where(dur >= 0, dur + 86400)
    sp["dup_of_previous"] = sp.drop(columns=["source_row"]).duplicated()
    out["spice"] = sp
    frames = []
    for psi, f in [("PSI-20", "PSI-20/PSI-20_Experimental_table_ACME_BRE.csv"),
                   ("PSI-21", "PSI-21/PSI-21_Experimental_table_CLD_Flame.csv"),
                   ("PSI-22", "PSI-22/PSI-22_Experimental_table_ACME_E-FIELD_Flames.csv"),
                   ("PSI-23", "PSI-23/PSI-23_Experimental_table_ACME_s-Flame.csv")]:
        t = add_trace(read_csv(f, dtype=str).dropna(how="all"), psi, f)
        t.columns = [c.strip().rstrip("*") for c in t.columns]
        fi = [c for c in t.columns if c.lower().startswith("flames ignited")][0]
        t["flames_ignited"] = pd.to_numeric(t[fi], errors="coerce")
        fb = [c for c in t.columns if "Fuel Bottle" in c]
        t["fuel_bottle"] = t[fb[0]] if fb else pd.NA
        t["experiment"] = {"PSI-20": "BRE", "PSI-21": "CLD Flame", "PSI-22": "E-FIELD", "PSI-23": "s-Flame"}[psi]
        frames.append(t[["psi_id", "source_file", "source_row", "experiment", "fuel_bottle", "flames_ignited"]])
    out["acme_testdays"] = pd.concat(frames, ignore_index=True)
    for k, v in out.items():
        rep(k, len(v), len(v), "-", {})
    append_assumption("spice_duration", "SPICE flame_duration_s = GMT Flame Off - GMT ignition (gece yarısı geçişi +86400 s). Aynı satırın tekrarları dup_of_previous ile işaretlendi, SİLİNMEDİ (aynı ayarda tekrar alev olabilir).")
    append_assumption("saffire2_spread", "SAFFIRE-II spread rate 1-g ölçümüdür, mikrogravite değildir; hedef olarak kullanılmadı.")
    return out


if __name__ == "__main__":
    tables = {"acme_normal": acme_normal(), "acme_inverse": acme_inverse(), "flex": flex(),
              "bass2": bass2(), "smoke": smoke(), "cfi": cfi()}
    tables.update(tier2())
    for k, v in tables.items():
        save(v, k)
    r = pd.DataFrame(REPORT)
    lines = ["# Yükleme raporu (Faz 1)", "", md_table(r), "", "## Notlar", ""]
    for k, v in NOTES.items():
        lines += [f"### {k}", "", v if isinstance(v, str) else "\n".join(f"- {x}" for x in v), ""]
    (OUT / "load_report.md").write_text("\n".join(lines) + "\n")
    print(r[["table", "rows_before", "rows_after", "flagged_cells"]].to_string(index=False))
    for k, v in NOTES.items():
        print(f"[{k}]", (v if isinstance(v, str) else v)[:400] if isinstance(v, str) else v[:5])
    for k, v in tables.items():
        print(f"{k}: {v.shape}")
