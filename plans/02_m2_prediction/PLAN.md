# 02 — M2: Tahmin & Senaryo Motoru (Objective 2)

Mimari: [Architecture.md §3](../../Architecture.md) · Kod: `src/prediction/`, `models/` · Testler: `tests/prediction/`

## Durum

- **İlerleme:** 0 / 29
- **Son güncelleme:** 2026-11-14
- **Sıradaki adım:** A1 (önce 00/C5 tamamlanmalı)
- **Açık sorunlar:**
  - Smoke ground eşlemesi doğrulanmadı. Bu yüzden smoke modeli yalnızca flight verisiyle kurulur (A1).
  - FLEX'te Extinction/Disruption ile biten testlerin yanma süresi kesilmiş; Completion testleriyle aynı şekilde modellenemez (D3).

## Hedef

1. **(A)** Başka ekiplerin de kullanabileceği temiz modelleme veri setleri ve veri kartları.
2. **(B)** Belirsizliğini, kapsam dışı uyarısını ve fizik tutarlılığını söyleyen bir senaryo motoru.
3. Kullanıcıya en yakın gerçek ISS deneyini gösterme (video yok: her deneyin videosu bulunmuyor, iptal 2026-11-14).

**Kurallar:**
- Doğrulama her zaman grup bazlı yapılır (GroupKFold).
- Her model hem bir fizik baseline'ıyla hem bir lineer baseline'la kıyaslanır.
- Leakage listesi `00/C4` ile otomatik uygulanır.

---

## Faz A — Modelleme veri setleri (Objective 2'nin doğrudan karşılığı)

- [ ] **A1** Dört veri setini üret
  - Yap: Setler `data/modeling/` altına yazılır:
    - `droplet` (FLEX + CFI, ortak sütun adları)
    - `gas_flame` (ACME CFI-G)
    - `smoke` (yalnızca flight)
    - `solid_atm` (BASS-II)
  - Test: `pytest tests/prediction/test_datasets.py::test_build`
  - Kabul:
    - Hiçbir sette leakage sütunu yok.
    - İz sütunları ve grup sütunu dolu.
    - Satır sayıları `target_candidates.csv` ile tutarlı.
- [ ] **A2** Sansür bayrakları
  - Yap:
    - `gas_flame`: `burn_time_censored` (FT testleri = sağdan sansürlü).
    - `droplet`: `burn_time_truncated` (test_end ≠ Completion).
  - Test: `pytest tests/prediction/test_datasets.py::test_censor_flags`
  - Kabul: Bayrak sayıları EDA sayılarıyla eşit.
- [ ] **A3** Veri kartları (`.md` + `.json`)
  - Yap: Her kartta şunlar olsun: sütun birimleri, `assumptions.md` içindeki ilgili maddeler, leakage listesi, sansür bilgisi, DOI'ler, satır sayısı, veri hash'i.
  - Test: `pytest tests/prediction/test_datasets.py::test_cards`
  - Kabul: JSON şeması doğrulanıyor; her sütunun bir birimi var (bilinmiyorsa `unit_unknown`); hash dosyayla eşleşiyor.
- [ ] **A4** CSV ve Parquet indirme dosyaları
  - Yap: Her set için aynı içerikte CSV ve Parquet dosyası üret.
  - Test: `pytest tests/prediction/test_datasets.py::test_formats`
  - Kabul: CSV ve Parquet içerikleri eşit (dtype farkları tolere edilir).

## Faz B — Ortak ön işleme (`preprocess.py`)

- [ ] **B1** Dönüşümler
  - Yap: Birim dönüşümü, kategorik kodlama ve kompozisyonel mol kesirlerinde denge gazının (`x_n2`) çıkarılması.
  - Test: `pytest tests/prediction/test_preprocess.py::test_transform`
  - Kabul: Mol kesri toplamı kontrolü yapılıyor; çıktıda `x_n2` yok; bilinmeyen kategori hata vermeden "other" oluyor.
- [ ] **B2** Eğitim ve çıkarım aynı kodu kullanır
  - Yap: `fit` ile durum (state) saklanır; çıkarımda aynı state ile `transform` yapılır.
  - Test: `pytest tests/prediction/test_preprocess.py::test_roundtrip`
  - Kabul: Kaydet → yükle sonrası çıktılar birebir aynı.
- [ ] **B3** Eksik değer politikası
  - Yap: Ağaç modellerinde NaN olduğu gibi kalır. Lineer modellerde medyan imputasyonu ve bir eksiklik göstergesi kullanılır. **0 ile doldurma yok.**
  - Test: `pytest tests/prediction/test_preprocess.py::test_missing`
  - Kabul: Hiçbir imputasyon sabiti 0 değil (sütunun medyanı gerçekten 0 olmadıkça).

## Faz C — Doğrulama çerçevesi

- [ ] **C1** Grup bölücüler
  - Yap: Grup sütunları:
    - droplet: fuel×diluent
    - gas_flame: day
    - smoke: material
    - solid_atm: pi
    Sınıflandırma için StratifiedGroupKFold kullan.
  - Test: `pytest tests/prediction/test_cv.py::test_no_group_leak`
  - Kabul: Hiçbir grup aynı anda hem train hem test tarafında yok.
