# 🚀 Vercel Deployment Rehberi

Bu rehber, Filmxane projenizi Vercel'de hem frontend hem backend ile birlikte yayınlamanız için hazırlanmıştır.

## 📋 Ön Gereksinimler

1. **Vercel Hesabı**: [vercel.com](https://vercel.com) üzerinden ücretsiz hesap oluşturun
2. **GitHub Repository**: Projenizi GitHub'a yükleyin
3. **Vercel CLI** (opsiyonel): `npm i -g vercel`

## 🔧 Adım 1: Vercel Postgres Veritabanı Kurulumu

1. Vercel Dashboard'a gidin
2. **Storage** sekmesine tıklayın
3. **Create Database** → **Postgres** seçin
4. Veritabanı adını `filmxane-db` olarak ayarlayın
5. **Create** butonuna tıklayın
6. **Settings** → **Environment Variables** kısmından `POSTGRES_URL` değerini kopyalayın

## 🔧 Adım 2: Environment Variables Ayarlama

Vercel Dashboard'da projenizin **Settings** → **Environment Variables** kısmına şu değişkenleri ekleyin:

```bash
# JWT Configuration
JWT_SECRET=filmxane_super_secret_key_2024_production
JWT_EXPIRES_IN=7d

# Database
POSTGRES_URL=postgresql://username:password@host:port/database

# Vercel
VERCEL=1
NODE_ENV=production
```

## 🔧 Adım 3: GitHub Repository Bağlama

1. Vercel Dashboard'da **New Project** tıklayın
2. GitHub repository'nizi seçin
3. **Import** butonuna tıklayın
4. Framework Preset: **Next.js** seçin
5. Root Directory: **frontend** olarak ayarlayın
6. Build Command: `npm run build`
7. Output Directory: `.next` (otomatik)
8. Install Command: `npm install`

## 🔧 Adım 4: Build Settings

Vercel'de proje ayarlarında:

```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/.next",
  "installCommand": "npm install && cd frontend && npm install && cd ../backend && npm install"
}
```

## 🔧 Adım 5: Deployment

1. **Deploy** butonuna tıklayın
2. İlk deployment 5-10 dakika sürebilir
3. Deployment tamamlandığında URL'nizi alacaksınız

## 🔧 Adım 6: Veritabanı Migration

Deployment tamamlandıktan sonra:

1. Vercel Dashboard → **Functions** sekmesine gidin
2. Backend function'ınızı bulun
3. **View Function Logs** ile hataları kontrol edin
4. İlk çalıştırmada veritabanı tabloları otomatik oluşturulacak

## 🔧 Adım 7: Admin Kullanıcısı Oluşturma

Backend çalıştıktan sonra admin kullanıcısı oluşturmak için:

1. Vercel Dashboard → **Functions** → Backend function
2. **View Function Logs** ile admin oluşturma script'ini çalıştırın
3. Veya API endpoint'i kullanın: `POST /api/auth/register`

## 🌐 Erişim Noktaları

Deployment sonrası:
- **Frontend**: `https://your-project.vercel.app`
- **Backend API**: `https://your-project.vercel.app/api`
- **API Docs**: `https://your-project.vercel.app/api/docs`

## 🔧 Sorun Giderme

### Build Hataları
```bash
# Local'de test edin
npm run build
```

### Database Bağlantı Hataları
- `POSTGRES_URL` environment variable'ının doğru olduğundan emin olun
- Vercel Postgres'in aktif olduğunu kontrol edin

### API Endpoint Hataları
- Vercel Dashboard → **Functions** → Logs kontrol edin
- CORS ayarlarını kontrol edin

### Frontend Build Hataları
- `frontend/package.json` dependencies kontrol edin
- TypeScript hatalarını kontrol edin

## 📊 Monitoring

Vercel Dashboard'da:
- **Analytics**: Ziyaretçi istatistikleri
- **Functions**: Backend performansı
- **Storage**: Veritabanı kullanımı

## 🔄 Güncellemeler

Kod değişikliklerinizi GitHub'a push ettiğinizde Vercel otomatik olarak yeniden deploy edecektir.

## 💰 Maliyet

- **Hobby Plan**: Ücretsiz (aylık 100GB bandwidth)
- **Pro Plan**: $20/ay (daha fazla bandwidth ve özellik)

## 🎯 Sonuç

Bu adımları takip ederek Filmxane projenizi Vercel'de başarıyla yayınlayabilirsiniz. Hem frontend hem backend aynı domain'de çalışacak ve otomatik scaling özelliklerinden yararlanacaksınız.
