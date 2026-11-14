# Gaz alevi tutuşma ve sönme (ACME CFI-G)

ACME CFI-G (PSI-159) normal ve ters etilen alevleri: tutuşma, yanma süresi ve sönme biçimi.

- **Veri seti:** `gas_flame` · **Satır:** 333 · **İçerik hash'i:** `sha256:ae4d3c5eab6aa6a2e4a85f3d222d347b9834f73f273dac070679e2d705acb84a`
- **Üretme komutu:** `python -m src.prediction.datasets build` (çıktı `data/modeling/gas_flame.parquet` ve `.csv`, aynı içerik)
- **CV grubu:** flame_type × day

## Kaynaklar

| Tablo | Satır filtresi | Satır | psi_id |
|---|---|---|---|
| `acme_normal` | `experiment == 'CFI-G'` | 179 | PSI-159 |
| `acme_inverse` | `experiment == 'CFI-G'` | 154 | PSI-159 |

## Atıf (investigation DOI'leri)

| psi_id | Kısaltma | DOI | Bağ |
|---|---|---|---|
| PSI-159 | ACME CFI-G | 10.60555/cyt1-kh64 | kaynak dosya |

## Hedefler

| Hedef | Görev | Tanımlı satır | Alt küme | Sansür etiketi |
|---|---|---|---|---|
| `burn_time_s` | regression | 263 | acme_inverse: `experiment == 'CFI-G' and hot_ignition == 1`; acme_normal: `experiment == 'CFI-G' and hot_ignition == 1` | `burn_time_censored` |
| `hot_ignition` | binary | 333 | acme_inverse: `experiment == 'CFI-G'`; acme_normal: `experiment == 'CFI-G'` | — |
| `ext_mode` | binary | 272 | acme_inverse: `experiment == 'CFI-G' and ext_mode.notna()`; acme_normal: `experiment == 'CFI-G' and ext_mode.notna()` | — |

### Sızıntı (feature olarak KULLANILMAZ)

- `burn_time_s`: `color_hit_limit`, `color_raw`, `comments`, `cool_flame`, `cool_flame_raw`, `d_xo2`, `ext_mode`, `ext_mode_raw`, `flame_color`, `hot_ignition`, `hot_ignition_raw`, `ignition_class`, `p_final_atm`, `peak_burner_T_C`, `peak_burner_T_K`, `x_fuel_amb_final`, `xo2_final`, `xo2_final_pct`
- `hot_ignition`: `burn_time_s`, `color_hit_limit`, `color_raw`, `comments`, `cool_flame`, `cool_flame_raw`, `d_xo2`, `ext_mode`, `ext_mode_raw`, `flame_color`, `hot_ignition_raw`, `ignition_class`, `peak_burner_T_C`, `peak_burner_T_K`, `x_fuel_amb_final`, `xo2_final`, `xo2_final_pct`
- `ext_mode`: `burn_time_s`, `color_hit_limit`, `color_raw`, `comments`, `d_xo2`, `ext_mode_raw`, `flame_color`, `hot_ignition`, `hot_ignition_raw`, `peak_burner_T_C`, `peak_burner_T_K`, `x_fuel_amb_final`, `xo2_final`, `xo2_final_pct`

## Sansür etiketleri

| Etiket | Anlam | True | False | NA |
|---|---|---|---|---|
| `burn_time_censored` | ext_mode == 'FT' (akış kesildi): yanma süresi sağdan sansürlü. Yalnızca burn_time satırlarında ve sonlanma biçimi biliniyorsa dolu; bilinmiyorsa NA. | 88 | 175 | 70 |

## Sütunlar

