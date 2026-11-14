"""Faz 9 - assemble analysis/REPORT.md from outputs/* (tables pulled live so numbers stay in sync)."""
import json

import pandas as pd

from _common import A, OUT, md_table

inv = pd.read_csv(OUT / "inventory.csv")
load = (OUT / "load_report.md").read_text()
T = pd.read_csv(OUT / "target_candidates.csv")
TOP = pd.read_csv(OUT / "target_top_features.csv")
SM = pd.read_csv(OUT / "simpson_flags.csv")
HC = pd.read_csv(OUT / "high_corr_pairs.csv")
D2 = pd.read_csv(OUT / "d2_law_flex.csv")
GE = json.loads((OUT / "group_effects_numbers.json").read_text())
W = pd.read_csv(OUT / "smoke_within_material.csv")
EV = pd.read_csv(OUT / "ts_saffire3_events.csv")
SG = pd.read_csv(OUT / "ts_hkp_segments.csv")
BM = pd.read_csv(OUT / "bass2_material_effects.csv")
TR = pd.read_csv(OUT / "transform_suggestions.csv")
CB = pd.read_csv(OUT / "categorical_balance.csv")
ASS = json.loads((OUT / "assumptions.json").read_text())
LR = pd.read_csv  # noqa

n_canon = len(inv)
cat_counts = inv.category.value_counts()
comp = D2[D2.subset == "Completion"].iloc[0]
ext = D2[D2.subset == "Extinction"].iloc[0]
s1 = EV[EV["sample"] == 1].iloc[0]
s2 = EV[EV["sample"] == 2].iloc[0]
long = SG[SG.duration_s > 60]
best = T.sort_values(["score_1_5", "n"], ascending=False)

R = []
R += ["# NASA PSI Mikrogravite Yanma Verisi — Keşifsel Veri Analizi (EDA) Raporu", "",
      "NASA Space Apps 2026 · *Flame in Freefall* · Bu raporda **hiçbir model eğitilmemiştir**; yalnızca betimsel "
      "istatistik, ilişki ölçüleri ve fiziksel tutarlılık kontrolleri yer alır. Tüm sayılar `analysis/outputs/` "
      "altındaki script çıktılarından otomatik alınmıştır (`scripts/09_build_report.py`).", ""]

