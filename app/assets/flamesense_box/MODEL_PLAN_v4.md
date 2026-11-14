# Tasarım 1 · v4 — Dashboard'un Halo diline uyarlanmış renk ve yüzey

v3'ün formu, iç yerleşimi ve bütün parçaları korunur. v4 yalnızca **renk, yüzey ve kapak üstü süslemeleri**
değiştirir; amaç cihazın `dashboard/` sitesiyle aynı ailede görünmesi.

Sitenin (Halo) kuralları ve cihazdaki karşılıkları:

| Sitede | Cihazda |
|---|---|
| Zemin siyah, marka rengi yok | Kasa mat siyah; turuncu tamamen kalkar |
| Vurgu parlaklıkla; metin açık ışık rengi `#f5f5f7` | Logo, etiket yazıları ve işaretler `#f5f5f7` mürekkep |
| Her ekranda tek ışıklı öğe; Canlı'da kuyruklu halka ve ucunda nokta | IR penceresinin çevresinde kuyruklu ışık halkası; cihazın tek parlak öğesi |
| Uçlara doğru solan ince çizgiler | Turuncu şeridin yerine uçlara doğru solan ince ışık çizgisi (halkadan çok daha soluk) |
| Grafik plakasında dört köşe işareti | Ön paneldeki camın köşelerinde dört ince köşe işareti |
| Durumlar opaklıkla | LED camları füme; yalnızca "sakin" LED'i soluk yanar |

## 0. Kurallar

- v3 planının (`MODEL_PLAN_v3.md`) §0 kuralları geçerli: Blender 5.3 MCP, `ToolSearch` ile `+Blender` (max_results 30),
  Blender'ı kendin başlatma, `*_for_cli` araçlarını kullanma, kontrolü render alıp PNG'yi `Read` ile açarak yap.
- Her execute çağrısı v3'teki üç satırla başlar (`fs3_helpers.py` ve `fs_v3.py` metin blokları .blend içinde zaten var).
  Yoksa v3 planının S1 adımındaki gibi yeniden yaz.
- **Geometriyi yeniden kurma.** v3 dosyası açılır ve üzerinde değişiklik yapılır. Var olan parçaların ölçü ve konumları değişmez.
- Yeni nesnelerin adı `FS_` ile başlar. Silinen tek nesne `FS_Accent_Stripe`.
- `versions\v3\` klasörüne ve repoya (`flame-freefall-iss/`) dokunma. Commit ya da push yok.
- Koordinatlar v3 ile aynı: birim mm, orijin kasanın alt yüzünün merkezi, −Y ön, +Z üst. Kapak üst yüzü z = 45.

## 1. Malzemeler (`FS_Mat_<ad>`, doğrusal RGB)

Var olan malzemeler **yerinde güncellenir** (yeni ad açma; nesne atamaları kendiliğinden güncellenir).

| Ad | Base color | Rough | Metal | Not |
|---|---|---|---|---|
| Shell | (0.010, 0.010, 0.012) | 0.62 | 0 | Mat "soft-touch" siyah. Coat 0. Specular IOR level 0.35 |
| Bezel | (0.004, 0.004, 0.005) | 0.06 | 0 | Parlak siyah cam. Coat weight 1, coat roughness 0.03 |
| Metal | (0.045, 0.045, 0.05) | 0.32 | 1 | Siyah oksit vida ve kalkan. **İstisna:** `FS_Sensor_O2` ve `FS_USBC` için `Steel` kullan |
| Steel *(yeni)* | (0.62, 0.62, 0.64) | 0.30 | 1 | Eski Metal değeri; yalnız O₂ gövdesi ve USB-C |
| PCB_Main | (0.018, 0.018, 0.02) | 0.42 | 0 | Siyah PCB (beyaz ipek baskı daha belirgin olur) |
| PCB_Blue | (0.018, 0.018, 0.02) | 0.42 | 0 | Siyah PCB |
| PCB_Green | (0.018, 0.018, 0.02) | 0.42 | 0 | Siyah PCB |
| DuctPlastic | (0.05, 0.05, 0.055) | 0.55 | 0 | Koyu gri |
| Sticker | (0.02, 0.02, 0.022) | 0.55 | 0 | Siyah etiket |
| LabelInk | (0.913, 0.913, 0.930) | 0.50 | 0 | `#f5f5f7`. Etiket yazıları ve SPS30 yazısı |
| Ink *(yeni)* | (0.913, 0.913, 0.930) | 0.45 | 0 | Logo ve köşe işaretleri |
| InkDim *(yeni)* | (0.30, 0.30, 0.31) | 0.50 | 0 | Soluk mürekkep; ışık çizgisi kapalı kısmı gibi ikincil işler için yedek |
| Orange | (0.913, 0.913, 0.930) | 0.45 | 0 | Turuncu kalkar. Bu malzemeyi kullanan nesne kalırsa açık mürekkep olur |
| Label | (0.913, 0.913, 0.930) | 0.50 | 0 | Emission aynı renk, güç 0.6. Koyu zeminde okunur |
| OLED | (0, 0, 0) | 0.20 | 0 | Emission 0 (ekran görüntüsü ayrı düzlemde, §2e) |
| LED_Green | (0.02, 0.02, 0.022) | 0.12 | 0 | Füme cam. Emission (0.55, 1.0, 0.62), güç 2.5 (yanıyor, soluk) |
| LED_Amber | (0.02, 0.02, 0.022) | 0.12 | 0 | Füme cam. Emission güç 0 |
| LED_Red | (0.02, 0.02, 0.022) | 0.12 | 0 | Füme cam. Emission güç 0 |
| Halo *(yeni)* | (0, 0, 0) | 0.30 | 0 | Emission rengi (0.913, 0.913, 0.930); gücü §2b'deki rampadan gelir |
| HaloDot *(yeni)* | (0, 0, 0) | 0.30 | 0 | Emission (1, 1, 1), güç 14 |
| Rule *(yeni)* | (0, 0, 0) | 0.40 | 0 | Emission (0.913, 0.913, 0.930); gücü §2c'deki rampadan gelir |

