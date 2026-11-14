# 04 — FlameSense Sensör Cihazı

Mimari: [Architecture.md §4.2](../../Architecture.md) · Kod: `edge/` (Python; donanım ve firmware adımları iptal) · Testler: `tests/flamesense/`

## Durum

- **İlerleme:** 0 / 9
- **Son güncelleme:** 2026-11-14
- **Sıradaki adım:** C1 (genel sıra 5; donanımsız yazılım demosu)
- **Açık sorunlar:**
  - Donanım (ESP32, sensörler) yok. Sunumda, ekipten birinin Blender'da hazırladığı temsili (dummy) donanım modeli gösterilecek; bu plan onu üretmez, yazılım demosu (05/E4 Canlı sayfası) ile birlikte sunulur. Gerçek donanım gelirse iptal edilen A, B, G, H2, I adımlarının çizgisi kaldırılır.

## Hedef

Cihaz kabin ortamını gerçek zamanlı ölçer ve iki soruyu yanıtlar:
1. **Yavaş döngü:** "Şu an yangın çıksa ne kadar kötü olur?"
2. **Hızlı döngü:** "Şu an bir yangın başlıyor mu?"

Feature tanımları EDA'nın Faz 6'sıyla aynıdır. **Donanımsız yazılım demosu:** M2 modelleri Python'da doğrudan çağrılır; fiziksel cihaz adımları (firmware, MQTT, HIL) ertelendi.

**Güvenlik:** Testlerde ve demoda açık alev kullanılmaz.

---

## Faz A — Donanım tasarımı (İPTAL 2026-11-14: donanım yok)

- ~~[ ] **A1** Malzeme listesi (BOM)~~ — **İPTAL (2026-11-14):** donanım yok, FlameSense donanımsız yazılım demosu olarak ilerliyor (C1, D1–D3, E3, F1–F2, H1); tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Yap: `firmware/BOM.md`: parça, arayüz (I2C/UART/analog), besleme gerilimi, akım, fiyat, tedarik bağlantısı.~~
    ~~Sensörler: O2, CO2 (SCD41), CO, BME280/688, anemometre, SPS30 + iyonizasyon kanalı, MLX90640 veya UV, IMU.~~
  - ~~Test: `pytest tests/flamesense/test_hw_config.py::test_bom`. Test, BOM'daki her sensörün `hw_config.yaml` dosyasında da tanımlı olduğunu kontrol eder.~~
  - ~~Kabul: Eksik veya fazla sensör yok.~~
- ~~[ ] **A2** Donanım konfigürasyonu ve çakışma kontrolü~~ — **İPTAL (2026-11-14):** donanım yok, FlameSense donanımsız yazılım demosu olarak ilerliyor (C1, D1–D3, E3, F1–F2, H1); tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Yap: `firmware/hw_config.yaml`: I2C adresleri, pinler, UART portları.~~
  - ~~Test: `pytest tests/flamesense/test_hw_config.py::test_no_conflicts`~~
  - ~~Kabul: Aynı I2C adresi veya aynı pin iki kez kullanılmıyor.~~
- ~~[ ] **A3** Güç bütçesi~~ — **İPTAL (2026-11-14):** donanım yok, FlameSense donanımsız yazılım demosu olarak ilerliyor (C1, D1–D3, E3, F1–F2, H1); tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Yap: Toplam akım, regülatör kapasitesinin %80'ini aşmamalı.~~
  - ~~Test: `pytest tests/flamesense/test_hw_config.py::test_power_budget`~~
  - ~~Kabul: Hesap ve sınır kontrolü geçiyor.~~
- ~~[ ] **A4** Bağlantı şeması~~ — **İPTAL (2026-11-14):** donanım yok, FlameSense donanımsız yazılım demosu olarak ilerliyor (C1, D1–D3, E3, F1–F2, H1); tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Yap: `docs/evidence/flamesense_wiring.png` + `firmware/WIRING.md`.~~
  - ~~Test: `pytest tests/flamesense/test_hw_config.py::test_wiring_evidence`~~
  - ~~Kabul: İki dosya var; WIRING.md'deki pinler `hw_config.yaml` ile eşleşiyor.~~

## Faz B — Firmware (ESP32-S3) (İPTAL 2026-11-14: donanım yok)

- ~~[ ] **B1** PlatformIO iskeleti~~ — **İPTAL (2026-11-14):** donanım yok, FlameSense donanımsız yazılım demosu olarak ilerliyor (C1, D1–D3, E3, F1–F2, H1); tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Yap: `firmware/platformio.ini`; `esp32-s3` ve `native` ortamları.~~
  - ~~Test: `pio run -e esp32-s3` ve `pio test -e native`~~
  - ~~Kabul: İki komut da hatasız bitiyor.~~
