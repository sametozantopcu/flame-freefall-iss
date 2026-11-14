# FlameSense — temsili donanım modeli (Blender, v4)

`MVP_SPEC.md` ve `plans/mvp/PLAN.md` FlameSense'i donanımsız bir yazılım demosu olarak tanımlıyor. Sunumda cihazı göstermek için
kullanılacak temsili 3D model bu klasörde. Gerçek bir donanım tasarımı değildir; ölçüler gerçek parçalara yakın tutulmuştur.

| Dosya | İçerik |
|---|---|
| `flamesense.blend` | Model (Blender 5.3). Kurulumda kullanılan yardımcı kod dosyanın içinde `fs3_helpers.py` ve `fs_v3.py` text datablock'ları olarak duruyor |
| `render_assembled.png` | Kapalı cihaz |
| `render_internal.png` | Kapak kaldırılmış, etiketli iç görünüm |
| `render_detail.png` | Anakart, kablolar ve sensörlerin yakın çekimi |
| `render_exploded.png` | Patlatılmış görünüm |
| `render_top.png` | Kapak üstünün yakın çekimi (v4) |
| `oled_live.png`, `oled_live.py` | Renderlardaki OLED görseli (örnek değerler, ölçüm değil) |
| `web/` | Siteye gömülen küçültülmüş JPG'ler (1200x750) |
| `v3_light/` | Önceki (v3, açık renkli) renderlar |
| `MODEL_PLAN_v4.md` | v4 (koyu Halo görünümü) planı |
| `MODEL_PLAN_v3.md` | v3'ün ölçülü ve koordinatlı planı (kapak dışı ve malzemeler için `MODEL_PLAN.md`'ye atıf yapar) |
| `MODEL_PLAN.md` | İlk sürümün planı |
| `CHANGELOG.md` | v1 → v4 değişiklikleri |

**Cihaz:** 140 × 90 × 45 mm kabin kutusu. Hava −X yüzündeki ızgaradan girer, toz filtresinden ve kanaldan geçer,
O₂ (LuminOx), CO, CO₂ (SCD41) ve hot-wire akış sensörlerinin önünden geçip SPS30 partikül sensöründen çıkar.
Anakartta ESP32-S3 var. Kapakta OLED, durum LED'leri (Normal / Ön-yangın / Yangın), buzzer ve MLX90640 termal dizi
bulunur. İyonizasyon kanalı yalnızca konsepttir.

Planlardaki dosya yolları modelin hazırlandığı makineye aittir. Modeli yeniden üretmek için `.blend` dosyası yeterlidir.
