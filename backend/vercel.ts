import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let app: any;

export default async function handler(req: any, res: any) {
  if (!app) {
    const expressApp = express();
    app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    
    // CORS configuration
    app.enableCors({
      origin: '*',
      methods: '*',
      allowedHeaders: '*',
      credentials: false
    });

    // Global prefix
    app.setGlobalPrefix('api');
    
    await app.init();
  }

  return app.getHttpAdapter().getInstance()(req, res);
}
