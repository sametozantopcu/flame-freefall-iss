"""Faz 7 - feature / target catalog with explicit leakage marking + target candidate scoring."""
import numpy as np
import pandas as pd

from _common import OUT, SPEC, TRACE, load, md_table, target_frame, unit_of

ID_COLS = {"test", "flex_id", "flex_no", "test_no", "cir", "sample_no", "same_no", "date", "gmt", "gmt_day",
           "local_time", "description"}
META_HINT = ("_flag", "_raw", "comments", "completed_analysis", "in_experimental_table", "p_mismatch",
             "_overrange", "_approx", "any_ramp_flag", "zero_as_missing_any", "flight_code", "flame_type",
             "source_")
REDUNDANT = {"p_bar": "p_atm ile aynı bilgi (birim farkı)", "p_atm_data": "p_atm (Master) ile aynı",
             "xo2_init_pct": "xo2_init ×100", "xo2_pct": "xo2 ×100", "x_o2_pct": "x_o2 ×100",
             "p_mmHg": "p_atm ×760", "d0_sq_mm2": "d0_mm²", "fuel_raw": "fuel_base'ten türetildi",
             "ign_power_raw": "ign_power_w", "ign_time_raw": "ign_time_ms", "pressure_raw": "p_atm",
             "gravity": "campaign ile iç içe (ground ⇔ campaign=ground)", "year": "zaman/kampanya vekili",
             "fan_display_initial": "anlamı belirsiz cihaz okuması"}

rows = []
for name, spec in SPEC.items():
    df = load(name)
    leak_map = {}
    for t, cols in spec["leakage"].items():
        for c in cols:
            leak_map.setdefault(c, []).append(t)
    for c in df.columns:
        s = df[c]
        role, notes, leak = "meta", "", ""
        if c in TRACE:
            role, notes = "meta", "kaynak izi"
        elif c in spec["targets"]:
            role = "target"
            notes = f"{spec['targets'][c]['task']}; alt küme: {spec['targets'][c]['subset']}"
            if c in leak_map:
                leak = f"diğer hedefler için sızıntı: {', '.join(leak_map[c])}"
        elif c in leak_map:
            role = "leakage"
            leak = f"hedef(ler) {', '.join(leak_map[c])} ile aynı anda ölçülen/hedeften türetilen çıktı"
        elif c in spec["num"] or c in spec["cat"]:
            role = "feature"
            if c in spec["groups"]:
                notes = "grup/karıştırıcı adayı (GroupKFold)"
        elif c in spec.get("unclear", []):
            role, notes = "exclude", "anlamı belgelenmemiş — sızıntı olabilir, doğrulanmadan kullanma"
        elif c in ID_COLS:
            role = "id"
        elif any(h in c for h in META_HINT):
            role = "meta"
        elif c in REDUNDANT:
            role, notes = "exclude", f"tekrarlı: {REDUNDANT[c]}"
        else:
            role, notes = "exclude", "çekirdek feature listesinde değil (az dolu / tek deneye özgü / türetilmiş)"
        if c == "tad_k_calc":
            notes = "HESAPLANMIŞ (XO2, yakıt, Zst fonksiyonu) — xo2/zst ile çoklu doğrusal; ağaç modellerde tek başına yeterli olabilir"
        if c == "zst":
            notes = (notes + "; " if notes else "") + "hesaplanmış stokiyometrik karışım kesri"
        if name == "smoke" and c in ("rt_r0", "sample_temp_c"):
            notes = "malzeme içinde Simpson işaret dönüşümü — mutlaka material ile birlikte kullan"
        rows.append(dict(dataset=name, column=c, role=role, dtype=str(s.dtype), unit=unit_of(c),
                         missing_pct=round(100 * s.isna().mean(), 1), n_unique=int(s.nunique(dropna=True)),
                         notes=notes, leakage_reason=leak))
C = pd.DataFrame(rows)
C.to_csv(OUT / "feature_catalog.csv", index=False)

# ------------------------------------------------------------- target candidates
top = pd.read_csv(OUT / "target_top_features.csv")
assoc_rank = {}
for name in SPEC:
    a = pd.read_csv(OUT / f"assoc_{name}.csv")
    for t in SPEC[name]["targets"]:
        e = a[(a.scope == f"target:{t}") & a.measure.isin(["spearman_rho", "eta", "cramers_v_bc"])]
        assoc_rank[(name, t)] = e.value.abs().max() if len(e) else np.nan

