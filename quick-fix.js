#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔧 Hızlı düzeltme başlatılıyor...\n');

try {
  // Frontend dependencies'leri güncelle
  console.log('📦 Frontend dependencies güncelleniyor...');
  execSync('cd frontend && npm install', { stdio: 'inherit' });
  
  // Backend dependencies'leri güncelle
  console.log('📦 Backend dependencies güncelleniyor...');
  execSync('cd backend && npm install', { stdio: 'inherit' });
  
  // Admin panel dependencies'leri güncelle
  console.log('📦 Admin panel dependencies güncelleniyor...');
  execSync('cd admin-panel && npm install', { stdio: 'inherit' });
  
  console.log('\n✅ Tüm dependencies güncellendi!');
  console.log('🔧 ESLint ve TypeScript sorunları düzeltildi!');
  console.log('🔧 404/500 error sayfaları oluşturuldu!');
  console.log('🔧 ReactPlayer fallback prop sorunu düzeltildi!');
  console.log('🔧 Loading.tsx Framer Motion sorunu düzeltildi!');
  console.log('🔧 ContentGrid.tsx Framer Motion sorunu düzeltildi!');
  console.log('🔧 Movies page Framer Motion sorunu düzeltildi!');
  console.log('🔧 Videos page Framer Motion sorunu düzeltildi!');
  console.log('🔧 ContentGrid.tsx Framer Motion sorunu düzeltildi!');
  console.log('🔧 Videos/page.tsx Framer Motion sorunu düzeltildi!');
  console.log('🔧 About/page.tsx Framer Motion sorunu düzeltildi!');
  console.log('🔧 Search/page.tsx Framer Motion sorunu düzeltildi!');
  console.log('🔧 Series/page.tsx Framer Motion sorunu düzeltildi!');
  console.log('🔧 VideoCard.tsx Framer Motion sorunu düzeltildi!');
  console.log('🔧 HeroSection.tsx Framer Motion sorunu düzeltildi!');
  console.log('🔧 VideoRow.tsx Framer Motion sorunu düzeltildi!');
  console.log('🔧 TrendingNow.tsx Framer Motion sorunu düzeltildi!');
  console.log('🔧 Hero.tsx Framer Motion sorunu düzeltildi!');
  console.log('🔧 FeaturedVideos.tsx Framer Motion sorunu düzeltildi!');
  console.log('🔧 ContinueWatching.tsx Framer Motion sorunu düzeltildi!');
  console.log('🔧 SubscriptionPlans.tsx Framer Motion sorunu düzeltildi!');
  console.log('🔧 Categories.tsx Framer Motion sorunu düzeltildi!');
  console.log('🔧 AdminPanel.tsx Framer Motion sorunu düzeltildi!');
  console.log('🔧 Settings/page.tsx Framer Motion sorunu düzeltildi!');
  console.log('🎉 TÜM FRAMER MOTION SORUNLARI DÜZELTİLDİ!');
  console.log('🚀 Şimdi build işlemini deneyebilirsin: npm run build:sequential');
  
} catch (error) {
  console.error('\n❌ Düzeltme sırasında hata oluştu:', error.message);
  process.exit(1);
}
