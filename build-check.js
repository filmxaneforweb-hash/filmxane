#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Build öncesi kontrol başlatılıyor...\n');

// React versiyonlarını kontrol et
function checkReactVersions() {
  console.log('📋 React versiyonları kontrol ediliyor...');
  
  const frontendPkg = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
  const adminPkg = JSON.parse(fs.readFileSync('admin-panel/package.json', 'utf8'));
  
  const frontendReact = frontendPkg.dependencies.react;
  const adminReact = adminPkg.dependencies.react;
  
  if (frontendReact === adminReact) {
    console.log('✅ React versiyonları senkronize:', frontendReact);
  } else {
    console.log('❌ React versiyonları uyumsuz:');
    console.log('   Frontend:', frontendReact);
    console.log('   Admin Panel:', adminReact);
    process.exit(1);
  }
}

// TypeScript konfigürasyonlarını kontrol et
function checkTypeScriptConfigs() {
  console.log('\n📋 TypeScript konfigürasyonları kontrol ediliyor...');
  
  const configs = [
    'frontend/tsconfig.json',
    'backend/tsconfig.json', 
    'admin-panel/tsconfig.json'
  ];
  
  configs.forEach(configPath => {
    if (fs.existsSync(configPath)) {
      console.log(`✅ ${configPath} mevcut`);
    } else {
      console.log(`❌ ${configPath} eksik`);
      process.exit(1);
    }
  });
}

// ESLint konfigürasyonlarını kontrol et
function checkESLintConfigs() {
  console.log('\n📋 ESLint konfigürasyonları kontrol ediliyor...');
  
  const configs = [
    'frontend/.eslintrc.json',
    'backend/.eslintrc.json',
    'admin-panel/.eslintrc.json'
  ];
  
  configs.forEach(configPath => {
    if (fs.existsSync(configPath)) {
      console.log(`✅ ${configPath} mevcut`);
    } else {
      console.log(`⚠️ ${configPath} eksik - otomatik oluşturulacak`);
    }
  });
}

// Node modüllerini kontrol et
function checkNodeModules() {
  console.log('\n📋 Node modülleri kontrol ediliyor...');
  
  const projects = ['frontend', 'backend', 'admin-panel'];
  
  projects.forEach(project => {
    const nodeModulesPath = path.join(project, 'node_modules');
    if (fs.existsSync(nodeModulesPath)) {
      console.log(`✅ ${project}/node_modules mevcut`);
    } else {
      console.log(`❌ ${project}/node_modules eksik`);
      console.log(`   Lütfen önce 'npm run install:all' komutunu çalıştırın`);
      process.exit(1);
    }
  });
}

// Ana kontrolleri çalıştır
try {
  checkReactVersions();
  checkTypeScriptConfigs();
  checkESLintConfigs();
  checkNodeModules();
  
  console.log('\n🎉 Tüm kontroller başarılı! Build işlemi başlatılabilir.');
  console.log('\n🚀 Build komutu: npm run build');
  
} catch (error) {
  console.error('\n❌ Kontrol sırasında hata oluştu:', error.message);
  process.exit(1);
}
