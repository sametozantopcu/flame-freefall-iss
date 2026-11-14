# Veri Analizi Raporu — MVP için en hazır tablo/hedef

Tüm scriptler `/home/halil/repos/flame-freefall-iss/.orchestrator/scratch/` altında; çıktıları aynı klasörde `*.out`. Python: nasa_hack (sklearn 1.9.1; lightgbm YOK, bu yüzden sklearn HistGradientBoosting kullanıldı). Hiçbir yerde 0 ile doldurma yapılmadı (yalnızca model içi median impute, CV içinde); `raw/` ve `csv/` dokunulmadı. Video/mp4 tabloları: yok (iptal kapsam).

Not: "Feature Store" kodu `src/data_layer` içinde, ama bu analiz doğrudan `analysis/data/*.parquet` ve `analysis/outputs/feature_catalog.csv` üzerinden yapıldı (kataloğun `role` sütunu: feature/target/leakage/exclude/meta/id; 226 satır). Rol sayıları: `scratch/base.out` (ilk blok).

## (a) Tablo envanteri
Yol: `data_analysis/Nasa_data/analysis/data/<ad>.parquet`. Boyut/eksik/grup: `scratch/profile.out`, `scratch/prof2.out`. DOI: `meta/investigations.parquet` (`scratch/meta.out`).

| Tablo | n × sütun | Aday hedefler (eksik oranı tabloda) | Grup sütunu (benzersiz) | Kaynak / DOI |
|---|---|---|---|---|
| flex | 274×28 | burn_time_s (0.022), burn_rate_K_mm2_s (0.058), d_ext_mm (0.281), test_end (0.000) | fuel×diluent (6), year (3) | PSI-69 FLEX, 10.60555/mbq8-0451 |
| cfi | 227×43 | k_hot_mm2_s (0.348), hf_burn_time_s (0.352), d_ext_hot_mm (0.366), has_cool_flame (0.000, türetilmiş) | fuel×diluent (5 kombinasyon; fuel 4, diluent 2) | PSI-39 Cool Flames, 10.60555/m6pj-a914 |
| acme_normal | 386×43 | hot_ignition (0.536), burn_time_s (0.547), ext_mode (0.655) — sonuç sütunları yalnızca CFI-G (179 satır); FlameDesign 207 satırda yok | day (14), fuel_base (4) | PSI-10 (10.60555/w4zy-bt45) + PSI-159 (10.60555/cyt1-kh64) |
| acme_inverse | 274×44 | hot_ignition (0.438), burn_time_s (0.438), ext_mode (0.493); CFI-G 154 satır | day (12), fuel_base (4) | PSI-10 + PSI-159 |
| smoke | 167×27 | amd_um (0.084), dusttrak_b_mg_m3 (0.114), dam_um (0.090) | material (5); campaign (3); gravity (2) | PSI-101 SAME-R, 10.60555/2np7-jv14 |
| bass2 | 129×41 | d_o2_pct (0.016), d_co2_pct (0.062), co_final_ppm (0.070) | pi (6), material (4) | PSI-25 BASS-II, 10.60555/4qc4-de67 |
| spice | 469×14 | flame_duration_s (0.181) | Fuel (7) | PSI-107, 10.60555/9kbh-e962 |
| saffire1 | 4×17 | Burn Time (s) (0.50) | Material (3) | PSI-98, 10.60555/0t15-1z43 |
| saffire2 | 15×24 | Burn Time (s) (0.40), ug Spread Length (0.667) | Material (6) | PSI-99, 10.60555/2chp-m469 |
| saffire3 | 2×12 | yok (betimsel) | Material (1) | PSI-100, 10.60555/040q-4h36 |
| acme_testdays | 100×6 | flames_ignited | experiment | PSI-20/21/22/23 (PSI-20: 10.60555/vb93-3y72) |

FLEX grup kırılımı: Heptane|CO2 48, Heptane|He 22, Heptane|N2 47, Methanol|CO2 75, Methanol|He 28, Methanol|N2 54. CFI: 5 kombinasyon (Farnesane|N2 44; dodecane60/iso40 He 14 / N2 38; dodecane75/iso25 He 15 / N2 36; n-dodecane He 23 / N2 57) (`base.out`).