- ~~[ ] **B2** Sensör sürücüleri ve birim dönüşümleri~~ — **İPTAL (2026-11-14):** donanım yok, FlameSense donanımsız yazılım demosu olarak ilerliyor (C1, D1–D3, E3, F1–F2, H1); tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Yap: Her sensör için `read()` ve ham değeri fiziksel birime çeviren saf bir fonksiyon yaz. Dönüşüm fonksiyonları host üzerinde test edilebilir olmalı.~~
  - ~~Test: `pio test -e native -f test_conversions`~~
  - ~~Kabul: Datasheet'teki örnek değerlerle eşleşiyor.~~
- ~~[ ] **B3** Masa testi: gerçek sensör okumaları~~ — **İPTAL (2026-11-14):** donanım yok, FlameSense donanımsız yazılım demosu olarak ilerliyor (C1, D1–D3, E3, F1–F2, H1); tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Yap: Her kanalı 10 dakika boyunca logla ve logu `docs/evidence/bench_log.csv` dosyasına kaydet.~~
  - ~~Test: `pytest tests/flamesense/test_bench.py`~~
  - ~~Kabul: Her kanal makul aralıkta:~~
    - ~~O2 %19–22~~
    - ~~CO2 400–2000 ppm~~
    - ~~basınç 950–1050 hPa~~
    - ~~eksik örnek oranı < %1~~
- ~~[ ] **B4** Örnekleme zamanlayıcısı (1–10 Hz)~~ — **İPTAL (2026-11-14):** donanım yok, FlameSense donanımsız yazılım demosu olarak ilerliyor (C1, D1–D3, E3, F1–F2, H1); tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Yap: Örnekleri zaman damgasıyla topla.~~
  - ~~Test: `pytest tests/flamesense/test_bench.py::test_jitter`. B3 logundaki zaman damgaları kullanılır.~~
  - ~~Kabul: Hedef periyottan sapma (jitter) p95 < %10.~~
- ~~[ ] **B5** Sensör sağlık kontrolü~~ — **İPTAL (2026-11-14):** donanım yok, FlameSense donanımsız yazılım demosu olarak ilerliyor (C1, D1–D3, E3, F1–F2, H1); tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Yap: Takılı kalan değer, aralık dışı değer ve iletişim hatasını tespit et.~~
  - ~~Test: `pio test -e native -f test_health`~~
  - ~~Kabul: Her hata türü için yapay bir girdi doğru bayrağı üretiyor.~~

## Faz C — Feature çıkarımı (EDA Faz 6 ile aynı tanımlar)

- [ ] **C1** Python referans uygulaması
  - Yap: `edge/features.py`: 10 sn ve 60 sn pencerelerde seviye, eğim (`rise_slope` / `decay_slope`), tabandan sapma, eşik üstü süre, AUC.
  - Test: `pytest tests/flamesense/test_features.py`
  - Kabul: Sentetik sinyallerde (rampa, basamak) analitik sonuçlarla eşleşiyor.
- ~~[ ] **C2** C portu ve golden test~~ — **İPTAL (2026-11-14):** donanım yok, FlameSense donanımsız yazılım demosu olarak ilerliyor (C1, D1–D3, E3, F1–F2, H1); tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Yap: Aynı fonksiyonları `firmware/lib/features/` altına C olarak yaz.~~
  - ~~Test: `pio test -e native -f test_features_golden`. Python'un ürettiği `tests/fixtures/features_golden.json` dosyasıyla karşılaştırılır.~~
  - ~~Kabul: Göreli fark < 1e-5.~~

## Faz D — Erken tespit motoru (hızlı döngü, 1 Hz)

- [ ] **D1** CUSUM/EWMA değişim tespiti
  - Test: `pytest tests/flamesense/test_detection.py::test_cusum`
  - Kabul: Sentetik basamakta tespit gecikmesi ≤ 5 sn; durağan gürültüde 1 saatte 0 yanlış alarm.
- [ ] **D2** SAFFIRE-III replay doğrulaması
  - Yap: Sample 1 kalibre verisini motora oynat.
  - Test: `pytest tests/flamesense/test_detection.py::test_saffire_replay`
  - Kabul: Ateşleme, pik ve sönme zamanları EDA olay zamanlarıyla (`analysis/outputs/timeseries_summary.md`) ±10 sn içinde.
