# Dashboard (Halo)

Flame in Freefall dashboard'unun Halo tasarım diliyle yapılmış statik web sürümü. Dört ekran var:
Explore (Keşif), Scenario (Senaryo), Equipment (Ekipman), Live (Canlı). Kurulum ya da sunucu gerektirmez.

## Çalıştırma

`index.html` dosyasını tarayıcıda aç. Belirli bir ekran için adresin sonuna `#explore`, `#scenario`,
`#equipment` ya da `#live` ekle. Eski Türkçe adresler (`#kesif` gibi) de çalışır.

## Dil

Arayüz yalnız **İngilizce**; dil seçimi yok. Metinlerin hepsi `i18n.js` içinde.
Kod yorumları ve bu README Türkçe kaldı.

## Düzen

Eski Python arayüzünün düzenini izler: iş mantığı arayüzden ayrıdır,
sabitler tek dosyadadır, metinler ayrı tutulur.

| Dosya | Repodaki karşılığı | İçerik |
|---|---|---|
| `index.html`, `app.js` | (eski giriş dosyası) | Giriş noktası; bölümleri çizer, `#bölüm` değerine göre görünümü çalıştırır |
| `config.js` | `app/config.py` | Tüm sabitler: Olson katsayıları, bulgu değerleri, seçenekler, örnek sensör değerleri |
| `i18n.js` | `app/i18n.py` | Arayüz metinleri (`FF.t`) ve sayı biçimi (`FF.num`); yalnız İngilizce |
| `core/physics.js` | `app/core/physics.py` | Olson U-eğrisi. Metin üretmez; `regime()` kod döndürür |
| `core/data.js` | `app/core/data.py` | 24 deneyin listesi ve BASS-II'nin 129 testi. `veriseti/` klasöründen üretildi |
| `ui/theme.css` | `app/ui/theme.py` | Halo tokenları ve temel sınıflar |
| `ui/components.js` | `app/ui/components.py` | Satır, çizgi, seçenek, dürüstlük bandı |
| `ui/charts.js` | `app/ui/charts.py` | SVG grafikler: sınır eğrisi, senaryo noktası, sınır çizgileri, halka |
| `views/*.js` | `app/views/*.py` | Her ekran için bir dosya |

Dosyalar ES modülü değil, `window.FF` altında toplanan düz script'ler. Böylece sayfa `file://` üzerinden,
sunucu olmadan açılıyor. Yükleme sırası `index.html` içinde.

## Halo kuralları

Tasarım dili Claude hesabındaki "Halo" design system artifact'ında tanımlı. Bu klasörde uyulan kurallar:

- Zemin siyah, marka rengi yok. Vurgu parlaklıkla, durumlar opaklıkla verilir.
- Her ekranda tek ışıklı öğe var: Keşif'te eğri, Senaryo'da nokta, Ekipman'da alt çizgi, Canlı'da halka.
- Veri düz satırdır: başlık solda, değer sağda, gruplar arasında ince çizgi. Kart, rozet, ikon yok.
- Sekme çubuğu yok. Bölümler düz metin: seçili olan parlak, diğerleri soluk.
- "Dürüstlük ve Sınırlar" bandı her ekranın altında soluk bir paragraftır.

Halo'da grafik tanımlı değil. Buradaki grafikler dilin "ışıklı biçim" kuralıyla çizildi; bu, dile bu proje
için yapılmış bir eklemedir.

### Sürüm 2 süslemeleri (2026-11-14)

Dil aynı kaldı: renk yok, kart yok, ana ışıklı öğe ekranın en parlak şeyi. Eklenenlerin hepsi ışıktan ve
ana öğeden daha soluk:

- **Yazı tipi:** Inter (Google Fonts). Çevrimdışı açılırsa sistem yazı tipine düşer. Tabular rakamlar yalnızca
  sayı sütunlarında, çünkü Inter'de bu ayar tireyi de genişletiyor.
- **Ortam:** Köşelerden gelen yumuşak ışık ve sağ üstte soluk bir yıldız dokusu.
- **Üst bar:** Halka biçimli marka işareti, numaralı bölümler (01–04) ve seçili bölümün altında ışıklı bir nokta.
  Seçimi gösteren ortak motif bu ışıklı nokta: aynı nokta Senaryo'daki seçenek rayında da kullanılıyor.
- **Üst etiketler (eyebrow):** Her sütunun ve dürüstlük bandının üstünde küçük, aralıklı, büyük harfli bir etiket.
- **Çizgiler:** Uçlara doğru solar. Seçili satırın solunda ışıklı bir çubuk var.
- **Keşif:** Her deneyin tablo satırı sayısı log ölçekli ince bir çizgiyle gösteriliyor. Eğri açılışta çiziliyor,
  üstünden "yanar" bölgesine doğru solan bir ışık yükseliyor ve dip noktası işaretli.