- [ ] **C2** Baseline'lar
  - Yap:
    - Fizik baseline'ı: yanma süresi için d² yasası; K için yakıt ortalaması.
    - Lineer baseline: Ridge veya lojistik regresyon.
    - Çoğunluk sınıfı baseline'ı.
  - Test: `pytest tests/prediction/test_cv.py::test_baselines`. Sentetik veride bilinen sonuçlar kontrol edilir.
  - Kabul: d² baseline'ı sentetik veride gerçek K değerini %1 hatayla buluyor.
- [ ] **C3** Metrikler ve değerlendirme raporu
  - Yap:
    - Regresyon: MAE, RMSE, MdAPE.
    - Sınıflandırma: ROC-AUC, PR-AUC, balanced accuracy, Brier, macro-F1.
    - Rapor `models/<model>/eval.md` dosyasına yazılır.
  - Test: `pytest tests/prediction/test_cv.py::test_report`
  - Kabul: Rapor her katlama (fold) ve baseline için satır içeriyor.

## Faz D — Modeller

Her adımda "Kabul" kısmına şu şart da dahildir: **grup CV sonucu `eval.md` dosyasına yazıldı ve baseline'larla kıyaslandı.**
Baseline geçilemezse adım yine tamamlanabilir, ama bu durum dürüstçe raporlanır ve Durum bölümüne not edilir.

- [ ] **D1** Damlacık `test_end`: CatBoost sınıflandırıcı
  - Test: `pytest tests/prediction/test_models.py::test_droplet_test_end`
  - Kabul: Olasılıkların toplamı 1; 3 sınıf; fixture verisinde eğitim çalışıyor.
- [ ] **D2** Damlacık `K`: LightGBM, `x_o2` için monoton artan kısıt
  - Test: `pytest tests/prediction/test_models.py::test_droplet_k_monotone`
  - Kabul: Diğer feature'lar sabitken `x_o2` arttıkça tahmin hiçbir zaman azalmıyor (100 noktalık ızgara).
- [ ] **D3** Hibrit yanma süresi: t_b = (d0² − d_ext²) / K
  - Test: `pytest tests/prediction/test_models.py::test_hybrid_tb`
  - Kabul: Elle hesaplanan değerlerle eşleşiyor; t_b > 0; d_ext ≥ d0 olursa uyarı veriliyor.
- [ ] **D4** Gaz alevi `hot_ignition`: lojistik regresyon + CatBoost, day grubuyla
  - Test: `pytest tests/prediction/test_models.py::test_gas_ignition`
  - Kabul: Olasılıklar [0, 1] içinde; Brier skoru hesaplanıyor; sınıf ağırlığı uygulanıyor.
- [ ] **D5** Gaz alevi `burn_time`: XGBoost `survival:aft`
  - Yap: FT testleri sağdan sansürlü olarak modellenir.
  - Test: `pytest tests/prediction/test_models.py::test_gas_aft_labels`
  - Kabul:
    - SE testlerinde alt sınır = üst sınır.
    - FT testlerinde üst sınır = +∞.
    - Tahminler pozitif.
- [ ] **D6** Duman `amd_um`: Ridge (log hedef) + CatBoost
  - Yap: `material` her zaman feature olarak kalır (Simpson paradoksu nedeniyle).
  - Test: `pytest tests/prediction/test_models.py::test_smoke_material_forced`
  - Kabul: Feature listesinden `material` çıkarılmaya çalışılırsa hata veriliyor; yalnızca flight verisi kullanılıyor.
- [ ] **D7** Katı malzeme: Ridge veya betimsel model + stokiyometri kontrolü
  - Test: `pytest tests/prediction/test_models.py::test_solid_stoich`
  - Kabul: PMMA tahminlerinden çıkan ΔCO2/ΔO2 oranı [−0.95, −0.70] içinde.

## Faz E — Belirsizlik, kapsam dışı (AD) ve fizik testleri

- [ ] **E1** Conformal aralıklar (MAPIE, jackknife+ / CV+, grup bazlı)
  - Test: `pytest tests/prediction/test_uncertainty.py::test_coverage`
  - Kabul: Dışarıda tutulan gruplarda %90 aralığın ampirik kapsaması [0.85, 0.95] içinde. Dışındaysa rapora yazılır.
- [ ] **E2** AD testi: kNN uzaklığı
  - Yap: Eşik, eğitim verisindeki uzaklıkların 95. persentili olsun.
  - Test: `pytest tests/prediction/test_uncertainty.py::test_ad`
  - Kabul:
    - Eğitim noktası kapsam içi.
    - Uzak bir nokta kapsam dışı.
    - Ay/Mars yerçekimi her zaman kapsam dışı.
- [ ] **E3** Fizik tutarlılık denetleyicisi
  - Yap: Kurallar: O2 artarken K azalmamalı, d² sınırına uyulmalı, negatif süre olmamalı.
  - Test: `pytest tests/prediction/test_uncertainty.py::test_physics_checks`
  - Kabul: Her kural için yapay olarak hazırlanmış bir ihlal kırmızı bayrak üretiyor.

