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

### Admin Özellikleri
- ✅ Video upload ve yönetim
- ✅ Kullanıcı yönetimi
- ✅ Abonelik ve ödeme takibi
- ✅ İçerik moderasyonu

## 🛠️ Teknoloji Stack

### Frontend
- **Next.js 14** - React tabanlı full-stack framework
- **Tailwind CSS** - Modern CSS framework
- **TypeScript** - Tip güvenliği
- **React Query** - Server state management

### Backend
- **NestJS** - Node.js enterprise framework
- **PostgreSQL** - Ana veritabanı
- **Redis** - Cache ve session storage
- **JWT** - Authentication

### Video Streaming
- **HLS (HTTP Live Streaming)** - Video streaming protokolü
- **AWS S3** - Video depolama
- **CloudFront** - CDN

### Ödeme
- **Stripe** - Ödeme işlemleri

## 📁 Proje Yapısı

```
filmxane/
├── frontend/          # Next.js kullanıcı arayüzü
├── backend/           # NestJS API
├── admin-panel/       # React admin paneli
├── database/          # Veritabanı migration'ları
└── docs/             # Dokümantasyon
```

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL 14+
- Redis 6+

### Adımlar

1. **Repository'yi klonlayın**
```bash
git clone <repository-url>
cd filmxane
```

2. **Bağımlılıkları yükleyin**
```bash
npm run install:all
```

3. **Veritabanını kurun**
```bash
# PostgreSQL'de veritabanı oluşturun
createdb filmxane_db

# Migration'ları çalıştırın
cd backend
npm run migration:run
```

4. **Environment değişkenlerini ayarlayın**
```bash
# .env dosyalarını oluşturun
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
cp admin-panel/.env.example admin-panel/.env
```

5. **Uygulamayı başlatın**
```bash
npm run dev
```

## 🌐 Erişim Noktaları

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Admin Panel**: http://localhost:3002
- **API Docs**: http://localhost:3001/api/docs

## 📝 API Dokümantasyonu

Backend API dokümantasyonu Swagger ile sağlanır:
http://localhost:3001/api/docs

## 🔧 Geliştirme

### Scripts

```bash
# Tüm servisleri başlat
npm run dev

# Sadece frontend
npm run dev:frontend

# Sadece backend
npm run dev:backend

# Sadece admin panel
npm run dev:admin

# Production build
npm run build
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
```

## 🧪 Test

```bash
# Frontend testleri
cd frontend && npm run test

# Backend testleri
cd backend && npm run test

# E2E testleri
npm run test:e2e
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
npm run build

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
- **Versiyon**: 1.0.0

## 📞 İletişim

- **Email**: info@filmxane.com
- **Website**: https://filmxane.com
- **GitHub**: https://github.com/filmxane

---

**Filmxane** - Kürtçe içerik için modern streaming platformu 🎬
