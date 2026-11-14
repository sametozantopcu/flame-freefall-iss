"""Faz 8 - rule-based model recommendations derived from data properties. NO model is fitted here."""
import numpy as np
import pandas as pd

from _common import OUT, SPEC, md_table, target_frame

T = pd.read_csv(OUT / "target_candidates.csv")
SM = pd.read_csv(OUT / "simpson_flags.csv") if (OUT / "simpson_flags.csv").stat().st_size > 5 else pd.DataFrame()
V = pd.read_csv(OUT / "vif.csv")
TR = pd.read_csv(OUT / "transform_suggestions.csv")

MONO = {  # physically expected monotone directions (for monotonic constraints)
    ("flex", "burn_time_s"): {"d0_mm": "+"},
    ("flex", "burn_rate_K_mm2_s"): {"x_o2": "+"},
    ("flex", "d_ext_mm"): {"d0_mm": "+"},
    ("cfi", "k_hot_mm2_s"): {"x_o2": "+"},
    ("cfi", "d_ext_hot_mm"): {"d0_mm": "+"},
    ("acme_normal", "hot_ignition"): {"xo2_init": "+"},
    ("smoke", "amd_um"): {"rt_r0": "+ (material içinde)", "aging_s": "+ (koagülasyon)"},
}

rows, blocks = [], []
for name, spec in SPEC.items():
    for t, ts in spec["targets"].items():
        d = target_frame(name, t)
        d = d[d[t].notna()]
        n = len(d)
        feats = [c for c in spec["num"] + spec["cat"] if c in d.columns and d[c].nunique() > 1]
        ncat = sum(1 for c in feats if c in spec["cat"])
        cat_levels = sum(d[c].nunique() for c in feats if c in spec["cat"])
        a = pd.read_csv(OUT / f"assoc_{name}.csv")
        a = a[a.scope == f"target:{t}"]
        pv = a[a.measure.isin(["pearson_r", "spearman_rho"])].pivot_table(index="var2", columns="measure", values="value")
        nonlin = int(((pv.spearman_rho.abs() - pv.pearson_r.abs()) > 0.15).sum()) if len(pv) else 0
        mi = a[a.measure == "mutual_info"].set_index("var2").value
        lin = a[a.measure.isin(["spearman_rho", "eta", "cramers_v_bc"])].set_index("var2").value.abs()
        mi_gap = [f for f in mi.index if mi[f] > 0.3 and lin.get(f, 0) < 0.3]   # nonlinear/non-monotone signal
        vif_hi = V[(V.table == name) & (V.vif > 10)].feature.tolist()
        minority = np.nan
        if ts["task"] != "regression":
            vc = d[t].astype(str).value_counts()
            minority = vc.min() / vc.sum()
        groups = {g: d[g].nunique() for g in spec["groups"] if g in d.columns}
        simp = SM[(SM.table == name) & (SM.target == t)] if len(SM) else pd.DataFrame()
        tr = TR[(TR.table == name) & (TR.column == f"{t} [hedef alt kümesi]")]
        tsug = tr.suggest.iat[0] if len(tr) else "-"

        # ---------------- rules
        rec = []
        if ts["task"] == "regression":
            base = "Ridge (standartlaştırılmış sayısal + one-hot kategorik)"
            if vif_hi:
                base += f"; VIF>10 ({', '.join(vif_hi)}) nedeniyle OLS yerine Ridge/Lasso"
        else:
            base = "Lojistik regresyon (L2, class_weight='balanced')" if ts["task"] == "binary" else \
                   "Çok terimli lojistik regresyon (L2, class_weight='balanced')"
        if n < 150:
            tree = "RandomForest (min_samples_leaf≥5) veya sığ GBM (max_depth 2–3, learning_rate ≤0.05, güçlü L2, erken durdurma)"
            rec.append(f"küçük n ({n}) → sığ ağaçlar + güçlü düzenlileştirme; karmaşık GBM aşırı uyum riski taşır")
        else:
            tree = "LightGBM / XGBoost (max_depth 3–4, min_child_samples≥10) + RandomForest karşılaştırması"
        if cat_levels >= 8 or ncat >= 2:
            tree += "; kategorik yoğunluk nedeniyle CatBoost (ordered target stats, küçük n'de iyi)"
            rec.append(f"{ncat} kategorik feature / {cat_levels} seviye → CatBoost doğal kategorik desteği avantajlı")
        if nonlin or mi_gap:
            rec.append(f"doğrusal olmayan/monoton olmayan sinyal (Spearman≫Pearson: {nonlin} feature; MI yüksek ama korelasyon düşük: {', '.join(mi_gap) or '-'}) → ağaç modelleri baseline'dan anlamlı fark yaratabilir")
        mono = MONO.get((name, t))
        if mono:
            rec.append("fiziksel monotonluk kısıtı önerisi (XGBoost/LightGBM `monotone_constraints`): "
                       + ", ".join(f"{k} {v}" for k, v in mono.items()))
        if minority == minority and minority < 0.2:
            rec.append(f"sınıf dengesizliği (azınlık %{100*minority:.0f}) → class_weight / scale_pos_weight, PR-AUC raporla")
        if len(simp):
            rec.append("karıştırıcı/Simpson bayrağı: " + "; ".join(f"{r.feature}|{r.control} ({r.marginal_rho:+.2f}→{r.partial_rho:+.2f})"
                                                              for _, r in simp.iterrows())
                       + " → grup değişkenini feature olarak ZORUNLU tut ve grup bazlı CV kullan")
        # validation
        gchoice = {"acme_normal": "fuel_base × day (test günü)", "acme_inverse": "day (gün içi vitiasyon)",
                   "flex": "year veya ortam (diluent × fuel) — test kampanyası", "bass2": "pi (araştırmacı test seti)",
                   "smoke": "material (görülmemiş malzemeye genelleme) veya campaign", "cfi": "fuel × diluent (veya test tarihi)"}[name]
        val = f"GroupKFold (grup: {gchoice}); tekrarlı (5×) ve n küçükse LeaveOneGroupOut. Rastgele KFold iyimser sonuç verir."
        if ts["task"] != "regression":
            val += " Stratified Group KFold ile sınıf oranını koru."
        metric = ("MAE + RMSE (orijinal ölçekte), log ölçekte modelleniyorsa MdAPE; R² yalnızca ek bilgi"
                  if ts["task"] == "regression" else
                  "ROC-AUC + PR-AUC + balanced accuracy, Brier skoru (kalibrasyon)" if ts["task"] == "binary" else
                  "macro-F1 + balanced accuracy + log-loss")
        prep = [f"hedef dönüşümü: {tsug}" if ts["task"] == "regression" else "hedef kodlama: sınıf etiketi",
                "eksikler: ağaçlar için NaN bırak (native), doğrusal modeller için medyan imputasyon + eksiklik göstergesi (0 ile DOLDURMA)",
                "sızıntı sütunlarını çıkar: " + ", ".join(spec["leakage"][t][:8]) + ("…" if len(spec["leakage"][t]) > 8 else "")]
        if name in ("acme_normal", "acme_inverse"):
            prep.append("tad_k_calc / zst / xo2 çoklu doğrusal → doğrusal modelde birini seç veya PCA; ağaçta kalabilir")
        if name in ("flex", "cfi"):
            prep.append("mol kesirleri toplamı = 1 (kompozisyonel, tam çoklu doğrusallık) → denge gazı x_n2'yi çıkar veya log-oran (ALR) dönüşümü kullan")
        risks = []
        if name == "flex" and t == "burn_time_s":
            risks.append("Extinction/Disruption ile biten testlerde süre tam yanma süresi değil (erken kesilmiş) → test_end'e göre ayrı değerlendir veya sansür bilinçli model")
        if name == "smoke":
            risks.append("ground eşlemesi doğrulanmadı → önce flight-only model; ground'u ayrı doğrulama seti gibi kullan")
        if name == "flex" and t == "burn_rate_K_mm2_s":
            risks.append("birim varsayımı (mm²/s) — d² kontrolüyle desteklendi ama belgeyle teyit edilmeli")
        if name == "cfi" and t == "hf_burn_time_s":
            risks.append("birim (s) varsayımı")
        if "burn_time" in t and name.startswith("acme"):
            risks.append("FT (akış kesildi) testlerinde yanma süresi sağdan sansürlü olabilir → sansür bilinçli model (ör. survival / AFT) veya yalnızca SE alt kümesi değerlendirilmeli")
        if name == "bass2":
            risks.append("PI etkisi ile malzeme/geometri iç içe (her PI farklı numune tipi) — etkiler ayrıştırılamayabilir")
        risks.append(f"küçük n ({n}) → güven aralıklarını bootstrap ile raporla" if n < 200 else "orta n")
        rows.append(dict(dataset=name, target=t, task=ts["task"], n=n, n_features=len(feats), n_cat=ncat,
                         minority=round(minority, 2) if minority == minority else np.nan, vif_hi=len(vif_hi),
                         nonlinear_feats=nonlin, simpson_flags=len(simp)))
        sc = T[(T.dataset == name) & (T.target == t)].score_1_5.iat[0]
        blocks += [f"### {name}.{t} ({ts['task']}, n={n}, uygunluk {sc}/5)", "",
                   f"- **Baseline:** {base}",
                   f"- **Ağaç modelleri:** {tree}",
                   *[f"- {r}" for r in rec],
                   f"- **Doğrulama:** {val}",
                   f"- **Metrikler:** {metric}",
                   "- **Ön işleme:** " + "; ".join(prep),
                   "- **Riskler:** " + "; ".join(risks), ""]
