# Flame in Freefall — Sistem Mimarisi
NASA Space Apps 2026 · Hedef: PSI yanma verisinden uzay ve Dünya için yangın güvenliği içgörüsü

## 0. Genel Bakış

Üç objective, üç modül, tek ortak veri katmanı ve bir fiziksel ürün:

| Objective (yarışma metni) | Modül | Kullanıcıya verdiği cevap |
|---|---|---|
| 1. Habitat yangın güvenliği için en ilgili investigation'ları bul | **M1 – Keşif & Sıralama** | "Benim habitatım için hangi deneyler önemli, neden?" |
| 2. Tahminsel modellemeyi destekleyen veriyi çıkar | **M2 – Tahmin & Senaryo Motoru** | "Bu koşullarda yangın ne yapar? En yakın gerçek deney hangisi? Videosu?" |
| 3. Yeni nesil yangın güvenliği ekipmanına ışık tutan araştırmayı öne çıkar | **M3 – Ekipman İçgörüsü + FlameSense cihazı** | "Hangi bulgu hangi ekipmanı değiştirir?" + gerçek sensör ürünü |

```
                               PSI API (24 Combustion Science investigation)
                                              │
┌─────────────────────────────── ORTAK VERİ KATMANI ────────────────────────────────┐
│                                                                                   │
│  [Ingest]──►[Audit]──►[Harmonize]──►[Feature Store]──►[Metadata & Video Index]    │
│  psi_all.py  audit_csv  01_load_core  parquet+DuckDB   investigations, DOI, mp4   │
│                                                                                   │
└───────────┬───────────────────────────────┬───────────────────────────────┬───────┘
            ▼                               ▼                               ▼
   ┌─────────────────┐            ┌───────────────────┐           ┌───────────────────┐
   │ M1 Keşif &      │            │ M2 Tahmin &       │           │ M3 Ekipman        │
   │ Sıralama        │            │ Senaryo Motoru    │           │ İçgörüsü          │
   └────────┬────────┘            └─────────┬─────────┘           └─────────┬─────────┘
            │                               │  (modeller ONNX/C)            │
            │                               ├──────────────────────►┌───────┴────────┐
            │                               │                       │ FlameSense     │
            ▼                               ▼                       │ sensör cihazı  │
   ┌──────────────────────────────────────────────────┐   MQTT     └───────┬────────┘
   │ FastAPI Backend  (REST + WebSocket)              │◄───────────────────┘
   └────────────────────────┬─────────────────────────┘
                            ▼
   ┌──────────────────────────────────────────────────┐
   │ Web Dashboard: Keşif | Senaryo | Ekipman | Canlı │
   └──────────────────────────────────────────────────┘
```

---

## 1. Ortak Veri Katmanı (büyük kısmı HAZIR)

```
┌──────────┐   ┌──────────┐   ┌────────────┐   ┌───────────────┐   ┌──────────────────┐
│ Ingest   │──►│ Audit    │──►│ Harmonize  │──►│ Feature Store │──►│ Metadata & Video │
│          │   │          │   │            │   │               │   │ Index            │
└──────────┘   └──────────┘   └────────────┘   └───────────────┘   └──────────────────┘
```

| Blok | Girdi | İşlem | Çıktı | Teknoloji | Durum |
|---|---|---|---|---|---|
| Ingest | PSI API | 24 investigation'ın detail.json'u + tüm CSV/XLSX indirilir, Excel sayfaları CSV'ye çevrilir | `raw/`, `csv/`, `detail.json` | Python, requests | ✅ |
| Audit | `csv/` | MD5 kopya tespiti, bozuk satır, sentinel, zaman tutarlılığı | `audit/canonical_files.csv` (2487 dosya) | pandas | ✅ |
| Harmonize | kanonik dosyalar | Token→NaN+flag, birim normalizasyonu, kaynak izi (`psi_id, source_file, source_row`) | `analysis/data/*.parquet` (11 tablo) | pandas, pyarrow | ✅ |
| Feature Store | parquet | Sütun rolleri (feature / target / leakage / meta), birim kaydı, grup sütunları (day, pi, material) | `feature_catalog.csv` + DuckDB görünümleri | DuckDB | ✅ katalog, ⬜ DuckDB |
| Metadata & Video Index | detail.json'lar | Investigation, yayın, DOI, dosya tablosu; .mp4/.avi/.zip listesi ve test-ID eşleme | `meta.duckdb`: `investigations`, `publications`, `files`, `videos`, `test_video_map` | Python, DuckDB, regex | ⬜ |

