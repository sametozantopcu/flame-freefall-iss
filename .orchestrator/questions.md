# Gate 1 soruları (2026-11-14)

12 soru, 3 grup (her grup bir AskUserQuestion çağrısı). Araç her soruya otomatik "Diğer" ekler. Video/mp4 kapsamı iptal; sorulmadı.
Notlar: streamlit/plotly kurulum izni Soru 4 içinde; "src/ üzerine yeni UI" seçeneği kurulum iznini de içerir.

---

## Grup 1 — Kapsamı belirleyen kararlar

### Soru 1
- **Başlık:** Süre
- **Soru:** Teslime ne kadar vaktiniz var? Space Apps sitesindeki "Submit for Judging" son saati nedir (saat dilimiyle)?
- **multiSelect:** hayır
- **Seçenekler:**
  1. **Yaklaşık 6–12 saat (Önerilen)** — Bugün/gece içinde teslim; yalnızca küçük, çalışan bir dikey dilim hedeflenir. Gerekçe: etkinlik 14–15 Kasım, veri katmanı hazır ama skor/model/UI kodu yok.
  2. **12–24 saat** — Yarın gün içine kadar; M1 + M2 birlikte mümkün olur.
  3. **24 saatten fazla** — Teslim 15 Kasım gün sonuna yakın; FlameSense/M3 de değerlendirilebilir.
  4. **2–6 saat** — Acil mod; yalnızca statik/ön hesaplanmış bir sayfa ve sunum.
- **Bu cevap neyi değiştirir?** Plan derinliği, kaç adımın yapılacağı, doğrulama sıklığı ve neyin kesileceği. (Kesin saati "Diğer" ile yazın.)

### Soru 2
- **Başlık:** Ekip
- **Soru:** Ekipte kaç kişi çalışıyor ve işler nasıl bölünüyor?
- **multiSelect:** hayır
- **Seçenekler:**
  1. **Yalnız ben + Claude (Önerilen)** — Kod/plan tamamen Claude'da, kullanıcı karar ve teslimi yapar. Gerekçe: hafıza notu kullanıcıyı lider, Claude'u tek geliştirici olarak tanımlıyor.
  2. **2–3 kişi, biri sunumda** — Claude kodu yazar; bir kişi proje sayfası/demo anlatımı/İngilizce metni hazırlar.
  3. **2–3 kişi, biri kod yazıyor** — Claude ile paralel kod; modül sahipliği ve dal ayrımı gerekir.
  4. **4+ kişi** — Birden fazla kişi kod/veri/tasarım/sunum üstlenir.
- **Bu cevap neyi değiştirir?** Claude'un sahiplendiği iş kapsamı, paralel iş/çakışma kuralları, sunum ve proje sayfası işlerinin plana girip girmeyeceği.

### Soru 3
- **Başlık:** MVP kapsamı
- **Soru:** MVP demosunda hangi modüller olsun? (Birden fazla seçilebilir.)
- **multiSelect:** evet
- **Seçenekler:**
  1. **M1 Keşif & Sıralama (Önerilen)** — Koşul zarfı ve ön üretilmiş metinle araştırmaları habitat ilgisine göre sıralar. Gerekçe: challenge'ın ana beklentisi (özetle/sırala) ve girdileri hazır.
  2. **M2 Tahmin** — flex/cfi için model, belirsizlik ve basit what-if; veri setleri hazır, model kodu yok.
  3. **M3 Ekipman içgörüsü** — EDA bulgularından (d², Simpson, ACME %21 O2) sayı kaynaklı içgörü kartları; kod yok ama ucuz.
  4. **FlameSense** — Donanım/izleme konseptinin demoda yer alması (bkz. Soru 5).
- **Bu cevap neyi değiştirir?** Hangi `plans/` klasörlerinin MVP'ye girdiği, adım sırası ve kesilecek işler; UI sayfa sayısı.

