# FLAME·FREEFALL — Microgravity Fire Safety Decision Support

NASA Space Apps Challenge 2026 · *Flame in Freefall* · BASS-II (PSI-25) dataset

```bash
pip install -r requirements.txt
streamlit run app/streamlit_app.py
```

## Mimari

```
src/                  Veri bilimi ekibi (özellik mühendisliği, CV, eğitim) — uygulama bunları doğrudan kullanır
app/
  i18n.py             EN / TR arayüz metinleri (tek sözlük) + t() / tv() / labeler()
  config.py           Tüm fiziksel sabitler, eşikler, fan kalibrasyonu, atmosfer senaryoları
  core/               Streamlit'ten bağımsız, test edilebilir iş mantığı
    physics.py        Olson U-eğrisi, gerilme hızı, Huggett HRR, sezgisel tutuşma/CO modelleri
    hardware.py       MSG fan Pot/Voltaj ↔ akış hızı (Restrictor 2)
    procedures.py     ISS Step 9.6 / 10.4 / 10.5 durum makinesi, GN2 hacim tahmini
    data.py           CSV yükleme, esnek kolon eşleme, birim tespiti, türetilmiş büyüklükler
    simulator.py      Gerçek veri gelene kadar fizik-bilgili 129 testlik sentetik arşiv
    models.py         models/ keşfi, joblib sözleşmesi, vekil model (src/cv + src/features)
    risk.py           Senaryo değerlendirme + çıkarım motoru (fizik + arşiv + model)
  ui/                 Tema, bileşenler, grafikler, önbellekli durum
  views/              Sayfalar
```

## Ekip dosyaları geldiğinde

| Dosya | Davranış |
|---|---|
| `data/processed/bass2_clean.csv` | Otomatik okunur; yoksa veya bozuksa simülasyona geri döner. |
| `models/*.joblib` / `*.pkl` | İlk çalışan model kullanılır; yoksa vekil RandomForest eğitilir. |

Model sözleşmesi ve şema raporu uygulamadaki **Veri & Model Durumu** sayfasındadır.
Önbellek dosya imzasıyla anahtarlandığı için yeniden başlatma gerekmez.

## Dil (EN / TR)

Varsayılan dil İngilizcedir; sol menünün en üstündeki **Language** seçicisiyle değişir.
Seçim URL'ye yazılır, Türkçe açılış bağlantısı: `http://localhost:8501/?lang=TR`.

- Yeni metin: `app/i18n.py` → `STRINGS["anahtar"] = ("English", "Türkçe")`, kodda `t("anahtar")`.
- `core/` metin üretmez; uyarılar ve çıkarımlar `(anahtar, parametreler)` döner, arayüz çevirir.
- Veri değerleri dilden bağımsız kodlardır (`burning`, `blowoff`, `sphere`…). Gerçek veride gelen
  serbest metin malzeme/geometri adları sözlükte yoksa olduğu gibi gösterilir.
