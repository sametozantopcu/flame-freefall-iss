# 06 — Teslim: Tekrarlanabilirlik, CI, Sunum

Mimari: [Architecture.md §5–§7](../../Architecture.md) · Kod: `.github/workflows/`, `run_all.sh`, `docs/` · Testler: `tests/delivery/`

## Durum

- **İlerleme:** 0 / 14
- **Son güncelleme:** 2026-11-14
- **Sıradaki adım:** A1. CI erken kurulursa diğer konuların testleri her push'ta otomatik çalışır.
- **Açık sorunlar:** —

## Hedef

Jüri ve ekip, repoyu klonlayıp tek komutla sonuçları yeniden üretebilmeli. Her iddia kaynağıyla birlikte sunulmalı.

---

## Faz A — CI (erken kur)

- [ ] **A1** GitHub Actions: her konu için ayrı pytest işi
  - Yap: `.github/workflows/tests.yml`. Matris: `00_data_layer`, `01_m1_discovery`, … Her iş kendi `plans/<konu>/requirements.txt` dosyasını kurar.
    `needs_raw`, `slow` ve `live` işaretli testler CI'da çalışmaz.
  - Test: `pytest tests/delivery/test_ci_config.py`. Test, workflow'da her plan klasörü için bir iş olduğunu kontrol eder.
    Ayrıca ilk CI çalıştırmasının yeşil olduğu `docs/evidence/ci_first_green.md` dosyasına not edilir.
  - Kabul: Workflow geçerli ve kapsam eksiksiz.
- [ ] **A2** Firmware derleme işi
  - Yap: PlatformIO ile `pio run -e esp32-s3` ve `pio test -e native`.
  - Test: `pytest tests/delivery/test_ci_config.py::test_firmware_job`
  - Kabul: İş tanımlı.
- [ ] **A3** Plan tutarlılık testi (bütün konular için)
  - Yap: Her `PLAN.md` dosyasında işaretli kutu sayısı Durum satırıyla ve `plans/README.md` tablosuyla eşleşmeli.
    Her `[x]` kutusunun altında `✔ YYYY-MM-DD` ile başlayan bir kanıt satırı olmalı.
  - Test: `pytest tests/delivery/test_plans.py`
  - Kabul: Bütün planlar tutarlı. Kanıt satırı olmayan `[x]` kutusu testi düşürüyor.

## Faz B — Tekrarlanabilirlik

- [ ] **B1** `run_all.sh`
  - Yap: Sıra: parquet → Feature Store → metadata → modeller → kartlar → rapor. `raw/` gerektiren adımlar `--skip-raw` ile atlanır.
  - Test: `pytest tests/delivery/test_run_all.py -m slow`. Test temiz bir kopyada çalışır.
  - Kabul: Komut 0 koduyla bitiyor; iki çalıştırmada model kartı metrikleri aynı.
- [ ] **B2** Veri ve model kartlarının eksiksizliği
  - Test: `pytest tests/delivery/test_cards_complete.py`
  - Kabul: `models/*/card.json` ve `data/modeling/*` kartlarının hepsi şemaya uyuyor ve zorunlu alanları dolu.
- [ ] **B3** Kurulum dokümantasyonu
  - Yap: Kök README'de sıfırdan kurulum anlatılsın (her konunun requirements dosyası, sistem bağımlılıkları: ffmpeg, mosquitto, PlatformIO).
  - Test: `pytest tests/delivery/test_readme.py`. Test, README'de bahsedilen komutların ve dosyaların var olduğunu kontrol eder.
  - Kabul: Kırık referans yok.

## Faz C — Atıf ve dürüstlük

- [ ] **C1** DOI atıf sayfası
  - Yap: `docs/CITATIONS.md`: kullanılan her `psi_id` için DOI ve yayın bilgisi. Sayfa Metadata DB'den otomatik üretilir.
  - Test: `pytest tests/delivery/test_citations.py`
  - Kabul: Parquet'te ve kartlarda geçen her `psi_id` için en az bir DOI var.
- [ ] **C2** Sınırlar listesi
  - Yap: Architecture §6'daki maddeler README'de, dashboard'da ve sunumda aynı metinle geçmeli.
  - Test: `pytest tests/delivery/test_limits.py`
  - Kabul: Üç yerde de bütün maddeler var.
- [ ] **C3** Architecture güncelliği
  - Yap: Planlarda alınan kararlar Architecture.md'ye yansıtılır. Açık örnekler:
    - duman medyanı (0.12–0.30 µm)
    - diyagram kutuları
    - mevcut `app/` ile ilişki (05/A1)
    Bu değişiklikleri ekip onaylar.
  - Test: `pytest tests/delivery/test_architecture.py`. Test, Architecture'daki sayıların kart ve çıktı dosyalarındaki değerlerle tutarlı olduğunu kontrol eder.
  - Kabul: Tutarsızlık yok.

## Faz D — Sunum

- [ ] **D1** Demo senaryosu
  - Yap: `docs/demo_script.md`: dakika dakika akış (M1 → M2 → M3 → FlameSense HIL → canlı sensör).
  - Test: `pytest tests/delivery/test_demo.py::test_script`
  - Kabul: Her bölüm için süre ve sorumlu kişi yazılmış; toplam süre yarışma sınırının içinde.
- [ ] **D2** Slaytlar
  - Test: `docs/evidence/slides.md` (bağlantı) + `pytest tests/delivery/test_demo.py::test_slides_evidence`
  - Kabul: Slaytlardaki her sayının kaynağı belirtilmiş.
- [ ] **D3** Demo videosu
  - Test: `docs/evidence/demo_video.md` (bağlantı + süre) + `pytest tests/delivery/test_demo.py::test_video_evidence`
  - Kabul: Video yarışma süre sınırına uyuyor.
- [ ] **D4** Prova kontrol listesi
  - Yap: `docs/evidence/rehearsal.md`: internet olmadan çalışma (önbellek), yedek kayıt videosu, cihaz şarjı, açık alev yok.
  - Test: `pytest tests/delivery/test_demo.py::test_rehearsal`
  - Kabul: Bütün maddeler işaretli ve en az 1 tam prova yapılmış.
- [ ] **D5** Plan ve durum güncellemesi
  - Test: `pytest tests/delivery/test_plans.py`
  - Kabul: Bütün planlarda sayılar tutarlı.