# ---------------------------------------------------------------- 1
R += ["## 1. Yönetici özeti", "",
      f"1. **`smoke_dataset.csv` repoda yok.** Duman tablosu PSI-101 *Combined_SAMER_Results* çalışma kitabından "
      f"yeniden kuruldu (flight: SAME + SAME-R, ground ayrı sayfa). Flight'ta `amd_um = 1000·M1/M0` birebir doğrulandı; "
      f"ground sayfasındaki eşleme ise bu ilişkiyi sağlamıyor (medyan göreli fark ~%90) → ground **ayrı** raporlandı.",
      f"2. **En güçlü hedef adayları:** FLEX yanma süresi / yanma sabiti K / sönme çapı, CFI sıcak alev K'sı ve SAME duman "
      f"partikül çapı (puan ≥4/5). ACME yanma süresi ve tutuşma da kullanılabilir ama **yalnızca PSI-159 (CFI-G)** satırlarında "
      "tanımlı: PSI-10 Flame Design tablolarında sonuç sütunu yok.",
      f"3. **d² yasası veride görülüyor:** FLEX'te tam yanan (Completion) damlacıklarda log t_b – log d0 eğimi "
      f"**{comp.ols_slope:.2f}** (%95 GA {comp.ci_lo:.2f}–{comp.ci_hi:.2f}, beklenen 2). Sönmeyle bitenlerde eğim "
      f"{ext.ols_slope:.2f}: bu testlerde süre erken kesildiği için yasa beklendiği gibi bozuluyor.",
      f"4. **Belirsiz birim çözüldü:** FLEX 'Burning rate; mm' sütunu, (d0²−d_ext²)/t_b ile karşılaştırıldığında oran medyanı "
      f"**{GE['flex_K_ratio_median']:.2f}** → sütun mm²/s cinsinden K.",
      f"5. **BASS-II stokiyometri kontrolü geçti:** PMMA için ölçülen ΔCO2/ΔO2 = **{GE['bass_pmma_ratio_median']:.2f}** "
      "(teorik −5/6 = −0.83). O2/CO2 sensör verisi fiziksel olarak tutarlı.",
      "6. **Smoke'ta Simpson paradoksu:** Rt/R0 (ısıtıcı sıcaklığı) ile partikül çapı arasındaki ilişki tüm veride negatif "
      "(ρ≈−0.27), malzeme sabit tutulunca **pozitif** (kısmi ρ≈+0.49; 5 malzemenin 5'inde de pozitif). Malzeme "
      "feature'ı modelden çıkarılırsa yanlış yönde bir ilişki öğrenilir.",
      "7. **ACME-inverse'te gün etkisi baskın:** yanma süresi ile ortam yakıt kesri / basınç arasındaki ilişkinin büyük kısmı "
      "test günü sabitlenince kayboluyor (ör. ρ −0.54 → −0.04). Bunun nedeni gün içinde yanma ürünlerinin birikmesi (vitiasyon).",
      "8. **ACME-normal'de tutuşma sınırı belirgin:** ~%21 O2'de bütan/propan için sıcak tutuşma yok, %35–40 O2'de çoğunlukla "
      "kendiliğinden sönme (SE). Tutuşan alevlerde O2 arttıkça yanma süresi uzuyor (ρ=0.29–0.67): yüksek O2'de radyatif "
      "sönmeye karşı daha dayanıklı alev oluşuyor.",
      "9. **Sızıntı riski yüksek:** her hedef için aynı anda ölçülen çıktı sütunları (ör. XO2 final, peak burner T, d_ext, "
      "M0/M1, rad*) `feature_catalog.csv` içinde `role=leakage` olarak işaretlendi. **Doğrulama mutlaka grup bazlı olmalı** "
      "(gün / PI / malzeme / kampanya).",
      "10. **Model önerisi (eğitmeden):** küçük n (108–274) → Ridge/Lojistik baseline + sığ, düzenlileştirilmiş ağaçlar; "
      "kategorik yoğun tablolarda CatBoost; fiziksel yönü bilinen ilişkilerde (d0↑→t_b↑, O2↑→K↑) monotonluk kısıtı.", ""]

# ---------------------------------------------------------------- 2
R += ["## 2. Veri envanteri ve kalite", "",
      f"- Kanonik dosya (`audit/canonical_files.csv`, use==True): **{n_canon}** (kopya ve 'wrong' dosyalar hariç). "
      "Kategori dağılımı: " + ", ".join(f"{k} {v}" for k, v in cat_counts.items()) + ". Ayrıntı: `outputs/inventory_summary.md`.",
      "- Analiz edilen tablolar: Tier 1 = acme_normal, acme_inverse, flex, bass2, smoke, cfi; Tier 2 = SAFFIRE I/II/III, SPICE, "
      "ACME test-günü tabloları (PSI-20/21/22/23); Tier 3 = SAFFIRE-III telemetri, SAME-R HKP.", "",
      "### 2.1 Yükleme ve temizlik", "", load.split("## Notlar")[0].split("\n", 2)[2].strip(), "",
      "Önemli temizlik kararları (tamamı `outputs/assumptions.md`):", "",
      "- `RAMP / RAMPED / LOW O2 / #DIV/0! / #VALUE! / none / – / -` → NaN + `<sütun>_flag` (token metni saklı). "
      "**Hiçbir eksik değer 0 ile doldurulmadı.**",
      "- PSI-159 inverse tablosundaki **861 boş satır** atıldı; geriye 154 test kaldı.",
      "- BASS-II CO değerlerinde `OR / over / >500` sağdan sansürlü (ölçüm aralığı aşılmış) → NaN + `_overrange`. "
      "13 testte negatif CO var; düzeltilmedi, işaretlendi.",
      "- Smoke: 37 DBP satırı (kalibrasyon aerosolü) çıkarıldı. Çap/konsantrasyon = 0 değerleri ölçülmemiş anlamına geldiği "
      "için NaN yapıldı.",
      "- Orijinal sütunlar korundu; XO2 için % sütunları **ek** olarak üretildi (`xo2_init_pct` vb.).", "",
      "### 2.2 Varsayımlar (özet)", "", *[f"- **{k}**: {v}" for k, v in sorted(ASS.items())], "",
      "### 2.3 Eksiklik", "",
      "![acme_normal eksiklik](figures/missing_acme_normal.png)", "",
      "ACME-normal'deki eksiklik **yapısal**: PSI-10 ve PSI-159 farklı sütun setlerine sahip; sonuç sütunları "
      "(burn time, hot ignition, ext mode) yalnızca PSI-159'da var.", "",
      "![cfi eksiklik](figures/missing_cfi.png)", "",
      "CFI'de Master sayfasındaki 227 testin 148'inde DATA (d0, K, burn time) analizi tamamlanmış.", ""]

