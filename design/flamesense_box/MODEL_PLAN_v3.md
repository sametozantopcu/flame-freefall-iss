# Tasarım 1 · v3 — FlameSense kabin kutusu: gerçekçi detay

Kullanıcı tasarım 1'in **formunu ve renklerini** beğendi:
- 140×90×45 mm beyaz kasa,
- turuncu şerit ve koyu ön panel,
- OLED, üç LED, buzzer ve IR penceresi,
- −X'ten +X'e giden hava akışı.

v3 bunları korur ve **gerçekçiliği** artırır:
- Kartlar artık gerçek bir elektronik kart gibi: anakart üzerinde ESP32-S3 modülü (kalkanlı), USB-C soketi, voltaj regülatörü, SMD pasif sıraları, IMU yongası, JST konnektörler, pirinç standoff'lar ve vidalar.
- Sensörler gerçek biçimlerine yakın: LuminOx O₂ (filtre kapaklı), elektrokimyasal CO, kart üstünde SCD41, kanala sarkan hot-wire, etiketli ve giriş yarıklı SPS30.
- Sensörler anakarta **kablolarla** bağlı.
- Hava kanalının girişinde bir toz filtresi var.
- Kapak dört köşeden vidalı. Tabanda vida kuleleri ve kauçuk ayaklar var. Yan yüzde bir ürün etiketi var.
- Kenar yuvarlatma doğru yapılıyor (v1 ve v2'deki kare çentik hatası yok).

İç yerleşim plan yazılırken AABB çakışma hesabıyla kontrol edildi.

## 0. Kurallar

- Blender 5.3, MCP üzerinden. `ToolSearch` ile `+Blender` (max_results 30) yükle. Bağlantı hatasında dur.
  Blender'ı kendin başlatma, `*_for_cli` araçlarını kullanma.
- Kontrolleri render alıp PNG'yi `Read` ile açarak yap. Pencere görüntüsü güncellenmeyebilir.
- Köşe yuvarlatmak için `bmesh.ops.bevel` kullanma. Yuvarlak köşeli parçalar `rprism()` ile yapılır.
- Önce `cut_with()`, en son `soften()`.
- Her nesnenin adı `FS_` ile başlar. Her adım tek bir execute çağrısıyla yapılır ve sonunda kaydedilir. Hata olursa sadece o adımı düzelt.
- Her execute çağrısı şu üç satırla başlar:
  ```python
  import bpy
  exec(bpy.data.texts["fs3_helpers.py"].as_string())
  exec(bpy.data.texts["fs_v3.py"].as_string())
  ```
  `fs3_helpers.py` = `tasarım 3\MODEL_PLAN.md` §11'deki kod (aynen). `fs_v3.py` = bu planın §9'undaki kod (aynen).
  `fs_v3.py`, `M()` fonksiyonunu `FS_Mat_` önekine ve `DESIGN_DIR`'i tasarım 1 klasörüne çevirir.

## 1. Koordinatlar

Tasarım 1 ile aynı: birim mm, orijin kasanın alt yüzünün merkezi, +X sağ (hava akışı −X → +X), −Y ön, +Z üst.
Üst yüz kabine bakar. Root ya da devirme yok; cihaz z = 0'da durur, kauçuk ayaklar z < 0'dadır.
Taban iç boşluğu: x ±67.5, y ±42.5, z 2.5…32. Kapak: z 32…45; üst plaka z 42.5…45.

## 2. Kasa

| Nesne | Yapım (mm) | Merkez | Malzeme | Parent |
|---|---|---|---|---|
| `FS_Base` | rprism 140×90×32, r=6. Kes (hepsi tek `cut_with` çağrısında): rprism 135×85×32 r=3.5 merkez (0,0,18.5); giriş yarıkları; çıkış yarıkları; ön havalandırma; USB-C yuvası. Sonra soften(0.8, 3) | (0, 0, 16) | Shell | – |
| giriş yarıkları (−X duvarı) | 4 adet box 6×16×1.8; merkez (−68.75, 24.5, z), z = 6.5, 9.5, 12.5, 15.5 | | | |
| çıkış yarıkları (+X duvarı) | 4 adet box 6×30×1.5; merkez (68.75, 17, z), z = 6, 8.5, 11, 13.5 | | | |
| ön havalandırma (−Y duvarı) | 4 adet box 2×6×14; merkez (x, −43.75, 16), x = 46, 50, 54, 58 | | | |
| USB-C yuvası (−X duvarı) | rprism (10, 4.2, 6), r=2, axis='Y'; sonra rotation z = π/2 ile X yönüne çevrilmiş kesici. Merkez (−68.75, −20, 11.7). Kolaylık için box 6×10×4 de kabul | | | |
| `FS_Lid` | rprism 140×90×13, r=6. Kes: rprism 135×85×11.5 r=3.5 merkez (0,0,36.75). Sonra soften(0.8, 3) | (0, 0, 38.5) | Shell | – |
| `FS_Boss_1..4` | cyl d5.5 h29.5 (kapak vida kulesi) | (±65.5, ±40.5, 17.25) | Shell | Base |
| `FS_Boss_Hole_1..4` | cyl d2.5 h0.1 | (±65.5, ±40.5, 32.0) | Recess | Base |
| `FS_Lid_Screw_1..4` | cyl d5.5 h0.6 (havşa başlı vida) | (±65.5, ±40.5, 45.1) | Metal | Lid |
| `FS_Lid_Screw_X_1..4` / `_Y_1..4` | box 3×0.6×0.12 ve box 0.6×3×0.12 (yıldız yuvası) | (±65.5, ±40.5, 45.42) | Recess | Lid |
| `FS_Tab_1..4` | box 10×14×3. Kes: cyl d4.2 h4 (montaj kulağı) | (±75, ±30, 1.5) | Shell | Base |
| `FS_Foot_1..4` | cyl d8 h1.2 (kauçuk ayak) | (±55, ±32, −0.6) | Rubber | Base |
| `FS_Sticker` | box 34×0.2×12 (ürün etiketi, ön yüzde) | (−22, −45.1, 16) | Sticker | Base |
| `FS_Sticker_T1` | text "FLAMESENSE CN-1", size 2.4, extrude 0.02, rotation (π/2, 0, 0) | (−22, −45.25, 19.5) | LabelInk | Base |
| `FS_Sticker_T2` | text "S/N FS-0001 · 5 V DC 1 A", size 1.6, aynı rotation | (−22, −45.25, 16) | LabelInk | Base |
| `FS_Sticker_T3` | text "PROTOTYPE · NOT CERTIFIED", size 1.6, aynı rotation | (−22, −45.25, 12.8) | LabelInk | Base |

Kapağın dışı v2 ile **aynıdır**. `tasarım 1\MODEL_PLAN.md` §2 ve §5'teki ölçü ve koordinatlarla yapılır, parent'ı `FS_Lid`'dir:
`FS_Accent_Stripe`, `FS_Bezel`, `FS_Logo`, `FS_OLED_Screen`, `FS_LED_Green/Amber/Red`, `FS_Buzzer_Hole_1..7`,
`FS_IR_Window`, `FS_Sensor_IR`. Bu planın §4 tablosu bunlardan farklı bir şey söylüyorsa §4 geçerlidir.

## 3. Taban içi

### 3a. Hava kanalı ve sensörler (arka bölge)

| Nesne | Yapım (mm) | Merkez | Malzeme | Parent |
|---|---|---|---|---|
| `FS_Duct` | box 93.2×19×14. Kes: box 97×16×11 aynı merkez (iki ucu açık tüp) | (−19.9, 24.5, 11) | DuctPlastic | – |
| `FS_Duct_Filter` | box 0.8×16×11 (toz filtresi, kanal girişinde) | (−66, 24.5, 11) | Mesh | Duct |
| `FS_Duct_Saddle_1` / `_2` | box 6×19×1.5 | (−50, 24.5, 3.25) / (10, 24.5, 3.25) | DuctPlastic | Duct |
| `FS_Sensor_O2` | cyl d20 h17 (LuminOx gövdesi) | (−50, 26, 26.5) | Metal | – |
| `FS_O2_Cap` | cyl d14 h0.6 (filtre kapağı) | (−50, 26, 35.3) | Mesh | Sensor_O2 |
| `FS_Sensor_CO` | cyl d20 h16.5 | (−26, 26, 26.25) | SensorWhite | – |
| `FS_CO_Filter` | cyl d12 h0.6 | (−26, 26, 34.8) | Mesh | Sensor_CO |
| `FS_SCD41_Board` | box 20×20×1.6 | (−4, 26, 18.8) | PCB_Black | – |
| `FS_Sensor_SCD41` | box 10.1×10.1×6.5 | (−4, 26, 22.85) | Graphite | SCD41_Board |
| `FS_SCD41_JST` | box 6×3×3 | (−8, 17.5, 21.1) | JST | SCD41_Board |
| `FS_Wind_Board` | box 1.6×17.5×30 (dikey; kanal tavanından içeri sarkar) | (16, 26, 25) | PCB_Black | – |
| `FS_Wind_Tip` | cyl d2.4 h3 (termistör, kanalın içinde) | (16, 26, 8.5) | SensorWhite | Wind_Board |
| `FS_Sensor_SPS30` | box 40.6×40.6×12.2 | (47, 17, 10.1) | BlackPlastic | – |
| `FS_SPS30_Plate` | box 38×38×0.3 | (47, 17, 16.35) | Metal | Sensor_SPS30 |
| `FS_SPS30_Text` | text "SPS30", size 4, extrude 0.02 | (47, 17, 16.55) | LabelInk | Sensor_SPS30 |
| `FS_SPS30_Slot_In_1..3` | box 0.2×10×1.5; z = 7, 10, 13 | (26.6, 17, z) | Recess | Sensor_SPS30 |
| `FS_SPS30_Slot_Out_1..3` | box 0.2×10×1.5; z = 7, 10, 13 | (67.4, 17, z) | Recess | Sensor_SPS30 |
| `FS_SPS30_JST` | box 6×3×4 | (31, −4.8, 12) | JST | Sensor_SPS30 |

### 3b. Anakart ve ön bölge

| Nesne | Yapım (mm) | Merkez | Malzeme | Parent |
|---|---|---|---|---|
| `FS_Mainboard` | box 86×42×1.6 | (−19, −20, 9.3) | PCB_Main | – |
| `FS_Standoff_1..4` | cyl d5 h6 | (−58, −37, 5.5), (20, −37, 5.5), (−58, −3, 5.5), (20, −3, 5.5) | Brass | – |
| `FS_PCB_Screw_1..4` | cyl d5 h1.2 (aynı x, y) | z = 10.7 | Metal | Mainboard |
| `FS_ESP32_Module` | box 18×25.5×0.8 | (−40, −22, 10.5) | PCB_Black | Mainboard |
| `FS_ESP32_Shield` | box 15.8×17.6×2.4 | (−40, −25.5, 12.1) | Metal | Mainboard |
| `FS_ESP32_Text` | text "ESP32-S3", size 1.8, extrude 0.02 | (−40, −25.5, 13.32) | LabelInk | Mainboard |
| `FS_USBC` | box 8.9×7.3×3.2 | (−59.5, −20, 11.7) | Metal | Mainboard |
| `FS_Regulator` | box 6.5×3.5×1.6 (SOT-223) | (−20, −10, 10.9) | BlackPlastic | Mainboard |
| `FS_IMU_Chip` | box 3×3×1 | (8, −20, 10.6) | BlackPlastic | Mainboard |
| `FS_Board_LED` | box 1.6×0.8×0.6 | (14, −30, 10.4) | LED_Green | Mainboard |
| `FS_JST_1..6` | box 6×4.2×2.9; x = −50, −38, −26, −14, −2, 10 | (x, −3, 11.55) | JST | Mainboard |
| `FS_Silk` | text "FLAMESENSE MAIN v3", size 2.2, extrude 0.02 | (−2, −8, 10.12) | Silk | Mainboard |
| SMD sıraları | `smd_row("FS_SMD_A", (−24, −30), 8, 2.5, 10.1, ...)`, `smd_row("FS_SMD_B", (−24, −18), 6, ...)`, `smd_row("FS_SMD_C", (−4, −37), 8, ...)` | | SMD_Cap / SMD_Res | Mainboard |
| `FS_BME_Standoff` | cyl d5 h6 | (50, −34, 5.5) | Brass | – |
| `FS_BME_Board` | box 15×12×1.6 | (50, −34, 9.3) | PCB_Blue | – |
| `FS_Sensor_BME280` | box 2.5×2.5×0.9 | (50, −34, 10.55) | Metal | BME_Board |
| `FS_BME_Header` | box 8×2.5×2.5 | (50, −29.5, 11.35) | JST | BME_Board |
| `FS_ION_Channel` | cyl d20 h15 (KONSEPT; radyoaktif kaynak detayı YOK) | (52, −16, 10) | ConceptGrey | – |

### 3c. Kablolar (`cable()`, d = 1.6, malzeme Cable; noktalar mm, bezier AUTO handle)

| Nesne | Noktalar |
|---|---|
| `FS_Cable_O2` | (−50,−3,13) → (−50,4,18) → (−50,12,24) → (−50,16,27) |
| `FS_Cable_CO` | (−38,−3,13) → (−36,4,18) → (−30,12,24) → (−26,16,27) |
| `FS_Cable_SCD41` | (−26,−3,13) → (−24,4,16) → (−14,12,20) → (−8,16,21.1) |
| `FS_Cable_Wind` | (−14,−3,13) → (−8,4,22) → (8,16,30) → (15.2,24,32) |
| `FS_Cable_SPS30` | (−2,−3,13) → (8,−6,14.5) → (20,−6.5,13.5) → (28,−4.8,12) |
| `FS_Cable_BME` | (10,−3,13) → (24,−8,15) → (42,−22,15) → (50,−28.3,12.6) |

Kablolar havada asılı kalmasın: her kablonun ilk noktası kendi `FS_JST_n`'inin üstünden, son noktası hedef parçanın yüzeyinden başlar.
Render'da bir kablo bir parçanın içinden geçiyorsa sadece ara noktalarını en fazla 3 mm oynatabilirsin.

## 4. Kapak altı (parent `FS_Lid`)

| Nesne | Yapım (mm) | Merkez | Malzeme |
|---|---|---|---|
| `FS_UI_Board` | box 70×28×1.6 | (−20, −20, 41.7) | PCB_Black |
| `FS_OLED_Board` | box 27×27×1.6 | (−40, −20, 39.3) | PCB_Blue |
| `FS_Buzzer` | cyl d12 h9 | (25, −20, 38) | BlackPlastic |
| `FS_IR_Board` | box 25×18×1.6 | (30, 22, 41.7) | PCB_Main |

Bunlar dışında kapak elemanları §2'deki gibi v2 ile aynıdır.

## 5. Malzemeler (`FS_Mat_<ad>`, doğrusal RGB)

`tasarım 1\MODEL_PLAN.md` §6'daki bütün malzemeler aynen oluşturulur (Shell, Orange, Bezel, PCB_Green, PCB_Blue, Metal,
BlackPlastic, SensorWhite, DuctPlastic, ConceptGrey, OLED, LED_*). Ek olarak:

| Ad | Base color | Rough | Metal |
|---|---|---|---|
| PCB_Main | (0.03, 0.20, 0.08) | 0.45 | 0 |
| PCB_Black | (0.02, 0.02, 0.022) | 0.45 | 0 |
| Graphite | (0.12, 0.12, 0.13) | 0.40 | 0.3 |
| Brass | (0.80, 0.60, 0.25) | 0.35 | 1 |
| SMD_Cap | (0.55, 0.45, 0.30) | 0.50 | 0 |
| SMD_Res | (0.02, 0.02, 0.02) | 0.40 | 0 |
| JST | (0.90, 0.88, 0.82) | 0.50 | 0 |
| Cable | (0.02, 0.02, 0.022) | 0.45 | 0 |
| Mesh | (0.05, 0.05, 0.055) | 0.90 | 0.2 |
| Sticker | (0.92, 0.92, 0.90) | 0.60 | 0 |
| Rubber | (0.02, 0.02, 0.02) | 0.90 | 0 |
| Recess | (0.006, 0.006, 0.007) | 0.60 | 0 |
| LabelInk | (0.03, 0.03, 0.035) | 0.50 | 0 |
| Silk | (0.95, 0.95, 0.95) | 0.50 | 0 |
| LED_Green_Small | `FS_Mat_LED_Green` ile aynı (yeni malzeme gerekmez; `FS_Board_LED` LED_Green kullanır) | | |

