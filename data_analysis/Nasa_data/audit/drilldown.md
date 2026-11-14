# Drilldown

Kanonik dosya: 2487 / 3185 (kopya: 695, wrong: 3)

## Uyarılar (kanonik dosyalar)

| psi_id   |   birebir tekrarlanan satır |   sentinel değer (-999, 9999…) |   tekrarlanan sütun adı |   zaman sütunu monoton değil |   şüpheli dosya adı |
|:---------|----------------------------:|-------------------------------:|------------------------:|-----------------------------:|--------------------:|
| PSI-10   |                         393 |                              0 |                       2 |                            0 |                   0 |
| PSI-100  |                           7 |                              1 |                       0 |                           33 |                   0 |
| PSI-101  |                         171 |                             55 |                       1 |                          100 |                  28 |
| PSI-102  |                         100 |                             78 |                      61 |                           50 |                  25 |
| PSI-107  |                          11 |                              0 |                       0 |                            0 |                  11 |
| PSI-117  |                           3 |                              0 |                       7 |                            5 |                   0 |
| PSI-142  |                           1 |                              0 |                       0 |                            0 |                   0 |
| PSI-159  |                         453 |                              0 |                       1 |                            2 |                   0 |
| PSI-20   |                           0 |                              0 |                       0 |                            1 |                   0 |
| PSI-22   |                           1 |                              0 |                       0 |                            1 |                   0 |
| PSI-23   |                         325 |                              0 |                       0 |                            1 |                   3 |
| PSI-25   |                           0 |                              0 |                       0 |                            6 |                   6 |
| PSI-26   |                           0 |                              0 |                       0 |                            1 |                   6 |
| PSI-39   |                           1 |                              0 |                       0 |                            2 |                   0 |
| PSI-47   |                           8 |                              0 |                       1 |                            0 |                   1 |
| PSI-98   |                           4 |                              2 |                       0 |                           12 |                   0 |


## Tekrarlanan satır oranı (%)

| psi_id   |   count |   50% |   max |
|:---------|--------:|------:|------:|
| PSI-10   |     393 |  32.3 |  86.5 |
| PSI-100  |       7 |  80.4 |  93.4 |
| PSI-101  |     171 |   1.7 |  92.9 |
| PSI-102  |     100 |   0.3 |  21.2 |
| PSI-107  |      11 |   7.2 |  28.9 |
| PSI-117  |       3 |   5.3 |   8.3 |
| PSI-142  |       1 |  13   |  13   |
| PSI-159  |     453 |  77.8 |  88   |
| PSI-22   |       1 |  25   |  25   |
| PSI-23   |     325 |  70.3 |  85.7 |
| PSI-39   |       1 |   9.2 |   9.2 |
| PSI-47   |       8 |   1.1 |  18.6 |
| PSI-98   |       4 |  70.6 |  98.2 |


En yüksek 10:

| psi_id   | file                                                                           | detail              |
|:---------|:-------------------------------------------------------------------------------|:--------------------|
| PSI-98   | PSI-98_Raw_Data_Saffire-I_Telemetry_Data_Good_Process_Version__SaffireData.csv | 5976 satır (98.2%)  |
| PSI-100  | PSI-100_Raw_Data_Saffire-III_Telemetry_Data__CygnusPressureData.csv            | 54460 satır (93.4%) |
| PSI-100  | PSI-100_Raw_Data_Saffire-III_Telemetry_Data__CygnusSmokeDetectorData.csv       | 54463 satır (93.4%) |
| PSI-100  | PSI-100_Raw_Data_Saffire-III_Telemetry_Data__CygnusData.csv                    | 54459 satır (93.4%) |
| PSI-101  | 94_Kapton_aged-_4_images__all_data.csv                                         | 1899 satır (92.9%)  |
| PSI-101  | 94_Kapton_aged-_4_images__all_data_big_only.csv                                | 1266 satır (92.5%)  |
| PSI-159  | PSI-159_Raw_Data_21242F1_mfcSetpoints.csv                                      | 22 satır (88.0%)    |
| PSI-159  | PSI-159_Raw_Data_21242P2_mfcSetpoints.csv                                      | 22 satır (88.0%)    |
| PSI-10   | PSI-10_Raw_Data_21328N3_mfcSetpoints.csv                                       | 32 satır (86.5%)    |
| PSI-10   | PSI-10_Raw_Data_21328N4_mfcSetpoints.csv                                       | 32 satır (86.5%)    |


## Monoton olmayan zaman sütunları (sütun adı → dosya sayısı)