## Faz F — Model kayıt defteri (registry)

- [ ] **F1** Model ve model kartı
  - Yap: `models/<ad>/` altına şunları kaydet: model dosyası, preprocess state, AD istatistikleri, conformal kantilleri, `card.json`.
    Kartta veri hash'i, feature listesi, CV şeması, metrikler ve tarih olsun.
  - Test: `pytest tests/prediction/test_registry.py::test_roundtrip`
  - Kabul: Yükle → tahmin et sonuçları eğitimdeki tahminlerle birebir aynı; kartta zorunlu alanların hepsi var.
- [ ] **F2** Mevcut uygulamayla uyumluluk
  - Yap: `app/core/models.py` dosyasındaki joblib sözleşmesine uyan bir adaptör yaz.
  - Test: `pytest tests/prediction/test_registry.py::test_app_contract`
  - Kabul: Uygulama modeli keşfediyor ve vekil RandomForest'a geri dönmüyor.
- [ ] **F3** `predict(scenario) -> Prediction` fonksiyonu
  - Yap: Aile yönlendirici (sıvı → damlacık, gaz → gaz alevi, katı → katı malzeme/duman; belirsiz → hepsi) + ön işleme + tahmin + aralık + AD + fizik testi.
  - Test: `pytest tests/prediction/test_api.py::test_predict`
  - Kabul: Dönen nesnede tahmin, aralık, `ad_warning` ve `physics_flags` var; belirsiz yakıt verilince tüm aileler dönüyor.

## Faz G — En yakın deney (video kısmı iptal)

- [ ] **G1** Gower uzaklığı
  - Test: `pytest tests/prediction/test_knn.py::test_gower`
  - Kabul:
    - d(x, x) = 0.
    - Simetrik.
    - Sonuç [0, 1] içinde.
    - Kategorik uyuşmazlık uzaklığı artırıyor.
    - Sayısal feature'lar eğitim aralığına göre ölçekleniyor.
- [ ] **G2** kNN (k=5, aynı aile içinde, yalnızca `role=feature` sütunları)
  - Test: `pytest tests/prediction/test_knn.py::test_neighbors`
  - Kabul: Sonuçta test_id, benzerlik yüzdesi ve feature farkları var; başka aileden komşu dönmüyor.
- ~~[ ] **G3** `test_video_map` ile birleştirme~~ — **İPTAL (2026-11-14):** video özelliği kapsam dışı: her deneyin videosu yok (00/E2–E5 de iptal)
  - ~~Test: `pytest tests/prediction/test_knn.py::test_video_join`~~
  - ~~Kabul: Eşleşme düzeyi (`exact` / `date` / `investigation`) sonuçta görünüyor; video yoksa `null` dönüyor ve hata vermiyor.~~
- ~~[ ] **G4** Önizleme klipleri (ffmpeg, 15 sn, 640p)~~ — **İPTAL (2026-11-14):** video özelliği kapsam dışı: her deneyin videosu yok (00/E2–E5 de iptal)
  - ~~Test: `pytest tests/prediction/test_preview.py`. ffmpeg `lavfi` ile üretilen 30 sn'lik bir test videosu kullanılır.~~
  - ~~Kabul: Çıktı ≤ 15 sn ve 640p; aynı girdi ikinci kez önbellekten geliyor.~~
- ~~[ ] **G5** PSI presigned URL (lazy, `redirect=false`)~~ — **İPTAL (2026-11-14):** video özelliği kapsam dışı: her deneyin videosu yok (00/E2–E5 de iptal)
  - ~~Test: `pytest tests/prediction/test_preview.py::test_presigned`. HTTP mock'lanır.~~
  - ~~Kabul: Doğru istek gönderiliyor; hata durumunda kullanıcıya anlaşılır bir mesaj dönüyor.~~
- [ ] **G6** "Neden benzer" açıklama metni
  - Test: `pytest tests/prediction/test_knn.py::test_explanation`
  - Kabul:
    - Metinde test ID, benzerlik yüzdesi ve en büyük feature farkı geçiyor.
    - (Eşleşme düzeyi/video uyarısı iptal: video işi kapsam dışı, 2026-11-14.)

## Faz H — Kapanış

- [ ] **H1** Tek komutla eğitim
  - Yap: `python -m src.prediction.train_all` komutu A → F adımlarını çalıştırsın (`random_state=42`).
  - Test: `pytest tests/prediction/test_train_all.py -m slow`
  - Kabul: Komut hatasız bitiyor; iki çalıştırmada model kartlarındaki metrikler aynı.
- [ ] **H2** Model export'u (FlameSense için, 04/E1'in girdisi)
  - Yap: Ağaç modellerini m2cgen ile C koduna, CatBoost modellerini ONNX'e çevir.
  - Test: `pytest tests/prediction/test_export.py`
  - Kabul: Export edilen modellerle Python modelleri arasındaki tahmin farkı 1e-4'ün altında (100 örnek).
- [ ] **H3** Plan ve durum güncellemesi
  - Test: `pytest tests/prediction/test_plan_status.py`
  - Kabul: Sayılar tutarlı.
