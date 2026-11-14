# FLAME·FREEFALL — Mikrogravite Yangın Güvenliği

**NASA Space Apps Challenge 2026 · "Flame in Freefall"**

NASA PSI (Physical Science Informatics) yanma deneylerinden uzay habitatları ve Dünya için yangın güvenliği içgörüsü üretiyoruz.
Veri: 24 Combustion Science investigation (ACME, FLEX, CFI, BASS-II, SAME/SAME-R, SAFFIRE…).

| Yarışma hedefi | Modül | Durum |
|---|---|---|
| Habitat için en ilgili investigation'ları bul | **M1 — Keşif & Sıralama** | 📋 Planlandı |
| Tahminsel modellemeyi destekleyen veriyi çıkar | **M2 — Tahmin & Senaryo Motoru** | 📋 Planlandı |
| Yeni nesil yangın güvenliği ekipmanına ışık tut | **M3 — Ekipman İçgörüsü** + **FlameSense** sensör cihazı | 📋 Planlandı |
| Ortak veri katmanı (temizlenmiş tablolar, EDA) | `data_analysis/` | ✅ EDA tamamlandı |
| Karar destek arayüzü (BASS-II, MVP) | `app/` | ✅ Çalışıyor |

## Hızlı başlangıç

```bash
git clone https://github.com/sametozantopcu/flame-freefall-iss.git
cd flame-freefall-iss
pip install -r requirements.txt
streamlit run app/streamlit_app.py      # http://localhost:8501  (Türkçe: ?lang=TR)
```

Sadece bir konu üzerinde çalışacaksanız tüm ortamı kurmanız gerekmez:
`pip install -r plans/<konu>/requirements.txt`

## Dokümanlar

| Doküman | İçerik |
|---|---|
| [Architecture.md](Architecture.md) | Sistem mimarisi: veri katmanı, M1/M2/M3, FlameSense, teknoloji yığını |
| [plans/](plans/README.md) | Konu bazlı iş planları: adımlar, testler, ilerleme durumu |
| [data_analysis/Nasa_data/analysis/REPORT.md](data_analysis/Nasa_data/analysis/REPORT.md) | Keşifsel veri analizi raporu (bulgular, hedef adayları, model önerileri) |
| [data_analysis/Nasa_data/README.md](data_analysis/Nasa_data/README.md) | Veri indirme, denetim ve analiz pipeline'ı |
| [CLAUDE.md](CLAUDE.md) | Ekip ve Claude için çalışma kuralları |

## Repo yapısı

```
├── Architecture.md          sistem mimarisi
├── plans/                   konu bazlı planlar (00 veri katmanı … 06 teslim)
├── data_analysis/Nasa_data/
│   ├── ingest/              PSI API'den indirme ve denetim script'leri
│   ├── audit/               veri denetimi çıktıları
│   └── analysis/            EDA: scripts/, data/*.parquet, outputs/, figures/, REPORT.md
├── app/                     Streamlit arayüzü (BASS-II MVP)
│   ├── core/                Streamlit'ten bağımsız iş mantığı (fizik, veri, model, risk)
│   ├── ui/                  tema, bileşenler, grafikler
│   └── views/               sayfalar
└── requirements.txt         uygulama ortamı
```

> `raw/` ve `csv/` (~8 GB ham PSI verisi) git'te yoktur. Temizlenmiş tablolar `analysis/data/*.parquet` içinde.
> Ham veriyi yeniden indirmek için: [data_analysis/Nasa_data/README.md](data_analysis/Nasa_data/README.md).

## Nasıl katkı verilir

1. [plans/README.md](plans/README.md) dosyasından çalışacağınız konuyu seçin. O konunun `PLAN.md` dosyasında **Durum** bölümünü okuyun.
2. Bağımlılıkları tamamlanmış ilk işaretsiz adımı alın.
3. Adımın testini yazın ve geçirin. Sonra kutuyu işaretleyip altına kanıt satırını ekleyin.
4. Değişmez kurallar:
   - Ham veri (`raw/`, `csv/`) değiştirilmez.
   - Eksik değerler 0 ile doldurulmaz.
   - Modeller grup bazlı doğrulanır.

## Öne çıkan EDA bulguları

- **d² yasası doğrulandı:** FLEX damlacıklarında yanma süresi ∝ d0^2.13 (%95 GA 1.76–2.52; teori 2).
- **Stokiyometri tutarlı:** BASS-II PMMA için ölçülen ΔCO₂/ΔO₂ = −0.80 (teorik −0.83).
- **Simpson paradoksu:** Dumanda ısıtıcı sıcaklığı ile parçacık çapı genel olarak negatif ilişkili, her malzemenin içinde ise pozitif. Bu yüzden malzeme her modelde zorunlu feature.
- **Mikrogravite dumanı alt-mikron:** Medyan parçacık çapı ~0.12–0.30 µm. Optik PM sensörleri bu boyutu iyi göremez; bu bulgu FlameSense tasarımını etkiledi.

Detaylar: [REPORT.md](data_analysis/Nasa_data/analysis/REPORT.md)

## Uygulama (app/) notları

<details>
<summary>Veri ve model dosyaları, dil desteği</summary>

| Dosya | Davranış |
|---|---|
| `data/processed/bass2_clean.csv` | Otomatik okunur. Yoksa veya bozuksa uygulama simülasyona geri döner. |
| `models/*.joblib` / `*.pkl` | Çalışan ilk model kullanılır. Hiç model yoksa vekil bir RandomForest eğitilir. |

- Model sözleşmesi ve şema raporu uygulamadaki **Veri & Model Durumu** sayfasındadır.
- Önbellek dosya imzasıyla anahtarlandığı için yeni dosya eklenince yeniden başlatma gerekmez.
- **Dil:** Varsayılan dil İngilizcedir. Sol menüdeki **Language** seçicisiyle değiştirilebilir (Türkçe bağlantı: `?lang=TR`).
  - Yeni metin eklemek için: `app/i18n.py` → `STRINGS["anahtar"] = ("English", "Türkçe")`, kodda `t("anahtar")`.
  - `core/` katmanı kullanıcıya gösterilen metin üretmez; `(anahtar, parametreler)` döndürür, çeviriyi arayüz yapar.

</details>

## Veri kaynağı ve atıf

Bütün veriler [NASA PSI](https://psi.nasa.gov) kaynağından alınmıştır. Her investigation, kendi DOI'siyle atıflanmalıdır (PSI kullanım şartı).
DOI listesi: `plans/06_delivery` → C1 (planlandı).