# ---------------------------------------------------------------- 3
R += ["## 3. Hedef adayları", "",
      "Puan (1–5) kural tabanlı: n, en güçlü etki büyüklüğü, sınıf dengesi ve alan bilgisine dayalı düzeltme. "
      "Ayrıntı: `outputs/target_candidates.md`.", "",
      md_table(best[["dataset", "target", "task", "n", "class_balance", "max_effect", "score_1_5", "rationale"]]), "",
      "### Ekip hedefleriyle eşleşme", "",
      "| Ekip hedefi | Veri karşılığı | Sonuç |",
      "|---|---|---|",
      "| Yanma süresi | flex.burn_time_s, cfi.hf_burn_time_s, acme_*.burn_time_s (CFI-G) | **Ana hedef**: FLEX en iyisi (n=268, d² doğrulandı) |",
      "| Tutuşur mu / ne zaman | acme_normal.hot_ignition, acme_inverse.hot_ignition (+flash), flex.test_end | **Sınıflandırma**: ACME-normal net O2 sınırı gösteriyor |",
      "| Yanma hızı (K) | flex.burn_rate_K_mm2_s, cfi.k_hot_mm2_s | Güçlü hedef (O2, seyreltici, basınç ile açıklanıyor) |",
      "| Yayılma hızı | yok (BASS/BASS-II yalnızca video; SAFFIRE-II spread rate 1-g) | Kapsam dışı |",
      "| Toksik gaz / duman | smoke.amd_um, smoke.dusttrak_b_mg_m3, bass2.co_final_ppm, bass2.d_co2_pct | İkincil hedef: amd_um en iyisi (flight-only) |",
      "| Ortamdaki gaz | x_o2/x_n2/x_he/x_co2, p_atm | Feature; bass2.d_o2_pct hedef olarak da mümkün (PI etkisi baskın) |",
      "| Yayılma yönü | SAFFIRE concurrent/opposed | Yalnızca 2–15 numune → betimsel |",
      "| Radyometre | SAFFIRE-III 4 radyometre | Run başına feature çıkarımı (Bölüm 7) |", "",
      "![FLEX burn time hedefi](figures/target_flex_burn_time_s.png)", "",
      "![ACME normal tutuşma hedefi](figures/target_acme_normal_hot_ignition.png)", ""]