**Kural:** Hiçbir modül `raw/` veya `csv/` klasörünü doğrudan okumaz. Her şey Feature Store ve Metadata katmanından geçer. Bu, sızıntı ve birim hatalarını tek bir noktada kontrol etmeyi sağlar.

---

## 2. M1 — Keşif & Sıralama (Objective 1)
> "Uzay aracı, istasyon, Ay/Mars üssü, basınçlı gezgin araç için en ilgili investigation'ları bul."

### 2.1 Pipeline

```
┌──────────────┐    ┌───────────────────┐    ┌─────────────────────┐
│ Metadata     │───►│ Koşul Zarfı       │───►│ Investigation       │
│ (24 inv.)    │    │ Çıkarımı          │    │ Profilleri          │
└──────────────┘    └───────────────────┘    └──────────┬──────────┘
┌──────────────┐    ┌───────────────────┐               │
│ Metin: amaç, │───►│ Embedding +       │───────────────┤
│ yaklaşım,    │    │ Vektör İndeksi    │               │
│ yayın, REPORT│    └───────────────────┘               ▼
└──────────────┘                              ┌─────────────────────┐   ┌──────────────┐
┌──────────────┐    ┌───────────────────┐     │ İlgililik Skorlama  │──►│ RAG Yorum    │
│ Kullanıcı:   │───►│ Habitat Profili   │────►│ (şeffaf bileşenler) │   │ (alıntılı)   │
│ habitat seç  │    │ (preset + ayar)   │     └─────────────────────┘   └──────┬───────┘
└──────────────┘    └───────────────────┘                                      ▼
                                                                      ┌──────────────────┐
                                                                      │ Dashboard: Keşif │
                                                                      └──────────────────┘
```

### 2.2 Bloklar

| Blok | Girdi | İşlem | Çıktı |
|---|---|---|---|
| **Koşul Zarfı Çıkarımı** | `analysis/data/*.parquet` | Her investigation için deney aralıkları: O2 (%), basınç (atm), seyreltici, yakıt/malzeme sınıfı (gaz, sıvı damlacık, katı-kumaş/PMMA…), akış hızı, yerçekimi (µg / 1g), olgu etiketleri (tutuşma, sönme, duman, söndürme, is). Tablo yoksa metinden LLM ile çıkarılır ve `source=text` olarak işaretlenir | `inv_envelope` tablosu |
| **Embedding + Vektör İndeksi** | Objectives, approach, impacts, yayın başlıkları, REPORT.md bulguları | ~300 token'lık parçalara bölme → embedding → indeks. Her parçada `psi_id`, `doi`, `section` tutulur | Vektör indeksi |
| **Habitat Profili** | Kullanıcı seçimi | Hazır profiller (alttaki tablo) + ayarlanabilir alanlar: yerçekimi, basınç, O2, havalandırma hızı, malzeme envanteri, kaygı duyulan senaryo (metin) | `habitat` nesnesi |
| **İlgililik Skorlama** | profil + zarf + indeks | 5 şeffaf bileşen (aşağıda), ağırlıklar dashboard'da slider olarak görünür | Sıralı liste + bileşen dökümü |
| **RAG Yorum** | ilk k investigation + indeks | LLM şunları yazar: "neden ilgili", "ana bulgular", "sınırlar". **Alıntı zorunluluğu:** her cümle bir parça ID'sine bağlanır; cevaptaki sayılar kaynakta yoksa cümle silinir | Kart metinleri |

**Habitat preset'leri** (değerler sunumdan önce kaynakla doğrulanmalı):

