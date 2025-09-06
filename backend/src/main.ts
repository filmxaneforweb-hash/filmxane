import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpException, HttpStatus } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

// Set JWT secret if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'filmxane_super_secret_key_2024';
}

// Process protection - prevent crashes
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // Don't exit, just log and continue
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit, just log and continue
});

process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Create uploads directories
const createUploadsDirectories = () => {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  const videosDir = path.join(uploadsDir, 'videos');
  const thumbnailsDir = path.join(uploadsDir, 'thumbnails');
  const postersDir = path.join(uploadsDir, 'posters');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }
  if (!fs.existsSync(thumbnailsDir)) {
    fs.mkdirSync(thumbnailsDir, { recursive: true });
  }
  if (!fs.existsSync(postersDir)) {
    fs.mkdirSync(postersDir, { recursive: true });
  }
  
  console.log('📁 Upload directories created successfully');
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false, // Disable default body parser
  });

  // CORS configuration - Add early
  app.enableCors({
    origin: '*', // Allow all origins
    methods: '*', // Allow all methods
    allowedHeaders: '*', // Allow all headers
    credentials: false // Disable credentials for wildcard origin
  });

  // Configure body parser with increased limits
  app.use(require('express').json({ limit: '10gb' }));
  app.use(require('express').urlencoded({ limit: '10gb', extended: true }));

  // Create upload directories
  createUploadsDirectories();

  // Serve static files from uploads directory
  app.useStaticAssets(path.join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  // Global exception filter to prevent server crashes
  app.useGlobalFilters(new (class {
    catch(exception: any, host: any) {
      // Only log critical errors, not authentication failures
      if (exception?.response?.statusCode === 500 || exception?.response?.statusCode >= 500) {
        console.error('❌ Critical server error:', exception?.message || exception);
      } else if (exception?.response?.statusCode === 401) {
        // Silent authentication failures - just continue
        return;
      } else if (exception?.response?.statusCode === 404) {
        // Silent 404 errors - just continue
        return;
      } else if (exception?.response?.statusCode === 400) {
        // Silent 400 errors - just continue
        return;
      } else if (exception instanceof HttpException) {
        const status = exception.getStatus();
        if (status >= 500) {
          console.error(`❌ Critical HTTP ${status} error:`, exception.getResponse());
        }
        // For other HTTP errors, just continue silently
        return;
      } else {
        // Only log unknown critical errors
        console.error('❌ Unknown critical error:', exception?.message || exception);
      }
      
      // Always continue, never crash
      return;
    }
  })());

  // Health check endpoint
  app.getHttpAdapter().get('/health', (req: any, res: any) => {
    res.status(200).json({ 
      status: 'ok', 
      message: 'Filmxane Backend is running',
      timestamp: new Date().toISOString()
    });
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Filmxane API')
    .setDescription('Filmxane platformu için REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);


  const port = process.env.PORT || 3005;
  await app.listen(port);
  
  console.log(`🚀 Filmxane Backend başlatıldı: http://localhost:${port}`);
  console.log(`📚 API Dokümantasyonu: http://localhost:${port}/api/docs`);
  console.log(`📁 Static files: http://localhost:${port}/uploads`);
  console.log(`🔐 Gerçek kullanıcı kayıtları için hazır`);
}

bootstrap().catch(err => {
  console.error('❌ Backend başlatılamadı:', err);
  // Don't exit, just log the error
  console.log('⚠️ Backend hata ile karşılaştı ama durmadı');
});