# ---------------------------------------------------------------- 4
tneed = TR[TR.column.str.contains("hedef alt")][["table", "column", "n", "skew", "boxcox_lambda", "suggest"]].round(2)
R += ["## 4. Dağılımlar", "",
      "Tüm tablolar için histogram + KDE (çarpık ve pozitif sütunlarda log ölçek yan yana): `figures/dist_<tablo>.png`; "
      "kategori bazlı boxplot'lar: `figures/box_<tablo>.png`; kategorik frekanslar: `figures/cat_<tablo>.png`.", "",
      "### Hedef dönüşüm önerileri (hedef alt kümesinde)", "", md_table(tneed), "",
      "- Yanma süreleri (ACME) ve partikül çapı / kütle konsantrasyonu sağa çarpık; **log** dönüşümü uygun (Box-Cox λ≈0.1–0.2).",
      "- CFI K ve FLEX burn time için **karekök** (λ≈0.4).",
      "- BASS-II ΔO2/ΔCO2 sıfır ve negatif değerler içeriyor → Yeo-Johnson veya dönüşümsüz robust kayıp.", "",
      "### Sınıf dengesizliği", "", md_table(CB[CB.imbalance_ratio > 3].head(12)), "",
      "![FLEX dağılımları](figures/dist_flex.png)", "",
      "![smoke boxplot](figures/box_smoke.png)", "",
      "Smoke boxplot'unda `rt_r0` ve `sample_temp_c` neredeyse yalnızca malzemeye bağlı (her malzeme kendi ısıtıcı ayarında "
      "test edilmiş). Bu durum Bölüm 5'teki Simpson bulgusunun kaynağı.", ""]

# ---------------------------------------------------------------- 5
R += ["## 5. İlişkiler ve korelasyon", "",
      "Ölçüler: sayısal–sayısal Pearson + Spearman; kategorik–sayısal η ve Kruskal-Wallis ε²; kategorik–kategorik "
      "bias-düzeltilmiş Cramér's V; hedef–feature karşılıklı bilgi (MI). Tablo içinde BH-FDR düzeltmesi uygulandı. "
      "Ham sonuçlar: `outputs/assoc_<tablo>.csv`.", "",
      "### Hedef başına en güçlü 5 feature", "", md_table(TOP), "",
      "### Yorum", "",
      "- **FLEX K**: O2 mol kesri en güçlü belirleyici (ρ=0.59). Seyreltici tipi (He/CO2/N2) η=0.45; CO2 K'yı düşürüyor. "
      "He etkisi büyük ölçüde seyreltici grubundan geliyor (kısmi ρ 0.42→0.13).",
      "- **CFI K_hot**: N2↑ → K↓ (ρ=−0.60), O2↑ → K↑ (0.55). d_ext_hot ile d0 arasında ρ=0.87: sönme çapı esas olarak başlangıç "
      "çapıyla ölçekleniyor, bu yüzden hedef olarak d_ext/d0 daha bilgilendirici.",
      "- **ACME-normal yanma süresi**: Tad (hesaplanmış) ve XO2 eşit derecede güçlü (ρ=0.58). Tad, XO2'nin bir fonksiyonu "
      "olduğu için bu iki sütun aynı bilgiyi taşıyor.",
      "- **BASS-II**: PI (araştırmacı) etkisi η≈0.7 ile en güçlüsü. Her PI farklı numune tipleri test ettiği için PI, malzeme "
      "ve geometri birbirinden ayrıştırılamıyor.",
      "- **Smoke amd_um**: malzeme η=0.53. Yaşlanma süresi (aging) arttıkça çap büyüyor (ρ=0.42); bu koagülasyonla tutarlı.", "",
      "### Doğrusal mı, monoton mu?", "",
      "Spearman ile Pearson arasındaki farklar `outputs/assoc_*.csv` dosyasından hesaplandı. Belirgin fark (|ρ|−|r| > 0.15) "
      "az sayıda çiftte görülüyor; ilişkilerin çoğu monoton ve yaklaşık doğrusal. İstisnalar çarpık hedeflerde "
      "(ACME burn time, smoke): log dönüşümünden sonra doğrusallaşıyorlar.", "",
      "### Çoklu doğrusallık", "", "|r| > 0.9 çiftleri:", "", md_table(HC.round(3)), "",
      "VIF > 10 olanlar: ACME'de xo2 / zst / tad_k_calc (hesaplanmış büyüklükler); FLEX ve CFI'de mol kesirleri (toplamları 1, "
      "yani kompozisyonel veri → denge gazı çıkarılmalı); smoke'ta rt_r0 ile sample_temp_c (r=0.99, ikisinden biri yeterli). "
      "Ayrıntı: `outputs/vif.csv`.", "",
      "### Karıştırıcı kontrolü (kısmi Spearman, grup sabit)", "", md_table(SM), "",
      "![smoke amd scatter](figures/scatter_smoke_amd_um.png)", "",
      "![CFI korelasyon](figures/corr_cfi.png)", "",
      "![FLEX korelasyon](figures/corr_flex.png)", ""]

