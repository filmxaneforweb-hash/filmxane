#!/bin/bash
# Filmxane GoDaddy Deployment Script

echo "🚀 Filmxane GoDaddy Deployment Başlıyor..."

# 1. Backend Build
echo "📦 Backend build ediliyor..."
cd backend
npm install --production
npm run build
echo "✅ Backend build tamamlandı"

# 2. Frontend Build
echo "📦 Frontend build ediliyor..."
cd ../frontend
npm install
npm run build
echo "✅ Frontend build tamamlandı"

# 3. Deployment dosyalarını hazırla
echo "📁 Deployment dosyaları hazırlanıyor..."
cd ..

# Frontend build dosyalarını kopyala
cp -r frontend/out/* ./
cp .htaccess ./
cp api/index.php ./api/

# Backend dosyalarını hazırla
mkdir -p backend-deploy
cp -r backend/dist/* backend-deploy/
cp backend/package-godaddy.json backend-deploy/package.json
cp backend/godaddy-main.ts backend-deploy/main.ts

echo "✅ Deployment dosyaları hazırlandı"
echo ""
echo "📋 GoDaddy'ye yüklenecek dosyalar:"
echo "   - Ana dizin: Frontend build dosyaları"
echo "   - /api/: API gateway (index.php)"
echo "   - /backend-deploy/: Backend dosyaları"
echo ""
echo "🎯 Sonraki adımlar:"
echo "   1. GoDaddy cPanel'e giriş yap"
echo "   2. File Manager'ı aç"
echo "   3. public_html klasörüne dosyaları yükle"
echo "   4. MySQL database oluştur"
echo "   5. Environment variables ayarla"
echo ""
echo "🚀 Deployment hazır!"
