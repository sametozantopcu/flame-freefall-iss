# FlameSense 3D — Değişiklik günlüğü

## v1
- MODEL_PLAN.md'den ilk üretim (kasa, sensörler, elektronik, etiketler, kamera/ışık, 3 render).
- Bilinen hatalar: ön-sağ (+X/-Y) köşede dikey yarık; etiketler beyaz ve okunmaz/üst üste.

## v2
- Kasa köşe hatası düzeltildi: FS_Base ve FS_Lid'deki bevel (bmesh) dikey köşeleri yuvarlamak yerine 6x6 mm'lik kare çentik bırakıyordu (dış hat L şeklinde), bu da ön-sağ köşede yarık olarak görünüyordu. Gövdeler gerçek yuvarlatılmış dikdörtgen prizmadan (r=6 dış, r=3.5 iç boşluk) yeniden kuruldu; tüm planlı kesimler (ızgaralar, ön havalandırma, USB-C) korundu. Mesh mevcut nesnelere atandı (FS_Lid çocukları bozulmadı).
- Etiketler: FS_Mat_Label koyu antrasit (emisyonsuz, speküler 0), 0.3 mm extrude + ince bevel, boyut 4.5 mm, gölge kapalı. AIR IN/AIR OUT ve kapak etiketleri (OLED, LED, Buzzer, IR) arka plan üzerinde kaldığı için marka turuncusu. Etiketler çakışmayacak şekilde taşındı; AIR IN/OUT görünür konuma alındı.
- Patlatılmış görünüm kamerası (300,-400,150 mm, lens 62) ve etiket konumları (yalnız render sırasında) ayarlandı.
- Üç render yeniden alındı; versions/v1 ve versions/v2 anlık görüntüleri eklendi.

## v3
- Form ve renkler v2 ile aynı; gerçekçi detay eklendi: kalkanlı ESP32-S3 modülü, USB-C soketi, regülatör, IMU, SMD sıraları, JST konnektörler, pirinç standoff'lar ve vidalar, ipek baskı yazısı.
- Sensörler gerçek biçimlerine yaklaştırıldı: LuminOx O2 (filtre kapaklı), CO (filtre kapaklı), kart üstünde SCD41, kanala sarkan hot-wire, etiketli ve giriş/çıkış yarıklı SPS30, BME280 kartı.
- Sensörler anakartın JST konnektörlerine 6 kablo ile bağlandı. Hava kanalı girişine toz filtresi ve kanal eyerleri eklendi.
- Kasa: dört köşede kapak vidaları (havşa başlı, yıldız yuvalı) ve vida kuleleri, montaj kulakları, kauçuk ayaklar, ön yüzde ürün etiketi (FLAMESENSE CN-1). Köşeler rprism ile yuvarlatıldı (kare çentik yok).
- Kapak altı: UI kartı, OLED kartı, buzzer, IR kartı.
- Dört render: monte, iç, detay (yeni) ve patlatılmış. Etiketler render sırasında ekran konumlarına yerleştirilip sonra geri alınıyor.
- Ayarlar: patlatılmış kamera (300,-400,190) lens 58 (plandaki z=150 ön duvar yüzünden kartı gizliyordu); FS_Label_ESP32 ile FS_Label_Main aynı parçaya bağlı olduğundan yalnızca FS_Label_Main bırakıldı.
- versions/v3 anlık görüntüsü eklendi.
