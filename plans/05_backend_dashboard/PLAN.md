# 05 — Backend (FastAPI) + Dashboard

Mimari: [Architecture.md §0 ve §5](../../Architecture.md) · Kod: `backend/`, `app/` (mevcut Streamlit) · Testler: `tests/backend/`, `tests/app/`

## Durum

- **İlerleme:** 0 / 23
- **Son güncelleme:** 2026-11-14
- **Sıradaki adım:** A1
- **Açık sorunlar:**
  - Mevcut `app/` uygulaması BASS-II odaklı ve `data/processed/bass2_clean.csv` dosyasını okuyor. Mimari ise FastAPI ve 4 sekmeli bir dashboard öngörüyor.
    A1'deki karar netleşmeden B ve E fazlarına başlanmaz.

## Hedef

Tek bir backend M1, M2, M3 ve FlameSense'i REST + WebSocket ile sunar. Dashboard'da dört sekme olur: **Keşif | Senaryo | Ekipman | Canlı**.
"Dürüstlük ve Sınırlar" uyarıları (Architecture §6) her ekranda görünür.

---

## Faz A — Mevcut uygulamayla ilişki

- [ ] **A1** Karar kaydı
  - Yap: `docs/decisions/001-app-vs-backend.md`: mevcut Streamlit MVP olarak kalacak mı, backend'i mi çağıracak?
    `app/core/` içinde neler yeniden kullanılacak? Ekip onayı yazılı olmalı.
  - Test: `pytest tests/app/test_decisions.py`
  - Kabul: Dosya var ve "Karar", "Gerekçe", "Onaylayan" alanları dolu.
- [ ] **A2** Mevcut uygulama için duman testi
  - Yap: Değişikliğe başlamadan önce mevcut sayfaların hatasız açıldığını sabitle.
  - Test: `pytest tests/app/test_smoke_pages.py`. Streamlit `AppTest` ile her sayfa çalıştırılır.
  - Kabul: 6 sayfanın (`archive`, `flammability`, `mission`, `procedures`, `ai`, `system`) hepsi exception vermeden açılıyor.
- [ ] **A3** `app/core/data.py` dosyasını Feature Store'a bağla
  - Yap: `bass2_clean.csv` yerine `00/C5` çıktısı `get_modeling_frame("bass2", ...)` kullanılır; simülasyona geri dönüş mekanizması korunur.
  - Test: `pytest tests/app/test_data_source.py`
  - Kabul: Gerçek veriyle 129 BASS-II satırı yükleniyor; veri yoksa simülasyona dönülüyor.

## Faz B — FastAPI iskeleti

- [ ] **B1** Uygulama, `/health` ve konfigürasyon
  - Yap: `backend/main.py`; ayarlar ortam değişkenlerinden okunur (pydantic-settings).
  - Test: `pytest tests/backend/test_health.py`. FastAPI `TestClient` kullanılır.
  - Kabul: 200 dönüyor; yanıtta veri katmanı, model registry ve MQTT durumları var.
- [ ] **B2** Hata modeli ve uyarı alanları
  - Yap: Her yanıtta `warnings: list` alanı olsun (AD, kısmi yerçekimi, eşleşme düzeyi).
  - Test: `pytest tests/backend/test_errors.py`
  - Kabul: Geçersiz girdi 422 ve anlaşılır bir mesaj döndürüyor; uyarılar kaybolmuyor.

## Faz C — REST uç noktaları

- [ ] **C1** `POST /m1/rank` (01/F1)
  - Test: `pytest tests/backend/test_m1.py`
  - Kabul: Yanıt şeması doğru; bileşen dökümü var; Ay/Mars için `partial_gravity` uyarısı dönüyor.
- [ ] **C2** `POST /m2/predict` (02/F3)
  - Test: `pytest tests/backend/test_m2.py::test_predict`
  - Kabul: Yanıtta tahmin, aralık, `ad_warning` ve `physics_flags` var.
- [ ] **C3** `POST /m2/nearest` + `GET /videos/{test_id}` (02/G2–G5)
  - Test: `pytest tests/backend/test_m2.py::test_nearest`. PSI çağrıları mock'lanır.
  - Kabul: k=5 komşu dönüyor; video yoksa 404 değil `null` dönüyor; presigned URL hatası anlaşılır biçimde iletiliyor.
- [ ] **C4** `GET /m3/cards` (03/D2)
  - Test: `pytest tests/backend/test_m3.py`
  - Kabul: Habitat ve ekipman filtreleri çalışıyor.