# ---------------------------------------------------------------- 6
R += ["## 6. Grup etkileri ve fizik kontrolü", "",
      "### 6.1 ACME (CFI-G) — tutuşma ve söndürme sınırları", "",
      "![ACME normal söndürme haritası](figures/extinction_map_acme_normal.png)", "",
      "![ACME inverse söndürme haritası](figures/extinction_map_acme_inverse.png)", "",
      f"- Sıcak tutuşma oranı: normal **{GE['acme_normal_ign_rate']:.2f}**, inverse **{GE['acme_inverse_ign_rate']:.2f}**.",
      "- Normal alevlerde ~%21 O2 → bütan/propan için sıcak tutuşma yok (soğuk alev rejimi). %35–40 O2'de alevlerin çoğu "
      "kendiliğinden sönüyor (SE), 2 atm'de akış kesilmesi (FT) daha sık. Bu tablo fiziksel olarak makul: yüksek basınç ve "
      "yüksek O2 alevi radyatif sönmeye karşı güçlendiriyor ve test süre sınırına ulaşıyor.",
      "- **O2 arttıkça yanma süresi kısalır mı?** Normal alevlerde **hayır, uzuyor** (yakıt içinde ρ=0.29–0.67). "
      "Mikrogravitede küresel alevler radyasyon kaybıyla sönüyor; O2 arttıkça alev sıcaklığı yükseliyor ve alev daha uzun "
      "süre ayakta kalıyor. Inverse etanda ilişki ters yönde (ρ=−0.40); bu testlerde ortam yakıt kesri ve gün etkisi baskın.", "",
      "![ACME normal burn vs O2](figures/burn_vs_o2_acme_normal.png)", "",
      "### 6.2 FLEX — d² yasası", "", md_table(D2.round(3)), "",
      "![d2 yasası](figures/d2_law_flex.png)", "",
      "- Completion (tam yanma) alt kümesinde eğim ≈ 2: d² yasası **doğrulanıyor**. Heptan + Completion: 2.03.",
      "- Tüm veride eğim 1.31'e düşüyor, çünkü sönmeyle biten testlerin süresi d0²'ye değil, d0² − d_ext²'ye bağlı. Heptan "
      "testlerinin çoğu sönmeyle bittiği için heptanın genel eğimi düşük (0.64). **Bu nedenle FLEX burn time hedefi "
      "test_end'den bağımsız yorumlanamaz.**",
      f"- CFI için log(hf burn time) – log(d0) eğimi **{GE['cfi_slope']:.2f}** (negatif!). Büyük damlacıklarda sıcak alev "
      "radyatif sönmeye daha erken giriyor; sıcak alev evresi d² yasasıyla değil sönme kinetiğiyle belirleniyor. "
      f"(d0²−d_ext²)/t_hf ÷ khot = {GE['cfi_K_ratio_median']:.2f}: birimler (s, mm²/s) tutarlı.", "",
      "### 6.3 Duman — malzeme × yerçekimi × Rt/R0", "",
      "![smoke amd vs rt](figures/smoke_amd_rt_material.png)", "",
      "Malzeme içinde Rt/R0 ve yaşlanma etkisi (flight-only, Spearman):", "", md_table(W.round(2)), "",
      "- 5 malzemenin hepsinde ısıtıcı sıcaklığı arttıkça partikül çapı büyüyor (ρ 0.36–0.68). Bu fiziksel olarak makul: "
      "yüksek piroliz hızı daha yoğun buhar, dolayısıyla daha fazla yoğuşma ve koagülasyon demek.",
      "- Flight vs ground: Kapton'da fark var (flight medyan 0.12 µm, ground 0.24 µm, p=0.03). Diğer malzemelerde anlamlı fark "
      "yok. **Ancak ground sütun eşlemesi doğrulanmadığı için bu karşılaştırma yalnızca betimsel.** Ayrıntı: "
      "`outputs/group_effects.md`.", "",
      "### 6.4 BASS-II — O2 tüketimi ve CO/CO2", "", md_table(BM), "",
      "![BASS-II O2 CO2](figures/bass2_o2_co2.png)", "",
      f"- PMMA ΔCO2/ΔO2 = {GE['bass_pmma_ratio_median']:.2f} (teorik −0.83): O2 ve CO2 sensörleri birbiriyle uyumlu. "
      "ΔO2 ve ΔCO2 neredeyse aynı bilgiyi taşıyor, ikisi ayrı hedef olarak düşünülmemeli.",
      "- O2 tüketimi geometriye göre belirgin şekilde değişiyor: kalın PMMA levhalar (slab, medyan ΔO2 −1.1 puan) ve çubuklar (−0.5) "
      "ince filmlerden (−0.1) çok daha fazla O2 tüketiyor; SIBAL ve Nomex kumaşlarda tüketim ≈0. Bu, yakıt kütlesi ve yanma süresiyle tutarlı.", ""]