Dokunulmayanlar (gerçek parça renkleri; iç görünümde küçük ayrıntı olarak kalır): Brass, JST, SensorWhite, SMD_Cap,
SMD_Res, Cable, Mesh, Rubber, Recess, Silk, Graphite, BlackPlastic, ConceptGrey.

Bu tabloyu uyguladıktan sonra `FS_Mat_Orange` kullanan nesneleri listele ve raporla. Normalde yalnızca etiketler ve
silinecek şerit kullanır.

## 2. Kapak üstü (hepsinin parent'ı `FS_Lid`)

### 2a. Şerit kalkar
`FS_Accent_Stripe` silinir (mesh datası da).

### 2b. Işık halkası — cihazın tek parlak öğesi
Sitedeki Canlı ekranındaki halkanın aynısı: soluk bir iz, üstünde kuyruğu solan bir yay ve yayın ucunda parlak bir nokta.

| Nesne | Yapım (mm) | Merkez | Malzeme |
|---|---|---|---|
| `FS_Halo_Ring` | torus, ana yarıçap 8.4, kesit yarıçapı 0.55, major_segments 128, minor_segments 16; rotation z = −45° | (30, 22, 45.0) | Halo |
| `FS_Halo_Dot` | UV küre d 1.7 | (30 + 8.4·cos45°, 22 + 8.4·sin45°, 45.25) = (35.94, 27.94, 45.25) | HaloDot |

Halkanın merkezi z = 45'te, yani yarısı kapağa gömülü (ışık borusu gibi yüzeyle aynı hizada). IR penceresinin yarıçapı 7,
halkanın iç kenarı 7.85; temas yok.

`FS_Mat_Halo` node ağacı:
- Texture Coordinate (Object) → Gradient Texture (type **Radial**) → Color Ramp → Math (Multiply, 9) → Emission Strength.
- Radial gradyan yerel koordinatta `atan2(y, x)/(2π) + 0.5` verir: −X'te 0, saat yönünün tersine artar, +Y'de 0.75.
  Halka z'de −45° döndüğü için yerel +Y dünyada (+X, +Y) çaprazına, yani noktaya denk gelir.
- Color Ramp (Linear): 0.00 → 0.06; 0.12 → 0.10; 0.75 → 1.00; 0.752 → 0.06; 1.00 → 0.06.
  Yani 0…0.75 arasında güç yavaşça yükselen yay, kalanı soluk iz.
- Render'da yayın ucu noktayla buluşmuyorsa halkanın z dönüşünü 90° adımlarla ya da işaretini değiştirerek düzelt;
  noktanın yeri sabit kalır.

### 2c. Işık çizgisi (eski şeridin yerinde)
| Nesne | Yapım (mm) | Merkez | Malzeme |
|---|---|---|---|
| `FS_Light_Rule` | box 110×0.9×0.25 | (−5, 37, 45.125) | Rule |

`FS_Mat_Rule`: Texture Coordinate (Object) → Separate XYZ → X (metre) → Map Range (from −0.055…0.055 to 0…1) →
Color Ramp (Linear: 0 → 0, 0.5 → 1, 1 → 0) → Math (Multiply, 1.8) → Emission Strength. Ortada soluk parlak, uçlarda sıfır.
Halkadan **belirgin biçimde daha soluk** olmalı; değilse çarpanı düşür.

