# Model önerileri (Faz 8) — EĞİTİM YAPILMADI

Bu öneriler yalnızca veri özelliklerinden (n, feature sayısı, kategorik oran, doğrusal/monoton ilişki farkı, MI–korelasyon farkı, VIF, sınıf dengesi, Simpson bayrakları) kural tabanlı olarak türetilmiştir. Hiçbir model fit edilmemiş, hiçbir tahmin skoru üretilmemiştir.

## Girdi özellikleri

| dataset      | target            | task       |   n |   n_features |   n_cat |   minority |   vif_hi |   nonlinear_feats |   simpson_flags |
|:-------------|:------------------|:-----------|----:|-------------:|--------:|-----------:|---------:|------------------:|----------------:|
| acme_normal  | burn_time_s       | regression | 132 |            9 |       1 |     nan    |        3 |                 2 |               0 |
| acme_normal  | hot_ignition      | binary     | 179 |            9 |       1 |       0.26 |        3 |                 0 |               2 |
| acme_normal  | ext_mode          | binary     | 133 |            9 |       1 |       0.23 |        3 |                 0 |               0 |
| acme_inverse | burn_time_s       | regression | 131 |            9 |       1 |     nan    |        4 |                 1 |               3 |
| acme_inverse | hot_ignition      | binary     | 154 |            9 |       1 |       0.15 |        4 |                 0 |               1 |
| acme_inverse | ext_mode          | binary     | 139 |            9 |       1 |       0.42 |        4 |                 0 |               2 |
| flex         | burn_time_s       | regression | 268 |            8 |       2 |     nan    |        4 |                 0 |               0 |
| flex         | burn_rate_K_mm2_s | regression | 258 |            8 |       2 |     nan    |        4 |                 0 |               1 |
| flex         | d_ext_mm          | regression | 197 |            8 |       2 |     nan    |        4 |                 0 |               0 |
| flex         | test_end          | multiclass | 274 |            8 |       2 |       0.1  |        4 |                 0 |               0 |
| bass2        | d_o2_pct          | regression | 122 |           10 |       4 |     nan    |        0 |                 0 |               0 |
| bass2        | d_co2_pct         | regression | 121 |           10 |       4 |     nan    |        0 |                 0 |               0 |
| bass2        | co_final_ppm      | regression | 108 |           10 |       4 |     nan    |        0 |                 0 |               0 |
| smoke        | amd_um            | regression | 153 |            7 |       3 |     nan    |        2 |                 0 |               2 |
| smoke        | dusttrak_b_mg_m3  | regression | 148 |            7 |       3 |     nan    |        2 |                 0 |               2 |
| cfi          | k_hot_mm2_s       | regression | 148 |           10 |       3 |     nan    |        3 |                 0 |               1 |
| cfi          | hf_burn_time_s    | regression | 147 |           10 |       3 |     nan    |        3 |                 0 |               1 |
| cfi          | d_ext_hot_mm      | regression | 144 |           10 |       3 |     nan    |        3 |                 1 |               0 |
| cfi          | has_cool_flame    | binary     | 146 |           10 |       3 |       0.15 |        3 |                 0 |               0 |

## Genel ilkeler

1. **Önce baseline**: her hedef için Ridge/Lojistik; ağaç modelleri ancak grup bazlı CV'de baseline'ı anlamlı geçerse tercih edilir.
2. **Küçük n (100–270)**: XGBoost/LightGBM varsayılanları aşırı uyar; derinlik 2–4, güçlü L2, erken durdurma. RandomForest sağlam bir orta yol.
3. **Kategorik ağırlıklı tablolar (BASS-II, smoke, ACME)**: CatBoost, one-hot patlaması olmadan kategorikleri işler.
4. **Fiziksel monotonluk** (d0↑ → t_b↑, O2↑ → K↑): monotonic constraints hem genellemeyi hem yorumlanabilirliği artırır.
5. **Doğrulama her zaman grup bazlı**: deney/kampanya/gün/PI/malzeme etkisi güçlü; rastgele CV sızıntı gibi davranır.
6. **Sızıntı listesi** `outputs/feature_catalog.csv` (role=leakage) ve `target_candidates.md` içinde; bu sütunlar feature olarak kullanılmaz.

## Hedef bazında öneriler

### acme_normal.burn_time_s (regression, n=132, uygunluk 4/5)

