# FlameSense — temsili donanım modeli (Blender)

`plans/04_flamesense` planı FlameSense'i donanımsız bir yazılım demosu olarak tanımlıyor. Sunumda cihazı göstermek için
kullanılacak temsili 3D model bu klasörde. Gerçek bir donanım tasarımı değildir; ölçüler gerçek parçalara yakın tutulmuştur.

Görünüm, `design/dashboard/` sitesinin Halo tasarım diline uyar: mat siyah kasa, marka rengi yok, vurgu parlaklıkla verilir.
Cihazın tek parlak öğesi IR penceresinin çevresindeki ışık halkasıdır; bu halka sitenin Canlı ekranındaki halkanın
aynısıdır. OLED ekranda da Canlı ekranının küçük bir hali görünür.

| Dosya | İçerik |
|---|---|
| `flamesense.blend` | Model (Blender 5.3). Kurulumda kullanılan yardımcı kod, dosyanın içinde `fs3_helpers.py` ve `fs_v3.py` text datablock'ları olarak duruyor. OLED görseli dosyaya gömülü |
| `render_assembled.png` | Kapalı cihaz |
| `render_top.png` | Kapak üstünün yakın çekimi: ışık halkası, OLED, durum LED'leri |
| `render_internal.png` | Kapak kaldırılmış, etiketli iç görünüm |
| `render_detail.png` | Anakart, kablolar ve sensörlerin yakın çekimi |
| `render_exploded.png` | Patlatılmış görünüm |
| `oled_live.png`, `oled_live.py` | OLED ekran görseli ve onu üreten script (Pillow) |
| `MODEL_PLAN_v4.md` | Güncel görünümün planı: renkler, malzemeler, kapak üstü süslemeler, render ortamı |
| `MODEL_PLAN_v3.md` | Geometrinin ölçülü ve koordinatlı planı (kapak dışı için `MODEL_PLAN.md`'ye atıf yapar) |
| `MODEL_PLAN.md` | İlk sürümün planı |
| `CHANGELOG.md` | Sürüm geçmişi |

**Cihaz:** 140 × 90 × 45 mm kabin kutusu. Hava −X yüzündeki ızgaradan girer, toz filtresinden ve kanaldan geçer,
O₂ (LuminOx), CO, CO₂ (SCD41) ve hot-wire akış sensörlerinin önünden geçip SPS30 partikül sensöründen çıkar.
Anakartta ESP32-S3 var. Kapakta OLED, durum LED'leri (Normal / Ön-yangın / Yangın), buzzer ve MLX90640 termal dizi
bulunur. İyonizasyon kanalı yalnızca konsepttir.

Planlardaki dosya yolları modelin hazırlandığı makineye aittir. Modeli yeniden üretmek için `.blend` dosyası yeterlidir.
Logo ve etiket yazılarında Windows'taki Segoe UI Light kullanıldı. Font dosyaya gömülü değil; bu yüzden başka bir
sistemde bu yazılar Blender'ın varsayılan fontuyla görünür. Renderlar bundan etkilenmez.