| psi_id   | col                            |   n |
|:---------|:-------------------------------|----:|
| PSI-101  | time                           |  39 |
| PSI-102  | elapsedtesttime(secs)          |  27 |
| PSI-101  | ElapsedTestTime(Secs)          |  22 |
| PSI-102  | positionerclock                |  20 |
| PSI-101  | elapsedtesttime(secs)          |  13 |
| PSI-101  | positionerclock                |  13 |
| PSI-101  | PositionerClock                |  10 |
| PSI-100  | epochtime                      |   8 |
| PSI-100  | cygnustimestamp                |   5 |
| PSI-25   | gmt 2014-                      |   4 |
| PSI-100  | relative time (s)              |   4 |
| PSI-98   | timestamp                      |   4 |
| PSI-117  | K(mm^2/sec)                    |   3 |
| PSI-100  | relative time (ms)             |   3 |
| PSI-100  | saffiretimestamp               |   3 |
| PSI-100  | RelativeSeconds                |   2 |
| PSI-100  | CygnusTimestamp                |   2 |
| PSI-100  | relativeseconds                |   2 |
| PSI-100  | SaffireTimestamp               |   2 |
| PSI-98   | test section fan power control |   2 |
| PSI-100  | test section fan power control |   2 |
| PSI-102  | time                           |   2 |
| PSI-159  | burn time (sec)                |   2 |
| PSI-101  | Duration (sec)                 |   1 |
| PSI-102  | time.1                         |   1 |


## Sentinel içeren sütunlar (ilk 25)

| detail                            |   count |
|:----------------------------------|--------:|
| ptrakmeasurement(ptpercc)         |      92 |
| PTrakMeasurement(PtPerCC)         |      35 |
| CycleCounter                      |       4 |
| ptrakmeasurement(ptpercc).1       |       4 |
| index                             |       3 |
| cyclecounter                      |       2 |
| ptrakmeasurement(ptpercc) (right) |       2 |


## En büyük 20 şema ailesi (kanonik)

| psi_id   | schema       |   n |   rows |   cols | example                                                                    |
|:---------|:-------------|----:|-------:|-------:|:---------------------------------------------------------------------------|
| PSI-101  | 7088a39b923d |  65 | 109671 |     98 | 2010_197_13_silicon_run48__Original_cut_and_paste.csv                      |
| PSI-101  | 236907b4becc |  50 | 180745 |     11 | 2010_197_13_silicon_run48__Sheet_used_to_Graph.csv                         |
| PSI-102  | 7088a39b923d |  26 |  81299 |     98 | GMT254run2btesthkp_with_zgy_average__Copy_of_GMT254run2btesthkp.csv        |
| PSI-101  | 2e314e473058 |  22 |  36546 |      8 | 54_lampwick_binneddatacorr_from_GWM__all_data_big_only.csv                 |
| PSI-47   | badef527f9ff |  20 |    307 |      6 | CVB_M1_Ops_timeline_summary_and_50X_20140121__-5C_0.35W_02125.csv          |
| PSI-101  | f755a92f6511 |  20 |    926 |     16 | 54_lampwick_binneddatacorr_from_GWM__Binned_data_big_only.csv              |
| PSI-101  | 3a4979ded414 |  14 |    100 |     14 | PSI-101_Engineering_Documents_SAME_Wire_Test__Alumel7.csv                  |
| PSI-101  | b9afec6881b9 |   8 |  28925 |     12 | 2010_236_10_lampwick_run68__Sheet_used_to_Graph.csv                        |
| PSI-101  | 8d77df966f8a |   8 |    973 |     10 | 60_silicone__Results-19_13S.csv                                            |
| PSI-102  | 22afbc895cb5 |   6 |  14671 |     20 | GMT271kapton29__Sheet1.csv                                                 |
| PSI-47   | cbdac0146ebf |   6 |     61 |      5 | CVB_M1_Ops_timeline_summary_and_50X_20140121__40C_growth_0.10W_02102.csv   |
| PSI-101  | 7307fdf15efa |   5 |    144 |     82 | Combined_SAMER_Results_06_02_14__DBP.csv                                   |
| PSI-25   | a4d5970e31b1 |   5 |    102 |     16 | BASS-II_Test_Matrix_by_PI_Final__Bhattacharjee.csv                         |
| PSI-101  | 5baf0753ff2a |   4 |    136 |     83 | Combined_SAMER_Results_06_02_14__Kapton_R_T_plots.csv                      |
| PSI-102  | dbcd83e2cfbc |   4 |   9565 |     13 | GMT256HKP_zgy_average__for_lampwick_average.csv                            |
| PSI-142  | 0182546f2ac6 |   4 |    120 |      3 | PSI-142_Analyzed_Data_PSI_data_summary_Princeton_with_links__data_ID_1.csv |
| PSI-47   | e5f662b3c51e |   4 |    143 |     27 | CVB_50X_template_and_examples__CVB_50X_template.csv                        |
| PSI-101  | e91a83923304 |   4 |   2030 |      9 | 94_Kapton_aged-_4_images__Results94_post-3.csv                             |
| PSI-101  | 21511adb1d0d |   4 |  14456 |     17 | 2010_210_10_teflon_run56__Sheet_used_to_Graph.csv                          |
| PSI-107  | 8711e84df570 |   3 |    125 |     13 | GMT055nikon__0.8.csv                                                       |