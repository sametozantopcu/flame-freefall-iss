# Envanter özeti (Faz 0)

- Kanonik dosya (use==True): **2487** / 3185 (kopya/'wrong' hariç 698)
- `smoke_dataset.csv` kökte mevcut mu: **False**
- Kategori, dosya adı desenleri + satır sayısı ile sezgisel atanmıştır (bkz. `00_inventory.py`).

## PSI-ID × kategori

| psi_id   |   calibration_engineering |   experimental_table |   other |   particle_level |   test_summary |   time_series |   TOPLAM |
|:---------|--------------------------:|---------------------:|--------:|-----------------:|---------------:|--------------:|---------:|
| PSI-10   |                       328 |                    2 |       0 |                0 |              0 |           317 |      647 |
| PSI-100  |                         2 |                    1 |       0 |                0 |              0 |            25 |       28 |
| PSI-101  |                        25 |                    1 |       2 |               41 |             50 |           144 |      263 |
| PSI-102  |                         0 |                    1 |       0 |                0 |              4 |           109 |      114 |
| PSI-106  |                         0 |                    1 |       0 |                0 |              0 |             0 |        1 |
| PSI-107  |                         5 |                    1 |      10 |                0 |              0 |            23 |       39 |
| PSI-117  |                         4 |                    0 |       4 |                0 |              0 |             2 |       10 |
| PSI-142  |                         0 |                    1 |       7 |                0 |              0 |             2 |       10 |
| PSI-159  |                       339 |                    2 |       0 |                0 |              0 |           335 |      676 |
| PSI-20   |                         0 |                    1 |       0 |                0 |              0 |             0 |        1 |
| PSI-21   |                         0 |                    1 |       0 |                0 |              0 |             0 |        1 |
| PSI-22   |                         0 |                    1 |       0 |                0 |              0 |             0 |        1 |
| PSI-23   |                       289 |                    1 |       0 |                0 |              3 |           287 |      580 |
| PSI-25   |                         1 |                    1 |       0 |                0 |              6 |             0 |        8 |
| PSI-26   |                         0 |                    1 |       0 |                0 |              6 |             0 |        7 |
| PSI-39   |                         0 |                    1 |       0 |                0 |              5 |             0 |        6 |
| PSI-47   |                         0 |                    1 |      10 |                0 |              1 |            56 |       68 |
| PSI-68   |                         0 |                    1 |       0 |                0 |              0 |             0 |        1 |
| PSI-69   |                         0 |                    1 |       0 |                0 |              0 |             0 |        1 |
| PSI-98   |                         2 |                    1 |       2 |                0 |              0 |            19 |       24 |
| PSI-99   |                         0 |                    1 |       0 |                0 |              0 |             0 |        1 |
| TOPLAM   |                       995 |                   22 |      35 |               41 |             75 |          1319 |     2487 |

## PSI-ID başına toplam boyut (MB)

| psi_id   |    size_mb |
|:---------|-----------:|
| PSI-10   | 872        |
| PSI-100  |  61.2      |
| PSI-101  |  67.1      |
| PSI-102  |  64.2      |
| PSI-106  |   0        |
| PSI-107  |   0.4      |
| PSI-117  |   0.3      |
| PSI-142  |   0.3      |
| PSI-159  |   1.03e+03 |
| PSI-20   |   0        |
| PSI-21   |   0        |
| PSI-22   |   0        |
| PSI-23   | 529        |
| PSI-25   |   0        |
| PSI-26   |   0.1      |
| PSI-39   |   0.1      |
| PSI-47   |   0.7      |
| PSI-68   |   0        |
| PSI-69   |   0        |
| PSI-98   |  61.1      |
| PSI-99   |   0        |

## Deneysel tablolar

| psi_id   | file                                                     |   rows_clean |   cols_clean |
|:---------|:---------------------------------------------------------|-------------:|-------------:|
| PSI-10   | PSI-10_Experimental_table_Flame_Design_Inverse_Flame.csv |          120 |           14 |
| PSI-10   | PSI-10_Experimental_table_Flame_Design_Normal_Flame.csv  |          207 |           15 |
| PSI-100  | PSI-100_Experimental_table_SAFFIRE-3.csv                 |            2 |            9 |
| PSI-101  | PSI-101_Experimental_table_SAME-R.csv                    |          109 |           10 |
| PSI-102  | PSI-102_Experimental_table_SAME.csv                      |            8 |            5 |
| PSI-106  | PSI-106_Experimental_table_Slice.csv                     |           12 |            2 |
| PSI-107  | PSI-107_Experimental_table_Spice.csv                     |          469 |            9 |
| PSI-142  | PSI-142_Experimental_table_Data_Summary_Table.csv        |            8 |            4 |
| PSI-159  | PSI-159_Experimental_table_CFI-G_Inverse_Flames.csv      |          154 |           20 |
| PSI-159  | PSI-159_Experimental_table_CFI-G_Normal_Flames.csv       |          179 |           18 |
| PSI-20   | PSI-20_Experimental_table_ACME_BRE.csv                   |           18 |            8 |
| PSI-21   | PSI-21_Experimental_table_CLD_Flame.csv                  |           32 |            8 |
| PSI-22   | PSI-22_Experimental_table_ACME_E-FIELD_Flames.csv        |           32 |           10 |
| PSI-23   | PSI-23_Experimental_table_ACME_s-Flame.csv               |           18 |            9 |
| PSI-25   | PSI-25_Experimental_table_BASS-II.csv                    |          129 |           17 |
| PSI-26   | PSI-26_Experimental_table_BASS.csv                       |          122 |            6 |
| PSI-39   | PSI-39_Experimental_table_CFI.csv                        |           87 |           10 |
| PSI-47   | PSI-47_Experimental_table_DAFT.csv                       |            2 |            5 |
| PSI-68   | PSI-68_Experimental_table_Flex2.csv                      |            8 |            7 |
| PSI-69   | PSI-69_Experimental_table_FLEX.csv                       |          274 |           15 |
| PSI-98   | PSI-98_Experimental_table_SAFFIRE-1.csv                  |            4 |           13 |
| PSI-99   | PSI-99_Experimental_table_SAFFIRE-2.csv                  |           15 |           17 |
