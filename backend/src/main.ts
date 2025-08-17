import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { seedCategories } from './seeds/categories.seed';
import { seedUsers } from './seeds/users.seed';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

// Set JWT secret if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'filmxane_super_secret_key_2024';
}

// Create uploads directories
const createUploadsDirectories = () => {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  const videosDir = path.join(uploadsDir, 'videos');
  const thumbnailsDir = path.join(uploadsDir, 'thumbnails');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }
  if (!fs.existsSync(thumbnailsDir)) {
    fs.mkdirSync(thumbnailsDir, { recursive: true });
  }
  
  console.log('📁 Upload directories created successfully');
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Create upload directories
  createUploadsDirectories();

  // Serve static files from uploads directory
  app.useStaticAssets(path.join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS configuration
  app.enableCors({
    origin:
      process.env.CORS_ORIGIN?.split(',') || [
        'http://localhost:3000',  // Film sitesi
        'http://localhost:3002',  // Admin panel (eski port)
        'http://localhost:5173',  // Admin panel (yeni port)
      ],
    credentials: true,
  });

  // Increase body size limit for large file uploads
  app.use((req, res, next) => {
    res.setHeader('Content-Length', '0');
    res.setHeader('Transfer-Encoding', 'chunked');
    next();
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, // Validation'ı geri açıyoruz
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Filmxane API')
    .setDescription('Kürtçe streaming platformu API dokümantasyonu')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Kimlik doğrulama')
    .addTag('users', 'Kullanıcı yönetimi')
    .addTag('videos', 'Video yönetimi')
    .addTag('subscriptions', 'Abonelik yönetimi')
    .addTag('payments', 'Ödeme işlemleri')
    .addTag('admin', 'Admin paneli')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3005;
  await app.listen(port);
  
  // Seed initial data
  try {
    const dataSource = app.get(DataSource);
    // Tabloların oluşmasını bekle
    await new Promise(resolve => setTimeout(resolve, 2000));
    await seedCategories(dataSource);
    console.log('🌱 Categories seeded successfully');
    await seedUsers(dataSource);
    console.log('👥 Users seeded successfully');
  } catch (error) {
    console.log('⚠️ Could not seed data:', error.message);
    console.log('📝 This is normal if tables are still being created');
  }
  
  console.log(`🚀 Filmxane API ${port} portunda çalışıyor`);
  console.log(`📚 API Dokümantasyonu: http://localhost:${port}/api/docs`);
}

bootstrap();