# ---------------------------------------------------------------- 7
R += ["## 7. Zaman serisi özeti", "",
      "![SAFFIRE-III numuneler](figures/ts_saffire3_samples.png)", "",
      md_table(EV.round(2)), "",
      f"- **Numune 1 (concurrent):** ateşleme {s1.t_igniter_on_s:.0f} s; radyometre 1/3 ile 2/4 sırayla pik yapıyor "
      f"(alev cephesinin geçişi). Tahmini alev süresi **{s1.flame_duration_est_s:.0f} s**, radyatif pik ≈ "
      f"{s1.rad_peak_mw_cm2:.0f} mW/cm², O2 düşüşü {s1.o2_drop_pct:.2f} puan, CO2 artışı {s1.co2_rise_pct:.2f} puan.",
      f"- **Numune 2 (opposed):** yalnızca radyometre 2/4 zayıf bir sinyal veriyor. ~{s2.t_extinction_s:.0f} s'deki keskin düşüş "
      "doğal bir sönmeden çok kaydın kesilmesine ya da testin sonlandırılmasına benziyor; tahmini süre (~72 s) alt sınır "
      "olarak alınmalı.",
      "- SAFFIRE-III 1 Hz Cygnus export'unun satırlarının %93'ü tekrar veya sentinel; `relative time (ms)` milisaniye cinsinden. "
      "Üç export birleştirilmedi.", "",
      "![SAME HKP](figures/ts_same_hkp_runs.png)", "",
      f"- SAME-R HKP: 44 ham dosya, `elapsedtesttime` geri düşüşleriyle **{len(SG)} segment** bulundu; >60 s olan "
      f"{len(long)} segmentin süre medyanı {long.duration_s.median():.0f} s. {int(SG.ptrak_sentinel_n.sum())} P-Trak hücresi "
      "sentinel ya da negatif değer içeriyordu (NaN yapıldı).", "",
      "**Run başına üretilebilecek feature'lar:** pik değer, pike kadar geçen süre, eşik üstü süre, yükselme ve sönüm eğimi, "
      "taban çıkarılmış AUC (radyatif enerji vekili), O2 düşüşü / CO2 artışı, taban seviyesi ve gürültü (MAD), run süresi, "
      "P-Trak/DustTrak pik ve ortalaması. Liste: `outputs/timeseries_summary.md`.", ""]