P = pd.DataFrame(rows)
P.to_csv(OUT / "model_recommendation_inputs.csv", index=False)
lines = ["# Model önerileri (Faz 8) — EĞİTİM YAPILMADI", "",
         "Bu öneriler yalnızca veri özelliklerinden (n, feature sayısı, kategorik oran, doğrusal/monoton ilişki farkı, "
         "MI–korelasyon farkı, VIF, sınıf dengesi, Simpson bayrakları) kural tabanlı olarak türetilmiştir. "
         "Hiçbir model fit edilmemiş, hiçbir tahmin skoru üretilmemiştir.", "",
         "## Girdi özellikleri", "", md_table(P), "",
         "## Genel ilkeler", "",
         "1. **Önce baseline**: her hedef için Ridge/Lojistik; ağaç modelleri ancak grup bazlı CV'de baseline'ı anlamlı geçerse tercih edilir.",
         "2. **Küçük n (100–270)**: XGBoost/LightGBM varsayılanları aşırı uyar; derinlik 2–4, güçlü L2, erken durdurma. RandomForest sağlam bir orta yol.",
         "3. **Kategorik ağırlıklı tablolar (BASS-II, smoke, ACME)**: CatBoost, one-hot patlaması olmadan kategorikleri işler.",
         "4. **Fiziksel monotonluk** (d0↑ → t_b↑, O2↑ → K↑): monotonic constraints hem genellemeyi hem yorumlanabilirliği artırır.",
         "5. **Doğrulama her zaman grup bazlı**: deney/kampanya/gün/PI/malzeme etkisi güçlü; rastgele CV sızıntı gibi davranır.",
         "6. **Sızıntı listesi** `outputs/feature_catalog.csv` (role=leakage) ve `target_candidates.md` içinde; bu sütunlar feature olarak kullanılmaz.", "",
         "## Hedef bazında öneriler", ""] + blocks
(OUT / "model_recommendations.md").write_text("\n".join(lines) + "\n")
print(P.to_string(index=False))
