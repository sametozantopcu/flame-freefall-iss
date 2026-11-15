# Sunum: Flame in Freefall · Prometheus 6

Space Apps 2026 sunumunun İngilizce sürümü. Yedi slayt, 1920×1080, Halo tasarım dili (siyah zemin, Geist + Inter).

| Dosya | Ne işe yarar |
|---|---|
| `Flame_in_Freefall_Prometheus6.pdf` | Sunulacak ya da paylaşılacak hâli (7 sayfa, 16:9) |
| `index.html` | Tarayıcıda açılan sunum: ← → ile geçiş, `F` ile tam ekran, adres sonuna `#3` yazınca 3. slayt |
| `NOTES.md` | Konuşmacı notları, slayt sırasıyla |
| `slides/NN-<id>.html` | Her slaytın kaynağı; notlar `<aside>` içinde |
| `deck.css` | Tüm slaytların ortak stili |
| `deck.json` | Başlık, slayt sırası ve bölümler |
| `assets/` | Dashboard ekran görüntüleri ve FlameSense renderı |
| `fonts/Geist-Variable.ttf` | Başlık fontu (SIL OFL). Inter, Google Fonts'tan yüklenir |

## Slaytlar

1. Kapak: ekip ve challenge
2. Challenge: üç soru, üç ekran
3. 01 · Explore: 24 deneyin habitat sıralaması
4. 02 · Scenario: yanma hızı tahmini ve malzeme risk indeksi
5. 03 · Equipment insights: dört sayı, dört tasarım kuralı
6. 04 · FlameSense konsepti
7. Teşekkürler: kullanılan araçlar ve SI kullanımı

## Güncelleme

Asıl düzenleme Claude'daki sunum dosyasında yapılıyor; bu klasör onun dışa aktarılmış kopyası. Bir slaytı burada
değiştirirsen hem `slides/` altındaki dosyayı hem `index.html` içindeki aynı `<section>`'ı güncelle.
PDF'i `index.html`'den yeniden üretmek için (Windows, bu klasörden):

```powershell
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=5000 --print-to-pdf="$PWD\Flame_in_Freefall_Prometheus6.pdf" "file:///$($PWD -replace '\\','/')/index.html"
```
