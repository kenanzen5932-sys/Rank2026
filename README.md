# Rank 2026 - Liderlik Sıralaması (H5 Leaderboard)

Flutter sesli sohbet ve canlı yayın uygulamaları için geliştirilmiş yüksek performanslı H5 Liderlik Sıralaması web modülü.

## 🚀 Özellikler
- **4 Canlı Sekme:**
  1. Onur (En Çok Hediye Gönderenler - Zenginlik)
  2. Cazibe (En Çok Hediye Alanlar)
  3. Oda (En Çok Hediye Alan Canlı Odalar)
  4. CP (Çiftler Sıralaması)
- **Zaman Filtreleri:** Günlük (`type=0`), Haftalık (`type=1`), Aylık (`type=2`)
- **Çoklu Dil Desteği:** Türkçe (`lang=tr`), İngilizce (`lang=en`), Arapça (`lang=ar`) ve diğer diller.
- **Supabase Entegrasyonu:** URL parametresi `mockUrl` ile doğrudan Supabase Edge Function API'nize bağlanır.

## 📡 API İstekleri & Endpoint Yapısı
Sayfa açılırken URL'deki `mockUrl` parametresine Supabase fonksiyon adresi verilir:
(Örn: `?mockUrl=https://<PROJE_ID>.supabase.co/functions/v1/rank&token=<JWT_TOKEN>&lang=tr`)

Frontend sırasıyla şu endpoint'leri çağırır:
- `GET /new/ranking/gifter?type=0`
- `GET /new/ranking/receive?type=0`
- `GET /new/ranking/room?type=0`
- `GET /new/ranking/cp?type=0`

## 🛠️ Yerel Çalıştırma
```bash
npm start
# veya
node server.js
```
Tarayıcıda test adresi:
`http://localhost:8899/index.html?mockUrl=http%3A%2F%2Flocalhost%3A8899&token=test1234&lang=tr`

## ☁️ Vercel Dağıtımı (Deployment)
Bu repo doğrudan Vercel üzerine sıfır konfigürasyonla deploy edilebilir.
`vercel.json` dosyası gerekli tüm CORS başlıklarını otomatik olarak sağlar.