Not: Çizginin sağ ucu x = 50; halka x 21.6…38.4, y 13.6…30.4 arasında. Çizgi y = 37'de olduğu için çakışma yok.

### 2d. Logo
`FS_Logo` (var olan yazı nesnesi) değişir, konumu aynı kalır:
- Font: `C:\Windows\Fonts\segoeuil.ttf` (Segoe UI Light; sitenin Inter'ine en yakın ince sans). `bpy.data.fonts.load` ile yükle.
- `size` 5 mm, `space_character` 1.35 (aralıklı büyük harf, sitedeki eyebrow gibi), extrude 0.08 mm.
- Malzeme Ink.

Ürün etiketindeki üç yazı (`FS_Sticker_T1..T3`) ve `FS_Silk` aynı fontu kullanır; malzemeleri LabelInk / Silk kalır.

### 2e. OLED ekran görüntüsü
Ekranda sitenin Canlı ekranının küçük bir hali görünür.

1. Görseli üret: `C:\Users\Ruzgar\Desktop\nasa\.venv\Scripts\python.exe` (Pillow kurulu) ile, tasarım 1 klasöründe
   `oled_live.png`, **880×440** px:
   - Zemin saf siyah.
   - Sol yarı: merkezi (220, 220), yarıçapı 150, kalınlığı 10 px olan halka. Tüm daire soluk iz (`#f5f5f7`, opaklık %12).
     Üstüne −90°'den (tepe) saat yönünde 270° süren yay; opaklığı başta %10, sonda %100 olacak şekilde 2–3°'lik dilimlerle
     çiz. Yayın ucunda d 22 px dolu, tam parlak nokta.
   - Halkanın ortasında `20.9` (Segoe UI Light, 96 px, `#f5f5f7`) ve altında `O2 %` (Segoe UI, 30 px, %55 opaklık).
   - Sağ yarı (x 460…840): dört satır, başlık solda (%55 opaklık, 30 px), değer sağda (tam parlak, 34 px, sağa yaslı):
     `CO` `2 ppm` · `CO2` `0.30 %` · `Flow` `3.2 cm/s` · `IR max` `31 °C`. Satırlar arasında uçlara doğru solan 1 px çizgi.
   - Sağ üstte küçük `CALM` yazısı ve solunda d 10 px nokta (%80 opaklık).
   - Fontlar: `C:\Windows\Fonts\segoeuil.ttf`, `segoeui.ttf`. Değerler `dashboard/config.js` içindeki `LIVE_SAMPLE`'dan.
   - Script'i `tasarım 1\oled_live.py` olarak bırak.
2. `FS_OLED_Image`: plane 22×11 mm, merkez (−40, −20, 45.92), parent `FS_Lid`. Malzeme `FS_Mat_OLED_Image` (yeni):
   Image Texture (`oled_live.png`, UV) → Emission Color, güç 2.2; Base color siyah, rough 0.2. Görsel ters ya da aynalı
   çıkarsa UV'yi ya da plane'in dönüşünü düzelt.

### 2f. Köşe işaretleri (ön panel camı)
Cam (`FS_Bezel`) 100×32, merkez (−12, −20), üst yüzü z = 45.6. Her köşede bir "L" (iki ince kutu, malzeme Ink):

| Köşe | Yatay kol (box 4×0.45×0.05) merkezi | Dikey kol (box 0.45×4×0.05) merkezi |
|---|---|---|
| sol ön | (−58.0, −34.0, 45.625) | (−60.0, −32.0, 45.625) |
| sağ ön | (34.0, −34.0, 45.625) | (36.0, −32.0, 45.625) |
| sol arka | (−58.0, −6.0, 45.625) | (−60.0, −8.0, 45.625) |
| sağ arka | (34.0, −6.0, 45.625) | (36.0, −8.0, 45.625) |

Adlar `FS_Corner_<SolOn|SagOn|SolArka|SagArka>_H` / `_V`. OLED (x −51…−29), LED'ler ve buzzer delikleri (x 22…28)
bu işaretlerle çakışmaz.

## 3. Render ortamı (sitenin siyah zemini)

v3 render ayarları (EEVEE, 64 örnek, 1600×1000, `shot()`, kamera konumları) korunur. Değişenler:

- **World:** renk (0.006, 0.006, 0.007), güç 1.
- **Fon:** `FS_Cyclorama` yoksa ekle: genişlik 1200, derinlik 900, arka duvar yüksekliği 600 mm, kavis yarıçapı 200 mm;
  zemin z = −1.2 (ayakların altı), merkezi (0, 150, …). Malzeme `FS_Mat_Backdrop` (0.012, 0.012, 0.013), rough 0.45
  (zeminde hafif yansıma olsun). Koleksiyon `FS_Lighting_Camera`.
- **Işıklar** (siyah cisim kenarlarından okunmalı; dashboard'daki köşe ışıltısı gibi):
  - Key AREA (300, −250, 400), 4 W, size 300.
  - Fill AREA (−350, −200, 200), 1.2 W, size 300.
  - Rim AREA (0, 350, 300), 9 W, size 200; kasanın üst ve arka kenarına ince bir parlaklık çizgisi düşürmeli.
  - `FS_Backdrop_Light` AREA (−250, 400, 350), 3 W, size 400, fonun sol üstüne bakar: arka planda soluk bir ışık lekesi
    (sitedeki sol üst köşe ışıltısı).
  Değerleri render'a bakarak ±%50 ayarlayabilirsin. Hedef: kasa siyah okunsun ama kenarları ve kapak dikişi seçilsin.
- **Renk yönetimi:** View Transform AgX, Look "Medium High Contrast" (yoksa "Base Contrast").
- **Bloom (isteğe bağlı):** Halka ve noktanın çevresinde hafif ışıma için compositor'a Glare (Fog Glow ya da Bloom,
  threshold 1, mix −0.6 civarı) dene. Blender 5.x'te compositor kurulumu hata verirse bu adımı atla ve raporla.

## 4. Renderlar

| Dosya | Kamera | Hedef | Lens | Durum |
|---|---|---|---|---|
| `render_assembled.png` | (230, −290, 210) | (0, 0, 20) | 60 | v3 ile aynı |
| `render_top.png` *(yeni)* | (40, −150, 260) | (−5, 5, 45) | 70 | Monte, etiketler gizli. Kapak üstünün yakını: halka, çizgi, logo, OLED, köşe işaretleri |
| `render_internal.png` | v3 ile aynı | | | |
| `render_detail.png` | v3 ile aynı | | | |
| `render_exploded.png` | v3 ile aynı (CHANGELOG'daki ayarlı kamera: (300, −400, 190), lens 58) | | | |

Kontrol listesi (her PNG'yi `Read` ile aç):
- görüntü patlak ya da tamamen siyah değil; kasa arka plandan kenarlarıyla ayrılıyor,
- turuncu hiçbir yerde kalmadı,
- halka ekranın en parlak öğesi; yayın ucu noktayla buluşuyor; ışık çizgisi ondan soluk ve uçlarda soluyor,
- OLED görseli okunur, ters ya da aynalı değil,
- köşe işaretleri camın üstünde ve köşelere hizalı,
- etiketler koyu zeminde okunur ve çakışmıyor,
- v3'teki parçaların hiçbiri kaybolmadı ya da yer değiştirmedi.

## 5. Adımlar

| Adım | İş |
|---|---|
| S0 | Araçları yükle. `versions\v3\flamesense.blend` var mı doğrula. Blender'da açık dosyaya bak: `tasarım 1\flamesense.blend` değilse `bpy.ops.wm.open_mainfile(filepath=..., load_ui=False)` ile aç. Bağlantı koparsa dur ve raporla |
| S1 | Metin bloklarını (`fs3_helpers.py`, `fs_v3.py`) exec ile test et |
| S2 | Malzemeler (§1). `FS_Mat_Orange` kullanan nesneleri raporla |
| S3 | Kapak üstü (§2a–2d, 2f). Kaydet |
| S4 | OLED görseli ve düzlemi (§2e). Kaydet |
| S5 | `check_overlaps()`; yeni beklenen temaslar: Halo_Ring/Halo_Dot ↔ IR_Window ve Lid (silindir/torus AABB), köşe işaretleri ↔ Bezel, OLED_Image ↔ OLED_Screen. Gerçek bir çakışma varsa raporla |
| S6 | Render ortamı (§3) |
| S7 | 5 render ve kontrolleri; sorun varsa düzelt, tekrar render al; gizleme ve patlatmayı geri al. Kaydet |
| S8 | `versions\v4\` klasörüne `.blend` (`save_as_mainfile(copy=True)`), 5 PNG, `oled_live.png` ve `oled_live.py`. `CHANGELOG.md`'ye v4 girdisi (Türkçe karakterlerle; ne değişti, plandan sapmalar) |
| S9 | Kısa rapor: sapmalar ve ayar değerleri, `check_overlaps` sonucu, bloom denendi mi, dosya yolları, çözülemeyenler |
