import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

// GoDaddy için optimize edilmiş main.ts
async function bootstrap() {
  const expressApp = express();
  
  // CORS configuration for GoDaddy
  expressApp.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  // Global prefix
  app.setGlobalPrefix('api');

  // Port configuration for GoDaddy
  const port = process.env.PORT || 3000;
  
  await app.listen(port);
  
  console.log(`🚀 Filmxane Backend GoDaddy'de çalışıyor: http://localhost:${port}`);
  console.log(`📚 API: http://localhost:${port}/api`);
}

bootstrap().catch(err => {
  console.error('❌ Backend başlatılamadı:', err);
  process.exit(1);
});