- **Baseline:** Ridge (standartlaştırılmış sayısal + one-hot kategorik); VIF>10 (xo2_init, zst, tad_k_calc) nedeniyle OLS yerine Ridge/Lasso
- **Ağaç modelleri:** RandomForest (min_samples_leaf≥5) veya sığ GBM (max_depth 2–3, learning_rate ≤0.05, güçlü L2, erken durdurma)
- küçük n (132) → sığ ağaçlar + güçlü düzenlileştirme; karmaşık GBM aşırı uyum riski taşır
- doğrusal olmayan/monoton olmayan sinyal (Spearman≫Pearson: 2 feature; MI yüksek ama korelasyon düşük: zst, day) → ağaç modelleri baseline'dan anlamlı fark yaratabilir
- **Doğrulama:** GroupKFold (grup: fuel_base × day (test günü)); tekrarlı (5×) ve n küçükse LeaveOneGroupOut. Rastgele KFold iyimser sonuç verir.
- **Metrikler:** MAE + RMSE (orijinal ölçekte), log ölçekte modelleniyorsa MdAPE; R² yalnızca ek bilgi
- **Ön işleme:** hedef dönüşümü: log / log1p (Box-Cox λ≈0); eksikler: ağaçlar için NaN bırak (native), doğrusal modeller için medyan imputasyon + eksiklik göstergesi (0 ile DOLDURMA); sızıntı sütunlarını çıkar: xo2_final, xo2_final_pct, d_xo2, peak_burner_T_C, ext_mode, ext_mode_raw, hot_ignition, hot_ignition_raw…; tad_k_calc / zst / xo2 çoklu doğrusal → doğrusal modelde birini seç veya PCA; ağaçta kalabilir
- **Riskler:** FT (akış kesildi) testlerinde yanma süresi sağdan sansürlü olabilir → sansür bilinçli model (ör. survival / AFT) veya yalnızca SE alt kümesi değerlendirilmeli; küçük n (132) → güven aralıklarını bootstrap ile raporla

### acme_normal.hot_ignition (binary, n=179, uygunluk 4/5)

- **Baseline:** Lojistik regresyon (L2, class_weight='balanced')
- **Ağaç modelleri:** LightGBM / XGBoost (max_depth 3–4, min_child_samples≥10) + RandomForest karşılaştırması
- fiziksel monotonluk kısıtı önerisi (XGBoost/LightGBM `monotone_constraints`): xo2_init +
- karıştırıcı/Simpson bayrağı: m_fuel_mg_s|day (+0.30→+0.09); tad_k_calc|day (+0.34→+0.17) → grup değişkenini feature olarak ZORUNLU tut ve grup bazlı CV kullan
- **Doğrulama:** GroupKFold (grup: fuel_base × day (test günü)); tekrarlı (5×) ve n küçükse LeaveOneGroupOut. Rastgele KFold iyimser sonuç verir. Stratified Group KFold ile sınıf oranını koru.
- **Metrikler:** ROC-AUC + PR-AUC + balanced accuracy, Brier skoru (kalibrasyon)
- **Ön işleme:** hedef kodlama: sınıf etiketi; eksikler: ağaçlar için NaN bırak (native), doğrusal modeller için medyan imputasyon + eksiklik göstergesi (0 ile DOLDURMA); sızıntı sütunlarını çıkar: burn_time_s, ext_mode, ext_mode_raw, peak_burner_T_C, xo2_final, xo2_final_pct, d_xo2, comments…; tad_k_calc / zst / xo2 çoklu doğrusal → doğrusal modelde birini seç veya PCA; ağaçta kalabilir
- **Riskler:** küçük n (179) → güven aralıklarını bootstrap ile raporla

### acme_normal.ext_mode (binary, n=133, uygunluk 2/5)

- **Baseline:** Lojistik regresyon (L2, class_weight='balanced')
- **Ağaç modelleri:** RandomForest (min_samples_leaf≥5) veya sığ GBM (max_depth 2–3, learning_rate ≤0.05, güçlü L2, erken durdurma)
- küçük n (133) → sığ ağaçlar + güçlü düzenlileştirme; karmaşık GBM aşırı uyum riski taşır
- **Doğrulama:** GroupKFold (grup: fuel_base × day (test günü)); tekrarlı (5×) ve n küçükse LeaveOneGroupOut. Rastgele KFold iyimser sonuç verir. Stratified Group KFold ile sınıf oranını koru.
- **Metrikler:** ROC-AUC + PR-AUC + balanced accuracy, Brier skoru (kalibrasyon)
- **Ön işleme:** hedef kodlama: sınıf etiketi; eksikler: ağaçlar için NaN bırak (native), doğrusal modeller için medyan imputasyon + eksiklik göstergesi (0 ile DOLDURMA); sızıntı sütunlarını çıkar: burn_time_s, peak_burner_T_C, xo2_final, xo2_final_pct, d_xo2, comments, ext_mode_raw, hot_ignition…; tad_k_calc / zst / xo2 çoklu doğrusal → doğrusal modelde birini seç veya PCA; ağaçta kalabilir
- **Riskler:** küçük n (133) → güven aralıklarını bootstrap ile raporla

### acme_inverse.burn_time_s (regression, n=131, uygunluk 3/5)