- [ ] **D3** Durum sınıflandırması: Normal / Ön-yangın (piroliz) / Yangın
  - Yap: Kurallar SAFFIRE olaylarından ve SAME-R malzeme imzalarından türetilsin.
  - Test: `pytest tests/flamesense/test_detection.py::test_states`
  - Kabul: Replay boyunca durum sırası Normal → Ön-yangın/Yangın → Normal; kurallar `edge/rules.yaml` içinde belgelenmiş.
- ~~[ ] **D4** C portu~~ — **İPTAL (2026-11-14):** donanım yok, FlameSense donanımsız yazılım demosu olarak ilerliyor (C1, D1–D3, E3, F1–F2, H1); tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Test: `pio test -e native -f test_detection_golden`~~
  - ~~Kabul: Aynı girdide Python ile aynı durum dizisi çıkıyor.~~

## Faz E — Ortam şiddeti motoru (yavaş döngü, 1/dk)

- ~~[ ] **E1** Export edilmiş modelleri yükleme (02/H2'nin çıktısı)~~ — **İPTAL (2026-11-14):** donanım yok, FlameSense donanımsız yazılım demosu olarak ilerliyor (C1, D1–D3, E3, F1–F2, H1); tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Yap: ESP32 üzerinde m2cgen'den gelen C modelleri çalışsın. Daha büyük modeller isteğe bağlı olarak Raspberry Pi 5 + ONNX Runtime üzerinde çalışsın.~~
  - ~~Test: `pio test -e native -f test_model_parity`~~
  - ~~Kabul: Python modeli ile export edilen model arasındaki fark < 1e-4 (100 örnek).~~
- ~~[ ] **E2** Cihaz üzerinde AD testi~~ — **İPTAL (2026-11-14):** donanım yok, FlameSense donanımsız yazılım demosu olarak ilerliyor (C1, D1–D3, E3, F1–F2, H1); tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Yap: AD istatistikleri JSON olarak cihaza yüklenir.~~
  - ~~Test: `pio test -e native -f test_ad`~~
  - ~~Kabul: Python AD testiyle aynı kararı veriyor (100 örnek).~~
- [ ] **E3** Malzeme envanterine göre şiddet hesabı
  - Yap: Envanterdeki her malzeme sınıfı için M2 modelleri Python'da çalışır (02/F3 `predict()`); cihaz yok. Çıktı: düşük/orta/yüksek seviyesi ve gerekçe.
  - Test: `pytest tests/flamesense/test_severity.py`
  - Kabul: Eşikler belgelenmiş; aynı girdide aynı seviye çıkıyor; kapsam dışı girdilerde uyarı var.
- ~~[ ] **E4** Bellek ve süre bütçesi~~ — **İPTAL (2026-11-14):** donanım yok, FlameSense donanımsız yazılım demosu olarak ilerliyor (C1, D1–D3, E3, F1–F2, H1); tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Test: `pio run -e esp32-s3 -t size` ve cihaz üzerindeki zamanlama logu (`docs/evidence/timing.md`)~~
  - ~~Kabul: Flash kullanımı < %80, RAM kullanımı < %70; bir şiddet döngüsü < 1 sn.~~

## Faz F — Alarm mantığı

- [ ] **F1** Tablo tabanlı alarm matrisi (3×3)
  - Yap: Matris Architecture §4.2'deki tabloyla birebir aynı ve `edge/alarm_matrix.yaml` dosyasından okunuyor.
  - Test: `pytest tests/flamesense/test_alarm.py`
  - Kabul: 9 hücrenin hepsi beklenen aksiyonu veriyor.
- [ ] **F2** Uzay ve Dünya modu
  - Yap: Dünya modunda "havalandırmayı kes" satırı bina kurallarına göre değişir.
  - Test: `pytest tests/flamesense/test_alarm.py::test_earth_mode`
  - Kabul: Mod değişince yalnızca ilgili hücreler değişiyor.
- ~~[ ] **F3** Yerel çıktılar (LED, buzzer, OLED)~~ — **İPTAL (2026-11-14):** donanım yok, FlameSense donanımsız yazılım demosu olarak ilerliyor (C1, D1–D3, E3, F1–F2, H1); tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Test: `docs/evidence/alarm_outputs.md`: her durum için fotoğraf veya video bağlantısı + `pytest tests/flamesense/test_alarm.py::test_evidence`~~
  - ~~Kabul: 3 durumun her biri için kanıt var.~~

## Faz G — Haberleşme (MQTT) (İPTAL 2026-11-14: donanım yok)

- ~~[ ] **G1** Topic'ler ve JSON şemaları~~ — **İPTAL (2026-11-14):** donanım yok, FlameSense donanımsız yazılım demosu olarak ilerliyor (C1, D1–D3, E3, F1–F2, H1); tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Yap: `flamesense/<id>/telemetry`, `/severity`, `/alerts` topic'leri; şemalar `edge/schemas/` altında.~~
  - ~~Test: `pytest tests/flamesense/test_mqtt.py::test_schemas`~~
  - ~~Kabul: Örnek mesajlar şemaya uyuyor.~~
- ~~[ ] **G2** Yayın ve abonelik~~ — **İPTAL (2026-11-14):** donanım yok, FlameSense donanımsız yazılım demosu olarak ilerliyor (C1, D1–D3, E3, F1–F2, H1); tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Yap: Firmware tarafında publish, host tarafında subscribe.~~
  - ~~Test: `pytest tests/flamesense/test_mqtt.py::test_roundtrip`. Lokal mosquitto veya paho mock kullanılır.~~
  - ~~Kabul: Mesajlar kaybolmadan ve sırası bozulmadan iletiliyor; bağlantı koparsa yeniden bağlanıyor.~~

## Faz H — Replay (yalnızca yazılım; HIL iptal)

- [ ] **H1** Replay aracı (yalnızca yazılım)
  - Yap: `edge/replay.py`, SAFFIRE-III telemetrisini zaman adımlarıyla (gerçek zamanlı ya da hızlandırılmış) üretir; tespit motoru (D) ve Canlı sayfası (05/E4) bunu tüketir. Seri port ve MQTT yok.
  - Test: `pytest tests/flamesense/test_replay.py`
  - Kabul: Üretilen örnek sayısı ve zaman damgaları kaynakla aynı; hızlandırma katsayısı doğru uygulanıyor.
- ~~[ ] **H2** Uçtan uca HIL testi~~ — **İPTAL (2026-11-14):** donanım yok, FlameSense donanımsız yazılım demosu olarak ilerliyor (C1, D1–D3, E3, F1–F2, H1); tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Yap: Replay → cihaz → MQTT → host akışında tespit edilen olaylar D2'deki sonuçlarla aynı olmalı.~~
  - ~~Test: `docs/evidence/hil_run.md` (log + ekran kaydı bağlantısı) + `pytest tests/flamesense/test_replay.py::test_hil_evidence`~~
  - ~~Kabul: Olay zamanları ±10 sn içinde.~~

## Faz I — Demo ve güvenlik

- ~~[ ] **I1** Zararsız uyaranlarla canlı demo~~ — **İPTAL (2026-11-14):** donanım yok, FlameSense donanımsız yazılım demosu olarak ilerliyor (C1, D1–D3, E3, F1–F2, H1); tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Yap: Nefes CO2'yi yükseltir; el sıcaklığı IR kanalını tetikler; preset habitatlar arasında geçiş yapılır.~~
  - ~~Test: `docs/evidence/live_demo.md` + `pytest tests/flamesense/test_demo.py`~~
  - ~~Kabul: Her uyaran için beklenen tepki kaydedilmiş.~~
- ~~[ ] **I2** OTA güncelleme~~ — **İPTAL (2026-11-14):** donanım yok, FlameSense donanımsız yazılım demosu olarak ilerliyor (C1, D1–D3, E3, F1–F2, H1); tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Yap: Model ve konfigürasyon güncellemeleri kablosuz yüklenebilsin.~~
  - ~~Test: `docs/evidence/ota.md` + `pytest tests/flamesense/test_demo.py::test_ota_evidence`~~
  - ~~Kabul: Yeni bir model sürümü yüklendikten sonra cihaz yeni sürüm numarasını MQTT üzerinden bildiriyor.~~
- ~~[ ] **I3** Güvenlik kontrol listesi~~ — **İPTAL (2026-11-14):** donanım yok, FlameSense donanımsız yazılım demosu olarak ilerliyor (C1, D1–D3, E3, F1–F2, H1); tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Yap: `docs/evidence/safety_checklist.md`: açık alev yok, etkinlik kuralları, "prototip, sertifikalı değil" uyarısı.~~
  - ~~Test: `pytest tests/flamesense/test_demo.py::test_safety`~~
  - ~~Kabul: Listedeki bütün maddeler işaretli.~~
- [ ] **I4** Plan ve durum güncellemesi
  - Test: `pytest tests/flamesense/test_plan_status.py`
  - Kabul: Sayılar tutarlı.
