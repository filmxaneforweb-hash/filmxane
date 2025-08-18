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

### Admin Özellikleri
- ✅ Video upload ve yönetim
- ✅ Kapak fotoğrafı yükleme
- ✅ Kullanıcı yönetimi
- ✅ Abonelik ve ödeme takibi
- ✅ İçerik moderasyonu
- ✅ WebSocket gerçek zamanlı güncellemeler

## 🛠️ Teknoloji Stack

### Frontend
- **Next.js 15** - React tabanlı full-stack framework
- **Tailwind CSS** - Modern CSS framework
- **TypeScript** - Tip güvenliği
- **Framer Motion** - Animasyonlar
- **Lucide React** - İkonlar

### Backend
- **NestJS** - Node.js enterprise framework
- **PostgreSQL** - Ana veritabanı
- **TypeORM** - ORM
- **JWT** - Authentication
- **WebSocket** - Gerçek zamanlı iletişim

### Video Streaming
- **HLS (HTTP Live Streaming)** - Video streaming protokolü
- **Static File Serving** - Kapak fotoğrafları için
- **Upload System** - Dosya yükleme sistemi

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
- PostgreSQL 14+

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
# PostgreSQL'de veritabanı oluşturun
createdb filmxane_db

# Migration'ları çalıştırın
cd backend
npm run migration:run

# Seed verilerini yükleyin
npm run seed
```

4. **Environment değişkenlerini ayarlayın**
```bash
# Backend .env
cp backend/env.example backend/.env
# .env dosyasını düzenleyin
```

5. **Uygulamayı başlatın**
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

## 📝 API Endpoints

### Auth
- `POST /auth/register` - Kullanıcı kaydı
- `POST /auth/login` - Kullanıcı girişi
- `POST /auth/admin/login` - Admin girişi

### Videos
- `GET /videos` - Tüm videolar
- `GET /videos/:id` - Video detayı
- `POST /videos` - Video yükleme (Admin)
- `PUT /videos/:id` - Video güncelleme (Admin)

### Categories
- `GET /categories` - Tüm kategoriler
- `POST /categories` - Kategori oluşturma (Admin)

### Users
- `GET /users` - Kullanıcı listesi (Admin)
- `PUT /users/:id` - Kullanıcı güncelleme

## 🔧 Geliştirme

### Scripts

```bash
# Backend
cd backend
npm run start:dev    # Development server
npm run build        # Production build
npm run migration:run # Migration çalıştır
npm run seed         # Seed verilerini yükle

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
# Migration oluştur
cd backend
npm run migration:generate -- src/migrations/MigrationName

# Migration çalıştır
npm run migration:run

# Migration geri al
npm run migration:revert

# Seed verilerini yükle
npm run seed
```

## 🐛 Son Düzeltmeler

### ✅ Kapak Fotoğrafları
- Tüm sayfalarda kapak fotoğrafları düzgün görünüyor
- `getSafeImageUrl` utility fonksiyonu eklendi
- Fallback mekanizması ile placeholder görseller
- Hero, Movies, Series, Videos sayfalarında düzeltildi

### ✅ Video İzleme
- Watch butonları doğru sayfalara yönlendiriyor
- `/videos/[id]` sayfası düzgün çalışıyor
- VideoCard component'i güncellendi

### ✅ TypeScript Düzeltmeleri
- Interface'ler güncellendi (`thumbnailUrl`, `posterUrl`)
- Type safety iyileştirildi
- Component prop'ları düzeltildi

### ✅ Admin Panel
- Video yükleme sistemi çalışıyor
- Kapak fotoğrafı yükleme aktif
- WebSocket bağlantısı kuruldu

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
- **Versiyon**: 1.1.0

## 📞 İletişim

- **GitHub**: https://github.com/SerkanCtn/projectFilmxane

---

**Filmxane** - Kürtçe içerik için modern streaming platformu 🎬

## 🎯 Son Güncellemeler

### v1.1.0 (Güncel)
- ✅ Kapak fotoğrafları tüm sayfalarda düzeltildi
- ✅ Video izleme sistemi tamamlandı
- ✅ TypeScript hataları giderildi
- ✅ Admin panel video yükleme sistemi aktif
- ✅ Database seed sistemi eklendi
- ✅ WebSocket gerçek zamanlı güncellemeler
- ✅ Responsive tasarım iyileştirmeleri