| Habitat | Yerçekimi | Basınç | O2 | Not |
|---|---|---|---|---|
| ISS | µg | ~1 atm | ~%21 | Verinin çoğu bu rejimde |
| Keşif aracı atmosferi | µg | düşük (ör. ~8.2 psia) | yüksek (ör. ~%34) | NASA'nın keşif atmosferi çalışmaları |
| Ay üssü | 0.166 g | habitata bağlı | habitata bağlı | **Kısmi yerçekimi verisi yok** → uyarı |
| Mars üssü | 0.38 g | habitata bağlı | habitata bağlı | **Kısmi yerçekimi verisi yok** → uyarı |
| Basınçlı gezgin araç | 0.166 / 0.38 g | düşük | yüksek | Dar hacim, kısıtlı havalandırma |

**Skor bileşenleri** (her biri 0–1 arası):

| Bileşen | Hesap |
|---|---|
| c₁ Atmosfer örtüşmesi | Habitat (O2, p) noktasının investigation zarfına normalize uzaklığı; zarfın içindeyse 1 |
| c₂ Malzeme / yakıt eşleşmesi | Habitat malzeme envanteri ile test edilen malzeme sınıfları arasında Jaccard benzerliği |
| c₃ Olgu eşleşmesi | Senaryo metni ile investigation metni arasındaki embedding kosinüs benzerliği |
| c₄ Yerçekimi uygunluğu | µg habitat → µg veri 1.0. Ay/Mars → µg ve 1g verisi yalnızca **aralığı sınırlar**, 0.5 + uyarı |
| c₅ Veri kullanılabilirliği | Experimental table var mı, test sayısı n, audit kalitesi, video var mı |

Skor = Σ wᵢ·cᵢ. Varsayılan ağırlıklar dokümante edilir ve kullanıcı bunları değiştirebilir. Skor bir "risk skoru" değil, şeffaf bir ilgililik sıralaması; her bileşen grafikte ayrı gösterilir.

### 2.3 Dashboard görünümü
- Sıralı investigation tablosu + bileşen çubukları (neden bu sırada?)
- **Zarf grafiği:** O2 × basınç düzleminde habitat noktası ve her investigation'ın kapsadığı bölge
- Investigation kartı: özet, bulgular, sınırlar, DOI, veri indirme bağlantısı, temsilî video

---

## 3. M2 — Tahmin & Senaryo Motoru (Objective 2)
> "Uzay keşfinde yanıcılık ve yangın senaryolarının tahminsel modellemesini destekleyen veriyi çıkar."

