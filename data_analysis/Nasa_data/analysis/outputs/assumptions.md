# Varsayımlar ve kararlar

Scriptler tarafından otomatik üretilir (anahtar: açıklama).

- **acme_color_limit**: PSI-159 inverse 'Color'='limit' bir renk değil (sıcaklık limitine ulaşıldı yorumu) -> flame_color NaN, color_hit_limit=True.
- **acme_ext_mode**: 'Self-ext or flow term' içindeki '-' = tutuşma olmadı/uygulanamaz -> ext_mode NaN; SE=self-extinction, FT=flow termination.
- **acme_flash**: PSI-159 inverse 'Hot ignition'='flash': anlık parlama, sürekli alev değil -> ignition_class='flash' (3 sınıf korunur), ikili hot_ignition=0.
- **acme_p_unit**: PSI-159 'approx p (bar)' -> p_atm = p_bar/1.01325 (yaklaşık basınç). PSI-10 'pmean (atm)' p_atm olarak kullanıldı.
- **acme_psi10_targets**: PSI-10 Flame Design tablolarında yanma süresi / tutuşma / söndürme sütunu YOK. Bu hedefler yalnızca PSI-159 (CFI-G) satırlarında tanımlı.
- **acme_ramp**: PSI-10 'RAMP/RAMPED/LOW O2' satırları akış rampası yapılan testler: sayısal değer NaN, token <col>_flag'de saklı, satır SİLİNMEDİ.
- **acme_tad**: 'Tad (K)' adyabatik alev sıcaklığı HESAPLANMIŞ bir büyüklük -> tad_k_calc adıyla tutuldu; ölçüm değil, girdilerin (XO2, yakıt, Zst) fonksiyonu.
- **acme_tfp**: TFP (Yes/No) anlamı belgelenmemiş; kategorik olarak tutuldu, birim/anlam atanmadı.
- **bass2_air_display**: Air/Fan display bir hız değil cihaz potansiyometre okuması; çoğu hücre test boyunca ayar dizisi ('5 3 2 ext'). air_display_initial = ilk sayı; birim unit_unknown.
- **bass2_co_censor**: BASS-II CO 'OR'/'over'/'>500' = ölçüm aralığı aşıldı (sağdan sansürlü) -> NaN + *_overrange=True. 'none' -> NaN.
- **bass2_material**: BASS-II 'Fuel Sample Material' serbest metin -> material (PMMA/SIBAL/Nomex/Wax candle), geometry (film/slab/rod/fabric/sphere_section/candle), thickness_mm (micron/mm/inç'ten). Çubuklarda 'thickness' = çap. '4 cm spherical section' PMMA VARSAYILDI. SIBAL'de '2 cm' genişliktir, kalınlık NaN.
- **bass2_negative_co**: Negatif CO değerleri DÜZELTİLMEDİ; co_negative_flag ile işaretlendi (sensör ofseti olası).
- **bass2_o2_anomaly**: o2_final_anomaly_flag: final O2 < %10 ya da O2'nin test boyunca >0.5 puan ARTMASI (fiziksel değil) -> işaretlendi, düzeltilmedi.
- **cfi_has_cool**: has_cool_flame = kcool ölçülmüş mü (1/0) - türetilmiş ikili hedef adayı; kcool analizi yapılmamış testlerde de 0 olabileceği için 'completed_analysis' ile birlikte yorumlanmalı.
- **cfi_hf_burn**: 'hf burn time' sütununun birimi belirtilmemiş; değer aralığına göre saniye VARSAYILDI (hf = hot flame).
- **cfi_merge**: PSI-39 cfi = Master_Sheet ⋈ DATA ⋈ Igniter (flex number, 1:1). Experimental_table (87) Master'ın alt kümesi; in_experimental_table ile işaretlendi.
- **flex_K_d2**: K_from_d2_law = (d0² - d_ext²)/t_b yalnızca bilgi amaçlı türetildi; hedef K ile sızıntı ilişkisi var (hedef olarak kullanılamaz).
- **flex_approx**: FLEX 'Burn time' içindeki '~6', '~9' -> 6, 9 sayısal + burn_time_approx=True. '–' -> NaN.
- **flex_burn_rate_unit**: PSI-69 'Burning rate; mm' başlığındaki birim eksik; değer aralığı (~0.4-1 ) damlacık yanma sabiti K ile uyumlu -> burn_rate_K_mm2_s (mm²/s) VARSAYILDI.
- **hkp_segments**: SAME-R HKP: yalnızca PSI-101 'Raw_Data_HKPData_gmt*' (44 dosya) kullanıldı (PSI-102 HKP'leri kopya/ortalama sayfaları içeriyor). elapsedtesttime geri düştüğünde yeni segment; ana zaman elapsedtesttime (positionerclock değil). ptrak -999/9999/negatif -> NaN.
- **saffire2_spread**: SAFFIRE-II spread rate 1-g ölçümüdür, mikrogravite değildir; hedef olarak kullanılmadı.
- **saffire3_time**: SAFFIRE-III 1 Hz export'larında zaman = 'relative time (ms)'/1000 (RelativeSeconds başlıklı sütunlar da aslında ms). Negatif zaman satırları ve tüm kanalların 0 olduğu sentinel satırlar atıldı. 3 telemetri export'u birleştirilmedi.
- **smoke_ground_map**: Ground eşlemesi DOĞRULANMADI: amd_um <- 'Best Diameter Ion B/Ptrak Count Mean Diameter', dam_um <- 'DTRak B Diameter of average mass', m0 <- 'Mo Best Diameter', m1 <- 'Ion B M1'. Analizlerde flight-only ve flight+ground AYRI raporlanır.
- **smoke_leak**: amd_um = M1/M0 olduğundan m0_per_cc, m1_mm_per_cc, log_m0 ve ionb_moment amd_um hedefi için SIZINTIDIR; dam_um, dg_um, sigma_g, dusttrak, mpass da aynı anda ölçülen çıktılardır.
- **smoke_source**: `smoke_dataset.csv` repoda YOK. Yerine PSI-101 'Combined_SAMER_Results_06_02_14' çalışma kitabından yeniden kuruldu: flight = 'Reduced_data_sheet' (SAME=1, SAME-R=2), ground = 'SAME_Ground_Test_Results'.
- **smoke_zero**: Duman tablosunda çap/konsantrasyon/hız = 0 değerleri fiziksel değil (ölçülmedi) -> NaN. Sayılar load_report'ta. BELİRSİZ: inlet_velocity_cm_s=0 olan 22 satırın tamamı SAME-R'da; düşük akışlı run'lar olduğu için gerçek 0 olma ihtimali var — feature olarak kullanmadan önce teyit edilmeli.
- **spice_duration**: SPICE flame_duration_s = GMT Flame Off - GMT ignition (gece yarısı geçişi +86400 s). Aynı satırın tekrarları dup_of_previous ile işaretlendi, SİLİNMEDİ (aynı ayarda tekrar alev olabilir).
- **ts_events**: SAFFIRE-III olay tespiti betimseldir: ateşleme = igniter current > 0.5 A ilk an; pik = 4 radyometre ortalamasının (5 nokta medyan) maksimumu; sönme = pikten sonra sinyalin (taban + %10·genlik) altına ilk düştüğü an. Taban = ilk 60 s medyanı.
