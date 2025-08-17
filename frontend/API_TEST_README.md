# 🧪 Filmxane API Test Rehberi

## 🚀 Hızlı Test

### 1. Backend'i Başlat
```bash
cd backend
npm install
npm run start:dev
```

Backend `http://localhost:3001` portunda çalışacak.

### 2. Frontend'i Başlat
```bash
cd frontend
npm install
npm run dev
```

Frontend `http://localhost:3000` veya `http://localhost:3002` portunda çalışacak.

### 3. API Test Sayfasını Aç
Tarayıcıda şu URL'yi aç:
```
http://localhost:3000/api-test
```

## 🔍 Test Edilecek Endpoint'ler

### ✅ Categories
- **GET** `/api/categories` - Tüm kategorileri listele

### ✅ Videos
- **GET** `/api/videos` - Tüm videoları listele
- **GET** `/api/videos/type/movie` - Sadece filmleri listele
- **GET** `/api/videos/type/series` - Sadece dizileri listele

### ✅ Auth
- **POST** `/api/auth/login` - Giriş yap
- **POST** `/api/auth/register` - Kayıt ol

## 🐛 Yaygın Sorunlar

### 1. Port Uyuşmazlığı
- Backend: 3001
- Frontend: 3000 veya 3002
- API Base URL: `http://localhost:3001/api`

### 2. CORS Hatası
Backend'de CORS ayarları:
```typescript
app.enableCors({
  origin: ['http://localhost:3000', 'http://localhost:3002'],
  credentials: true,
});
```

### 3. Database Bağlantısı
PostgreSQL'in çalıştığından emin ol:
```bash
docker-compose up -d
```

## 📊 Test Sonuçları

Test sayfasında şu bilgileri göreceksin:
- ✅ Başarılı API çağrıları
- ❌ Hatalı API çağrıları
- 📡 Kullanılan base URL
- 🔑 Token durumu

## 🎯 Sonraki Adımlar

1. API testleri başarılı olduktan sonra ana sayfayı test et
2. Content loading'i kontrol et
3. User authentication'ı test et
4. Admin panelini test et

## 🆘 Yardım

Eğer hala sorun yaşıyorsan:
1. Console'da hata mesajlarını kontrol et
2. Network tab'ında API çağrılarını incele
3. Backend loglarını kontrol et
4. Database bağlantısını test et