### Soru 4
- **Başlık:** Arayüz
- **Soru:** Mevcut `app/` açılmıyor (streamlit/plotly kurulu değil, `app/core/models.py` var olmayan `cv`/`features` modüllerini import ediyor, yalnız BASS-II'ye bağlı). Nasıl ilerleyelim? (Seçenek 1–2 `nasa_hack` ortamına `pip install streamlit plotly` iznini içerir.)
- **multiSelect:** hayır
- **Seçenekler:**
  1. **src/ üzerine ince yeni Streamlit (Önerilen)** — Feature Store/metadata'dan okuyan 2–4 sayfalık yeni uygulama; `app/` tema/i18n parçaları yalnızca işe yararsa taşınır. Gerekçe: CLAUDE.md "modüller veriyi yalnızca Feature Store/Metadata'dan okur" der; app/ bunu ihlal ediyor.
  2. **app/'i onar** — `cv`/`features` importlarını sök, bass2_clean.csv ve simülasyon yedeğini geri getir; BASS-II odaklı kalır. Hızlı görünür ama challenge kapsamına dar.
  3. **Streamlit'siz statik HTML** — Ön hesaplanmış tablolar/grafiklerden tek sayfalık dashboard; kurulum gerekmez, deploy kolay.
  4. **Streamlit kurulumuna izin yok** — Yalnızca mevcut ortamla (matplotlib vb.) çıktı üretilir.
- **Bu cevap neyi değiştirir?** `plans/05` adımları, ortam değişikliği (requirements), deploy yolu ve test stratejisi (AppTest mi, statik çıktı mı).

---

## Grup 2 — Teknik ve teslim kararları

### Soru 5
- **Başlık:** FlameSense
- **Soru:** FlameSense MVP'de nasıl yer alsın? (Şu an yalnızca Blender modeli ve render PNG'leri var; plan 04 0/9.)
- **multiSelect:** hayır
- **Seçenekler:**
  1. **MVP dışı, sunumda konsept (Önerilen)** — Render görselleri ve tek slayt/sayfa metniyle "gelecek çalışma". Gerekçe: az süre; gerçek veri/modeli olmayan bileşen puan getirmez, Validity'yi zedeler.
  2. **Simülasyon/replay sayfası** — Kayıtlı/EDA verisi üzerinden sensör akışı simülasyonu ve uyarı mantığı; "simüle" etiketiyle.
  3. **Gerçek donanım** — Sensörlü prototip canlı veri verir; donanım ve kablolama süresi gerekir.
- **Bu cevap neyi değiştirir?** `plans/04` adımlarının tamamen çıkarılması/küçültülmesi, UI'da canlı/replay sayfası, edge/ klasörü ve donanım bağımlılıkları (pymavlink, scapy vb.).

