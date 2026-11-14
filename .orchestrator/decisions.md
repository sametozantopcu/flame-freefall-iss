# Kullanıcı kararları (Gate 1, 2026-11-14)

Cevaplar kullanıcının kendi kelimeleriyle; "Yorum" satırları orkestratörün yorumudur.

## Önceden verilenler
- Video/mp4 ile ilgili her şey iptal (video indeksi, test-video eşleme, ffmpeg önizleme, presigned URL).
- "use miniconda env named "nasa_hack" /home/halil/miniconda3/envs/nasa_hack"

## Grup 1
1. **Süre:** "2–6 saat"
2. **Ekip:** "Yalnız ben + Claude"
3. **MVP kapsamı:** "M1 Keşif & Sıralama, M2 Tahmin, M3 Ekipman içgörüsü, FlameSense" (dördü de)
4. **Arayüz:** "burayi arkadasim yazmisti guzelce analiz et onu kullanacagiz duzenlemeler yapilabilir ama renk paleti design olarak ona benseyecek anladin mi duzenlemeler yapilabilir ama terkardan sifirdan olusturma orayi kullan yine bir sorun olursa sor"

## Grup 2
5. **FlameSense:** "sadece fotografi ekle dizaynlarin guzel bir sekilde ekstra calisma yapma o sekilde acikla ne yaptiigni ve bu sekilde bir sey planladik icerigi bu sekidle etc. seklinde olsutur o kadar yine sorun varsa sor"
   - **EKSTRA (arayüz için):** "Arkdasim design icine yuklemis siteyi ordan siteyi app icine cek appteki dosylari sil temizle design icindeki kodlari koy sonra ona gore ilerle sorun olursa sor"
   - Yorum: `design/dashboard/` (statik HTML/CSS/vanilla JS, "Halo" koyu tema; bkz. `reports/design.md`) `app/` içine taşınır; eski Streamlit `app/` dosyaları silinir. Arayüz sıfırdan yazılmaz, bu site düzenlenir; renk paleti/tasarım korunur. FlameSense = render fotoğrafları + ne planlandığını anlatan konsept sayfası, başka iş yok.
6. **LLM/RAG:** "LLm ile birlikte statik kartlari kullan aciklma icin iyi context olur"
   - Yorum: belirsiz (canlı çağrı mı, önceden üretim mi) → takip sorusu soruldu, cevap aşağıda.
7. **Teslim:** "demo olustur yerel biz videosunu sonra cekecegiz kendimiz"
   - Yorum: yerel çalışan demo; deploy yok; videoyu ekip çeker.
8. **M2 hedef:** "burda tam bilgim yok en bize uygun veirler fln cekmistik en mantiklisi neyse ordan devam edelim"
   - Yorum: karar orkestratör/planner'da. Veri raporuna göre en hazır: flex (PSI-69) `burn_rate_K_mm2_s`; sınırlar dürüstçe gösterilir.

## Grup 3
9. **Diğer değişiklikler:** "Yalnız İngilizce arayüz, Ay/Mars habitat vurgusu, Test disiplinini hafiflet, bu sekilde ilerle ve baska gereklilik gerektiren seyler varsa bana bu kalsin mi etc. seklinde sor"
   - Yorum: TR dil desteği kalkar; içerik Ay/Mars habitat bağlamıyla çerçevelenir; adım başına bağımsız doğrulayıcı yerine kabul testi + sonda uçtan uca kontrol. Kapsamdan bir şey çıkarmadan/ek gereklilik doğduğunda önce kullanıcıya "bu kalsın mı?" diye sorulur.
10. **Eski dokümanlar:** "sil ve yeni mimariyi o dosyanin ustune yaz"
    - Yorum: eski/çelişen dokümanlar silinir; `Architecture.md` yeni MVP mimarisiyle üstüne yazılır.
11. **Commit:** "Otomatik commit + push" (CLAUDE.md geçerli; `plans/README.md` kural 9 uyarlanır).
12. **Kural teyidi:** "Suan sadece gerekli kodlamalara odaklan ileride islerimiz bitince sor"
    - Yorum: teslim kuralları şimdilik plana girmez; FAZ 6'da tekrar sorulacak.

## Gate 2 (plan onayı, 2026-11-14)
- **Plan:** "35 dk dogurlama etc olmaz bu sekilde bir zaman dagilimi yok tamam mi bana zaman verme duzgunce islere bastan basla ve bitir bu kadar zaman cok fazla"
  - Yorum: işe başla ve bitir; kullanıcıya süre tahmini/zaman dağılımı sunma; doğrulamaya uzun zaman ayırma.
- **design/ klasörü:** "onu artik silebilirsin abi bize icerigi lazim yani sadece anladin mi design altindakileri at app'e sonra orda duzenle onlari dedigim sekilde app altini ilk temizle sonra design altindakileri app e at sonra tek basina design silebilrsin amacimiz desiggn altindakini appe atmak blender modelini de kaydet anladin mi app altina asset fln folder ac veya sen daha iyi bilrisin isimlendirmesini ona gore kacirma kaybetme artifact abi"
  - Yorum: sıra — (1) `app/` temizlenir, (2) `design/` altındaki HER ŞEY `app/` altına taşınır (site → `app/`, Blender modeli ve renderlar → `app/assets/flamesense_box/`), (3) boşalan `design/` silinir. Hiçbir dosya kaybolmaz (`git mv`).

## Takip sorusu
- Soru: statik sitede LLM demoda nasıl çalışsın (önceden üret-göm / canlı soru-cevap / ikisi)?
- Cevap: "LLM api var kullan giren kisi soru fln sorabilsin yani burasi acik degil ve daha derin soru sorman gerekiyorsa sor"
  - Yorum: canlı soru-cevap isteniyor. Ziyaretçi sitede soru sorabilir; LLM (EVREN API, kök `.env` `API_KEY`) statik kartları bağlam alarak cevaplar. Anahtar tarayıcıya gömülmez; siteyi sunan küçük yerel Python sunucusu çağrıyı yapar. Anahtar/bağlantı yoksa statik kartlara düşer.
