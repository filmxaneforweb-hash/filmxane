import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS configuration
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
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

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Filmxane API ${port} portunda çalışıyor`);
  console.log(`📚 API Dokümantasyonu: http://localhost:${port}/api/docs`);
}

bootstrap();