CAVEATS = {
    ("acme_normal", "burn_time_s"): (0, "Yalnızca CFI-G; FT (akış kesildi) testlerinde süre sağdan sansürlü olabilir."),
    ("acme_inverse", "burn_time_s"): (-1, "Gün içi vitiasyon (ortam yakıtı birikimi) güçlü karıştırıcı; FT sansürü."),
    ("acme_normal", "hot_ignition"): (0, "Net fiziksel sınır (≈21% O2'de tutuşma yok); PSI-10'da yok."),
    ("acme_inverse", "hot_ignition"): (-1, "Azınlık sınıfı ~%15; 'flash' 3. sınıf olarak ayrıca modellenebilir."),
    ("acme_normal", "ext_mode"): (-1, "FT operasyonel karar (akış kesildi) olabilir — fiziksel söndürme değil."),
    ("acme_inverse", "ext_mode"): (-1, "FT operasyonel karar olabilir; gün etkisi baskın."),
    ("flex", "burn_time_s"): (1, "d² yasası doğrulandı (Completion eğimi≈2); test_end ile birlikte yorumlanmalı."),
    ("flex", "burn_rate_K_mm2_s"): (1, "Birim varsayımı (mm²/s) d² tutarlılık kontrolüyle desteklendi (oran≈0.95)."),
    ("flex", "d_ext_mm"): (0, "Yalnızca sönme/kesinti ile biten testlerde tanımlı (seçim yanlılığı)."),
    ("flex", "test_end"): (0, "3 sınıf, Completion azınlık (%10)."),
    ("bass2", "d_o2_pct"): (-1, "PI (araştırmacı) etkisi baskın; tutuşma süresi/akış ayar dizisi bilinmiyor."),
    ("bass2", "d_co2_pct"): (-1, "PI etkisi baskın; ΔO2 ile neredeyse stokiyometrik (aynı bilgi)."),
    ("bass2", "co_final_ppm"): (-1, "Sansürlü (OR/>500) ve negatif değerler; küçük n."),
    ("smoke", "amd_um"): (-1, "M0/M1 sızıntı; ground eşlemesi doğrulanmadı; Simpson (Rt/R0 × material)."),
    ("smoke", "dusttrak_b_mg_m3"): (-1, "Seyreltme/kalibrasyon düzeltmeli cihaz okuması; material baskın."),
    ("cfi", "k_hot_mm2_s"): (1, "Fiziksel olarak iyi tanımlı; O2/He/basınç ilişkileri güçlü."),
    ("cfi", "hf_burn_time_s"): (0, "Birim saniye varsayımı; d0 ile negatif ilişki (radyatif sönme) — d² yasası uygulanmaz."),
    ("cfi", "d_ext_hot_mm"): (-1, "d0 ile ρ=0.87 — büyük ölçüde başlangıç çapının ölçeği; d_ext/d0 daha anlamlı."),
    ("cfi", "has_cool_flame"): (-1, "Türetilmiş (kcool ölçülmüş mü); azınlık %15; analiz tamamlanma durumu karışabilir."),
}
trows = []
for name, spec in SPEC.items():
    full = load(name)
    for t, ts in spec["targets"].items():
        d = target_frame(name, t)
        n = int(d[t].notna().sum())
        bal = ""
        minority = np.nan
        if ts["task"] != "regression":
            vc = d[t].astype("string").value_counts()
            bal = ", ".join(f"{k}:{v}" for k, v in vc.items())
            minority = vc.min() / vc.sum()
        top5 = top[(top.table == name) & (top.target == t)].top5.iat[0]
        eff = assoc_rank[(name, t)]
        score = 3 + (n >= 150) - (n < 80) + (eff >= 0.5) - (eff < 0.3) - (minority < 0.15 if minority == minority else 0)
        adj, why = CAVEATS.get((name, t), (0, ""))
        score = int(np.clip(score + adj, 1, 5))
        trows.append(dict(dataset=name, target=t, task=ts["task"], n=n, missing_pct_full=round(100 * full[t].isna().mean(), 1),
                          class_balance=bal, max_effect=round(eff, 2), score_1_5=score, rationale=why, top5=top5,
                          leakage_cols=", ".join(spec["leakage"][t])))
T = pd.DataFrame(trows).sort_values(["score_1_5", "n"], ascending=False)
T.to_csv(OUT / "target_candidates.csv", index=False)
lines = ["# Hedef adayları (Faz 7)", "",
         "Puan (1–5) kural tabanlı: 3 + (n≥150) − (n<80) + (en güçlü etki ≥0.5) − (en güçlü etki <0.3) − (azınlık sınıfı <%15) "
         "+ alan bilgisine dayalı düzeltme (gerekçe sütunu). Etki: |Spearman|, η veya Cramér's V'nin maksimumu.", "",
         md_table(T[["dataset", "target", "task", "n", "missing_pct_full", "class_balance", "max_effect", "score_1_5", "rationale"]]), ""]
for _, r in T.iterrows():
    lines += [f"## {r.dataset}.{r.target} — puan {r.score_1_5}/5", "",
              f"- Tip: **{r.task}**, n={r.n}, tam tabloda eksik %{r.missing_pct_full}" + (f", sınıflar: {r.class_balance}" if r.class_balance else ""),
              f"- En güçlü 5 ilişki: {r.top5}",
              f"- Sızıntı (feature olarak KULLANILMAZ): `{r.leakage_cols}`",
              f"- Gerekçe: {r.rationale}", ""]
(OUT / "target_candidates.md").write_text("\n".join(lines) + "\n")
print(C.groupby(["dataset", "role"]).size().unstack(fill_value=0).to_string())
print(T[["dataset", "target", "task", "n", "max_effect", "score_1_5"]].to_string(index=False))
