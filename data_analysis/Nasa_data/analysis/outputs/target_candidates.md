# Hedef adayları (Faz 7)

Puan (1–5) kural tabanlı: 3 + (n≥150) − (n<80) + (en güçlü etki ≥0.5) − (en güçlü etki <0.3) − (azınlık sınıfı <%15) + alan bilgisine dayalı düzeltme (gerekçe sütunu). Etki: |Spearman|, η veya Cramér's V'nin maksimumu.

| dataset      | target            | task       |   n |   missing_pct_full | class_balance                                |   max_effect |   score_1_5 | rationale                                                                              |
|:-------------|:------------------|:-----------|----:|-------------------:|:---------------------------------------------|-------------:|------------:|:---------------------------------------------------------------------------------------|
| flex         | burn_time_s       | regression | 268 |                2.2 |                                              |         0.44 |           5 | d² yasası doğrulandı (Completion eğimi≈2); test_end ile birlikte yorumlanmalı.         |
| flex         | burn_rate_K_mm2_s | regression | 258 |                5.8 |                                              |         0.59 |           5 | Birim varsayımı (mm²/s) d² tutarlılık kontrolüyle desteklendi (oran≈0.95).             |
| flex         | d_ext_mm          | regression | 197 |               28.1 |                                              |         0.67 |           5 | Yalnızca sönme/kesinti ile biten testlerde tanımlı (seçim yanlılığı).                  |
| cfi          | k_hot_mm2_s       | regression | 148 |               34.8 |                                              |         0.6  |           5 | Fiziksel olarak iyi tanımlı; O2/He/basınç ilişkileri güçlü.                            |
| flex         | test_end          | multiclass | 274 |                0   | Extinction:186, Disruption:61, Completion:27 |         0.58 |           4 | 3 sınıf, Completion azınlık (%10).                                                     |
| acme_normal  | hot_ignition      | binary     | 179 |               53.6 | 1.0:132, 0.0:47                              |         0.43 |           4 | Net fiziksel sınır (≈21% O2'de tutuşma yok); PSI-10'da yok.                            |
| smoke        | amd_um            | regression | 153 |                8.4 |                                              |         0.53 |           4 | M0/M1 sızıntı; ground eşlemesi doğrulanmadı; Simpson (Rt/R0 × material).               |
| cfi          | hf_burn_time_s    | regression | 147 |               35.2 |                                              |         0.52 |           4 | Birim saniye varsayımı; d0 ile negatif ilişki (radyatif sönme) — d² yasası uygulanmaz. |
| acme_normal  | burn_time_s       | regression | 132 |               54.7 |                                              |         0.58 |           4 | Yalnızca CFI-G; FT (akış kesildi) testlerinde süre sağdan sansürlü olabilir.           |
| smoke        | dusttrak_b_mg_m3  | regression | 148 |               11.4 |                                              |         0.78 |           3 | Seyreltme/kalibrasyon düzeltmeli cihaz okuması; material baskın.                       |
| cfi          | d_ext_hot_mm      | regression | 144 |               36.6 |                                              |         0.87 |           3 | d0 ile ρ=0.87 — büyük ölçüde başlangıç çapının ölçeği; d_ext/d0 daha anlamlı.          |
| acme_inverse | ext_mode          | binary     | 139 |               49.3 | SE:81, FT:58                                 |         0.56 |           3 | FT operasyonel karar olabilir; gün etkisi baskın.                                      |
| acme_inverse | burn_time_s       | regression | 131 |               43.8 |                                              |         0.67 |           3 | Gün içi vitiasyon (ortam yakıtı birikimi) güçlü karıştırıcı; FT sansürü.               |
| bass2        | d_o2_pct          | regression | 122 |                1.6 |                                              |         0.71 |           3 | PI (araştırmacı) etkisi baskın; tutuşma süresi/akış ayar dizisi bilinmiyor.            |
| bass2        | d_co2_pct         | regression | 121 |                6.2 |                                              |         0.72 |           3 | PI etkisi baskın; ΔO2 ile neredeyse stokiyometrik (aynı bilgi).                        |
| bass2        | co_final_ppm      | regression | 108 |                7   |                                              |         0.7  |           3 | Sansürlü (OR/>500) ve negatif değerler; küçük n.                                       |
| acme_inverse | hot_ignition      | binary     | 154 |               43.8 | 1.0:131, 0.0:23                              |         0.47 |           2 | Azınlık sınıfı ~%15; 'flash' 3. sınıf olarak ayrıca modellenebilir.                    |
| cfi          | has_cool_flame    | binary     | 146 |                0   | 1:124, 0:22                                  |         0.38 |           2 | Türetilmiş (kcool ölçülmüş mü); azınlık %15; analiz tamamlanma durumu karışabilir.     |
| acme_normal  | ext_mode          | binary     | 133 |               65.5 | SE:102, FT:31                                |         0.33 |           2 | FT operasyonel karar (akış kesildi) olabilir — fiziksel söndürme değil.                |

## flex.burn_time_s — puan 5/5

- Tip: **regression**, n=268, tam tabloda eksik %2.2
- En güçlü 5 ilişki: x_o2 (spearman_rho=0.44, MI=0.12); d0_mm (spearman_rho=0.43, MI=0.50); fuel (eta=0.36, MI=0.05); x_he (spearman_rho=-0.27, MI=0.05); diluent (eta=0.26, MI=0.05)
- Sızıntı (feature olarak KULLANILMAZ): `d_ext_mm, d_ext_over_d0, K_from_d2_law, burn_rate_K_mm2_s, test_end, burn_time_approx`
- Gerekçe: d² yasası doğrulandı (Completion eğimi≈2); test_end ile birlikte yorumlanmalı.

## flex.burn_rate_K_mm2_s — puan 5/5

- Tip: **regression**, n=258, tam tabloda eksik %5.8
- En güçlü 5 ilişki: x_o2 (spearman_rho=0.59, MI=0.38); diluent (eta=0.45, MI=0.13); x_co2 (spearman_rho=-0.42, MI=0.20); x_he (spearman_rho=0.42, MI=0.09); fuel (eta=0.26, MI=0.11)
- Sızıntı (feature olarak KULLANILMAZ): `burn_time_s, d_ext_mm, d_ext_over_d0, K_from_d2_law, test_end`
- Gerekçe: Birim varsayımı (mm²/s) d² tutarlılık kontrolüyle desteklendi (oran≈0.95).

## flex.d_ext_mm — puan 5/5

- Tip: **regression**, n=197, tam tabloda eksik %28.1
- En güçlü 5 ilişki: d0_mm (spearman_rho=0.67, MI=0.50); x_o2 (spearman_rho=-0.33, MI=0.00); x_co2 (spearman_rho=0.23, MI=0.08); x_n2 (spearman_rho=-0.17, MI=0.04); p_atm (spearman_rho=-0.15, MI=0.05)
- Sızıntı (feature olarak KULLANILMAZ): `burn_time_s, burn_rate_K_mm2_s, d_ext_over_d0, K_from_d2_law, test_end`
- Gerekçe: Yalnızca sönme/kesinti ile biten testlerde tanımlı (seçim yanlılığı).

## cfi.k_hot_mm2_s — puan 5/5

- Tip: **regression**, n=148, tam tabloda eksik %34.8
- En güçlü 5 ilişki: x_n2 (spearman_rho=-0.60, MI=0.45); x_o2 (spearman_rho=0.55, MI=0.25); diluent (eta=0.51, MI=0.17); fuel (eta=0.43, MI=0.21); x_he (spearman_rho=0.40, MI=0.22)
- Sızıntı (feature olarak KULLANILMAZ): `d_ext_hot_mm, k_cool_mm2_s, d_ext_cool_mm, hf_burn_time_s, reignitions, extrap_cf, peak_hf_rad, peak_h2o_rad, rad_ratio, rad_2p5mm, rad_2p5mm_narrow, cf_rad_ratio, rad_2p5mm_cf, time_2p5mm, actual_d_mm, has_cool_flame`
- Gerekçe: Fiziksel olarak iyi tanımlı; O2/He/basınç ilişkileri güçlü.

## flex.test_end — puan 4/5

- Tip: **multiclass**, n=274, tam tabloda eksik %0.0, sınıflar: Extinction:186, Disruption:61, Completion:27
- En güçlü 5 ilişki: x_o2 (eta=0.58, MI=0.20); fuel (cramers_v_bc=0.30, MI=0.05); d0_mm (eta=0.18, MI=0.00); x_he (eta=0.17, MI=0.03); x_co2 (eta=0.15, MI=0.06)
- Sızıntı (feature olarak KULLANILMAZ): `burn_time_s, burn_rate_K_mm2_s, d_ext_mm, d_ext_over_d0, K_from_d2_law`
- Gerekçe: 3 sınıf, Completion azınlık (%10).

## acme_normal.hot_ignition — puan 4/5

- Tip: **binary**, n=179, tam tabloda eksik %53.6, sınıflar: 1.0:132, 0.0:47
- En güçlü 5 ilişki: tad_k_calc (eta=0.43, MI=0.23); zst (eta=0.33, MI=0.28); fuel_base (cramers_v_bc=0.29, MI=0.06); day (eta=0.27, MI=0.18); m_fuel_mg_s (eta=0.22, MI=0.13)
- Sızıntı (feature olarak KULLANILMAZ): `burn_time_s, ext_mode, ext_mode_raw, peak_burner_T_C, xo2_final, xo2_final_pct, d_xo2, comments, cool_flame, cool_flame_raw, hot_ignition_raw`
- Gerekçe: Net fiziksel sınır (≈21% O2'de tutuşma yok); PSI-10'da yok.

## smoke.amd_um — puan 4/5

- Tip: **regression**, n=153, tam tabloda eksik %8.4
- En güçlü 5 ilişki: material (eta=0.53, MI=0.24); aging_s (spearman_rho=0.42, MI=0.13); sample_temp_c (spearman_rho=-0.30, MI=0.36); rt_r0 (spearman_rho=-0.27, MI=0.35); inlet_velocity_cm_s (spearman_rho=-0.19, MI=0.01)
- Sızıntı (feature olarak KULLANILMAZ): `m0_per_cc, m1_mm_per_cc, log_m0, dam_um, dg_um, sigma_g, dusttrak_a_mg_m3, dusttrak_b_mg_m3, m3_mpass, mpass_3_2, mass_loss_mg`
- Gerekçe: M0/M1 sızıntı; ground eşlemesi doğrulanmadı; Simpson (Rt/R0 × material).

## cfi.hf_burn_time_s — puan 4/5

- Tip: **regression**, n=147, tam tabloda eksik %35.2
- En güçlü 5 ilişki: x_o2 (spearman_rho=0.52, MI=0.23); x_he (spearman_rho=-0.42, MI=0.17); diluent (eta=0.40, MI=0.13); fuel (eta=0.38, MI=0.22); d0_mm (spearman_rho=-0.35, MI=0.10)
- Sızıntı (feature olarak KULLANILMAZ): `d_ext_hot_mm, k_hot_mm2_s, k_cool_mm2_s, d_ext_cool_mm, reignitions, extrap_cf, peak_hf_rad, peak_h2o_rad, rad_ratio, rad_2p5mm, rad_2p5mm_narrow, cf_rad_ratio, rad_2p5mm_cf, time_2p5mm, actual_d_mm, has_cool_flame`
- Gerekçe: Birim saniye varsayımı; d0 ile negatif ilişki (radyatif sönme) — d² yasası uygulanmaz.

## acme_normal.burn_time_s — puan 4/5

- Tip: **regression**, n=132, tam tabloda eksik %54.7
- En güçlü 5 ilişki: tad_k_calc (spearman_rho=0.58, MI=0.72); xo2_init (spearman_rho=0.58, MI=0.63); p_atm (spearman_rho=-0.32, MI=0.28); fuel_base (eta=0.24, MI=0.20); day (spearman_rho=0.22, MI=0.46)
- Sızıntı (feature olarak KULLANILMAZ): `xo2_final, xo2_final_pct, d_xo2, peak_burner_T_C, ext_mode, ext_mode_raw, hot_ignition, hot_ignition_raw, cool_flame, cool_flame_raw, comments, p_final_atm`
- Gerekçe: Yalnızca CFI-G; FT (akış kesildi) testlerinde süre sağdan sansürlü olabilir.

## smoke.dusttrak_b_mg_m3 — puan 3/5

- Tip: **regression**, n=148, tam tabloda eksik %11.4
- En güçlü 5 ilişki: material (eta=0.78, MI=0.66); sample_temp_c (spearman_rho=-0.40, MI=0.83); rt_r0 (spearman_rho=-0.40, MI=0.74); aging_s (spearman_rho=0.17, MI=0.09); campaign (eta=0.12, MI=0.10)
- Sızıntı (feature olarak KULLANILMAZ): `dusttrak_a_mg_m3, m3_mpass, mpass_3_2, m0_per_cc, m1_mm_per_cc, log_m0, amd_um, dam_um, dg_um, sigma_g, mass_loss_mg`
- Gerekçe: Seyreltme/kalibrasyon düzeltmeli cihaz okuması; material baskın.

## cfi.d_ext_hot_mm — puan 3/5

- Tip: **regression**, n=144, tam tabloda eksik %36.6
- En güçlü 5 ilişki: d0_mm (spearman_rho=0.87, MI=1.04); fuel (eta=0.49, MI=0.10); ign_time_ms (spearman_rho=0.39, MI=0.24); x_o2 (spearman_rho=-0.31, MI=0.08); fiber (eta=0.28, MI=0.03)
- Sızıntı (feature olarak KULLANILMAZ): `k_hot_mm2_s, k_cool_mm2_s, d_ext_cool_mm, hf_burn_time_s, reignitions, extrap_cf, peak_hf_rad, peak_h2o_rad, rad_ratio, rad_2p5mm, rad_2p5mm_narrow, cf_rad_ratio, rad_2p5mm_cf, time_2p5mm, actual_d_mm, has_cool_flame`
- Gerekçe: d0 ile ρ=0.87 — büyük ölçüde başlangıç çapının ölçeği; d_ext/d0 daha anlamlı.

## acme_inverse.ext_mode — puan 3/5

- Tip: **binary**, n=139, tam tabloda eksik %49.3, sınıflar: SE:81, FT:58
- En güçlü 5 ilişki: p_atm (eta=0.56, MI=0.19); x_fuel_amb_init (eta=0.56, MI=0.30); zst (eta=0.55, MI=0.30); xo2 (eta=0.24, MI=0.10); hc_burnrate_mg_s (eta=0.13, MI=0.03)
- Sızıntı (feature olarak KULLANILMAZ): `burn_time_s, x_fuel_amb_final, peak_burner_T_C, peak_burner_T_K, flame_color, color_raw, color_hit_limit, comments, ext_mode_raw`
- Gerekçe: FT operasyonel karar olabilir; gün etkisi baskın.

## acme_inverse.burn_time_s — puan 3/5

- Tip: **regression**, n=131, tam tabloda eksik %43.8
- En güçlü 5 ilişki: x_fuel_amb_init (spearman_rho=0.67, MI=0.74); p_atm (spearman_rho=-0.54, MI=0.23); zst (spearman_rho=-0.44, MI=0.36); fuel_base (eta=0.22, MI=0.14); tad_k_calc (spearman_rho=0.22, MI=0.33)
- Sızıntı (feature olarak KULLANILMAZ): `x_fuel_amb_final, peak_burner_T_C, peak_burner_T_K, flame_color, color_raw, color_hit_limit, comments, ext_mode, ext_mode_raw, ignition_class, hot_ignition, hot_ignition_raw, p_final_atm`
- Gerekçe: Gün içi vitiasyon (ortam yakıtı birikimi) güçlü karıştırıcı; FT sansürü.

## bass2.d_o2_pct — puan 3/5

- Tip: **regression**, n=122, tam tabloda eksik %1.6
- En güçlü 5 ilişki: pi (eta=0.71, MI=0.46); geometry (eta=0.70, MI=0.54); material (eta=0.46, MI=0.35); thickness_mm (spearman_rho=-0.27, MI=0.28); rod_color (eta=0.21, MI=0.00)
- Sızıntı (feature olarak KULLANILMAZ): `o2_final_pct, co2_final_pct, co_final_ppm, d_co2_pct, d_co_ppm, frames, frames_raw, co_final_ppm_overrange, o2_final_anomaly_flag`
- Gerekçe: PI (araştırmacı) etkisi baskın; tutuşma süresi/akış ayar dizisi bilinmiyor.

## bass2.d_co2_pct — puan 3/5

- Tip: **regression**, n=121, tam tabloda eksik %6.2
- En güçlü 5 ilişki: pi (eta=0.72, MI=0.52); geometry (eta=0.71, MI=0.65); material (eta=0.44, MI=0.30); thickness_mm (spearman_rho=0.33, MI=0.28); rod_color (eta=0.22, MI=0.00)
- Sızıntı (feature olarak KULLANILMAZ): `o2_final_pct, co2_final_pct, co_final_ppm, d_o2_pct, d_co_ppm, frames, frames_raw, co_final_ppm_overrange, o2_final_anomaly_flag`
- Gerekçe: PI etkisi baskın; ΔO2 ile neredeyse stokiyometrik (aynı bilgi).

## bass2.co_final_ppm — puan 3/5

- Tip: **regression**, n=108, tam tabloda eksik %7.0
- En güçlü 5 ilişki: pi (eta=0.70, MI=0.43); geometry (eta=0.56, MI=0.39); co_init_ppm (spearman_rho=0.51, MI=0.54); co2_init_pct (spearman_rho=0.48, MI=0.19); rod_color (eta=0.44, MI=0.13)
- Sızıntı (feature olarak KULLANILMAZ): `o2_final_pct, co2_final_pct, d_o2_pct, d_co2_pct, d_co_ppm, frames, frames_raw, co_final_ppm_overrange, o2_final_anomaly_flag`
- Gerekçe: Sansürlü (OR/>500) ve negatif değerler; küçük n.

## acme_inverse.hot_ignition — puan 2/5

- Tip: **binary**, n=154, tam tabloda eksik %43.8, sınıflar: 1.0:131, 0.0:23
- En güçlü 5 ilişki: zst (eta=0.47, MI=0.14); x_fuel_amb_init (eta=0.46, MI=0.12); xo2 (eta=0.44, MI=0.12); tad_k_calc (eta=0.40, MI=0.11); p_atm (eta=0.19, MI=0.06)
- Sızıntı (feature olarak KULLANILMAZ): `burn_time_s, x_fuel_amb_final, peak_burner_T_C, peak_burner_T_K, flame_color, color_raw, color_hit_limit, comments, ext_mode, ext_mode_raw, ignition_class, hot_ignition_raw`
- Gerekçe: Azınlık sınıfı ~%15; 'flash' 3. sınıf olarak ayrıca modellenebilir.

## cfi.has_cool_flame — puan 2/5

- Tip: **binary**, n=146, tam tabloda eksik %0.0, sınıflar: 1:124, 0:22
- En güçlü 5 ilişki: x_o2 (eta=0.38, MI=0.04); fiber (cramers_v_bc=0.37, MI=0.07); p_atm (eta=0.26, MI=0.04); x_n2 (eta=0.19, MI=0.06); ign_power_w (eta=0.17, MI=0.00)
- Sızıntı (feature olarak KULLANILMAZ): `d_ext_hot_mm, k_hot_mm2_s, k_cool_mm2_s, d_ext_cool_mm, hf_burn_time_s, reignitions, extrap_cf, peak_hf_rad, peak_h2o_rad, rad_ratio, rad_2p5mm, rad_2p5mm_narrow, cf_rad_ratio, rad_2p5mm_cf, time_2p5mm, actual_d_mm`
- Gerekçe: Türetilmiş (kcool ölçülmüş mü); azınlık %15; analiz tamamlanma durumu karışabilir.

## acme_normal.ext_mode — puan 2/5

- Tip: **binary**, n=133, tam tabloda eksik %65.5, sınıflar: SE:102, FT:31
- En güçlü 5 ilişki: xo2_init (eta=0.33, MI=0.10); tad_k_calc (eta=0.29, MI=0.06); m_fuel_mg_s (eta=0.24, MI=0.09); fuel_bottle_frac (eta=0.14, MI=0.00); x_fuel (eta=0.12, MI=0.00)
- Sızıntı (feature olarak KULLANILMAZ): `burn_time_s, peak_burner_T_C, xo2_final, xo2_final_pct, d_xo2, comments, ext_mode_raw, hot_ignition, hot_ignition_raw`
- Gerekçe: FT operasyonel karar (akış kesildi) olabilir — fiziksel söndürme değil.