- **Senaryo:** Nokta nabız atıyor. Kesikli yardımcı çizgiler eksenlere iniyor; pay grafiğin içinde de yazıyor.
- **Ekipman:** Bulgular numaralı. İki sınır arasındaki 1,9 puanlık fark taralı bir alanla ve parantezle gösteriliyor.
  Ana çıkarım daha büyük yazılıyor.
- **Canlı:** Halkadaki ışık kuyruklu (conic-gradient) ve ucunda ışıklı bir nokta var. Kadranda işaretler var,
  "Sakin" durumu nabız atan bir noktayla gösteriliyor.
- **Grafik plakası:** Grafiklerin çevresinde dört köşe işareti var; kenar çizgisi yok.
- **Hareket:** Giriş animasyonu yalnızca bölüm değişince oynar (`app.js` içinde `.enter`). `prefers-reduced-motion`
  açıksa tüm hareketler kapanır.

### Logo (2026-11-14)

Üst barın solunda NASA Space Apps Challenge logosu, sağında ince bir çizgi ve proje adı var. Halo'da renk
olmadığı için logonun siyah ve kırmızı kısımları açık ışık rengine (`#f5f5f7`) çevrildi; saydamlık korundu.

| Dosya | İçerik |
|---|---|
| `assets/logo_orijinal.png` | Kullanıcının verdiği özgün logo (580×227, saydam zemin) |
| `assets/logo.png` | Halo'ya uyarlanmış logo; üst barda kullanılır |
| `assets/favicon.png` | Sekme simgesi: siyah yuvarlak kare üzerinde logonun halka işareti (64×64) |
| `assets/logo_uyarla.py` | Bu iki dosyayı özgün logodan üreten script (Pillow gerekir) |

Logo değişirse bu klasörden, Pillow kurulu bir Python ile:
`python assets/logo_uyarla.py assets/logo_orijinal.png assets`

### Kaydırmasız düzen (2026-11-14)

Genişliği 900 px ve üstü olan ekranlarda sayfa tam ekran yüksekliğindedir; kaydırma gerekmez.

- **Ölçüler ekran yüksekliğine bağlı:** Yazı ve boşluklar `vh` ile ölçeklenir (`theme.css` içindeki `--fs`,
  `--space-rule` gibi tokenlar). 1000 px yükseklikte Halo'nun özgün ölçüleri (20/26, 17/22) kullanılır;
  daha alçak ekranlarda en fazla 14 px'e kadar küçülür.
- **Grafikler kalan alanı doldurur:** `plate(svg, en/boy)` grafiği `.plate-fit` içine koyar. Bu kutu container
  query ile ölçülür ve grafik en-boy oranını koruyarak sığabildiği en büyük boyuta gelir. Canlı'daki halka
  ekran yüksekliğinin %44'ü kadardır (en fazla 320 px).
- **Keşif:** 24 deney iki sütuna akar (önce sol sütun dolar). Deney ayrıntıları grafiğin altında iki sütunlu bir
  ızgaradadır.
- **Ekipman:** FlameSense satırları sol sütundan sahneye, ana çıkarımın altına taşındı.
- **Dürüstlük bandı:** Etiket solda, metin sağda, tek blok halinde.
- **Denetim:** 1920×1080, 1680×1050, 1440×900, 1366×768, 1280×720 ve 1024×700 boyutlarında dört ekranın da
  taşmadığı ölçüldü.
- 900 px'ten dar ekranlarda (dikey tablet, telefon) düzen tek sütuna döner ve sayfa normal şekilde kayar.

## Veri ve sınırlar

- Keşif ve Senaryo'daki sayılar gerçek: `veriseti/raw/PSI-25/` altındaki BASS-II deney tablosu ve
  `physics.py` ile aynı Olson formülü.
- Ekipman'daki bulgular `app/config.py` sabitlerinden; kaynakları BASS-II özet raporu.
- Canlı'daki sensör değerleri **örnek** (`config.js` içindeki `LIVE_SAMPLE`). Cihaz bağlı değil.
- Yalnızca BASS-II'nin grafiği var. Diğer deneyler seçilebiliyor ama yalnızca adları ve tablo satır sayıları
  görünüyor.
- Mimarideki O₂ × basınç zarf grafiği yok; BASS-II tablosunda basınç bulunmadığı için O₂ × akış çizildi.
- Model, tahmin aralığı ve FastAPI bağlantısı yok. Bu klasör tasarımın çalışan bir taslağı; repodaki
  `plans/05_backend_dashboard` planının yerine geçmez.

## Tuval

Aynı tasarımın Claude tuvalindeki hali: https://claude.ai/artifact/BaiNyS9K1hX96pUi9WUgMi (hesap sahibine özel).