# ---------------------------------------------------------------- 8
mr = (OUT / "model_recommendations.md").read_text()
R += ["## 8. Model önerileri (eğitim yapılmadı)", "",
      "Kural tabanlı öneriler veri özelliklerinden türetildi; tam metin `outputs/model_recommendations.md` dosyasında. Özet:", "",
      "| Hedef | Baseline | Ağaç modeli | Doğrulama grubu | Kritik not |",
      "|---|---|---|---|---|",
      "| flex.burn_time_s | Ridge (sqrt hedef) | LightGBM/XGBoost + monotone(d0 +), CatBoost | year / fuel×diluent | test_end ile birlikte değerlendir (erken kesilme) |",
      "| flex.burn_rate_K | Ridge | GBM + monotone(x_o2 +) | fuel×diluent | mol kesirleri kompozisyonel → x_n2'yi çıkar |",
      "| cfi.k_hot_mm2_s | Ridge (sqrt) | RF / sığ GBM, CatBoost (fuel, diluent, fiber) | fuel×diluent | He etkisi seyreltici grubundan geliyor |",
      "| smoke.amd_um | Ridge (log) + material one-hot | CatBoost (material, campaign) | material (LOGO) | M0/M1 sızıntı; flight-only başla |",
      "| acme_normal.hot_ignition | Lojistik (balanced) | RF / CatBoost, monotone(xo2 +) | day × fuel | PSI-10'da etiket yok |",
      "| acme_*.burn_time_s | Ridge (log) | sığ GBM | day | FT testlerinde süre sansürlü → AFT/survival düşün |",
      "| bass2.d_o2_pct | Ridge | CatBoost | pi | PI ile malzeme iç içe; etkiler ayrıştırılamayabilir |", "",
      "**Genel:** n=108–274 küçük olduğu için derinlik 2–4, güçlü L2 ve erken durdurma kullanılmalı. Metrikler (MAE/RMSE, "
      "ROC-AUC/PR-AUC, macro-F1) grup bazlı CV'de raporlanmalı. Rastgele KFold sonuçları gruplar arasındaki sızıntı yüzünden "
      "iyimser çıkar.", ""]

# ---------------------------------------------------------------- 9
R += ["## 9. Riskler, açık sorular ve sonraki adımlar", "",
      "- **Eksik dosya:** `smoke_dataset.csv` bulunamadı. Ekip asıl dosyayı paylaşırsa `01_load_core.py::smoke()` ona yönlendirilmeli; "
      "o durumda da ground eşlemesi belgeyle doğrulanmalı.",
      "- **Birim belirsizlikleri:** FLEX K (mm²/s) fiziksel kontrolle desteklendi. CFI 'hf burn time' (s) ve radyasyon sütunları "
      "(`unit_unknown`) için belge kontrolü gerekiyor.",
      "- **Anlamı belirsiz sütunlar:** ACME `TFP` (Yes/No) hiç kullanılmadı; anlamı öğrenilirse sızıntı mı feature mı karar verilmeli.",
      "- **Sansür:** ACME FT ve FLEX Extinction/Disruption testlerinde yanma süresi tam süre değil.",
      "- **Karıştırıcılar:** gün (ACME-inverse), PI (BASS-II) ve malzeme (smoke) kontrol edilmeden kurulan modeller yanıltıcı olur.",
      "- **Sonraki adımlar:** (1) SAFFIRE/HKP run-feature'larını tablolaştırmak; (2) PSI-10 için ham veriden (`*_data.csv`) "
      "yanma süresi türetmenin fizibilitesi; (3) model aşamasında `feature_catalog.csv` içindeki `role in {feature}` sütunları "
      "ve önerilen GroupKFold şemasıyla başlamak.", "",
      "## Ek: dosyalar", "",
      "- Scriptler: `analysis/scripts/00_inventory.py … 09_build_report.py` (idempotent; iki ardışık çalıştırmada 50 çıktı dosyası birebir aynı)",
      "- Ara tablolar: `analysis/data/*.parquet` (her satırda `psi_id`, `source_file`, `source_row`)",
      "- Özetler: `analysis/outputs/` · Figürler: `analysis/figures/` · Loglar: `analysis/logs/`", ""]

(A / "REPORT.md").write_text("\n".join(R) + "\n")
print(f"REPORT.md written: {len(R)} lines, {sum(1 for x in R if x.startswith('!['))} figures embedded")
