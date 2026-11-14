# FlameSense — Blender modelleme planı (uygulayıcı için)

Kaynak: `flame-freefall-iss/Architecture.md` §4.2 (origin/main). Bu plan **tasarım kararlarının tamamını** içerir.
Uygulayıcı yeni karar vermez; ölçüleri ve koordinatları aynen kullanır. Sadece render ışığı/kadrajı ve
etiket konumları gözle kontrol edilip ince ayar yapılabilir.

## 0. Kurallar

- Blender 5.3, MCP üzerinden. Araçlar ertelenmiş: önce `ToolSearch` ile `+Blender` (max_results 30) yükle.
  Bağlantı hatası olursa dur ve hatayı aynen raporla. Blender'ı kendin başlatma, `*_for_cli` araçlarını kullanma.
- Açık dosya kaydedilmemiş varsayılan sahne: `Collection` içinde `Camera`, `Cube`, `Light`.
  **Bunları silme, düzenleme.** Sadece `Collection`'ı view layer'dan hariç tut (S0).
- Senin oluşturduğun her nesnenin adı `FS_` ile başlar. `FS_` ile başlamayan hiçbir şeyi silme/değiştirme.
- Yardımcı fonksiyonlar aynı adlı nesneyi silip yeniden oluşturur. Yani bir adımı tekrar çalıştırmak güvenlidir.
  Bir adım hata verirse sadece o adımı düzeltip tekrar çalıştır.