- [ ] **C5** `GET /datasets/{name}` ve `GET /datasets/{name}/card` (02/A3–A4)
  - Test: `pytest tests/backend/test_datasets.py`
  - Kabul: CSV/Parquet indirmesi çalışıyor; kart JSON olarak dönüyor; bilinmeyen ad 404 veriyor.
- [ ] **C6** OpenAPI dokümantasyonu
  - Test: `pytest tests/backend/test_openapi.py`
  - Kabul: Her uç noktanın açıklaması ve örnek isteği var.

## Faz D — Canlı veri (FlameSense)

- [ ] **D1** MQTT abonesi
  - Yap: `flamesense/+/telemetry|severity|alerts` topic'lerine abone ol; mesajlar 04/G1 şemalarıyla doğrulanır.
  - Test: `pytest tests/backend/test_live.py::test_mqtt_ingest`. Sahte bir MQTT broker kullanılır.
  - Kabul: Geçerli mesaj kabul ediliyor; geçersiz mesaj loglanıp atlanıyor.
- [ ] **D2** WebSocket `/ws/live`
  - Yap: MQTT mesajlarını tarayıcıya ilet.
  - Test: `pytest tests/backend/test_live.py::test_ws`
  - Kabul: MQTT'ye yayınlanan mesaj 1 sn içinde WebSocket istemcisine ulaşıyor.
- [ ] **D3** Kısa geçmiş tamponu
  - Yap: Son 10 dakikalık veri bellekte tutulur ve yeni bağlanan istemciye gönderilir.
  - Test: `pytest tests/backend/test_live.py::test_history`
  - Kabul: Tampon sınırı aşılmıyor.

## Faz E — Dashboard sekmeleri

- [ ] **E1** Keşif sekmesi
  - Yap: Sıralı tablo + bileşen çubukları, O2 × basınç zarf grafiği, investigation kartı (DOI, video).
  - Test: `pytest tests/app/test_tab_discovery.py` (AppTest, backend mock'lanır)
  - Kabul: Habitat değişince sıralama güncelleniyor; ağırlık slider'ları çalışıyor.
- [ ] **E2** Senaryo sekmesi
  - Yap: Senaryo formu, tahmin + aralık, AD ve fizik uyarıları, en yakın deney + video + "neden benzer" metni.
  - Test: `pytest tests/app/test_tab_scenario.py`
  - Kabul: Kapsam dışı bir senaryoda uyarı görünüyor; video yoksa yer tutucu gösteriliyor.
- [ ] **E3** Ekipman sekmesi
  - Yap: Bulgu kartları, güven rozetleri (A/B/C), Dünya uygulamaları, veri boşluğu kartları.
  - Test: `pytest tests/app/test_tab_equipment.py`
  - Kabul: Filtreler çalışıyor; her kartta DOI görünüyor.
- [ ] **E4** Canlı sekme
  - Yap: FlameSense telemetrisi, şiddet seviyesi, tespit durumu, alarm matrisi.
  - Test: `pytest tests/app/test_tab_live.py`. Sahte bir WebSocket akışı kullanılır.
  - Kabul: Durum değişimi ekranda görünüyor; bağlantı koparsa uyarı veriliyor.
- [ ] **E5** "Dürüstlük ve Sınırlar" bandı (Architecture §6)
  - Test: `pytest tests/app/test_honesty_banner.py`
  - Kabul: Bant 4 sekmenin hepsinde görünüyor.
- [ ] **E6** i18n (EN/TR)
  - Yap: Yeni metinler `app/i18n.py` dosyasına eklenir.
  - Test: `pytest tests/app/test_i18n.py`. Test, koddaki her `t("…")` anahtarının iki dilde de tanımlı olduğunu kontrol eder.
  - Kabul: Eksik anahtar yok.

## Faz F — Kapanış

- [ ] **F1** Tek komutla çalıştırma
  - Yap: `make run` veya `scripts/run_local.sh` backend'i, mosquitto'yu ve dashboard'u birlikte başlatsın.
  - Test: `pytest tests/backend/test_run_local.py -m slow`. Test, `/health` ve dashboard'un 200 döndüğünü kontrol eder.
  - Kabul: Temiz bir makinede README'deki adımlarla çalışıyor.
- [ ] **F2** Performans
  - Test: `pytest tests/backend/test_perf.py`
  - Kabul: `/m1/rank` ve `/m2/predict` için p95 < 500 ms (lokal ortamda, 50 istek).
- [ ] **F3** Plan ve durum güncellemesi
  - Test: `pytest tests/backend/test_plan_status.py`
  - Kabul: Sayılar tutarlı.