- **Baseline:** Ridge (standartlaştırılmış sayısal + one-hot kategorik); VIF>10 (xo2, m_o2_mg_s, zst, hc_burnrate_mg_s) nedeniyle OLS yerine Ridge/Lasso
- **Ağaç modelleri:** RandomForest (min_samples_leaf≥5) veya sığ GBM (max_depth 2–3, learning_rate ≤0.05, güçlü L2, erken durdurma)
- küçük n (131) → sığ ağaçlar + güçlü düzenlileştirme; karmaşık GBM aşırı uyum riski taşır
- doğrusal olmayan/monoton olmayan sinyal (Spearman≫Pearson: 1 feature; MI yüksek ama korelasyon düşük: tad_k_calc, day) → ağaç modelleri baseline'dan anlamlı fark yaratabilir
- karıştırıcı/Simpson bayrağı: x_fuel_amb_init|day (+0.67→+0.23); p_atm|day (-0.54→-0.04); zst|day (-0.44→-0.17) → grup değişkenini feature olarak ZORUNLU tut ve grup bazlı CV kullan
- **Doğrulama:** GroupKFold (grup: day (gün içi vitiasyon)); tekrarlı (5×) ve n küçükse LeaveOneGroupOut. Rastgele KFold iyimser sonuç verir.
- **Metrikler:** MAE + RMSE (orijinal ölçekte), log ölçekte modelleniyorsa MdAPE; R² yalnızca ek bilgi
- **Ön işleme:** hedef dönüşümü: log / log1p (Box-Cox λ≈0); eksikler: ağaçlar için NaN bırak (native), doğrusal modeller için medyan imputasyon + eksiklik göstergesi (0 ile DOLDURMA); sızıntı sütunlarını çıkar: x_fuel_amb_final, peak_burner_T_C, peak_burner_T_K, flame_color, color_raw, color_hit_limit, comments, ext_mode…; tad_k_calc / zst / xo2 çoklu doğrusal → doğrusal modelde birini seç veya PCA; ağaçta kalabilir
- **Riskler:** FT (akış kesildi) testlerinde yanma süresi sağdan sansürlü olabilir → sansür bilinçli model (ör. survival / AFT) veya yalnızca SE alt kümesi değerlendirilmeli; küçük n (131) → güven aralıklarını bootstrap ile raporla

### acme_inverse.hot_ignition (binary, n=154, uygunluk 2/5)

- **Baseline:** Lojistik regresyon (L2, class_weight='balanced')
- **Ağaç modelleri:** LightGBM / XGBoost (max_depth 3–4, min_child_samples≥10) + RandomForest karşılaştırması
- sınıf dengesizliği (azınlık %15) → class_weight / scale_pos_weight, PR-AUC raporla
- karıştırıcı/Simpson bayrağı: x_fuel_amb_init|day (-0.34→-0.04) → grup değişkenini feature olarak ZORUNLU tut ve grup bazlı CV kullan
- **Doğrulama:** GroupKFold (grup: day (gün içi vitiasyon)); tekrarlı (5×) ve n küçükse LeaveOneGroupOut. Rastgele KFold iyimser sonuç verir. Stratified Group KFold ile sınıf oranını koru.
- **Metrikler:** ROC-AUC + PR-AUC + balanced accuracy, Brier skoru (kalibrasyon)
- **Ön işleme:** hedef kodlama: sınıf etiketi; eksikler: ağaçlar için NaN bırak (native), doğrusal modeller için medyan imputasyon + eksiklik göstergesi (0 ile DOLDURMA); sızıntı sütunlarını çıkar: burn_time_s, x_fuel_amb_final, peak_burner_T_C, peak_burner_T_K, flame_color, color_raw, color_hit_limit, comments…; tad_k_calc / zst / xo2 çoklu doğrusal → doğrusal modelde birini seç veya PCA; ağaçta kalabilir
- **Riskler:** küçük n (154) → güven aralıklarını bootstrap ile raporla

### acme_inverse.ext_mode (binary, n=139, uygunluk 3/5)

- **Baseline:** Lojistik regresyon (L2, class_weight='balanced')
- **Ağaç modelleri:** RandomForest (min_samples_leaf≥5) veya sığ GBM (max_depth 2–3, learning_rate ≤0.05, güçlü L2, erken durdurma)
- küçük n (139) → sığ ağaçlar + güçlü düzenlileştirme; karmaşık GBM aşırı uyum riski taşır
- doğrusal olmayan/monoton olmayan sinyal (Spearman≫Pearson: 0 feature; MI yüksek ama korelasyon düşük: day) → ağaç modelleri baseline'dan anlamlı fark yaratabilir
- karıştırıcı/Simpson bayrağı: x_fuel_amb_init|day (-0.57→-0.02); p_atm|day (+0.58→+0.01) → grup değişkenini feature olarak ZORUNLU tut ve grup bazlı CV kullan
- **Doğrulama:** GroupKFold (grup: day (gün içi vitiasyon)); tekrarlı (5×) ve n küçükse LeaveOneGroupOut. Rastgele KFold iyimser sonuç verir. Stratified Group KFold ile sınıf oranını koru.
- **Metrikler:** ROC-AUC + PR-AUC + balanced accuracy, Brier skoru (kalibrasyon)
- **Ön işleme:** hedef kodlama: sınıf etiketi; eksikler: ağaçlar için NaN bırak (native), doğrusal modeller için medyan imputasyon + eksiklik göstergesi (0 ile DOLDURMA); sızıntı sütunlarını çıkar: burn_time_s, x_fuel_amb_final, peak_burner_T_C, peak_burner_T_K, flame_color, color_raw, color_hit_limit, comments…; tad_k_calc / zst / xo2 çoklu doğrusal → doğrusal modelde birini seç veya PCA; ağaçta kalabilir
- **Riskler:** küçük n (139) → güven aralıklarını bootstrap ile raporla

