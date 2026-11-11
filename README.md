# Klar

Klar, Türkçe destekli Almanca A1 ve Goethe Start Deutsch 1 çalışma uygulamasıdır. Statik bir PWA olarak GitHub Pages üzerinde çalışır.

## Kullanım

1. Uygulamayı tarayıcıda aç.
2. **Kaynaklar → Paket yükle** ile kişisel Klar JSON paketini ekle. Bu adımı kullanacağın her cihazda yap.
3. **Ayarlar** bölümünde çalışma günlerini, günlük süreyi, seviyeni ve varsa sınav tarihini seç.
4. **Bugün** bölümünden sıradaki adıma devam et. **Üniteler** bölümünde 16 ders, sesli örnekler, beceri alıştırmaları ve ünite kontrolleri var. Daha fazla pratik için **Alıştırma arşivi** bölümünü aç.
5. **Ayarlar → Yedeği indir** ile ilerlemeni dosyaya al. Başka bir tarayıcıda **Yedek yükle** ile birleştir.

iPhone ve iPad’de Safari’de **Paylaş → Ana Ekrana Ekle** ile Klar’ı uygulama gibi açabilirsin. Mac ve Windows’ta bağlantıyı açman yeterli. İlk bağlantıda uygulama, alıştırmalar ve temel ses dosyaları çevrimdışı kullanım için hazırlanır.

Ünitelerdeki [Deutsche Welle Nicos Weg videoları](https://www.youtube.com/playlist?list=PLs7zUO7VPyJ5DV1iBRgSw2uDl832n0bLg) yeni sekmede açılır ve internet bağlantısıyla izlenir.

Tarayıcı çalışma verisini yerel olarak saklar. Kişisel PDF’leri **Kaynaklar** bölümünde tek tek bağlayabilirsin. PDF’ler ve ses kayıtları ayrı olarak cihazda tutulur. Kayıtları **Ayarlar → Konuşma kayıtları** bölümünden indirebilirsin. Yazma ve konuşmada model yanıt ve öz değerlendirme bulunur. Deneme puanları çalışma takibi içindir.

Açık ve koyu tema arasında üst çubuktan geçebilirsin. **Ayarlar → Görünüm** bölümünde sistem temasını izleme seçeneği de var.

## Yerel geliştirme

Bu klasörde `python3 -m http.server 8157 --bind 127.0.0.1` komutunu çalıştır ve `http://127.0.0.1:8157/` adresini aç. GitHub Pages, `main` dalının kök dizininden yayımlanır. Çevrimdışı dosyaları değiştirdiğinde `sw.js` içindeki önbellek sürümünü güncelle. `private/` klasörü kişisel dosyalar içindir ve Git tarafından yok sayılır.

## Varlıklar

- Almanca sesler Piper ile yerelde üretildi. [Thorsten (CC0 ses verisi)](https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/thorsten/medium/MODEL_CARD) ve [Kerstin (CC0 ses verisi)](https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/kerstin/low/MODEL_CARD)
- Bricolage Grotesque, DM Sans ve Material Symbols lisansları `assets/` klasöründedir.
- `assets/berlin.webp` yerleşik ImageGen aracıyla üretilen Berlin illüstrasyonudur. Kullanılan istem aşağıdadır.

> Use case: stylized-concept. Asset type: an editorial hero illustration for a premium personal German learning dashboard named Klar. Generate a single widescreen landscape image with flat warm pale yellow background (#f4d98a), soft screenprint grain, vivid dark forest green ink, and very limited cream accents. On the RIGHT TWO THIRDS an iconic German city street as a stylized vintage travel illustration: tall Berlin TV tower, compact historic street facades, a curving tram track and small U-Bahn entry structure, a few leafy shapes. Modern Swiss editorial print meets contemporary boutique study journal, sophisticated dark ink silhouette and linework, confident stylized perspective. Right-weighted composition, left third has quiet yellow space as a fade area for blending into website background. No text, no letters, no badges, no people, no border, no interface elements. A wide landscape crop with foreground buildings toward the lower right.