## (b) MVP uygunluğu
- **flex — YÜKSEK.** n=274, hedef eksiği düşük (%2–6), 4 sağlam hedef, fizik doğrulanmış (d² eğimi 2.12 Completion'da, REPORT §6.2). Risk: sönme/kesilmeyle biten testlerde süre kesik.
- **cfi — YÜKSEK (K için).** k_hot n=148, grup CV'de R²~0.57. Eksiklik yapısal (227 testin 148'inde analiz tamamlanmış). Kendi hedefleri flex'ten ayrı tutulmalı (K birleştirilmemeli, `src/prediction/datasets.py` de ayırıyor).
- **acme_normal (CFI-G alt kümesi) — ORTA.** hot_ignition binary, n=179, net O2 sınırı (~%21) var; ancak gün-gruplu AUC 0.78, yakıt-gruplu 0.585. Flame Design satırlarında etiket yok.
- **acme_inverse — DÜŞÜK/ORTA.** Gün etkisi baskın, azınlık sınıfı %15, FT sansürü.
- **smoke — ORTA (keşif/sıralama için), DÜŞÜK (tahmin için).** Malzeme-gruplu CV'de sinyal yok (aşağıda). Malzeme içi Rt/R0 etkisi güçlü (ρ 0.36–0.68), yani betimsel demo için iyi.
- **bass2 — DÜŞÜK.** PI ile malzeme iç içe; grup CV'de R²<0.
- **spice — DÜŞÜK.** `flame_duration_s` max=86394 s (medyan 105 s) — gece yarısı düzeltmesinde hata/aykırı değer şüphesi; ayrıca 34 tekrar satırı (`prof2.out`). Doğrulanmadan kullanılmamalı.
- **saffire1/2/3, acme_testdays — DÜŞÜK** (n=2–15; yalnızca betimsel/vitrin).

