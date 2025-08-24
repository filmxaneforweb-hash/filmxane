# Filmxane - Kürtçe Streaming Platformu

Netflix tarzı modern bir streaming platformu. Akademik Kürtçe dil desteği ile film ve dizi izleme deneyimi sunar.

## 🎬 Özellikler

### Kullanıcı Özellikleri
- ✅ Hesap oluşturma ve giriş sistemi
- ✅ Abonelik sistemi (aylık/yıllık paketler)
- ✅ Film ve dizi streaming
- ✅ Kategoriler ve gelişmiş arama
- ✅ Favoriler ve izleme listesi
- ✅ Akademik Kürtçe arayüz
- ✅ Kapak fotoğrafları ve thumbnail desteği
- ✅ Video izleme sayfası
- ✅ Responsive tasarım
- ✅ İzleme geçmişi ve istatistikler
- ✅ Gerçek zamanlı profil güncellemeleri

### Admin Özellikleri
- ✅ Video upload ve yönetim (Film/Series)
- ✅ Kapak fotoğrafı yükleme
- ✅ Kullanıcı yönetimi
- ✅ Abonelik ve ödeme takibi
- ✅ İçerik moderasyonu
- ✅ WebSocket gerçek zamanlı güncellemeler
- ✅ Admin dashboard istatistikleri
- ✅ Kullanıcı rol yönetimi

## 🛠️ Teknoloji Stack

### Frontend
- **Next.js 15** - React tabanlı full-stack framework
- **Tailwind CSS** - Modern CSS framework
- **TypeScript** - Tip güvenliği
- **Framer Motion** - Animasyonlar
- **Lucide React** - İkonlar

### Backend
- **NestJS** - Node.js enterprise framework
- **SQLite** - Ana veritabanı (Production için PostgreSQL hazır)
- **TypeORM** - ORM
- **JWT** - Authentication
- **WebSocket** - Gerçek zamanlı iletişim
- **bcryptjs** - Şifre hashleme