| Sütun | Rol | dtype | Birim | Eksik |
|---|---|---|---|---|
| `psi_id` | trace | str | unit_unknown | 0 |
| `source_file` | trace | str | unit_unknown | 0 |
| `source_row` | trace | int64 | unit_unknown | 0 |
| `source_table` | meta | str | unit_unknown | 0 |
| `flame_type` | meta | str | unit_unknown | 0 |
| `day` | feature | float64 | test day index | 0 |
| `x_fuel` | feature | float64 | mol fraction | 154 |
| `m_fuel_mg_s` | feature | float64 | mg/s | 154 |
| `xo2_init` | feature | float64 | mol fraction | 154 |
| `p_atm` | feature | float64 | atm | 0 |
| `zst` | feature | float64 | - (mixture fraction) | 2 |
| `tad_k_calc` | feature | float64 | K (calculated) | 2 |
| `experiment` | feature | str | unit_unknown | 0 |
| `fuel_base` | feature | str | unit_unknown | 0 |
| `fuel_bottle_frac` | feature | float64 | vol fraction | 154 |
| `burn_time_s` | target | float64 | s | 4 |
| `hot_ignition` | target | float64 | unit_unknown | 0 |
| `ext_mode` | target | str | unit_unknown | 61 |
| `xo2` | feature | float64 | mol fraction | 179 |
| `m_o2_mg_s` | feature | float64 | mg/s | 179 |
| `x_fuel_amb_init` | feature | float64 | mol fraction | 179 |
| `hc_burnrate_mg_s` | feature | float64 | mg/s | 179 |
| `burn_time_censored` | label | boolean | unit_unknown | 70 |
| `in_subset__burn_time_s` | mask | bool | unit_unknown | 0 |
| `in_subset__hot_ignition` | mask | bool | unit_unknown | 0 |
| `in_subset__ext_mode` | mask | bool | unit_unknown | 0 |

## Varsayımlar (EDA)

- **acme_color_limit:** PSI-159 inverse 'Color'='limit' bir renk değil (sıcaklık limitine ulaşıldı yorumu) -> flame_color NaN, color_hit_limit=True.
- **acme_ext_mode:** 'Self-ext or flow term' içindeki '-' = tutuşma olmadı/uygulanamaz -> ext_mode NaN; SE=self-extinction, FT=flow termination.
- **acme_flash:** PSI-159 inverse 'Hot ignition'='flash': anlık parlama, sürekli alev değil -> ignition_class='flash' (3 sınıf korunur), ikili hot_ignition=0.
- **acme_p_unit:** PSI-159 'approx p (bar)' -> p_atm = p_bar/1.01325 (yaklaşık basınç). PSI-10 'pmean (atm)' p_atm olarak kullanıldı.
- **acme_psi10_targets:** PSI-10 Flame Design tablolarında yanma süresi / tutuşma / söndürme sütunu YOK. Bu hedefler yalnızca PSI-159 (CFI-G) satırlarında tanımlı.
- **acme_ramp:** PSI-10 'RAMP/RAMPED/LOW O2' satırları akış rampası yapılan testler: sayısal değer NaN, token <col>_flag'de saklı, satır SİLİNMEDİ.
- **acme_tad:** 'Tad (K)' adyabatik alev sıcaklığı HESAPLANMIŞ bir büyüklük -> tad_k_calc adıyla tutuldu; ölçüm değil, girdilerin (XO2, yakıt, Zst) fonksiyonu.
- **acme_tfp:** TFP (Yes/No) anlamı belgelenmemiş; kategorik olarak tutuldu, birim/anlam atanmadı.

## Notlar

- Normal alevde xo2_init (ortam O2) ile ters alevde xo2 (oksitleyici akımındaki O2) farklı büyüklükler: ayrı sütunlar.
- Test günü numaraları iki alev türünde de 1'den başlar; CV grubu flame_type × day.
- PSI-10 Flame Design satırları hedef içermediği için yok (yalnızca CFI-G).
- Burn time alt kümesi dışında ext_mode'u bilinen 9 satır var (1 'No' + FT, 8 'flash' + SE); sansür bayrakları orada NA.