## (c) En hazır öneriler ve GroupKFold baseline (`scratch/base.py` → `scratch/base.out`)
Özellikler yalnızca katalogdaki `role=feature` sütunlarından; test_end, d_ext, xo2_final, M0/M1 vb. leakage dışarıda. Gruplama sütunu özellik olarak kullanılmadı (smoke'ta material hem grup hem çıkarıldı → ayrı özellik olarak kalmadı). Metrik: birleştirilmiş out-of-fold R².

**Öneri 1: droplet ailesi — `flex`, hedef `burn_rate_K_mm2_s` (ikincil `burn_time_s`), grup = fuel×diluent (6) veya year (3).** Özellikler: d0_mm, p_atm, x_o2, x_he, x_co2, fuel, diluent.
- K, GroupKFold(5) fuel×diluent: Ridge R²=0.176, HGB 0.154, ortalama tahmin −0.158; MAE 0.101 (HGB 0.094).
- K, GroupKFold(3) year: Ridge R²=0.561, HGB 0.374, ortalama −0.044; MAE 0.054.
- burn_time_s (sqrt hedef) fuel×diluent: HGB R²=0.214 (MAE 4.94), Ridge −0.098; year-grup: HGB 0.510 (MAE 3.93), Ridge 0.306.
- Yorum: yakıt×seyreltici dışarıda bırakılınca (yeni yakıt/gaz kombinasyonuna genelleme) skor düşük; yıla göre (aynı kombinasyonlar, farklı kampanya) iyi. Yani demo "bilinen yakıt/seyreltici kombinasyonu için tahmin" olarak dürüstçe sunulmalı.

**Öneri 2: `cfi`, hedef `k_hot_mm2_s` (sqrt), grup = fuel×diluent (5).** Özellikler: d0_mm, p_atm, x_o2, x_he, x_n2, fuel, diluent, fiber.
- k_hot: Ridge R²=0.568 (MAE 0.100), HGB 0.527, ortalama −0.173 (n=148).
- hf_burn_time_s: Ridge R²=0.660 (MAE 1.62), HGB 0.018, ortalama −0.301 (n=147). Birim saniye VARSAYIMI.
- Not: x_he ve x_n2 birbirinden türetilebilir (kompozisyonel); fiziksel yorum için dikkat.

Diğer ölçümler (öneri değil):
- acme_normal CFI-G hot_ignition (n=179, pozitif oran 0.737): GroupKFold(5) day → lojistik AUC=0.778 (11 grup); GroupKFold(3) fuel_base → AUC=0.585. burn_time_s>0 alt kümesi (n=133) day-grup: Ridge R²=0.081, HGB −0.107.
- smoke flight-only amd_um (log hedef, n=131), GroupKFold(5) material (5 grup, leave-material-out): Ridge R²=−0.094, HGB 0.033, ortalama −0.191. Yeni malzemeye genelleme YOK. (Not: scriptte "material dahil/hariç" iki satırı aynı çıktı, çünkü material grup sütunu olduğu için iki çalıştırmada da özellik değildi; material-dahil bir model grup CV ile anlamsız olurdu.)
- bass2 d_o2_pct (n=122, anomali satırları hariç), pi grupları (6): Ridge −0.089, HGB −0.043, ortalama −0.226.
- CV-dışı Kapsam: SAME yıl/kampanya CV'si ölçülmedi.

## (d) Demo'da gösterilebilecek en güçlü bulgular (`analysis/REPORT.md`, bölüm no)
1. d² yasası: FLEX Completion alt kümesinde log t_b–log d0 eğimi 2.12 (%95 GA 1.76–2.52, n=27); Heptan+Completion 2.03 (n=19). Tüm veride 1.31; sönmeyle bitenlerde ~1.0 (§6.2). Doğrulandı: Completion ayrımı demo'ya iyi bir "yasa kontrolü" katmanı verir.
2. CFI'de sıcak alev süresi d0 ile TERS ilişkili (eğim −1.42): radyatif sönme (§6.2).
3. ACME-normal: ~%21 O2'de bütan/propan için sıcak tutuşma yok; sıcak tutuşma oranı normal 0.74, inverse 0.85; O2 arttıkça yanma süresi uzuyor (ρ=0.29–0.67) (§6.1) — "tutuşur mu" sıralama ekranı için net sınır.
4. Smoke'ta Simpson paradoksu: tüm veride ρ≈−0.27, malzeme sabitken kısmi ρ≈+0.49 (5/5 malzemede pozitif; malzeme içi ρ 0.36–0.68) (§1 madde 6, §6.3). Karıştırıcı kontrolü neden gerekli, çarpıcı bir sunum noktası.
5. BASS-II stokiyometri: PMMA ΔCO2/ΔO2=−0.80 (teorik −0.83); slab ΔO2 medyanı −1.1 puan vs film −0.1 (§6.4) — sensör tutarlılığı ve güvenilirlik hikayesi.
(Ek: FLEX K birimi mm²/s doğrulandı, oran medyanı 0.95; Kapton'da flight 0.12 µm vs ground 0.24 µm, p=0.03 ama ground eşlemesi doğrulanmadığı için yalnızca betimsel.)

## (e) Kısmi yerçekimi verisi
**Yok.** Smoke tablosunda `gravity` sütunu yalnızca {flight: 134, ground: 33} (`prof2.out` sonu; yani mikro-g vs 1-g). SAFFIRE-II spread rate 1-g ölçümü (REPORT §2.2). Meta metinlerinde ("reduced gravity" ifadesi hariç genel anlatım) Ay/Mars yerçekimi seviyesi veya sayısal g değeri bulunmadı (`scratch/pg.out`). Dolayısıyla yerçekimi bir sayısal özellik değil; "partial-g tahmini" MVP'de iddia edilmemeli.

## (f) Riskler
- **Küçük n:** 108–274 satır; saffire1/2/3 toplam 21 satır. Gruplu CV'de birkaç grup (year=3, material=5) → yüksek varyans; yukarıdaki R² değerleri tek bölünme sonuçları, güven aralığı ölçülmedi.
- **Genelleme zayıf:** fuel×diluent veya malzeme dışarıda bırakıldığında FLEX K R² 0.15–0.18, smoke ≈0 (`base.out`).
- **Leakage:** katalogda 54 sütun `leakage` (flex 3, cfi 13, smoke 10, bass2 7, acme 10–11). FLEX'te test_end bir sonuç; özellik olarak eklenirse burn_time HGB R²=0.279 (0.214'e karşı) — yalnızca sızıntıyı ölçmek için denendi, kullanılmamalı. smoke'ta amd_um=1000·M1/M0 (flight'ta birebir).
- **Eksiklik/sansür:** acme sonuçları PSI-10'da yapısal olarak yok; ACME FT ve FLEX Extinction/Disruption süreleri sağdan kesik; `burn_time_s=0` satırları var (acme_normal CFI-G; log hedefinde dışarıda bırakıldı).
- **Doğrulanmamış varsayımlar:** CFI hf_burn_time birimi (s), smoke ground sütun eşlemesi, SPICE süre aykırıları.
- **Ortam:** lightgbm/catboost kurulu değil; baselinelar sklearn ile.
- Not: `plans/README.md` madde 9 (commit yalnızca istenince) ile CLAUDE.md'deki otomatik commit kuralı çelişiyor; bu analiz commit yapmadı.
