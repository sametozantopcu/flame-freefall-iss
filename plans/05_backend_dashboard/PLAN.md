# 05 — Uygulama (Streamlit dashboard)

Mimari: [Architecture.md §0 ve §5](../../Architecture.md) · Kod: `app/` (mevcut Streamlit; yeni sayfalar `app/views/`) · Testler: `tests/app/`

## Durum

- **İlerleme:** 0 / 12
- **Son güncelleme:** 2026-11-14
- **Sıradaki adım:** A1 (genel sıra 3: karar kaydı ve yeni sayfalar E1, E3; E2 genel sıra 4, E4 genel sıra 5)
- **Açık sorunlar:**
  - Karar (2026-11-14): yalnızca Streamlit, ayrı backend yok (A1'de kayda geçecek). FastAPI/MQTT/WebSocket adımları (B, C, D, F2) iptal edildi.
  - Mevcut `app/` BASS-II odaklı ve `data/processed/bass2_clean.csv` dosyasını okuyor (A3). Repoda şu an tek geliştirici çalışıyor; mevcut `app/` dosyaları gerektiğinde düzenlenebilir (her adım yine onayla).

## Hedef

Tek bir Streamlit uygulaması M1, M2, M3 ve FlameSense yazılım demosunu dört sayfada sunar: **Keşif | Senaryo | Ekipman | Canlı**. Sayfalar `src/` modüllerini doğrudan çağırır; ayrı bir backend yoktur.
"Dürüstlük ve Sınırlar" uyarıları (Architecture §6) her ekranda görünür.

---

## Faz A — Mevcut uygulamayla ilişki

- [ ] **A1** Karar kaydı
  - Yap: `docs/decisions/001-app-vs-backend.md`: karar = yalnızca Streamlit, ayrı backend (FastAPI/MQTT) yok; yeni sayfalar `src/` modüllerini doğrudan çağırır.
    `app/core/` içinde neler yeniden kullanılacak? Alanlar 002 kaydıyla aynı (Karar, Gerekçe, Onaylayan); ekip onayı yazılı olmalı.
  - Test: `pytest tests/app/test_decisions.py`
  - Kabul: Dosya var ve "Karar", "Gerekçe", "Onaylayan" alanları dolu; aynı test `docs/decisions/` altındaki tüm kayıtları (002 dahil) denetler.
- [ ] **A2** Mevcut uygulama için duman testi
  - Yap: Değişikliğe başlamadan önce mevcut sayfaların hatasız açıldığını sabitle.
  - Test: `pytest tests/app/test_smoke_pages.py`. Streamlit `AppTest` ile her sayfa çalıştırılır.
  - Kabul: 6 sayfanın (`archive`, `flammability`, `mission`, `procedures`, `ai`, `system`) hepsi exception vermeden açılıyor.
- [ ] **A3** `app/core/data.py` dosyasını Feature Store'a bağla
  - Yap: `bass2_clean.csv` yerine `00/C5` çıktısı `get_modeling_frame("bass2", ...)` kullanılır; simülasyona geri dönüş mekanizması korunur.
  - Test: `pytest tests/app/test_data_source.py`
  - Kabul: Gerçek veriyle 129 BASS-II satırı yükleniyor; veri yoksa simülasyona dönülüyor.
- [ ] **A4** Çalışan `requirements.txt` (kök)
  - Yap: Kökteki `requirements.txt` bir ortam dökümü (Jupyter, Windows'a özel `pywinpty`…). Uygulamanın ve `src/`'nin gerçekten import ettiği paketlere, `>=` alt sınırlı ve her platformda kurulabilir bir listeye indir. Kök dosyayı değiştirdiği için uygulamadan önce sorulur.
  - Test: `pytest tests/app/test_requirements.py`. Test, `app/` ve `src/` içindeki üçüncü taraf import'ların hepsinin dosyada olduğunu ve platforma özel paket bulunmadığını kontrol eder; temiz bir sanal ortamda kurulum kanıtı `docs/evidence/requirements_install.md`.
  - Kabul: Temiz ortamda `pip install -r requirements.txt` başarılı ve `streamlit run app/streamlit_app.py` açılıyor.

## Faz B — FastAPI iskeleti (İPTAL 2026-11-14: yalnızca Streamlit)

- ~~[ ] **B1** Uygulama, `/health` ve konfigürasyon~~ — **İPTAL (2026-11-14):** yalnızca Streamlit; ayrı backend (FastAPI/MQTT/WebSocket) yok, sayfalar `src/` modüllerini doğrudan çağırır; tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Yap: `backend/main.py`; ayarlar ortam değişkenlerinden okunur (pydantic-settings).~~
  - ~~Test: `pytest tests/backend/test_health.py`. FastAPI `TestClient` kullanılır.~~
  - ~~Kabul: 200 dönüyor; yanıtta veri katmanı, model registry ve MQTT durumları var.~~
- ~~[ ] **B2** Hata modeli ve uyarı alanları~~ — **İPTAL (2026-11-14):** yalnızca Streamlit; ayrı backend (FastAPI/MQTT/WebSocket) yok, sayfalar `src/` modüllerini doğrudan çağırır; tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Yap: Her yanıtta `warnings: list` alanı olsun (AD, kısmi yerçekimi, eşleşme düzeyi).~~
  - ~~Test: `pytest tests/backend/test_errors.py`~~
  - ~~Kabul: Geçersiz girdi 422 ve anlaşılır bir mesaj döndürüyor; uyarılar kaybolmuyor.~~

## Faz C — REST uç noktaları (İPTAL 2026-11-14: yalnızca Streamlit)

- ~~[ ] **C1** `POST /m1/rank` (01/F1)~~ — **İPTAL (2026-11-14):** yalnızca Streamlit; ayrı backend (FastAPI/MQTT/WebSocket) yok, sayfalar `src/` modüllerini doğrudan çağırır; tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Test: `pytest tests/backend/test_m1.py`~~
  - ~~Kabul: Yanıt şeması doğru; bileşen dökümü var; Ay/Mars için `partial_gravity` uyarısı dönüyor.~~
- ~~[ ] **C2** `POST /m2/predict` (02/F3)~~ — **İPTAL (2026-11-14):** yalnızca Streamlit; ayrı backend (FastAPI/MQTT/WebSocket) yok, sayfalar `src/` modüllerini doğrudan çağırır; tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Test: `pytest tests/backend/test_m2.py::test_predict`~~
  - ~~Kabul: Yanıtta tahmin, aralık, `ad_warning` ve `physics_flags` var.~~
- ~~[ ] **C3** `POST /m2/nearest` (02/G2). `GET /videos/{test_id}` iptal (2026-11-14: video işi kapsam dışı)~~ — **İPTAL (2026-11-14):** yalnızca Streamlit; ayrı backend (FastAPI/MQTT/WebSocket) yok, sayfalar `src/` modüllerini doğrudan çağırır; tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Test: `pytest tests/backend/test_m2.py::test_nearest`~~
  - ~~Kabul: k=5 komşu dönüyor; başka aileden komşu dönmüyor.~~
- ~~[ ] **C4** `GET /m3/cards` (03/D2)~~ — **İPTAL (2026-11-14):** yalnızca Streamlit; ayrı backend (FastAPI/MQTT/WebSocket) yok, sayfalar `src/` modüllerini doğrudan çağırır; tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Test: `pytest tests/backend/test_m3.py`~~
  - ~~Kabul: Habitat ve ekipman filtreleri çalışıyor.~~
- ~~[ ] **C5** `GET /datasets/{name}` ve `GET /datasets/{name}/card` (02/A3–A4)~~ — **İPTAL (2026-11-14):** yalnızca Streamlit; ayrı backend (FastAPI/MQTT/WebSocket) yok, sayfalar `src/` modüllerini doğrudan çağırır; tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Test: `pytest tests/backend/test_datasets.py`~~
  - ~~Kabul: CSV/Parquet indirmesi çalışıyor; kart JSON olarak dönüyor; bilinmeyen ad 404 veriyor.~~
- ~~[ ] **C6** OpenAPI dokümantasyonu~~ — **İPTAL (2026-11-14):** yalnızca Streamlit; ayrı backend (FastAPI/MQTT/WebSocket) yok, sayfalar `src/` modüllerini doğrudan çağırır; tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Test: `pytest tests/backend/test_openapi.py`~~
  - ~~Kabul: Her uç noktanın açıklaması ve örnek isteği var.~~

## Faz D — Canlı veri: MQTT/WebSocket (İPTAL 2026-11-14: yalnızca Streamlit)

- ~~[ ] **D1** MQTT abonesi~~ — **İPTAL (2026-11-14):** yalnızca Streamlit; ayrı backend (FastAPI/MQTT/WebSocket) yok, sayfalar `src/` modüllerini doğrudan çağırır; tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Yap: `flamesense/+/telemetry|severity|alerts` topic'lerine abone ol; mesajlar 04/G1 şemalarıyla doğrulanır.~~
  - ~~Test: `pytest tests/backend/test_live.py::test_mqtt_ingest`. Sahte bir MQTT broker kullanılır.~~
  - ~~Kabul: Geçerli mesaj kabul ediliyor; geçersiz mesaj loglanıp atlanıyor.~~
- ~~[ ] **D2** WebSocket `/ws/live`~~ — **İPTAL (2026-11-14):** yalnızca Streamlit; ayrı backend (FastAPI/MQTT/WebSocket) yok, sayfalar `src/` modüllerini doğrudan çağırır; tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Yap: MQTT mesajlarını tarayıcıya ilet.~~
  - ~~Test: `pytest tests/backend/test_live.py::test_ws`~~
  - ~~Kabul: MQTT'ye yayınlanan mesaj 1 sn içinde WebSocket istemcisine ulaşıyor.~~
- ~~[ ] **D3** Kısa geçmiş tamponu~~ — **İPTAL (2026-11-14):** yalnızca Streamlit; ayrı backend (FastAPI/MQTT/WebSocket) yok, sayfalar `src/` modüllerini doğrudan çağırır; tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Yap: Son 10 dakikalık veri bellekte tutulur ve yeni bağlanan istemciye gönderilir.~~
  - ~~Test: `pytest tests/backend/test_live.py::test_history`~~
  - ~~Kabul: Tampon sınırı aşılmıyor.~~

## Faz E — Dashboard sayfaları (Streamlit, yeni `app/views/*.py` dosyaları)

- [ ] **E1** Keşif sayfası
  - Yap: Sıralı tablo + bileşen çubukları, O2 × basınç zarf grafiği, investigation kartı (DOI).
  - Test: `pytest tests/app/test_tab_discovery.py` (AppTest; sayfa `src/` modüllerini doğrudan çağırır)
  - Kabul: Habitat değişince sıralama güncelleniyor; ağırlık slider'ları çalışıyor.
- [ ] **E2** Senaryo sayfası
  - Yap: Senaryo formu, tahmin + aralık, AD ve fizik uyarıları, en yakın deney + "neden benzer" metni (video yok).
  - Test: `pytest tests/app/test_tab_scenario.py`
  - Kabul: Kapsam dışı bir senaryoda uyarı görünüyor.
- [ ] **E3** Ekipman sayfası
  - Yap: Bulgu kartları, güven rozetleri (A/B/C), Dünya uygulamaları, veri boşluğu kartları.
  - Test: `pytest tests/app/test_tab_equipment.py`
  - Kabul: Filtreler çalışıyor; her kartta DOI görünüyor.
- [ ] **E4** Canlı sayfası (FlameSense yazılım demosu)
  - Yap: SAFFIRE-III replay (04/H1) ile telemetri, şiddet seviyesi, tespit durumu ve alarm matrisi. WebSocket/MQTT yok.
  - Test: `pytest tests/app/test_tab_live.py`. Replay hızlandırılmış olarak çalıştırılır.
  - Kabul: Durum değişimi (Normal → Ön-yangın/Yangın → Normal) ekranda görünüyor; replay hızı ayarlanabiliyor.
- [ ] **E5** "Dürüstlük ve Sınırlar" bandı (Architecture §6)
  - Test: `pytest tests/app/test_honesty_banner.py`
  - Kabul: Bant 4 sekmenin hepsinde görünüyor.
- [ ] **E6** i18n (EN/TR)
  - Yap: Yeni metinler `app/i18n.py` dosyasına eklenir.
  - Test: `pytest tests/app/test_i18n.py`. Test, koddaki her `t("…")` anahtarının iki dilde de tanımlı olduğunu kontrol eder.
  - Kabul: Eksik anahtar yok.

## Faz F — Kapanış

- [ ] **F1** Tek komutla çalıştırma
  - Yap: Tek komut: repo kökünden `streamlit run app/streamlit_app.py`; README'de yazılı.
  - Test: `pytest tests/app/test_run.py -m slow`. Test, uygulamayı başsız (headless) başlatıp ana sayfanın 200 döndüğünü ve tüm sayfaların AppTest ile hatasız açıldığını kontrol eder.
  - Kabul: Temiz bir makinede README'deki adımlarla çalışıyor.
- ~~[ ] **F2** Performans~~ — **İPTAL (2026-11-14):** yalnızca Streamlit; ayrı backend (FastAPI/MQTT/WebSocket) yok, sayfalar `src/` modüllerini doğrudan çağırır; tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Test: `pytest tests/backend/test_perf.py`~~
  - ~~Kabul: `/m1/rank` ve `/m2/predict` için p95 < 500 ms (lokal ortamda, 50 istek).~~
- [ ] **F3** Plan ve durum güncellemesi
  - Test: `pytest tests/app/test_plan_status.py`
  - Kabul: Sayılar tutarlı.
