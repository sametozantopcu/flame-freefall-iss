# CLAUDE.md

Bu repo bir NASA Space Apps 2026 projesi: "Flame in Freefall". Mimari için `Architecture.md`, iş planları için `plans/` klasörüne bakın.

## Bir konu üzerinde çalışırken

1. Önce `plans/README.md` dosyasını, sonra ilgili `plans/<konu>/PLAN.md` dosyasındaki **Durum** bölümünü oku.
   Bağımlılıkları tamamlanmış ilk işaretsiz adımla devam et.
2. Bir kutuyu (`- [ ]` → `- [x]`) **yalnızca** o adımın Test satırındaki test yazıldıktan, çalıştırıldıktan ve geçtikten sonra işaretle.
   Kutunun altına `✔ YYYY-MM-DD · <komut> · <sonuç>` biçiminde bir kanıt satırı ekle. Skip veya xfail olan testler geçti sayılmaz.
3. Oturum sonunda `PLAN.md` dosyasındaki Durum bölümünü (ilerleme, son güncelleme, sıradaki adım, açık sorunlar) ve `plans/README.md` tablosunu güncelle.
4. Yeni bir paket import ettiysen onu `plans/<konu>/requirements.txt` dosyasına `>=` alt sınırıyla ekle.
5. Adım ID'lerini yeniden numaralandırma. Yeni adımı fazın sonuna ekle. Gereksizleşen adımın üstünü çiz (`- ~~[ ] **ID** ...~~ — **İPTAL (tarih):** neden`); iptal edilen adım toplamdan düşer.

## Değişmez kurallar

- `data_analysis/Nasa_data/raw/` ve `csv/` asla değiştirilmez, silinmez, taşınmaz.
- Eksik değerler asla 0 ile doldurulmaz. Ara tablolarda `psi_id`, `source_file` ve `source_row` sütunları korunur.
- Modüller veriyi yalnızca Feature Store veya Metadata katmanından okur (`plans/00_data_layer`).
- Doğrulama her zaman grup bazlı yapılır (GroupKFold); leakage listesi uygulanır.
- Dokümanlar Türkçe yazılır; kod ve kod yorumları İngilizce olabilir.
- Commit ve push: testlerle doğrulanmış her adımdan sonra otomatik yapılır (kullanıcı kararı, 2026-11-14). Her commit/push, commit kimliği, adım ve CI sonucuyla birlikte Claude'un kalıcı hafızasındaki commit günlüğüne yazılır. Doğrulanmamış iş commit edilmez.