İki parçası var: (A) **modelleme için hazır veri setleri** (objective'in tam karşılığı) ve (B) bu veriyle eğitilmiş, belirsizliğini söyleyen **senaryo motoru**.

### 3.1 Pipeline

```
 OFFLINE (eğitim)
┌──────────────┐  ┌──────────────────┐  ┌────────────────────┐  ┌──────────────────┐
│ Feature Store│─►│ Modelleme Veri   │─►│ Eğitim & Doğrulama │─►│ Model Registry   │
│              │  │ Setleri + Kartı  │  │ (grup CV, conformal)│  │ model+kart+AD    │
└──────────────┘  └────────┬─────────┘  └────────────────────┘  └────────┬─────────┘
                           ▼                                             │
                  ┌──────────────────┐                                   │
                  │ Veri İndirme API │ ◄── araştırmacılar                │
                  └──────────────────┘                                   │
 ONLINE (çıkarım)                                                        ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐
│ Kullanıcı    │─►│ Aile         │─►│ Ön İşleme    │─►│ Tahmin + Conformal Aralık│
│ senaryosu    │  │ Yönlendirici │  │ (eğitimle    │  │ + Kapsam Dışı (AD) Testi │
└──────────────┘  └──────────────┘  │  aynı kod)   │  │ + Fizik Tutarlılık Testi │
                                    └──────┬───────┘  └────────────┬─────────────┘
                                           ▼                       │
                                  ┌──────────────────┐             │
                                  │ En Yakın Deney   │             │
                                  │ (Gower kNN)      │             │
                                  └────────┬─────────┘             │
                                           ▼                       ▼
                                  ┌──────────────────┐   ┌──────────────────────┐
                                  │ Video Eşleyici   │──►│ Senaryo Ekranı       │
                                  └──────────────────┘   └──────────────────────┘
```

### 3.2 Modelleme veri setleri (A)

| Veri seti | Kaynak | n | Hedefler | Grup sütunu | Not |
|---|---|---|---|---|---|
| `droplet` | FLEX + CFI | ~420 | test_end, K (mm²/s), burn_time, d_ext | fuel×diluent, yıl | d² yasası doğrulandı |
| `gas_flame` | ACME CFI-G | ~330 | hot_ignition, ext_mode, burn_time (sansürlü) | day | gün etkisi baskın |
| `smoke` | SAME/SAME-R flight | ~150 | amd_um, dusttrak_b | material | M0/M1 sızıntı, çıkarıldı |
| `solid_atm` | BASS-II | ~129 | ΔO2, ΔCO2, CO_final | pi | PI ve malzeme iç içe |

Her set şunlarla birlikte gelir: **veri kartı** (birimler, varsayımlar, sızıntı listesi, sansür bayrakları, DOI'ler) ve CSV/Parquet indirme. Bu, objective 2'nin doğrudan karşılığı: başka ekipler de bu temiz veriyle model kurabilir.

### 3.3 Modüller (B)

| Modül | Model | Fiziksel bileşen | Çıktı |
|---|---|---|---|
| Damlacık | test_end: CatBoost (sınıflandırma); K: LightGBM, monoton(x_o2 +) | **Hibrit:** ML K'yı tahmin eder, t_b = (d0² − d_ext²)/K | Sönme olasılığı, K, yanma süresi |
| Gaz alevi | hot_ignition: lojistik + CatBoost; burn_time: XGBoost `survival:aft` | Akış kesilen (FT) testler sağdan sansürlü | Tutuşma olasılığı, süre dağılımı |
| Duman | Ridge (log hedef) + CatBoost | malzeme her zaman feature (Simpson) | Beklenen parçacık çapı |
| Katı malzeme | Ridge / betimsel | stokiyometri kontrolü | O2 tüketimi, CO üretimi |

**Doğrulama:** GroupKFold; her modül bir fizik ve bir lineer baseline'la kıyaslanır. **Belirsizlik:** MAPIE jackknife+ ile %90 aralık.

### 3.4 Çıkarım blokları

| Blok | İşlem |
|---|---|
| **Aile Yönlendirici** | Senaryodaki yakıt tipine göre modül seçer: sıvı → damlacık, gaz → gaz alevi, katı → katı malzeme/duman. Belirsizse tümünü çalıştırıp yan yana gösterir |
| **Ön İşleme** | Eğitimdekiyle **aynı fonksiyon** (`preprocess.py`): birim dönüşümü, kategorik kodlama, kompozisyonel mol kesrinde denge gazının çıkarılması |
| **Kapsam Dışı (AD) Testi** | Eğitim verisine Mahalanobis veya kNN uzaklığı. Eşik aşılırsa "bu koşulda deney yok, tahmin güvenilmez" uyarısı. Kısmi yerçekimi (Ay/Mars) **her zaman** AD uyarısı verir |
| **Fizik Tutarlılık Testi** | Monotonluk (O2↑ → K azalmamalı), d² sınırı, negatif süre yok. İhlal olursa kırmızı bayrak |

### 3.5 En Yakın Deney + Video Eşleme (kullanıcının durumuna en yakın gerçek ISS deneyi)

**Offline: video indeksi oluşturma**
```
┌──────────────┐   ┌───────────────────┐   ┌────────────────────┐   ┌───────────────┐
│ detail.json  │──►│ Video dosyaları   │──►│ Test-ID çıkarımı   │──►│ test_video_map│
│ (added list) │   │ .mp4 .avi .zip    │   │ (aileye özel regex)│   │ + güven düzeyi│
└──────────────┘   └───────────────────┘   └────────────────────┘   └───────┬───────┘
                                                                            ▼
                                                                  ┌───────────────────┐
                                                                  │ Önizleme üretimi  │
                                                                  │ ffmpeg 15 sn, 640p│
                                                                  └───────────────────┘
```

| Adım | Detay |
|---|---|
| 1. Video listesi | `raw/<PSI>/detail.json` → uzantısı video olan dosyalar. **Hepsi indirilmez** (TB'larca veri); sadece adları ve boyutları alınır |
| 2. Test-ID eşleme | Her aile için regex. ACME: `\d{5}[A-Z]\d` (örn. `19115B1`; ham `_data.csv` adlarıyla aynı kod). FLEX: test numarası. BASS/BASS-II: test #/sample # veya GMT gün kodu. SAFFIRE: sample 1/2 |
| 3. Eşleşme düzeyi | `exact` (test ID) > `date` (aynı GMT günü) > `investigation` (temsilî video). Her eşleşme güven etiketiyle saklanır |
| 4. Elle kontrol | Rastgele 20 eşleşme gözle doğrulanır; doğruluk oranı raporlanır |
| 5. Önizleme | En sık kullanılacak testler için ffmpeg ile 15 sn'lik 640p klipler üretilir ve önbelleğe alınır |

**Online: sorgu anında**
```
Kullanıcı senaryosu ──► Ön işleme ──► Gower kNN (k=5, aynı aile, role=feature sütunları)
     ──► [test_id, benzerlik %, feature farkları] ──► test_video_map JOIN
     ──► önizleme varsa hemen göster │ yoksa backend PSI'den presigned URL ister (redirect=false)
     ──► HTML5 video oynatıcı + "neden benzer" açıklaması
```

- **Neden Gower uzaklığı:** Sayısal (O2, basınç) ve kategorik (yakıt, seyreltici) feature'ları birlikte ölçebiliyor. Sayısal feature'lar eğitim aralığına göre ölçeklenir.
- **Ekran metni örneği:** *"Senaryonuza en yakın gerçek ISS deneyi: ACME 19115B1 (%87 benzer). Fark: O2 sizde 2 puan daha yüksek. Bu deneyde alev 41 sn sonra kendiliğinden söndü."* + video + DOI.
- Eşleşme düzeyi `date` veya `investigation` ise bu ekranda açıkça yazılır: "Bu video aynı test gününe ait, birebir test olmayabilir."

---

## 4. M3 — Ekipman İçgörüsü + FlameSense (Objective 3)
> "Yeni nesil yangın güvenliği kontrol ve ekipmanlarına ışık tutan araştırmayı öne çıkar." + Dünya uygulamaları

İki parçası var: (A) **bulgu → ekipman** eşlemesi yapan bir içgörü motoru ve (B) bu bulguları ve M2 modellerini içine gömen gerçek bir sensör cihazı.

### 4.1 İçgörü motoru (A)

```
┌──────────────┐   ┌───────────────────┐   ┌──────────────────┐   ┌───────────────────┐
│ EDA bulguları│──►│ Bulgu Kartı       │──►│ Ekipman Sınıfı   │──►│ Dashboard:        │
│ + M2 model   │   │ Kaydı             │   │ Eşleme + M1      │   │ Ekipman merceği   │
│ sonuçları    │   │ (kanıt + güven)   │   │ sıralaması       │   │ + Dünya uyg.      │
└──────────────┘   └───────────────────┘   └──────────────────┘   └───────────────────┘
```

**Bulgu kartı şeması:** `iddia | sayı | kanıt (veri seti, n, istatistik, %95 GA) | DOI | güven (A/B/C) | ekipman sınıfı | habitat | Dünya uygulaması | sınırlar`

- Güven seviyesi: **A** = fiziksel olarak doğrulandı ve n yeterli; **B** = istatistiksel olarak güçlü; **C** = betimsel veya küçük n.

| Ekipman sınıfı | Bulgu (bizim analizden) | Ekipman çıkarımı | Dünya uygulaması | Güven |
|---|---|---|---|---|
| **Algılama** | Mikrogravitede piroliz dumanı medyan ~0.12–0.28 µm (malzemeye göre); ısıtıcı sıcaklığı arttıkça çap büyüyor (her malzemede) | Dedektör alt-mikron parçacıklara duyarlı olmalı; tek bir eşik her malzemeye uymaz | Ev ve endüstriyel duman dedektörleri | B |
| **Söndürme** | FLEX: CO2 seyreltici K'yı düşürüyor, sönme O2'ye güçlü bağlı (η=0.58) | Gazlı inertleme ajanı seçimi ve dozu | Gazlı söndürme sistemleri (veri merkezi, arşiv) | A |
| **Atmosfer kontrolü** | ACME: O2 arttıkça alev daha uzun yanıyor, kendiliğinden sönme azalıyor | Yüksek O2'li keşif atmosferlerinde O2 üst sınırı ve izleme | O2 ile zenginleştirilmiş ortamlar (hastane, evde oksijen tedavisi) | B |
| **Malzeme seçimi** | BASS-II: O2 tüketimi geometriye bağlı (PMMA levha ≫ film ≫ kumaş) | Kabin malzemesi ve kalınlık seçimi | Bina ve araç iç malzeme standartları | B |
| **Havalandırma** | ACME-inverse: akış kesildiğinde (FT) alev davranışı değişiyor; BASS: akış yönü (concurrent/opposed) | Yangın anında havalandırma kontrol mantığı | Denizaltı, maden, uçak kabini | C |

**Veri boşlukları kartları** (dürüstlük için zorunlu): su sisi (water mist) verisi indirilen setlerde yok; kısmi yerçekimi verisi yok; mikrogravitede ölçülmüş yayılma hızı tablosu yok.

### 4.2 FlameSense — gerçek sensör cihazı (B)

**Fikir:** PSI deneylerinin ölçtüğü değişkenleri (O2, basınç, CO2, CO, akış, duman, radyasyon) kabinde gerçek zamanlı ölçen bir cihaz. İçine M2 modelleri gömülü. İki soruyu aynı anda cevaplar:
1. **"Şu an yangın çıksa ne kadar kötü olur?"** Ortam şiddeti; yavaş döngüde, PSI modelleriyle.
2. **"Şu an bir yangın başlıyor mu?"** Erken tespit; hızlı döngüde, SAFFIRE ve SAME-R'den öğrenilen imzalarla.

```
┌───────────────────────── FlameSense Düğümü ─────────────────────────────────────────┐
│                                                                                     │
│ ┌────────────┐   ┌──────────────┐   ┌──────────────────┐                            │
│ │ Sensörler  │──►│ ESP32-S3     │──►│ Feature Çıkarımı │                            │
│ │ (8 kanal)  │   │ toplama 1-10Hz│   │ 10 s / 60 s pencere│                         │
│ └────────────┘   └──────────────┘   └────────┬─────────┘                            │
│                                              │                                      │
│                    ┌─────────────────────────┴──────────────────────┐               │
│                    ▼                                                ▼               │
│        ┌───────────────────────────┐                ┌───────────────────────────┐   │
│        │ Ortam Şiddeti Motoru      │                │ Erken Tespit Motoru       │   │
│        │ (yavaş, 1/dk)             │                │ (hızlı, 1 Hz)             │   │
│        │ PSI modelleri (ONNX/C)    │                │ CUSUM/EWMA + kural seti   │   │
│        │ + AD testi                │                │ (SAFFIRE/SAME-R imzaları) │   │
│        └─────────────┬─────────────┘                └─────────────┬─────────────┘   │
│                      └──────────────────┬─────────────────────────┘                 │
│                                         ▼                                           │
│                          ┌───────────────────────────┐   ┌──────────────────────┐   │
│ Konfigürasyon ─────────► │ Alarm Mantığı (matris)    │──►│ LED / buzzer / OLED  │   │
│ (malzeme envanteri,      └─────────────┬─────────────┘   └──────────────────────┘   │
│  habitat profili)                      │                                            │
└────────────────────────────────────────┼────────────────────────────────────────────┘
                                         ▼ MQTT (telemetry / severity / alerts)
                              ┌──────────────────────┐     ┌─────────────────────────┐
                              │ Backend (FastAPI)    │────►│ Dashboard: Canlı panel  │
                              └──────────────────────┘     └─────────────────────────┘
```

**Sensör → PSI değişkeni eşlemesi** (cihazın her kanalı bir PSI verisine bağlı; parça adları örnek):

| Ölçüm | Örnek sensör | PSI karşılığı | Kullanıldığı yer |
|---|---|---|---|
| O2 | LuminOx (optik) veya elektrokimyasal O2 | x_o2 (FLEX, CFI, ACME), O2 (BASS-II) | Şiddet motoru |
| CO2 | Sensirion SCD41 (NDIR) | x_co2 seyreltici (FLEX), ΔCO2 (BASS-II) | Şiddet + tespit |
| CO | Elektrokimyasal CO | CO_final (BASS-II) | Tespit |
| Basınç, sıcaklık, nem | Bosch BME280 / BME688 | p_atm, ortam | Şiddet |
| Hava akışı | Sıcak tel anemometre (ör. Modern Device Wind Sensor) | inlet velocity (SAME), akış (BASS, SAFFIRE) | Şiddet + havalandırma |
| Duman / parçacık | Sensirion SPS30 + iyonizasyon kanalı | DustTrak / P-Trak (SAME-R) | Tespit |
| Isıl radyasyon / alev | MLX90640 termal dizi veya UV alev sensörü | SAFFIRE radyometreleri | Tespit |
| İvme | IMU | yerçekimi rejimi | AD testi |

> **Veriden çıkan bir tasarım kararı:** SAME-R dumanı medyan ~0.12–0.28 µm. SPS30 gibi optik PM sensörleri yaklaşık 0.3 µm'nin altını iyi göremez. Bu yüzden alt-mikron parçacıklara daha duyarlı bir iyonizasyon kanalı eklemek gerekiyor. Bu bulguyu jüriye "PSI verisi cihaz tasarımımızı değiştirdi" diye anlatabilirsiniz.

**Bloklar:**

| Blok | Girdi | İşlem | Çıktı |
|---|---|---|---|
| Toplama | sensörler | ESP32-S3, 1–10 Hz örnekleme, zaman damgası, sensör sağlık kontrolü | ham akış |
| Feature Çıkarımı | ham akış | 10 sn ve 60 sn kayan pencerelerde seviye, eğim, tabandan sapma, eşik üstü süre, AUC. **EDA'nın Faz 6'sında SAFFIRE için tanımlanan feature'larla aynı**; böylece veri ile cihaz tutarlı | feature vektörü |
| Ortam Şiddeti Motoru | O2, p, CO2, akış + malzeme envanteri | Envanterdeki her yakıt/malzeme sınıfı için M2 modelleri çalışır: sönme olasılığı, K, yanma süresi, beklenen duman çapı. AD testi kapsam dışı koşulları işaretler | şiddet seviyesi + gerekçe |
| Erken Tespit Motoru | feature vektörü | CO, parçacık sayısı ve IR kanallarında CUSUM/EWMA değişim tespiti. Kurallar SAFFIRE olay tespitinden (ateşleme, pik, sönme) ve SAME-R malzeme imzalarından türetilir | Normal / Ön-yangın (piroliz) / Yangın |
| Alarm Mantığı | şiddet × tespit | **Şeffaf, dokümante edilmiş matris** (aşağıda). Uydurma bir skor değil | aksiyon önerisi |
| Haberleşme | tüm çıktılar | MQTT topic'leri: `flamesense/<id>/telemetry`, `/severity`, `/alerts` | dashboard |

**Alarm matrisi:**

| Tespit ↓ \ Şiddet → | Düşük | Orta | Yüksek |
|---|---|---|---|
| Normal | izle | izle + O2 uyarısı | O2 düşürme önerisi |
| Ön-yangın (piroliz) | yerel uyarı | ekibe uyarı + kaynağı kontrol et | ekibe alarm + havalandırmayı kes |
| Yangın | alarm | alarm + söndürme | alarm + söndürme + tahliye |

> Mikrogravitede havalandırma alevi besler (BASS bulguları ve mikrogravite yanma literatürüyle tutarlı). Bu yüzden "havalandırmayı kes" uzay için mantıklı bir aksiyon. Dünya modunda bu satır bina kurallarına göre değiştirilir.

**Model dağıtımı:**
```
Bulut eğitimi ─► export (CatBoost → ONNX/C++, XGBoost/LightGBM → treelite veya m2cgen C)
             ─► conformal kantiller + AD istatistikleri (JSON) ─► OTA güncelleme ─► cihaz
```
- ESP32 üzerinde: m2cgen ile C koduna çevrilmiş küçük ağaç modelleri.
- Daha büyük modeller için: düğümde bir Raspberry Pi 5 + ONNX Runtime.

**Demo planı (güvenli):**
1. **Hardware-in-the-loop:** SAFFIRE-III telemetrisi gerçek sensör akışıymış gibi cihaza oynatılır. Cihaz ateşleme, pik ve sönmeyi canlı olarak tespit eder.
2. **Canlı sensörler zararsız uyaranlarla:** Nefes CO2'yi yükseltir, el sıcaklığı IR kanalını tetikler. Şiddet paneli O2 ve basınç değiştikçe güncellenir; preset habitatlar arasında geçiş yapılır.
3. **Açık alev kullanmayın.** Etkinlik alanının kurallarına uyun.

**Dünya modu:** Aynı cihaz, aynı yazılım, farklı preset: denizaltı, maden, uçak kabini (SAFFIRE'ın kendi "Earth benefits" metninde geçen ortamlar), O2 ile zenginleştirilmiş hastane odası, kapalı endüstriyel alan.

---

## 5. Teknoloji Yığını

| Katman | Teknoloji | Neden |
|---|---|---|
| Veri | Python, pandas, pyarrow (Parquet), DuckDB | Mevcut script'lerle uyumlu, sunucusuz ve hızlı SQL |
| ML | scikit-learn, CatBoost, XGBoost (`survival:aft`), LightGBM, MAPIE, SHAP | Küçük tablo verisi, sansür, kategorikler, belirsizlik |
| Metin / RAG | sentence-transformers (lokal embedding), FAISS veya Chroma, LLM API (ör. Claude) | Alıntı zorunlu, kontrollü cevap |
| Backend | FastAPI (REST + WebSocket), Mosquitto (MQTT) | Hızlı geliştirme, cihaz bağlantısı |
| Dashboard | MVP için Streamlit; zaman kalırsa Next.js + Plotly | Hız ve görsel kalite dengesi |
| Video | PSI presigned URL (lazy), ffmpeg önizleme klipleri, HTML5 oynatıcı | TB'larca veri indirmeden video göstermek |
| Edge | ESP32-S3 (MicroPython/Arduino) + isteğe bağlı Raspberry Pi 5, ONNX Runtime, m2cgen/treelite | Düşük güç, gerçek cihaz |
| Tekrarlanabilirlik | `run_all.sh`, model kartları (JSON/MD), veri kartları, GitHub | Jüri incelemesi |

---

## 6. Dürüstlük ve Sınırlar (her ekranda görünür)

- Veri µg ve 1g rejimlerinden geliyor; **Ay ve Mars kısmi yerçekimi tahminleri kapsam dışı** olarak işaretlenir.
- Laboratuvar ölçeğinden kabin ölçeğine geçiş belirsiz; büyük ölçekli SAFFIRE verisi yalnızca 2–15 numune.
- Yayılma hızı tahmini yapılmaz; mikrogravitede ölçülmüş bir tablo yok.
- Su sisi verisi yok; söndürme içgörüleri yalnızca gazlı seyrelticilere dayanıyor.
- FlameSense bir prototip, sertifikalı bir güvenlik cihazı değil.
- Tüm veri kaynaklarına DOI ile atıf yapılır (PSI zorunluluğu).

---

## 7. Uygulama Sırası

| # | İş | Bağlı olduğu |
|---|---|---|
| 1 | Metadata DB + video indeksi | Ortak katman |
| 2 | M2 damlacık + gaz alevi modelleri + conformal + AD | Feature Store |
| 3 | M2 senaryo ekranı + en yakın deney + video | 1, 2 |
| 4 | M1 skorlama + zarf grafiği + RAG kartları | 1 |
| 5 | M3 bulgu kartları + ekipman merceği | EDA, 2 |
| 6 | FlameSense: sensör okuma → MQTT → canlı panel → telemetri replay | 2 (export) |
| 7 | Sunum, video, model ve veri kartları | hepsi |