**Etiket malzemesi (v2'den):** `FS_Mat_Label` antrasit (0.03, 0.03, 0.035), emisyon yok, rough 0.5, specular 0.
Gri arka plan üzerinde duran etiketler `FS_Mat_Orange` kullanır.

## 6. Etiketler

v2'deki etiket stili: `label()`, boy 4.5 mm, extrude 0.3, bevel 0.12, gölge kapalı, `TRACK_TO` FS_Camera.
Etiket listesi `tasarım 1\MODEL_PLAN.md` §8'deki ile aynıdır. Ek olarak:
- `FS_Label_Main` "Mainboard (ESP32-S3)" → `FS_ESP32_Shield`
- `FS_Label_Filter` "Dust filter" → `FS_Duct_Filter`
- `FS_Label_Duct` "Air duct" → `FS_Duct`

Eski plandaki parça adları v3'te değişti; etiketler yeni adlara bağlanır:
- ESP32 etiketi → `FS_ESP32_Shield` (anakart değil)
- IMU → `FS_IMU_Chip`
- "Airflow (hot-wire)" → `FS_Wind_Board`
- CO2 → `FS_SCD41_Board`
- "P / T / RH (BME280)" → `FS_BME_Board`
Etiketleri çakışmayacak ve okunur olacak şekilde serbestçe taşıyabilirsin; v2'de iç ve patlatılmış görünüm için ayrı konumlar gerekmişti.

## 7. Render (v2 ayarları)

- Kamera `FS_Camera` + `FS_CamTarget` (TRACK_TO).
- Işıklar AREA: Key (300, −250, 400) 7 W, size 250; Fill (−350, −200, 200) 3 W, size 300; Rim (0, 350, 300) 6 W, size 200; hepsi hedefe bakar.
- World (0.5, 0.52, 0.55), güç 0.25. EEVEE (`BLENDER_EEVEE`), 64 örnek, 1600×1000.

| Dosya | Kamera | Hedef | Lens | Durum |
|---|---|---|---|---|
| `render_assembled.png` | (230, −290, 210) | (0, 0, 20) | 60 | Monte, etiketler gizli |
| `render_internal.png` | (200, −260, 330) | (0, 5, 15) | 60 | `set_hidden(lid_family(), True)`; kapak ailesi dışındaki etiketler görünür |
| `render_detail.png` | (90, −170, 150) | (−15, −5, 12) | 55 | Kapak ve bütün etiketler gizli. Anakart, kablolar ve kanal üstündeki sensörlerin yakın çekimi |
| `render_exploded.png` | (300, −400, 150) | (0, 0, 55) | 62 | `explode(True)`; kablolar gizli (`set_hidden(CABLES, True)`); etiketler görünür |

Kontrol listesi:
- görüntü patlak ya da siyah değil,
- varsayılan küp yok,
- kasa köşeleri gerçekten yuvarlak (kare çentik yok),
- monte ve iç görünümde parça çakışması ya da havada duran parça yok,
- kablolar JST'lerden çıkıp parçalara varıyor,
- etiketler okunur ve çakışmıyor.

Sorun varsa düzelt ve tekrar render al. Her render'dan sonra gizlemeyi ve patlatmayı geri al.

## 8. Adımlar

| Adım | İş |
|---|---|
| S0 | Araçları yükle. `tasarım 1\versions\v2\flamesense.blend`'in var olduğunu doğrula. `read_homefile(use_empty=True)`; birimleri mm yap; `save_as_mainfile` ile `...\tasarım 1\flamesense.blend` (çalışma dosyası v3 olur) |
| S1 | `tasarım 3\MODEL_PLAN.md` §11 kodunu aynen `fs3_helpers.py`'ye, bu planın §9 kodunu aynen `fs_v3.py`'ye yaz; ikisini de exec ile test et |
| S2 | Koleksiyonlar (`FlameSense` altında `FS_Enclosure`, `FS_Electronics`, `FS_Sensors`, `FS_UI`, `FS_Cables`, `FS_Labels`, `FS_Lighting_Camera`; kesiciler `FS_tmp`), malzemeler |
| S3 | Kasa (§2): Base ve kesimleri, Lid, kuleler, vidalar, kulaklar, ayaklar, etiket |
| S4 | Kapak dışı (v2 ile aynı) ve kapak altı (§4) |
| S5 | Kanal ve sensörler (§3a) |
| S6 | Anakart ve ön bölge (§3b); SMD sıraları |
| S7 | `check_overlaps()`, sonucu raporla. Beklenen temaslar (`EXPECTED`) çakışma sayılmaz. Gerçek bir çakışma varsa en küçük konum değişikliğiyle düzelt |
| S8 | Kablolar (§3c) |
| S9 | Kamera, ışık, world, render ayarları; etiketler (§6) |
| S10 | 4 render ve kontrolleri; her şeyi geri al; `FS_tmp`'yi sil; kaydet. `versions\v3\` klasörüne `.blend` (`copy=True`) ve 4 PNG. `CHANGELOG.md`'ye v3 girdisi ekle (Türkçe karakterlerle) |
| S11 | Kısa rapor: sapmalar ve ayarlar, `check_overlaps` sonucu, dosya yolları, çözülemeyenler |

## 9. Ek kod (`fs_v3.py`, S1'de aynen yazılır)

```python
DESIGN_DIR = r"C:\Users\Ruzgar\Desktop\nasa\tasarımlar\tasarım 1"

def M(name):
    return bpy.data.materials["FS_Mat_" + name]

def label(name, text_body, part=None, pos=None, c=None, cam=None, dz=8, size=4.5, material=None):
    cu = bpy.data.curves.new(name, 'FONT')
    cu.body = text_body
    cu.size = size * MM
    cu.align_x = 'CENTER'
    cu.align_y = 'CENTER'
    cu.extrude = 0.3 * MM
    cu.bevel_depth = 0.12 * MM
    o = _obj(name, cu, c or coll("FS_Labels"), material or M("Label"))
    try:
        o.visible_shadow = False
    except Exception:
        pass
    bpy.context.view_layer.update()
    if part is not None:
        top = max((part.matrix_world @ Vector(v)).z for v in part.bound_box)
        t = part.matrix_world.translation
        o.location = (t.x, t.y, top + dz * MM)
        parent_keep(o, part)
    else:
        o.location = Vector(pos) * MM
    if cam is not None:
        con = o.constraints.new('TRACK_TO')
        con.target = cam
        con.track_axis = 'TRACK_Z'
        con.up_axis = 'UP_Y'
    return o

def cable(name, pts, c, material, d=1.6):
    cu = bpy.data.curves.new(name, 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = d / 2 * MM
    cu.bevel_resolution = 4
    cu.use_fill_caps = True
    sp = cu.splines.new('BEZIER')
    sp.bezier_points.add(len(pts) - 1)
    for bp, p in zip(sp.bezier_points, pts):
        bp.co = Vector(p) * MM
        bp.handle_left_type = 'AUTO'
        bp.handle_right_type = 'AUTO'
    return _obj(name, cu, c, material)

def smd_row(prefix, start, n, pitch, board_top_z, c, parent, size=(0.8, 1.6, 0.5)):
    """X boyunca n adet SMD parça (0603 benzeri). Çift indeksler kondansatör, tekler direnç rengi."""
    out = []
    for i in range(n):
        ctr = (start[0] + i * pitch, start[1], board_top_z + size[2] / 2)
        o = box(f"{prefix}_{i:02d}", size, ctr, c, M("SMD_Cap") if i % 2 == 0 else M("SMD_Res"))
        parent_keep(o, parent)
        out.append(o)
    return out

def family(name):
    o = bpy.data.objects[name]
    return [o.name] + [ch.name for ch in o.children_recursive]

def lid_family():
    return family("FS_Lid")

def set_hidden(names, hidden):
    for n in names:
        o = bpy.data.objects.get(n)
        if o:
            o.hide_render = hidden
            o.hide_set(hidden)

def shot(cam_mm, target_mm, lens):
    cam, tgt = bpy.data.objects["FS_Camera"], bpy.data.objects["FS_CamTarget"]
    cam.location = Vector(cam_mm) * MM
    tgt.location = Vector(target_mm) * MM
    cam.data.lens = lens
    bpy.context.view_layer.update()

CABLES = ["FS_Cable_O2", "FS_Cable_CO", "FS_Cable_SCD41", "FS_Cable_Wind", "FS_Cable_SPS30", "FS_Cable_BME"]

EXPLODE = {  # dünya ekseninde mm (Root yok)
    "FS_Lid": (0, 0, 60), "FS_Sensor_O2": (0, 0, 28), "FS_Sensor_CO": (0, 0, 28),
    "FS_SCD41_Board": (0, 0, 28), "FS_Wind_Board": (0, 0, 34), "FS_Duct": (0, 0, 12),
    "FS_Sensor_SPS30": (0, 0, 12), "FS_Mainboard": (0, 0, 6), "FS_BME_Board": (0, 0, 6),
    "FS_ION_Channel": (0, 0, 4),
}

EXPECTED = {frozenset(p) for p in [("FS_Duct", "FS_Wind_Board"), ("FS_Duct", "FS_Wind_Tip"),
                                    ("FS_Duct", "FS_Duct_Filter"), ("FS_Duct", "FS_Sensor_SPS30"),
                                    ("FS_Sensor_IR", "FS_IR_Board"), ("FS_Sensor_IR", "FS_IR_Window")]}

def check_overlaps(prefixes=("FS_",), skip=("FS_Base", "FS_Lid", "FS_Label", "FS_Cable", "FS_Cam", "FS_Key",
                                          "FS_Fill", "FS_Rim", "FS_cut", "FS_SMD", "FS_Silk", "FS_Sticker",
                                          "FS_Tab", "FS_Foot", "FS_Boss_Hole", "FS_Lid_Screw", "FS_Buzzer_Hole"),
                   tol_mm=0.05):
    """Mesh nesnelerinin dünya AABB'leri (tol kadar küçültülmüş) arasında beklenmeyen çakışmaları döndürür.
    Parent-çocuk çiftleri ve EXPECTED çiftleri hariç."""
    bpy.context.view_layer.update()
    objs = [o for o in bpy.data.objects if o.type == 'MESH' and o.name.startswith(prefixes)
            and not o.name.startswith(skip)]
    boxes = {}
    for o in objs:
        pts = [o.matrix_world @ Vector(v) for v in o.bound_box]
        lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
        hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
        boxes[o.name] = (lo + Vector((tol_mm,) * 3) * MM, hi - Vector((tol_mm,) * 3) * MM)
    hits = []
    names = list(boxes)
    for i, a in enumerate(names):
        for b in names[i + 1:]:
            oa, ob = bpy.data.objects[a], bpy.data.objects[b]
            if oa.parent == ob or ob.parent == oa or frozenset((a, b)) in EXPECTED:
                continue
            (al, ah), (bl, bh) = boxes[a], boxes[b]
            if all(al[k] < bh[k] and bl[k] < ah[k] for k in range(3)):
                hits.append((a, b))
    return hits
```

Not: Kartların kendi bileşenleri (çocukları) parent-çocuk ilişkisi nedeniyle çakışma sayılmaz.
Silindirlerin AABB'si köşelerde gerçekte olmayan bir çakışma gösterebilir. Böyle bir sonucu raporda "silindir AABB" olarak not et ve geometriyi gözle kontrol et.
