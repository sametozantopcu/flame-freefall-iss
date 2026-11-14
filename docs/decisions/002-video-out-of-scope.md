# 002 — Video işi kapsam dışı

- **Durum:** Kabul edildi (sohbette sözlü onay, 2026-11-14). Ekip toplantısında teyit edilmeli.
- **Onaylayan:** ekip üyesi, oturumda; ekip teyidi bekliyor

## Karar

Deney videolarının listelenmesi, test kimliğiyle eşlenmesi, önizleme klibi üretilmesi ve ekranda gösterilmesi **kapsam dışıdır.**
"En yakın deney" özelliği (kNN) videosuz çalışır.

## Gerekçe

- Her deneyin videosu yok. `detail.json` dosya listelerinde video yalnızca 9 investigation'da görünüyor
  (PSI-10, 23, 25, 26, 39, 101, 102, 107, 159; 1.770 dosya, ≈381 GB).
- 7 investigation'ın dosya listesi eksik: PSI-20, 21, 22, 68, 69, 99, 106 (toplam ≈7,2 TB). Listelenen boyut toplam boyutla diğer
  tüm investigation'larda birebir tutuyor, bunlarda tutmuyor. FLEX (PSI-69, 924 GB) gibi önemli bir deney için dosya adı bilgisi yok,
  yani video eşlemesi tam yapılamaz.
- Videolar çok büyük (TB düzeyi) ve `.ts` biçimi tarayıcıda oynatılamıyor; önizleme için ek altyapı (ffmpeg, presigned URL) gerekirdi.

## Etkilenen plan adımları

| Plan | Adım | Sonuç |
|---|---|---|
| 00 | E1 | iptal, kod kaldırıldı (geri almak için `a68717d`) |
| 00 | E2, E3, E4, E5 | iptal |
| 02 | G3, G4, G5 | iptal; G6 metninden video/eşleşme düzeyi uyarısı çıktı |
| 01 | C5 | skor bileşeninden "video var mı" çıktı |
| 05 | C3, E1, E2 | `/videos` uç noktası ve video göstergeleri çıktı |
| 06 | B3, C3 | kurulum belgesinden ffmpeg çıktı; C3'e Architecture maddesi eklendi |

Aynı kalan: 06/D3 "Demo videosu" ve 06/D4 "yedek kayıt videosu" yarışma sunum videolarıdır, deney videosu değil.

## `Architecture.md` ile fark

`Architecture.md` bu karara göre **güncellenmedi** (ortak belge, ekip kararı). 2026-11-14 itibarıyla video ile ilgili satırlar:
satır 11 (M2 tablo satırı), 19 ve 47 ("Metadata & Video Index" kutusu), 58, 116 (c₅ bileşeni), 123 (investigation kartı),
157 (Video Eşleyici), 192–225 (§3.5 bütün bölüm), 355 (teknoloji tablosu), 376, 378 ve 382 (uygulama sırası).
Güncelleme 06/C3 adımında ekip onayıyla yapılacak.

## Yeniden açmak için

- 7 investigation için dosya adı listesi (portal dışa aktarımı) gerekir; elle derlenen liste `source=manual` olarak ayrı tutulmalı.
- Kaldırılan kod `a68717d` commit'inde (`src/data_layer/video_index.py`, `tests/data_layer/test_video_index.py`).