- Her `execute_blender_code` çağrısı tek bir adımı yapsın ve şu satırla başlasın:
  `exec(bpy.data.texts["fs_helpers.py"].as_string())` (S1'den sonra). Kod sonunda kısa bir dict döndür.
- Her adımın sonunda `bpy.ops.wm.save_mainfile()` ile kaydet.
- Ekran görüntüsünü az kullan (bağlam doluyor): sadece S4, S7 sonrası ve her render sonrası bak.

## 1. Koordinat sistemi ve birimler

- Blender birimi metre, ölçüler planda **mm**. Yardımcılar mm alır ve `MM = 0.001` ile çevirir.
- Sahne: `unit_settings.system='METRIC'`, `scale_length=1.0`, `length_unit='MILLIMETERS'`.
- Orijin: kasanın **alt yüzünün merkezi**. +X sağ (hava akışı −X'ten +X'e), −Y ön, +Z üst.
- Üst yüz (+Z) kabine bakan yüzdür: OLED, LED'ler, IR penceresi, logo burada.

## 2. Kasa (FS_Enclosure)

Dış ölçü **140 × 90 × 45 mm**, duvar 2.5 mm, dikey köşe yarıçapı 6 mm (iç boşluk 3.5 mm).

| Nesne | İşlem |
|---|---|
| `FS_Base` | box 140×90×32, merkez (0,0,16), bevel 6. Kes: box 135×85×32 merkez (0,0,18.5) bevel 3.5 (üstü açık tepsi) |
| `FS_Lid` | box 140×90×13, merkez (0,0,38.5), bevel 6. Kes: box 135×85×11.5 merkez (0,0,36.75) bevel 3.5 (üst plaka z 42.5–45) |
| Giriş ızgarası (FS_Base, −X duvarı) | 5 yarık, her biri box 6×18×1.8, merkez (−68.75, 25, z), z = 6.5, 9.5, 12.5, 15.5, 18.5 |
| Çıkış ızgarası (FS_Base, +X duvarı) | 4 yarık, box 6×30×1.5, merkez (68.75, 22, z), z = 6, 8.5, 11, 13.5 |
| Ön havalandırma (FS_Base, −Y duvarı) | 4 yarık, box 2×6×14, merkez (x, −43.75, 16), x = 46, 50, 54, 58 |
| USB-C deliği (FS_Base, −X duvarı) | box 6×11×5, merkez (−68.75, −20, 11.7) |
| `FS_Tab_1..4` | box 10×14×3, merkez (±75, ±30, 1.5); her birine delik: cyl d4.2 h4 aynı merkez |
| `FS_Accent_Stripe` | box 120×6×0.4, merkez (0, 37, 45.2), turuncu. **Parent: FS_Lid** |
| `FS_Bezel` | box 100×32×0.6, merkez (−12, −20, 45.3), koyu. **Parent: FS_Lid** |
| `FS_Logo` | 3D yazı "FLAMESENSE", size 6, extrude 0.2, align CENTER, konum (−25, 24, 45.1), koyu. **Parent: FS_Lid** |

## 3. Hava kanalı ve arka bölge sensörleri

Hava −X girişten girer, kanaldan geçip SPS30'a, oradan +X çıkışa gider.

| Nesne | Şekil, ölçü (mm) | Merkez (x, y, z) | Malzeme | Parent |
|---|---|---|---|---|
| `FS_Duct` | box 91×24×16, iç kesim box 95×21×13 aynı merkez (iki ucu açık tüp) | (−22, 25, 12) | DuctPlastic | – |
| `FS_Sensor_O2` | cyl d20 h17 | (−56, 25, 26.5) | Metal | – |
| `FS_O2_Cap` | cyl d14 h1 | (−56, 25, 35.5) | BlackPlastic | FS_Sensor_O2 |
| `FS_Sensor_CO` | cyl d20 h17 | (−33, 25, 26.5) | SensorWhite | – |
| `FS_SCD41_Board` | box 20×20×1.6 | (−11, 25, 20.8) | PCB_Green | – |
| `FS_Sensor_SCD41` | box 10.1×10.1×6.5 | (−11, 25, 24.85) | BlackPlastic | FS_SCD41_Board |
| `FS_Anemometer_Board` | box 24×17.5×1.6 | (12, 25, 20.8) | PCB_Green | – |
| `FS_Sensor_Anemometer_Tip` | cyl d3 h10 | (20, 25, 14) | Metal | FS_Anemometer_Board |
| `FS_Sensor_SPS30` | box 41×41×12 | (44, 22, 10) | BlackPlastic | – |
| `FS_SPS30_Shield` | box 38×38×0.4 | (44, 22, 16.2) | Metal | FS_Sensor_SPS30 |

## 4. Ön bölge elektroniği

| Nesne | Şekil, ölçü (mm) | Merkez (x, y, z) | Malzeme | Parent |
|---|---|---|---|---|
| `FS_PCB_ESP32S3` | box 69×25.4×1.6 | (−25, −20, 9.3) | PCB_Green | – |
| `FS_ESP32_Module` | box 25.5×18×3.2 | (−6, −20, 11.7) | Metal | FS_PCB_ESP32S3 |
| `FS_USBC` | box 7.5×9×3.2 | (−58.5, −20, 11.7) | Metal | FS_PCB_ESP32S3 |
| `FS_Standoff_1..4` | cyl d4 h6 | (−56, −30, 5.5), (−56, −10, 5.5), (6, −30, 5.5), (6, −10, 5.5) | Metal | – |
| `FS_IMU_Board` | box 20×15×1.6 | (22, −25, 9.3) | PCB_Green | – |
| `FS_Sensor_IMU` | box 3×3×1 | (22, −25, 10.6) | BlackPlastic | FS_IMU_Board |
| `FS_IMU_Standoff` | cyl d6 h6 | (22, −25, 5.5) | Metal | – |
| `FS_BME_Board` | box 15×12×1.6 | (52, −34, 9.3) | PCB_Green | – |
| `FS_Sensor_BME280` | box 2.5×2.5×0.9 | (52, −34, 10.55) | Metal | FS_BME_Board |
| `FS_BME_Standoff` | cyl d6 h6 | (52, −34, 5.5) | Metal | – |
| `FS_ION_Channel` | cyl d25 h15 (KONSEPT, radyoaktif kaynak detayı YOK) | (50, −12, 10) | ConceptGrey | – |

## 5. Kapak altı arayüz ve IR (hepsinin parent'ı FS_Lid)

| Nesne | Şekil, ölçü (mm) | Merkez (x, y, z) | Malzeme |
|---|---|---|---|
| `FS_OLED_Board` | box 27×27×1.6 | (−40, −20, 41.7) | PCB_Blue |
| `FS_OLED_Screen` | box 22×11×0.3 | (−40, −20, 45.75) | OLED (ışıyan) |
| `FS_LED_Green` | cyl d5 h4 | (−12, −20, 44.6) | LED_Green |
| `FS_LED_Amber` | cyl d5 h4 | (−2, −20, 44.6) | LED_Amber |
| `FS_LED_Red` | cyl d5 h4 | (8, −20, 44.6) | LED_Red |
| `FS_Buzzer` | cyl d12 h9 | (25, −20, 38) | BlackPlastic |
| `FS_Buzzer_Hole_1..7` | cyl d1.6 h0.1; biri (25, −20), altısı onun çevresinde 3 mm yarıçaplı altıgen | z = 45.65 | BlackPlastic |
| `FS_IR_Board` | box 25×18×1.6 | (30, 22, 41.7) | PCB_Green |
| `FS_Sensor_IR` | cyl d9 h4.2 | (30, 22, 43.6) | Metal |
| `FS_IR_Window` | cyl d14 h0.5 | (30, 22, 45.25) | Bezel |

## 6. Malzemeler (Principled BSDF; renkler doğrusal RGB)

| Ad | Base color | Roughness | Metallic | Emission (renk, güç) |
|---|---|---|---|---|
| `FS_Mat_Shell` | (0.82, 0.83, 0.84) | 0.55 | 0 | – |
| `FS_Mat_Orange` (#D95926) | (0.693, 0.100, 0.019) | 0.40 | 0 | – |
| `FS_Mat_Bezel` | (0.02, 0.02, 0.025) | 0.30 | 0 | – |
| `FS_Mat_PCB_Green` | (0.02, 0.18, 0.06) | 0.40 | 0 | – |
| `FS_Mat_PCB_Blue` | (0.02, 0.05, 0.25) | 0.40 | 0 | – |
| `FS_Mat_Metal` | (0.80, 0.80, 0.82) | 0.30 | 1 | – |
| `FS_Mat_BlackPlastic` | (0.015, 0.015, 0.015) | 0.50 | 0 | – |
| `FS_Mat_SensorWhite` | (0.90, 0.90, 0.88) | 0.50 | 0 | – |
| `FS_Mat_DuctPlastic` | (0.60, 0.62, 0.65) | 0.50 | 0 | – |
| `FS_Mat_ConceptGrey` | (0.35, 0.36, 0.40) | 0.60 | 0.2 | – |
| `FS_Mat_OLED` | (0, 0, 0) | 0.20 | 0 | (0.4, 0.9, 1.0), 4 |
| `FS_Mat_LED_Green` | (0.1, 1, 0.2) | 0.20 | 0 | (0.1, 1, 0.2), 6 |
| `FS_Mat_LED_Amber` | (1, 0.55, 0.05) | 0.20 | 0 | (1, 0.55, 0.05), 6 |
| `FS_Mat_LED_Red` | (1, 0.08, 0.05) | 0.20 | 0 | (1, 0.08, 0.05), 6 |
| `FS_Mat_Label` | (1, 1, 1) | 0.50 | 0 | (1, 1, 1), 1.5 |

Kasa parçaları (`FS_Base`, `FS_Lid`, `FS_Tab_*`) Shell malzemesini kullanır.

## 7. Koleksiyonlar

`FlameSense` (sahne koleksiyonunun altında). Alt koleksiyonları:
- `FS_Enclosure`: Base, Lid, Tab'lar, Duct, Bezel, Stripe, Logo, IR_Window
- `FS_Electronics`: PCB, Module, USBC, Standoff'lar, OLED_Board, IR_Board, SCD41/Anemometer/IMU/BME board'ları
- `FS_Sensors`: O2, O2_Cap, CO, SCD41, Anemometer_Tip, SPS30, SPS30_Shield, IMU, BME280, ION_Channel, IR
- `FS_UI`: OLED_Screen, LED'ler, Buzzer, Buzzer_Hole'lar
- `FS_Labels`, `FS_Lighting_Camera`

Kesici nesneler geçici olarak `FS_tmp_cutters` koleksiyonuna konur; S10'da bu koleksiyon silinir.

## 8. Etiketler (FS_Labels, İngilizce)

`label(...)` yardımcısını kullan: yazı boyu 3.5 mm, parçanın tepesinin 8 mm üstünde durur, parent'ı o parçadır,
`TRACK_TO` ile `FS_Camera`'ya bakar. Hepsinin malzemesi `FS_Mat_Label`.

| Etiket | Parça |
|---|---|
| `FS_Label_ESP32` "ESP32-S3" | FS_PCB_ESP32S3 |
| `FS_Label_O2` "O2 (LuminOx)" | FS_Sensor_O2 |
| `FS_Label_CO` "CO (electrochem.)" | FS_Sensor_CO |
| `FS_Label_CO2` "CO2 (SCD41)" | FS_SCD41_Board |
| `FS_Label_Flow` "Airflow (hot-wire)" | FS_Anemometer_Board |
| `FS_Label_PM` "Particles (SPS30)" | FS_Sensor_SPS30 |
| `FS_Label_ION` "ION channel (concept)" | FS_ION_Channel |
| `FS_Label_BME` "P / T / RH (BME280)" | FS_BME_Board |
| `FS_Label_IMU` "IMU" | FS_IMU_Board |
| `FS_Label_IR` "IR array (MLX90640)" | FS_IR_Board |
| `FS_Label_OLED` "OLED" | FS_OLED_Board |
| `FS_Label_LED` "Status LEDs" | FS_LED_Amber |
| `FS_Label_Buzzer` "Buzzer" | FS_Buzzer |
| `FS_Label_AirIn` "AIR IN" | nesne yok, sabit konum (−82, 25, 14) |
| `FS_Label_AirOut` "AIR OUT" | nesne yok, sabit konum (82, 22, 10) |

Render'da etiketler üst üste binerse etiketin x/y konumunu birkaç mm kaydır. Bunun dışında bir değişiklik yapma.

## 9. Kamera, ışık, render

- `FS_CamTarget`: empty. `FS_Camera`: lens 60 mm, clip_start 0.001; `TRACK_TO` FS_CamTarget
  (track_axis `TRACK_NEGATIVE_Z`, up `UP_Y`). Bu kamerayı `scene.camera` yap.
- Işıklar AREA tipinde, hepsi `TRACK_TO` FS_CamTarget:
  - `FS_Key`: size 250 mm, konum (300, −250, 400), 40 W
  - `FS_Fill`: size 300 mm, konum (−350, −200, 200), 15 W
  - `FS_Rim`: size 200 mm, konum (0, 350, 300), 30 W
- World arka planı (0.5, 0.52, 0.55), güç 0.4.
- Motor: `scene.render.bl_rna.properties['engine'].enum_items` içinde `BLENDER_EEVEE_NEXT` varsa onu, yoksa
  `BLENDER_EEVEE` kullan. Çözünürlük 1600×1000, %100; EEVEE örnek sayısı 32. EEVEE hata verirse
  `BLENDER_WORKBENCH` kullan ve raporda belirt.
- Gerekirse ışık güçlerini ayarla: kasa beyaza patlamamalı, koyu parçalar seçilebilmeli.

Çekimler (kamera ve hedef konumları mm):

| Dosya | Kamera | Hedef | Durum |
|---|---|---|---|
| `render_assembled.png` | (260, −330, 240) | (0, 0, 20) | Her şey kapalı ve monte; `FS_Labels` render'da gizli |
| `render_internal.png` | (200, −260, 330) | (0, 5, 15) | `FS_Lid` ve tüm çocukları gizli; bunların etiketleri (IR, OLED, LED, Buzzer) de gizli; diğer etiketler görünür |
| `render_exploded.png` | (300, −380, 320), lens 50 | (0, 0, 50) | `explode(True)`, tüm etiketler görünür |

`explode` Z ofsetleri (mm). Sadece parent'ı olmayan nesneler ofsetlenir, çocuklar onlarla birlikte gelir:
`FS_Lid` +55, `FS_Sensor_O2` +25, `FS_Sensor_CO` +25, `FS_SCD41_Board` +25, `FS_Anemometer_Board` +25,
`FS_Duct` +10, `FS_Sensor_SPS30` +10, `FS_PCB_ESP32S3` +5.

Her render'dan sonra PNG'yi `Read` aracıyla aç ve kontrol et:
- görüntü siyah ya da patlak değil,
- cihaz kadrajın ortasında ve %60–80'ini kaplıyor,
- varsayılan küp görünmüyor,
- havada asılı ya da kasanın içinden geçen parça yok.
Sorun varsa düzelt ve tekrar render al.

**Bitişte:** `explode(False)` çalıştır ve tüm gizlemeleri geri al (kasa monte, etiketler render'da gizli).
`FS_tmp_cutters` koleksiyonunu sil ve kaydet.

## 10. Adımlar

| Adım | İş |
|---|---|
| S0 | Araçları yükle; `get_objects_summary`; sahne sadece varsayılan Collection'dan oluşuyorsa `view_layer.layer_collection.children['Collection'].exclude = True`; birimleri ayarla; klasörü oluştur (`os.makedirs`); `bpy.ops.wm.save_as_mainfile(filepath=r"C:\Users\Ruzgar\Desktop\nasa\tasarımlar\tasarım 1\flamesense.blend")` |
| S1 | Aşağıdaki **yardımcı kodu** `bpy.data.texts` içinde `fs_helpers.py` adlı bir text datablock'a yaz (varsa üzerine yaz) ve bir kez `exec` ederek test et |
| S2 | Koleksiyonlar (§7) ve malzemeler (§6) |
| S3 | `FS_Base` + kesimler (§2) + Tab'lar + Tab delikleri |
| S4 | `FS_Lid` + Stripe, Bezel, Logo (parent FS_Lid). Viewport ekran görüntüsüyle kontrol et |
| S5 | Kanal ve arka bölge sensörleri (§3) |
| S6 | Ön bölge elektroniği (§4) |
| S7 | Kapak altı arayüz + IR (§5), hepsini FS_Lid'e bağla. Viewport ekran görüntüsüyle kontrol et |
| S8 | Etiketler (§8). Önce kamera gerekiyorsa S9'daki `FS_Camera`'yı önce oluştur |
| S9 | Kamera, ışıklar, world, render ayarları (§9) |
| S10 | Üç render + her birinin kontrolü; monte duruma dönüş; geçici koleksiyonu sil; kaydet |
| S11 | Raporla |

## 11. Yardımcı kod (`fs_helpers.py`, S1'de aynen yazılır)

```python
import bpy, bmesh, math, os
from mathutils import Vector

MM = 0.001

def coll(name, parent=None):
    c = bpy.data.collections.get(name)
    if c is None:
        c = bpy.data.collections.new(name)
        (parent or bpy.context.scene.collection).children.link(c)
    return c

def mat(name, color, rough=0.5, metal=0.0, emit=None, strength=0.0):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    try:
        if not m.use_nodes:
            m.use_nodes = True
    except Exception:
        pass
    b = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    b.inputs["Base Color"].default_value = (*color, 1.0)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if emit:
        b.inputs["Emission Color"].default_value = (*emit, 1.0)
        b.inputs["Emission Strength"].default_value = strength
    m.diffuse_color = (*color, 1.0)   # viewport rengi
    return m

def M(name):
    return bpy.data.materials["FS_Mat_" + name]

def _obj(name, data, c, material=None):
    old = bpy.data.objects.get(name)
    if old:
        bpy.data.objects.remove(old, do_unlink=True)
    o = bpy.data.objects.new(name, data)
    c.objects.link(o)
    if material is not None:
        o.data.materials.append(material)
    return o

def box(name, size, center, c, material=None, bevel=0.0):
    sx, sy, sz = (v * MM for v in size)
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=(sx, sy, sz), verts=bm.verts)
    if bevel > 0:
        edges = [e for e in bm.edges
                 if abs((e.verts[0].co - e.verts[1].co).normalized().z) > 0.99]
        bmesh.ops.bevel(bm, geom=edges, offset=bevel * MM, segments=8, affect='EDGES')
    bm.to_mesh(me)
    bm.free()
    o = _obj(name, me, c, material)
    o.location = Vector(center) * MM
    return o

def cyl(name, d, h, center, c, material=None, axis='Z', segs=48):
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=segs,
                          radius1=d / 2 * MM, radius2=d / 2 * MM, depth=h * MM)
    bm.to_mesh(me)
    bm.free()
    o = _obj(name, me, c, material)
    o.location = Vector(center) * MM
    if axis == 'X':
        o.rotation_euler = (0, math.pi / 2, 0)
    elif axis == 'Y':
        o.rotation_euler = (math.pi / 2, 0, 0)
    return o

def cut(target, specs):
    """specs: [(size, center), (size, center, bevel), ('cyl', d, h, center, axis)] — mm, dünya koordinatı."""
    tmp = coll("FS_tmp_cutters")
    cutters = []
    for i, s in enumerate(specs):
        nm = f"FS_cut_{target.name}_{i}"
        if s[0] == 'cyl':
            _, d, h, ctr, ax = s
            cutters.append(cyl(nm, d, h, ctr, tmp, axis=ax, segs=24))
        else:
            cutters.append(box(nm, s[0], s[1], tmp, bevel=s[2] if len(s) > 2 else 0.0))
    for ct in cutters:
        md = target.modifiers.new("cut", 'BOOLEAN')
        md.operation = 'DIFFERENCE'
        md.object = ct
        try:
            md.solver = 'EXACT'
        except Exception:
            pass
    bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get()
    new_me = bpy.data.meshes.new_from_object(target.evaluated_get(dg))
    target.modifiers.clear()
    target.data = new_me
    for ct in cutters:
        bpy.data.objects.remove(ct, do_unlink=True)
    return target

def parent_keep(child, parent):
    bpy.context.view_layer.update()
    child.parent = parent
    child.matrix_parent_inverse = parent.matrix_world.inverted()

def label(name, text, part=None, pos=None, c=None, cam=None, dz=8, size=3.5):
    cu = bpy.data.curves.new(name, 'FONT')
    cu.body = text
    cu.size = size * MM
    cu.align_x = 'CENTER'
    cu.align_y = 'CENTER'
    o = _obj(name, cu, c or coll("FS_Labels"), M("Label"))
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

def look_at_light(name, size, pos, power, target, c):
    ld = bpy.data.lights.get(name) or bpy.data.lights.new(name, 'AREA')
    ld.size = size * MM
    ld.energy = power
    o = _obj(name, ld, c)
    o.location = Vector(pos) * MM
    con = o.constraints.new('TRACK_TO')
    con.target = target
    con.track_axis = 'TRACK_NEGATIVE_Z'
    con.up_axis = 'UP_Y'
    return o

EXPLODE = {"FS_Lid": 55, "FS_Sensor_O2": 25, "FS_Sensor_CO": 25, "FS_SCD41_Board": 25,
           "FS_Anemometer_Board": 25, "FS_Duct": 10, "FS_Sensor_SPS30": 10, "FS_PCB_ESP32S3": 5}

def explode(on=True):
    for name, dz in EXPLODE.items():
        o = bpy.data.objects[name]
        if on and "fs_z0" not in o:
            o["fs_z0"] = o.location.z
            o.location.z += dz * MM
        elif not on and "fs_z0" in o:
            o.location.z = o["fs_z0"]
            del o["fs_z0"]
    bpy.context.view_layer.update()

def set_hidden(names, hidden):
    for n in names:
        o = bpy.data.objects.get(n)
        if o:
            o.hide_render = hidden
            o.hide_set(hidden)

def lid_family():
    lid = bpy.data.objects["FS_Lid"]
    return ["FS_Lid"] + [o.name for o in lid.children_recursive]

def render_to(path):
    bpy.context.scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
    return os.path.exists(path)
```

Not: `lid_family()` kapağın çocuklarını ve onların etiketlerini de döndürür, çünkü etiketler parçalarının çocuğudur.
`render_internal.png` için `set_hidden(lid_family(), True)` yeterlidir.

## 12. Rapor (kısa düz metin)

- Tamamlanan adımlar; plandan sapılan her yer ve nedeni.
- `.blend` dosyasının ve 3 PNG'nin tam yolları.
- Kullanılan render motoru, son ışık güçleri.
- Önceden var olan sahnede değiştirilen tek şey: `Collection` exclude.