### Video Streaming
- **HLS (HTTP Live Streaming)** - Video streaming protokolü
- **Static File Serving** - Kapak fotoğrafları için
- **Upload System** - Dosya yükleme sistemi (5GB'a kadar)

## 📁 Proje Yapısı

```
filmxane/
├── frontend/          # Next.js kullanıcı arayüzü
│   ├── app/          # App Router sayfaları
│   ├── components/   # React component'leri
│   ├── contexts/     # React context'leri
│   └── lib/          # Utility fonksiyonları
├── backend/           # NestJS API
│   ├── src/
│   │   ├── entities/ # Veritabanı entity'leri
│   │   ├── modules/  # Feature modülleri
│   │   ├── seeds/    # Veritabanı seed'leri
│   │   └── migrations/ # Veritabanı migration'ları
├── admin-panel/       # React admin paneli
└── uploads/          # Yüklenen dosyalar
```

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- SQLite (varsayılan) veya PostgreSQL 14+

### Adımlar

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/SerkanCtn/projectFilmxane.git
cd filmxane
```

2. **Bağımlılıkları yükleyin**
```bash
# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install

# Admin Panel
cd ../admin-panel && npm install
```

3. **Veritabanını kurun**
```bash
# SQLite otomatik oluşturulur
cd backend

# Admin kullanıcısı oluşturun
node create-admin.js
```

4. **Uygulamayı başlatın**
```bash
# Backend (Terminal 1)
cd backend && npm run start:dev

# Frontend (Terminal 2)
cd frontend && npm run dev

# Admin Panel (Terminal 3)
cd admin-panel && npm run dev
```

## 🌐 Erişim Noktaları

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3005
- **Admin Panel**: http://localhost:5173
- **API Docs**: http://localhost:3005/api/docs

## 🔑 Admin Giriş Bilgileri

- **📧 Email:** `admin@filmxane.com`
- **🔑 Şifre:** `admin123`
- **👤 Rol:** Admin

## 📝 API Endpoints

### Auth
- `POST /auth/register` - Kullanıcı kaydı
- `POST /auth/login` - Kullanıcı girişi
- `POST /auth/admin/login` - Admin girişi
- `POST /auth/verify-admin` - Admin yetkisi doğrulama

### Videos
- `GET /videos` - Tüm videolar
- `GET /videos/:id` - Video detayı
- `POST /videos` - Video yükleme (Admin)
- `PUT /videos/:id` - Video güncelleme (Admin)
- `POST /videos/watch-history` - İzleme geçmişi kaydetme
- `GET /videos/search/filter` - Gelişmiş arama ve filtreleme

### Admin
- `POST /admin/videos` - Video yükleme (Admin)
- `GET /admin/stats` - Dashboard istatistikleri
- `GET /admin/users` - Kullanıcı listesi
- `DELETE /admin/users/:id` - Kullanıcı silme

### Favorites
- `POST /favorites` - Favori ekleme/çıkarma
- `GET /favorites/my-favorites` - Kullanıcı favorileri
- `GET /favorites/check` - Favori durumu kontrolü

## 🔧 Geliştirme

### Scripts

```bash
# Backend
cd backend
npm run start:dev    # Development server
npm run build        # Production build
node create-admin.js # Admin kullanıcısı oluştur

# Frontend
cd frontend
npm run dev          # Development server
npm run build        # Production build

# Admin Panel
cd admin-panel
npm run dev          # Development server
npm run build        # Production build
```

### Veritabanı

```bash
# Admin kullanıcısı oluştur
cd backend
node create-admin.js

# Veritabanı kontrolü
node check-admin.js
node list-all-users.js
```

## 🐛 Son Düzeltmeler

### ✅ Video Yükleme Sistemi
- **Film/Series Type Düzeltmesi:** Artık dizi yüklerken doğru şekilde series olarak kaydediliyor
- **Dosya Boyutu Limiti:** 100MB → 5GB'a çıkarıldı
- **Type Validation:** Backend'de type field'ı DTO'dan alınıyor
- **Series Alanları:** Season Number, Episode Number, Series ID desteği

### ✅ Admin Panel
- **Admin Kullanıcısı:** `admin@filmxane.com` / `admin123` ile giriş
- **Video Upload:** Film ve dizi yükleme sistemi
- **Type Seçimi:** Movie/Series radio button'ları
- **Form Validation:** Gerekli alanlar kontrol ediliyor

### ✅ Kullanıcı Sistemi
- **Profil Sayfası:** İzleme süresi, favori sayısı, katılım tarihi
- **Gerçek Zamanlı Güncellemeler:** WebSocket ile anlık güncellemeler
- **İzleme Geçmişi:** WatchHistory entity ile takip
- **Favori Sistemi:** Backend'e bağlı favori ekleme/çıkarma

### ✅ Arama ve Filtreleme
- **Gelişmiş Arama:** Genre, yıl, rating, süre filtreleri
- **Debounce:** Arama çubuğunda 500ms gecikme
- **Pagination:** Sayfalama sistemi
- **Backend Entegrasyonu:** Tüm filtreler backend'e bağlı

### ✅ Video Player
- **Süre Gösterimi:** Float değerler yerine saniye saniye ilerleme
- **İzleme Takibi:** Her 10 saniyede bir backend'e kayıt
- **Progress Bar:** Doğru süre gösterimi

### ✅ Kapak Fotoğrafları
- **Thumbnail Desteği:** Tüm sayfalarda kapak fotoğrafları
- **Fallback Sistemi:** Fotoğraf yüklenemezse placeholder
- **Static File Serving:** Backend'den dosya servisi

## 🧪 Test

```bash
# Backend testleri
cd backend && npm run test

# Frontend testleri
cd frontend && npm run test
```

## 📦 Deployment

### Docker ile

```bash
# Docker image'ları oluştur
docker-compose build

# Servisleri başlat
docker-compose up -d
```

### Manuel Deployment

```bash
# Production build
cd backend && npm run build
cd frontend && npm run build
cd admin-panel && npm run build

# PM2 ile process yönetimi
pm2 start ecosystem.config.js
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👥 Takım

- **Geliştirici**: Filmxane Team
- **Dil Desteği**: Akademik Kürtçe
- **Versiyon**: 1.2.0

## 📞 İletişim

- **GitHub**: https://github.com/SerkanCtn/projectFilmxane

---

**Filmxane** - Kürtçe içerik için modern streaming platformu 🎬

## 🎯 Son Güncellemeler

### v1.2.0 (Güncel)
- ✅ **Video Type Düzeltmesi:** Film/Series doğru kayıt
- ✅ **Dosya Boyutu:** 5GB'a kadar video yükleme
- ✅ **Admin Panel:** Tam fonksiyonel admin sistemi
- ✅ **İzleme Geçmişi:** WatchHistory entity ile takip
- ✅ **Profil Sistemi:** Gerçek zamanlı istatistikler
- ✅ **Arama Sistemi:** Gelişmiş filtreleme ve debounce
- ✅ **Video Player:** Doğru süre gösterimi ve izleme takibi
- ✅ **Favori Sistemi:** Backend entegrasyonu
- ✅ **Kapak Fotoğrafları:** Tüm sayfalarda thumbnail desteği

### v1.1.0
- ✅ Kapak fotoğrafları tüm sayfalarda düzeltildi
- ✅ Video izleme sistemi tamamlandı
- ✅ TypeScript hataları giderildi
- ✅ Admin panel video yükleme sistemi aktif
- ✅ Database seed sistemi eklendi
- ✅ WebSocket gerçek zamanlı güncellemeler
- ✅ Responsive tasarım iyileştirmeleri