### Soru 6
- **Başlık:** LLM/RAG
- **Soru:** Çalışma zamanında LLM/RAG kullanılacak mı? (EVREN API anahtarı yerelde var; çıktılar commit'li.)
- **multiSelect:** hayır
- **Seçenekler:**
  1. **Ön üretilmiş statik kartlar (Önerilen)** — Çalışma zamanında API çağrısı yok; commit'li metin zarfları ve kartlar gösterilir. Gerekçe: demo deploy'unda anahtar sızıntısı/kota/çevrimdışı riski yok.
  2. **Yerel arama + ön üretilmiş cevap** — TF-IDF/anahtar kelime ile kayıtlı kartlardan arama; LLM çağrısı yok.
  3. **Canlı LLM çağrısı** — Demo ortamında anahtar gizli değişken olarak tutulur; "soru sor" kutusu çalışır.
- **Bu cevap neyi değiştirir?** RAG/E-adımlarının plana girip girmeyeceği, deploy gizli değişkenleri, hata/zaman aşımı yedekleri.

### Soru 7
- **Başlık:** Teslim
- **Soru:** Teslim formatı ne olsun? (Resmi 2026 kuralı doğrulanamadı; 2025'te herkese açık Project Demo linki ve ≤30 sn video ya da slayt istendi.)
- **multiSelect:** hayır
- **Seçenekler:**
  1. **Deploy linki + kısa sunum (Önerilen)** — Herkese açık çalışan uygulama; 7 slayt/ekran kaydıyla yedeklenir. Gerekçe: hem "çalışan MVP" hem teslim formatı karşılanır; deney videosu işleme iptalinden bağımsız.
  2. **Yalnız canlı demo (yerel)** — Linksiz, jüriye elle gösterilir; teslimde risk yüksek.
  3. **Yalnız sunum/video** — Uygulama çalışmasa da kayıt/slaytla teslim; kod önceliği düşer.
  4. **GitHub repo + README** — Kod ve README ön planda; deploy yok.
- **Bu cevap neyi değiştirir?** `plans/06` adımları (D3/D4), deploy işi (Streamlit Cloud vb.), kod dondurma saati ve statik yedek gereksinimi.

### Soru 8
- **Başlık:** M2 hedef
- **Soru:** (Yalnızca M2 seçildiyse) Tahmin hangi veri setinde ve nasıl sunulsun? Grup-dışı skorlar zayıf: flex K fuel×diluent R²≈0.18, yıl-gruplu 0.56; cfi k_hot R²≈0.57.
- **multiSelect:** hayır
- **Seçenekler:**
  1. **flex K + cfi k_hot, dürüst sınırlarla (Önerilen)** — İki hedef; grup-dışı R² ve "bilinen yakıt/seyreltici için güvenilir" uyarısı arayüzde görünür. Gerekçe: en hazır veri ve Validity kriteri dürüstlüğü ödüllendirir.
  2. **Yalnız flex (K + burn_time)** — Tek veri seti; daha az iş, tek hikaye.
  3. **Tahmin yerine fizik yasası** — d² eğimi ve ACME %21 O2 sınırı gibi bulgular; model yok.
  4. **M2 yok** — M2 kesilir (Soru 3'ten bağımsız kapanır).
- **Bu cevap neyi değiştirir?** `plans/02` adımları, model seçimi (Ridge/HGB), skorların arayüzde nasıl uyarıyla sunulacağı, kısmi-g iddiasının yapılmaması.

---

## Grup 3 — Yönetişim ve temizlik

### Soru 9
- **Başlık:** Diğer iptal
- **Soru:** Video/mp4 dışında iptal etmek veya eklemek istediğiniz bir şey var mı?
- **multiSelect:** evet
- **Seçenekler:**
  1. **Hayır, değişiklik yok (Önerilen)** — Mevcut plan, video çıkarılmış hâliyle sürer.
  2. **Çok dilli (EN/TR) arayüzü iptal et** — Yalnız İngilizce; challenge sayfası zaten İngilizce istiyor.
  3. **Habitat/Ay-Mars senaryo vurgusunu ekle** — Sıralama ve içgörüler Ay/Mars habitat O2/basınç bağlamıyla çerçevelensin.
  4. **Doğrulama/CI ağırlığını azalt** — Test ve kanıt satırı disiplini hackathon için hafifletilir.
- **Bu cevap neyi değiştirir?** Plan satırlarının iptali/eklenmesi, i18n işi, sıralama skorunun habitat ağırlıkları ve süreç maliyeti. (Başka şeyler "Diğer" ile yazılır.)

### Soru 10
- **Başlık:** Eski doküman
- **Soru:** MVP planıyla çelişen eski dokümanlara (Architecture.md video bölümleri, plan 04/05 fazlalıkları, `app/` yazılımı) ne yapılsın?
- **multiSelect:** hayır
- **Seçenekler:**
  1. **docs/archive'e taşı (Önerilen)** — Git geçmişinde ve arşivde kalır, yanıltmaz; geri alınabilir. Gerekçe: silmek geri döndürülemez risk, bırakmak ajan/okuyucuyu yanıltır.
  2. **Sil** — Repo temiz kalır; geçmişten geri alınabilir ama aranması zor.
  3. **Yerinde bırak, üstüne "geçersiz" notu** — En az iş; çelişkili metinler arada kalır.
  4. **Önce manifest göster, sonra karar vereyim** — doc-pruner listeyi çıkarır, siz onaylarsınız.
- **Bu cevap neyi değiştirir?** doc-pruner'ın davranışı (arşiv/silme/manifest), `data_analysis/Nasa_data/raw|csv` dokunulmazlığı korunarak yalnız doküman/kod klasörlerinde değişiklik.

### Soru 11
- **Başlık:** Commit
- **Soru:** `plans/README.md` kural 9 "commit yalnızca istendiğinde" diyor; `CLAUDE.md` ise doğrulanmış her adımdan sonra otomatik commit+push (2026-11-14 kararı) diyor. Hangisi geçerli?
- **multiSelect:** hayır
- **Seçenekler:**
  1. **CLAUDE.md geçerli, README güncellensin (Önerilen)** — Testle doğrulanmış her adım otomatik commit+push; plans/README kural 9 buna uyarlanır. Gerekçe: CLAUDE.md daha yeni, açık kullanıcı kararı.
  2. **Commit yalnızca ben isteyince** — Otomatik commit kapanır, CLAUDE.md ve hafıza güncellenir; toplu commit sonda.
  3. **Otomatik commit, push yalnızca ben isteyince** — Yerelde adım başına commit, uzak depoya toplu push.
- **Bu cevap neyi değiştirir?** Her adımdan sonra commit/push yapılıp yapılmayacağı, commit günlüğü tutumu, `plans/README.md` ve CLAUDE.md düzenlemesi ve CI tetiklenmesi.

### Soru 12
- **Başlık:** Kural teyidi
- **Soru:** Resmi challenge/teslim sayfaları (TLS hatası) okunamadı; teslim kurallarını (zorunlu teslimler, video/slayt şartı, saat, AI kullanım beyanı) siz teyit edebilir misiniz?
- **multiSelect:** hayır
- **Seçenekler:**
  1. **Evet, ben teyit edip yazarım (Önerilen)** — Kuralları sayfadan okuyup sohbete yapıştırırsınız. Gerekçe: bu ortamdan resmi metin okunamıyor; yanlış varsayım diskalifiye riski taşır.
  2. **Sertifika kontrolünü atlayarak okumayı dene** — Güvenlik riski; yalnız salt okunur, hassas bilgi göndermeden.
  3. **Teyit edemem, 2025 kurallarına göre ilerle** — Demo linki + ≤30 sn video/slayt + İngilizce sayfa + erken teslim varsayılır.
- **Bu cevap neyi değiştirir?** `plans/06` teslim kontrol listesi, İngilizce proje sayfası/AI beyanı adımları ve sunum varlıkları; doğrulanmamış varsayımların plana girip girmeyeceği.
