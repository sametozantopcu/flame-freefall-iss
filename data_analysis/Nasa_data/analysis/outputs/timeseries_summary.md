# Zaman serisi özeti (Faz 6)

## SAFFIRE-III numune sensörleri

|   sample |   n_rows |   dropped_time_rows |   dt_s |   duration_s |   t_igniter_on_s |   t_igniter_off_s |   t_rad_peak_s |   rad_peak_mw_cm2 |   rad_baseline |   t_extinction_s |   flame_duration_est_s |   time_above_half_peak_s |   rad_auc |   plume_T_peak_C |   o2_drop_pct |   co2_rise_pct |
|---------:|---------:|--------------------:|-------:|-------------:|-----------------:|------------------:|---------------:|------------------:|---------------:|-----------------:|-----------------------:|-------------------------:|----------:|-----------------:|--------------:|---------------:|
|        1 | 2.09e+04 |                   0 |   0.03 |          690 |               60 |                68 |            266 |              99.8 |          -17.3 |              409 |                  349   |                    232   |   2.6e+04 |             95.6 |          0.39 |           0.21 |
|        2 | 4.85e+03 |                   0 |   0.03 |          160 |               60 |                68 |            130 |             -11   |          -17.3 |              132 |                   71.5 |                     48.9 | 279       |             48.4 |          0.08 |           0.01 |

Kanallar ve birimler: `outputs/ts_saffire3_channels.csv`. Figür: `figures/ts_saffire3_samples.png`.

## SAFFIRE-III 1 Hz Cygnus telemetri

|   rows_raw |   rows_used |   dropped_negative_or_sentinel |   median_dt_s |   span_h |
|-----------:|------------:|-------------------------------:|--------------:|---------:|
|   5.83e+04 |    2.01e+03 |                       5.63e+04 |             2 |     1.91 |

## SAME-R HKP segmentasyonu

- 44 dosya, 72 segment; >60 s segment: 49; süre medyanı 1297 s.
- P-Trak sentinel/negatif hücre: 1974

| file                                  |   segment |   n_rows |   duration_s |   sample |   test |   ptrak_sentinel_n |   max_gasplumetemperature |   max_issdetectorobscurationmeasurement |   max_iondetectorameasurement |   max_iondetectorbmeasurement |   max_ptrakmeasurement |   max_dusttrakameasurement |   max_stsdetectormeasurement |
|:--------------------------------------|----------:|---------:|-------------:|---------:|-------:|-------------------:|--------------------------:|----------------------------------------:|------------------------------:|------------------------------:|-----------------------:|---------------------------:|-----------------------------:|
| PSI-101_Raw_Data_HKPData_gmt235_2.csv |         0 |     2328 |     2.29e+03 |        0 |     65 |                 46 |                     101   |                                    3.43 |                          4.64 |                          7.34 |               1.72e+05 |                   2.13e+04 |                            0 |
| PSI-101_Raw_Data_HKPData_gmt235_3.csv |         0 |     1688 |     1.57e+03 |        0 |     64 |                  6 |                      80.9 |                                    3.43 |                          2.76 |                          7.75 |               2.2e+05  |                   2.12e+04 |                            0 |
| PSI-101_Raw_Data_HKPData_gmt235_4.csv |         0 |     1510 |     1.55e+03 |        0 |     66 |                  4 |                     115   |                                    3.43 |                          9.02 |                          7.83 |               2.35e+05 |                   2.3e+04  |                            0 |
| PSI-101_Raw_Data_HKPData_gmt211_4.csv |         0 |     1930 |     1.52e+03 |        0 |     60 |                  9 |                      70.7 |                                    3.44 |                          6.58 |                          7.8  |               2.15e+05 |                   2.19e+04 |                            0 |
| PSI-101_Raw_Data_HKPData_gmt211_3.csv |         0 |     1707 |     1.52e+03 |        0 |     59 |                  7 |                     101   |                                    3.44 |                          3.5  |                          7.38 |               2.26e+05 |                   2.09e+04 |                            0 |
| PSI-101_Raw_Data_HKPData_gmt214_1.csv |         1 |     1649 |     1.46e+03 |        0 |     61 |                 28 |                      98   |                                    3.44 |                          0.12 |                          5.64 |               1.17e+05 |                   2e+04    |                            0 |
| PSI-101_Raw_Data_HKPData_gmt252_5.csv |         2 |     2296 |     1.46e+03 |        0 |    103 |                  2 |                      60.7 |                                    3.43 |                          2.63 |                          5.49 |               2.31e+04 |                   2.07e+04 |                            0 |
| PSI-101_Raw_Data_HKPData_gmt250_4.csv |         1 |     1889 |     1.42e+03 |        0 |     95 |                197 |                      56.6 |                                    3.43 |                          0.34 |                          4.79 |               1.03e+04 |                   2.01e+04 |                            0 |
| PSI-101_Raw_Data_HKPData_gmt251_1.csv |         0 |     1801 |     1.41e+03 |        0 |     97 |                  0 |                      50.1 |                                    3.43 |                          0.32 |                          4.82 |               5.39e+03 |                   2.02e+04 |                            0 |
| PSI-101_Raw_Data_HKPData_gmt251_4.csv |         1 |     1549 |     1.41e+03 |        0 |     99 |                  4 |                      74.8 |                                    3.43 |                          3.06 |                          6.26 |               9.52e+04 |                   2.16e+04 |                            0 |

## Run başına üretilebilecek feature'lar

| feature                    | tanım                                                           | kaynak       |
|:---------------------------|:----------------------------------------------------------------|:-------------|
| peak_value                 | kanal maksimumu (radyometre, plume T, CO2, duman örtme, iyon B) | SAFFIRE, HKP |
| time_to_peak_s             | ateşlemeden pike süre                                           | SAFFIRE      |
| flame_duration_est_s       | ateşleme → sönme (eşik altı)                                    | SAFFIRE      |
| time_above_threshold_s     | sinyalin %50 pik üstünde kaldığı süre                           | SAFFIRE, HKP |
| rise_slope                 | ateşleme sonrası ilk N s'de eğim (ör. radyometre, CO2)          | SAFFIRE      |
| decay_slope                | pik sonrası sönüm eğimi / zaman sabiti                          | SAFFIRE      |
| auc                        | taban çıkarılmış eğri altı alan (toplam radyatif enerji vekili) | SAFFIRE, HKP |
| o2_drop / co2_rise         | test başı–min/max farkı (tüketim/üretim)                        | SAFFIRE      |
| baseline / noise           | ilk 60 s medyan ve MAD (sensör ofseti)                          | tümü         |
| run_duration_s, n_rows     | segment süresi, örnek sayısı                                    | HKP          |
| ptrak/dusttrak peak & mean | partikül sayısı/kütle konsantrasyonu özeti                      | HKP          |
