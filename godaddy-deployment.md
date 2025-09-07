# 🚀 GoDaddy Deployment Rehberi - Filmxane

## 📋 Ön Gereksinimler

1. **GoDaddy Deluxe Hosting** paketi
2. **Domain** (filmxane.com gibi)
3. **FTP erişimi** (cPanel'den)

## 🔧 Adım 1: Proje Hazırlığı

### Backend Build
```bash
cd backend
npm install --production
npm run build
```

### Frontend Build
```bash
cd frontend
npm install
npm run build
```

## 🔧 Adım 2: GoDaddy'ye Yükleme

### Dosya Yapısı:
```
public_html/
├── index.html (frontend build)
├── static/ (CSS, JS, images)
├── api/ (backend API)
├── uploads/ (video files)
└── .htaccess (routing)
```

## 🔧 Adım 3: Database Kurulumu

### MySQL Database:
- Database adı: `filmxane_db`
- Username: `filmxane_user`
- Password: `güvenli_şifre`

## 🔧 Adım 4: Environment Variables

### .env dosyası:
```
NODE_ENV=production
DB_HOST=localhost
DB_NAME=filmxane_db
DB_USER=filmxane_user
DB_PASS=güvenli_şifre
JWT_SECRET=filmxane_super_secret_key_2024
```

## 🎯 Sonuç

Bu rehber ile Filmxane projenizi GoDaddy'de çalıştırabilirsiniz!
