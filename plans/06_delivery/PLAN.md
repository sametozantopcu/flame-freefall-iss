# 06 — Teslim: Tekrarlanabilirlik, CI, Sunum

Mimari: [Architecture.md §5–§7](../../Architecture.md) · Kod: `.github/workflows/`, `run_all.sh`, `docs/` · Testler: `tests/delivery/`

## Durum

- **İlerleme:** 0 / 14
- **Son güncelleme:** 2026-11-14
- **Sıradaki adım:** A1 (genel sıra 1, 00/F3 ile birlikte: CI erken kurulursa her push'ta testler otomatik çalışır). B, C ve D adımları en sonda (genel sıra 6).
- **Açık sorunlar:** —

## Hedef

Jüri ve ekip, repoyu klonlayıp tek komutla sonuçları yeniden üretebilmeli. Her iddia kaynağıyla birlikte sunulmalı.

---

## Faz A — CI (erken kur)

- [ ] **A1** GitHub Actions: tek pytest işi
  - Yap: `.github/workflows/tests.yml`. Tek iş: bütün `plans/<konu>/requirements.txt` dosyalarını kurar ve `pytest tests` çalıştırır.
    `needs_raw`, `slow` ve `live` işaretli testler CI'da çalışmaz.
  - Test: `pytest tests/delivery/test_ci_config.py`. Test, workflow'un tek işte tüm plan requirements dosyalarını kurduğunu ve işaretli testleri hariç tuttuğunu kontrol eder.
    Ayrıca ilk CI çalıştırmasının yeşil olduğu `docs/evidence/ci_first_green.md` dosyasına not edilir.
  - Kabul: Workflow geçerli ve kapsam eksiksiz.
- ~~[ ] **A2** Firmware derleme işi~~ — **İPTAL (2026-11-14):** firmware yok (04'ün donanım adımları iptal); tek geliştirici kapsamı; zaman kalırsa çizgi kaldırılıp geri açılır
  - ~~Yap: PlatformIO ile `pio run -e esp32-s3` ve `pio test -e native`.~~
  - ~~Test: `pytest tests/delivery/test_ci_config.py::test_firmware_job`~~
  - ~~Kabul: İş tanımlı.~~
- [ ] **A3** Plan tutarlılık testi (bütün konular için)
  - Yap: Her `PLAN.md` dosyasında işaretli kutu sayısı Durum satırıyla ve `plans/README.md` tablosuyla eşleşmeli.
    İptal edilen (üstü çizili, `- ~~[ ]`) adımlar sayıma girmez. Her `[x]` kutusunun altında `✔ YYYY-MM-DD` ile başlayan bir kanıt satırı olmalı.
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
  - Yap: Kök README'de sıfırdan kurulum anlatılsın (kök `requirements.txt` ve konuların requirements dosyaları; ek sistem bağımlılığı yok).
  - Test: `pytest tests/delivery/test_readme.py`. Test, README'de bahsedilen komutların ve dosyaların var olduğunu kontrol eder.
  - Kabul: Kırık referans yok.

## Faz C — Atıf ve dürüstlük

- [ ] **C1** DOI atıf sayfası
  - Yap: `docs/CITATIONS.md`: kullanılan her `psi_id` için DOI ve yayın bilgisi. Sayfa Metadata DB'den otomatik üretilir.
  - Test: `pytest tests/delivery/test_citations.py`
  - Kabul: Parquet'te ve kartlarda geçen her `psi_id` için en az bir DOI var.
  - Not (00/D3'ten): 68 yayında DOI yok (`doi_flag='missing'`, uydurulmaz); PSI-100'ün yayınlarında hiç DOI yok (`pub_doi_status='no_doi'`). "Benzersiz makale" sayarken DOI'ye göre tekilleştir: 93 satır aynı DOI'yi paylaşıyor, 44 DOI birden çok investigation'da geçiyor, 1 DOI PSI-21 içinde iki kez. DOI karşılaştırması büyük/küçük harfe duyarsız yapılmalı.
- [ ] **C2** Sınırlar listesi
  - Yap: Architecture §6'daki maddeler README'de, dashboard'da ve sunumda aynı metinle geçmeli.
  - Test: `pytest tests/delivery/test_limits.py`
  - Kabul: Üç yerde de bütün maddeler var.
- [ ] **C3** Architecture güncelliği
  - Yap: Planlarda alınan kararlar Architecture.md'ye yansıtılır. Açık örnekler:
    - duman medyanı (0.12–0.30 µm)
    - diyagram kutuları
    - mevcut `app/` ile ilişki (05/A1)
    - video özelliklerinin iptali (2026-11-14): §3.5 "Video eşleme", M2 diyagramındaki video blokları, "Metadata & Video Index" kutusu, dashboard'daki video göstergeleri
    Bu değişiklikleri ekip onaylar.
  - Test: `pytest tests/delivery/test_architecture.py`. Test, Architecture'daki sayıların kart ve çıktı dosyalarındaki değerlerle tutarlı olduğunu kontrol eder.
  - Kabul: Tutarsızlık yok.

## Faz D — Sunum

- [ ] **D1** Demo senaryosu
  - Yap: `docs/demo_script.md`: dakika dakika akış (M1 → M2 → M3 → FlameSense yazılım demosu (SAFFIRE-III replay)).
  - Test: `pytest tests/delivery/test_demo.py::test_script`
  - Kabul: Her bölüm için süre ve sorumlu kişi yazılmış; toplam süre yarışma sınırının içinde.
- [ ] **D2** Slaytlar
  - Test: `docs/evidence/slides.md` (bağlantı) + `pytest tests/delivery/test_demo.py::test_slides_evidence`
  - Kabul: Slaytlardaki her sayının kaynağı belirtilmiş.
- [ ] **D3** Demo videosu
  - Test: `docs/evidence/demo_video.md` (bağlantı + süre) + `pytest tests/delivery/test_demo.py::test_video_evidence`
  - Kabul: Video yarışma süre sınırına uyuyor.
- [ ] **D4** Prova kontrol listesi
  - Yap: `docs/evidence/rehearsal.md`: internet olmadan çalışma (önbellek), yedek kayıt videosu, açık alev yok.
  - Test: `pytest tests/delivery/test_demo.py::test_rehearsal`
  - Kabul: Bütün maddeler işaretli ve en az 1 tam prova yapılmış.
- [ ] **D5** Plan ve durum güncellemesi
  - Test: `pytest tests/delivery/test_plans.py`
  - Kabul: Bütün planlarda sayılar tutarlı.
- [ ] **D6** Herkese açık yayın (Streamlit Community Cloud)
  - Yap: Uygulamayı yayınla; bağlantıyı kök README'ye ve `docs/evidence/deploy.md`'ye yaz. Hesap ve depo bağlantısını ekip üyesi yapar.
  - Test: `pytest tests/delivery/test_demo.py::test_deploy_evidence`. Test, kanıt dosyasında bağlantı ve tarih olduğunu kontrol eder.
  - Kabul: Bağlantı tarayıcıda açılıyor; dört sayfa da çalışıyor (ekran görüntüleri kanıt dosyasında).
