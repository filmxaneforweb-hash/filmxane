import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class VercelDatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    // Vercel Postgres için konfigürasyon
    const isVercel = process.env.VERCEL === '1';
    
    if (isVercel) {
      // Vercel Postgres
      return {
        type: 'postgres',
        url: process.env.POSTGRES_URL,
        entities: [
          __dirname + '/../entities/*.entity{.ts,.js}',
        ],
        migrations: [__dirname + '/../migrations/*{.ts,.js}'],
        synchronize: true,
        logging: false,
        ssl: {
          rejectUnauthorized: false
        }
      };
    } else {
      // Local SQLite
      return {
        type: 'sqlite',
        database: 'filmxane.db',
        entities: [
          __dirname + '/../entities/*.entity{.ts,.js}',
        ],
        migrations: [__dirname + '/../migrations/*{.ts,.js}'],
        synchronize: true,
        logging: true,
      };
    }
  }
}