### flex.burn_time_s (regression, n=268, uygunluk 5/5)

- **Baseline:** Ridge (standartlaştırılmış sayısal + one-hot kategorik); VIF>10 (x_o2, x_n2, x_co2, x_he) nedeniyle OLS yerine Ridge/Lasso
- **Ağaç modelleri:** LightGBM / XGBoost (max_depth 3–4, min_child_samples≥10) + RandomForest karşılaştırması; kategorik yoğunluk nedeniyle CatBoost (ordered target stats, küçük n'de iyi)
- 2 kategorik feature / 5 seviye → CatBoost doğal kategorik desteği avantajlı
- fiziksel monotonluk kısıtı önerisi (XGBoost/LightGBM `monotone_constraints`): d0_mm +
- **Doğrulama:** GroupKFold (grup: year veya ortam (diluent × fuel) — test kampanyası); tekrarlı (5×) ve n küçükse LeaveOneGroupOut. Rastgele KFold iyimser sonuç verir.
- **Metrikler:** MAE + RMSE (orijinal ölçekte), log ölçekte modelleniyorsa MdAPE; R² yalnızca ek bilgi
- **Ön işleme:** hedef dönüşümü: sqrt (λ≈0.5); eksikler: ağaçlar için NaN bırak (native), doğrusal modeller için medyan imputasyon + eksiklik göstergesi (0 ile DOLDURMA); sızıntı sütunlarını çıkar: d_ext_mm, d_ext_over_d0, K_from_d2_law, burn_rate_K_mm2_s, test_end, burn_time_approx; mol kesirleri toplamı = 1 (kompozisyonel, tam çoklu doğrusallık) → denge gazı x_n2'yi çıkar veya log-oran (ALR) dönüşümü kullan
- **Riskler:** Extinction/Disruption ile biten testlerde süre tam yanma süresi değil (erken kesilmiş) → test_end'e göre ayrı değerlendir veya sansür bilinçli model; orta n

### flex.burn_rate_K_mm2_s (regression, n=258, uygunluk 5/5)

- **Baseline:** Ridge (standartlaştırılmış sayısal + one-hot kategorik); VIF>10 (x_o2, x_n2, x_co2, x_he) nedeniyle OLS yerine Ridge/Lasso
- **Ağaç modelleri:** LightGBM / XGBoost (max_depth 3–4, min_child_samples≥10) + RandomForest karşılaştırması; kategorik yoğunluk nedeniyle CatBoost (ordered target stats, küçük n'de iyi)
- 2 kategorik feature / 5 seviye → CatBoost doğal kategorik desteği avantajlı
- fiziksel monotonluk kısıtı önerisi (XGBoost/LightGBM `monotone_constraints`): x_o2 +
- karıştırıcı/Simpson bayrağı: x_he|diluent (+0.42→+0.13) → grup değişkenini feature olarak ZORUNLU tut ve grup bazlı CV kullan
- **Doğrulama:** GroupKFold (grup: year veya ortam (diluent × fuel) — test kampanyası); tekrarlı (5×) ve n küçükse LeaveOneGroupOut. Rastgele KFold iyimser sonuç verir.
- **Metrikler:** MAE + RMSE (orijinal ölçekte), log ölçekte modelleniyorsa MdAPE; R² yalnızca ek bilgi
- **Ön işleme:** hedef dönüşümü: dönüşüm gerekmez; eksikler: ağaçlar için NaN bırak (native), doğrusal modeller için medyan imputasyon + eksiklik göstergesi (0 ile DOLDURMA); sızıntı sütunlarını çıkar: burn_time_s, d_ext_mm, d_ext_over_d0, K_from_d2_law, test_end; mol kesirleri toplamı = 1 (kompozisyonel, tam çoklu doğrusallık) → denge gazı x_n2'yi çıkar veya log-oran (ALR) dönüşümü kullan
- **Riskler:** birim varsayımı (mm²/s) — d² kontrolüyle desteklendi ama belgeyle teyit edilmeli; orta n

### flex.d_ext_mm (regression, n=197, uygunluk 5/5)

- **Baseline:** Ridge (standartlaştırılmış sayısal + one-hot kategorik); VIF>10 (x_o2, x_n2, x_co2, x_he) nedeniyle OLS yerine Ridge/Lasso
- **Ağaç modelleri:** LightGBM / XGBoost (max_depth 3–4, min_child_samples≥10) + RandomForest karşılaştırması; kategorik yoğunluk nedeniyle CatBoost (ordered target stats, küçük n'de iyi)
- 2 kategorik feature / 5 seviye → CatBoost doğal kategorik desteği avantajlı
- fiziksel monotonluk kısıtı önerisi (XGBoost/LightGBM `monotone_constraints`): d0_mm +
- **Doğrulama:** GroupKFold (grup: year veya ortam (diluent × fuel) — test kampanyası); tekrarlı (5×) ve n küçükse LeaveOneGroupOut. Rastgele KFold iyimser sonuç verir.
- **Metrikler:** MAE + RMSE (orijinal ölçekte), log ölçekte modelleniyorsa MdAPE; R² yalnızca ek bilgi
- **Ön işleme:** hedef dönüşümü: dönüşüm gerekmez; eksikler: ağaçlar için NaN bırak (native), doğrusal modeller için medyan imputasyon + eksiklik göstergesi (0 ile DOLDURMA); sızıntı sütunlarını çıkar: burn_time_s, burn_rate_K_mm2_s, d_ext_over_d0, K_from_d2_law, test_end; mol kesirleri toplamı = 1 (kompozisyonel, tam çoklu doğrusallık) → denge gazı x_n2'yi çıkar veya log-oran (ALR) dönüşümü kullan
- **Riskler:** küçük n (197) → güven aralıklarını bootstrap ile raporla

### flex.test_end (multiclass, n=274, uygunluk 4/5)

- **Baseline:** Çok terimli lojistik regresyon (L2, class_weight='balanced')
- **Ağaç modelleri:** LightGBM / XGBoost (max_depth 3–4, min_child_samples≥10) + RandomForest karşılaştırması; kategorik yoğunluk nedeniyle CatBoost (ordered target stats, küçük n'de iyi)
- 2 kategorik feature / 5 seviye → CatBoost doğal kategorik desteği avantajlı
- sınıf dengesizliği (azınlık %10) → class_weight / scale_pos_weight, PR-AUC raporla
- **Doğrulama:** GroupKFold (grup: year veya ortam (diluent × fuel) — test kampanyası); tekrarlı (5×) ve n küçükse LeaveOneGroupOut. Rastgele KFold iyimser sonuç verir. Stratified Group KFold ile sınıf oranını koru.
- **Metrikler:** macro-F1 + balanced accuracy + log-loss
- **Ön işleme:** hedef kodlama: sınıf etiketi; eksikler: ağaçlar için NaN bırak (native), doğrusal modeller için medyan imputasyon + eksiklik göstergesi (0 ile DOLDURMA); sızıntı sütunlarını çıkar: burn_time_s, burn_rate_K_mm2_s, d_ext_mm, d_ext_over_d0, K_from_d2_law; mol kesirleri toplamı = 1 (kompozisyonel, tam çoklu doğrusallık) → denge gazı x_n2'yi çıkar veya log-oran (ALR) dönüşümü kullan
- **Riskler:** orta n

### bass2.d_o2_pct (regression, n=122, uygunluk 3/5)

- **Baseline:** Ridge (standartlaştırılmış sayısal + one-hot kategorik)
- **Ağaç modelleri:** RandomForest (min_samples_leaf≥5) veya sığ GBM (max_depth 2–3, learning_rate ≤0.05, güçlü L2, erken durdurma); kategorik yoğunluk nedeniyle CatBoost (ordered target stats, küçük n'de iyi)
- küçük n (122) → sığ ağaçlar + güçlü düzenlileştirme; karmaşık GBM aşırı uyum riski taşır
- 4 kategorik feature / 18 seviye → CatBoost doğal kategorik desteği avantajlı
- **Doğrulama:** GroupKFold (grup: pi (araştırmacı test seti)); tekrarlı (5×) ve n küçükse LeaveOneGroupOut. Rastgele KFold iyimser sonuç verir.
- **Metrikler:** MAE + RMSE (orijinal ölçekte), log ölçekte modelleniyorsa MdAPE; R² yalnızca ek bilgi
- **Ön işleme:** hedef dönüşümü: Yeo-Johnson (λ=3.18) - sıfır/negatif değer var; eksikler: ağaçlar için NaN bırak (native), doğrusal modeller için medyan imputasyon + eksiklik göstergesi (0 ile DOLDURMA); sızıntı sütunlarını çıkar: o2_final_pct, co2_final_pct, co_final_ppm, d_co2_pct, d_co_ppm, frames, frames_raw, co_final_ppm_overrange…
- **Riskler:** PI etkisi ile malzeme/geometri iç içe (her PI farklı numune tipi) — etkiler ayrıştırılamayabilir; küçük n (122) → güven aralıklarını bootstrap ile raporla

### bass2.d_co2_pct (regression, n=121, uygunluk 3/5)

- **Baseline:** Ridge (standartlaştırılmış sayısal + one-hot kategorik)
- **Ağaç modelleri:** RandomForest (min_samples_leaf≥5) veya sığ GBM (max_depth 2–3, learning_rate ≤0.05, güçlü L2, erken durdurma); kategorik yoğunluk nedeniyle CatBoost (ordered target stats, küçük n'de iyi)
- küçük n (121) → sığ ağaçlar + güçlü düzenlileştirme; karmaşık GBM aşırı uyum riski taşır
- 4 kategorik feature / 18 seviye → CatBoost doğal kategorik desteği avantajlı
- **Doğrulama:** GroupKFold (grup: pi (araştırmacı test seti)); tekrarlı (5×) ve n küçükse LeaveOneGroupOut. Rastgele KFold iyimser sonuç verir.
- **Metrikler:** MAE + RMSE (orijinal ölçekte), log ölçekte modelleniyorsa MdAPE; R² yalnızca ek bilgi
- **Ön işleme:** hedef dönüşümü: Yeo-Johnson (λ=-1.94) - sıfır/negatif değer var; eksikler: ağaçlar için NaN bırak (native), doğrusal modeller için medyan imputasyon + eksiklik göstergesi (0 ile DOLDURMA); sızıntı sütunlarını çıkar: o2_final_pct, co2_final_pct, co_final_ppm, d_o2_pct, d_co_ppm, frames, frames_raw, co_final_ppm_overrange…
- **Riskler:** PI etkisi ile malzeme/geometri iç içe (her PI farklı numune tipi) — etkiler ayrıştırılamayabilir; küçük n (121) → güven aralıklarını bootstrap ile raporla

### bass2.co_final_ppm (regression, n=108, uygunluk 3/5)

- **Baseline:** Ridge (standartlaştırılmış sayısal + one-hot kategorik)
- **Ağaç modelleri:** RandomForest (min_samples_leaf≥5) veya sığ GBM (max_depth 2–3, learning_rate ≤0.05, güçlü L2, erken durdurma); kategorik yoğunluk nedeniyle CatBoost (ordered target stats, küçük n'de iyi)
- küçük n (108) → sığ ağaçlar + güçlü düzenlileştirme; karmaşık GBM aşırı uyum riski taşır
- 4 kategorik feature / 18 seviye → CatBoost doğal kategorik desteği avantajlı
- **Doğrulama:** GroupKFold (grup: pi (araştırmacı test seti)); tekrarlı (5×) ve n küçükse LeaveOneGroupOut. Rastgele KFold iyimser sonuç verir.
- **Metrikler:** MAE + RMSE (orijinal ölçekte), log ölçekte modelleniyorsa MdAPE; R² yalnızca ek bilgi
- **Ön işleme:** hedef dönüşümü: log / log1p (Box-Cox λ≈0); eksikler: ağaçlar için NaN bırak (native), doğrusal modeller için medyan imputasyon + eksiklik göstergesi (0 ile DOLDURMA); sızıntı sütunlarını çıkar: o2_final_pct, co2_final_pct, d_o2_pct, d_co2_pct, d_co_ppm, frames, frames_raw, co_final_ppm_overrange…
- **Riskler:** PI etkisi ile malzeme/geometri iç içe (her PI farklı numune tipi) — etkiler ayrıştırılamayabilir; küçük n (108) → güven aralıklarını bootstrap ile raporla

### smoke.amd_um (regression, n=153, uygunluk 4/5)

- **Baseline:** Ridge (standartlaştırılmış sayısal + one-hot kategorik); VIF>10 (rt_r0, sample_temp_c) nedeniyle OLS yerine Ridge/Lasso
- **Ağaç modelleri:** LightGBM / XGBoost (max_depth 3–4, min_child_samples≥10) + RandomForest karşılaştırması; kategorik yoğunluk nedeniyle CatBoost (ordered target stats, küçük n'de iyi)
- 3 kategorik feature / 10 seviye → CatBoost doğal kategorik desteği avantajlı
- doğrusal olmayan/monoton olmayan sinyal (Spearman≫Pearson: 0 feature; MI yüksek ama korelasyon düşük: rt_r0, sample_temp_c) → ağaç modelleri baseline'dan anlamlı fark yaratabilir
- fiziksel monotonluk kısıtı önerisi (XGBoost/LightGBM `monotone_constraints`): rt_r0 + (material içinde), aging_s + (koagülasyon)
- karıştırıcı/Simpson bayrağı: rt_r0|material (-0.27→+0.49); sample_temp_c|material (-0.30→+0.49) → grup değişkenini feature olarak ZORUNLU tut ve grup bazlı CV kullan
- **Doğrulama:** GroupKFold (grup: material (görülmemiş malzemeye genelleme) veya campaign); tekrarlı (5×) ve n küçükse LeaveOneGroupOut. Rastgele KFold iyimser sonuç verir.
- **Metrikler:** MAE + RMSE (orijinal ölçekte), log ölçekte modelleniyorsa MdAPE; R² yalnızca ek bilgi
- **Ön işleme:** hedef dönüşümü: log / log1p (Box-Cox λ≈0); eksikler: ağaçlar için NaN bırak (native), doğrusal modeller için medyan imputasyon + eksiklik göstergesi (0 ile DOLDURMA); sızıntı sütunlarını çıkar: m0_per_cc, m1_mm_per_cc, log_m0, dam_um, dg_um, sigma_g, dusttrak_a_mg_m3, dusttrak_b_mg_m3…
- **Riskler:** ground eşlemesi doğrulanmadı → önce flight-only model; ground'u ayrı doğrulama seti gibi kullan; küçük n (153) → güven aralıklarını bootstrap ile raporla

### smoke.dusttrak_b_mg_m3 (regression, n=148, uygunluk 3/5)

- **Baseline:** Ridge (standartlaştırılmış sayısal + one-hot kategorik); VIF>10 (rt_r0, sample_temp_c) nedeniyle OLS yerine Ridge/Lasso
- **Ağaç modelleri:** RandomForest (min_samples_leaf≥5) veya sığ GBM (max_depth 2–3, learning_rate ≤0.05, güçlü L2, erken durdurma); kategorik yoğunluk nedeniyle CatBoost (ordered target stats, küçük n'de iyi)
- küçük n (148) → sığ ağaçlar + güçlü düzenlileştirme; karmaşık GBM aşırı uyum riski taşır
- 3 kategorik feature / 10 seviye → CatBoost doğal kategorik desteği avantajlı
- karıştırıcı/Simpson bayrağı: rt_r0|material (-0.40→+0.37); sample_temp_c|material (-0.40→+0.39) → grup değişkenini feature olarak ZORUNLU tut ve grup bazlı CV kullan
- **Doğrulama:** GroupKFold (grup: material (görülmemiş malzemeye genelleme) veya campaign); tekrarlı (5×) ve n küçükse LeaveOneGroupOut. Rastgele KFold iyimser sonuç verir.
- **Metrikler:** MAE + RMSE (orijinal ölçekte), log ölçekte modelleniyorsa MdAPE; R² yalnızca ek bilgi
- **Ön işleme:** hedef dönüşümü: log / log1p (Box-Cox λ≈0); eksikler: ağaçlar için NaN bırak (native), doğrusal modeller için medyan imputasyon + eksiklik göstergesi (0 ile DOLDURMA); sızıntı sütunlarını çıkar: dusttrak_a_mg_m3, m3_mpass, mpass_3_2, m0_per_cc, m1_mm_per_cc, log_m0, amd_um, dam_um…
- **Riskler:** ground eşlemesi doğrulanmadı → önce flight-only model; ground'u ayrı doğrulama seti gibi kullan; küçük n (148) → güven aralıklarını bootstrap ile raporla

### cfi.k_hot_mm2_s (regression, n=148, uygunluk 5/5)

- **Baseline:** Ridge (standartlaştırılmış sayısal + one-hot kategorik); VIF>10 (x_o2, x_n2, x_he) nedeniyle OLS yerine Ridge/Lasso
- **Ağaç modelleri:** RandomForest (min_samples_leaf≥5) veya sığ GBM (max_depth 2–3, learning_rate ≤0.05, güçlü L2, erken durdurma); kategorik yoğunluk nedeniyle CatBoost (ordered target stats, küçük n'de iyi)
- küçük n (148) → sığ ağaçlar + güçlü düzenlileştirme; karmaşık GBM aşırı uyum riski taşır
- 3 kategorik feature / 7 seviye → CatBoost doğal kategorik desteği avantajlı
- fiziksel monotonluk kısıtı önerisi (XGBoost/LightGBM `monotone_constraints`): x_o2 +
- karıştırıcı/Simpson bayrağı: x_he|diluent (+0.40→+0.04) → grup değişkenini feature olarak ZORUNLU tut ve grup bazlı CV kullan
- **Doğrulama:** GroupKFold (grup: fuel × diluent (veya test tarihi)); tekrarlı (5×) ve n küçükse LeaveOneGroupOut. Rastgele KFold iyimser sonuç verir.
- **Metrikler:** MAE + RMSE (orijinal ölçekte), log ölçekte modelleniyorsa MdAPE; R² yalnızca ek bilgi
- **Ön işleme:** hedef dönüşümü: sqrt (λ≈0.5); eksikler: ağaçlar için NaN bırak (native), doğrusal modeller için medyan imputasyon + eksiklik göstergesi (0 ile DOLDURMA); sızıntı sütunlarını çıkar: d_ext_hot_mm, k_cool_mm2_s, d_ext_cool_mm, hf_burn_time_s, reignitions, extrap_cf, peak_hf_rad, peak_h2o_rad…; mol kesirleri toplamı = 1 (kompozisyonel, tam çoklu doğrusallık) → denge gazı x_n2'yi çıkar veya log-oran (ALR) dönüşümü kullan
- **Riskler:** küçük n (148) → güven aralıklarını bootstrap ile raporla

### cfi.hf_burn_time_s (regression, n=147, uygunluk 4/5)

- **Baseline:** Ridge (standartlaştırılmış sayısal + one-hot kategorik); VIF>10 (x_o2, x_n2, x_he) nedeniyle OLS yerine Ridge/Lasso
- **Ağaç modelleri:** RandomForest (min_samples_leaf≥5) veya sığ GBM (max_depth 2–3, learning_rate ≤0.05, güçlü L2, erken durdurma); kategorik yoğunluk nedeniyle CatBoost (ordered target stats, küçük n'de iyi)
- küçük n (147) → sığ ağaçlar + güçlü düzenlileştirme; karmaşık GBM aşırı uyum riski taşır
- 3 kategorik feature / 7 seviye → CatBoost doğal kategorik desteği avantajlı
- doğrusal olmayan/monoton olmayan sinyal (Spearman≫Pearson: 0 feature; MI yüksek ama korelasyon düşük: x_n2) → ağaç modelleri baseline'dan anlamlı fark yaratabilir
- karıştırıcı/Simpson bayrağı: x_he|diluent (-0.42→-0.16) → grup değişkenini feature olarak ZORUNLU tut ve grup bazlı CV kullan
- **Doğrulama:** GroupKFold (grup: fuel × diluent (veya test tarihi)); tekrarlı (5×) ve n küçükse LeaveOneGroupOut. Rastgele KFold iyimser sonuç verir.
- **Metrikler:** MAE + RMSE (orijinal ölçekte), log ölçekte modelleniyorsa MdAPE; R² yalnızca ek bilgi
- **Ön işleme:** hedef dönüşümü: dönüşüm gerekmez; eksikler: ağaçlar için NaN bırak (native), doğrusal modeller için medyan imputasyon + eksiklik göstergesi (0 ile DOLDURMA); sızıntı sütunlarını çıkar: d_ext_hot_mm, k_hot_mm2_s, k_cool_mm2_s, d_ext_cool_mm, reignitions, extrap_cf, peak_hf_rad, peak_h2o_rad…; mol kesirleri toplamı = 1 (kompozisyonel, tam çoklu doğrusallık) → denge gazı x_n2'yi çıkar veya log-oran (ALR) dönüşümü kullan
- **Riskler:** birim (s) varsayımı; küçük n (147) → güven aralıklarını bootstrap ile raporla

### cfi.d_ext_hot_mm (regression, n=144, uygunluk 3/5)

- **Baseline:** Ridge (standartlaştırılmış sayısal + one-hot kategorik); VIF>10 (x_o2, x_n2, x_he) nedeniyle OLS yerine Ridge/Lasso
- **Ağaç modelleri:** RandomForest (min_samples_leaf≥5) veya sığ GBM (max_depth 2–3, learning_rate ≤0.05, güçlü L2, erken durdurma); kategorik yoğunluk nedeniyle CatBoost (ordered target stats, küçük n'de iyi)
- küçük n (144) → sığ ağaçlar + güçlü düzenlileştirme; karmaşık GBM aşırı uyum riski taşır
- 3 kategorik feature / 7 seviye → CatBoost doğal kategorik desteği avantajlı
- doğrusal olmayan/monoton olmayan sinyal (Spearman≫Pearson: 1 feature; MI yüksek ama korelasyon düşük: -) → ağaç modelleri baseline'dan anlamlı fark yaratabilir
- fiziksel monotonluk kısıtı önerisi (XGBoost/LightGBM `monotone_constraints`): d0_mm +
- **Doğrulama:** GroupKFold (grup: fuel × diluent (veya test tarihi)); tekrarlı (5×) ve n küçükse LeaveOneGroupOut. Rastgele KFold iyimser sonuç verir.
- **Metrikler:** MAE + RMSE (orijinal ölçekte), log ölçekte modelleniyorsa MdAPE; R² yalnızca ek bilgi
- **Ön işleme:** hedef dönüşümü: dönüşüm gerekmez; eksikler: ağaçlar için NaN bırak (native), doğrusal modeller için medyan imputasyon + eksiklik göstergesi (0 ile DOLDURMA); sızıntı sütunlarını çıkar: k_hot_mm2_s, k_cool_mm2_s, d_ext_cool_mm, hf_burn_time_s, reignitions, extrap_cf, peak_hf_rad, peak_h2o_rad…; mol kesirleri toplamı = 1 (kompozisyonel, tam çoklu doğrusallık) → denge gazı x_n2'yi çıkar veya log-oran (ALR) dönüşümü kullan
- **Riskler:** küçük n (144) → güven aralıklarını bootstrap ile raporla

### cfi.has_cool_flame (binary, n=146, uygunluk 2/5)

- **Baseline:** Lojistik regresyon (L2, class_weight='balanced')
- **Ağaç modelleri:** RandomForest (min_samples_leaf≥5) veya sığ GBM (max_depth 2–3, learning_rate ≤0.05, güçlü L2, erken durdurma); kategorik yoğunluk nedeniyle CatBoost (ordered target stats, küçük n'de iyi)
- küçük n (146) → sığ ağaçlar + güçlü düzenlileştirme; karmaşık GBM aşırı uyum riski taşır
- 3 kategorik feature / 7 seviye → CatBoost doğal kategorik desteği avantajlı
- sınıf dengesizliği (azınlık %15) → class_weight / scale_pos_weight, PR-AUC raporla
- **Doğrulama:** GroupKFold (grup: fuel × diluent (veya test tarihi)); tekrarlı (5×) ve n küçükse LeaveOneGroupOut. Rastgele KFold iyimser sonuç verir. Stratified Group KFold ile sınıf oranını koru.
- **Metrikler:** ROC-AUC + PR-AUC + balanced accuracy, Brier skoru (kalibrasyon)
- **Ön işleme:** hedef kodlama: sınıf etiketi; eksikler: ağaçlar için NaN bırak (native), doğrusal modeller için medyan imputasyon + eksiklik göstergesi (0 ile DOLDURMA); sızıntı sütunlarını çıkar: d_ext_hot_mm, k_hot_mm2_s, k_cool_mm2_s, d_ext_cool_mm, hf_burn_time_s, reignitions, extrap_cf, peak_hf_rad…; mol kesirleri toplamı = 1 (kompozisyonel, tam çoklu doğrusallık) → denge gazı x_n2'yi çıkar veya log-oran (ALR) dönüşümü kullan
- **Riskler:** küçük n (146) → güven aralıklarını bootstrap ile raporla

