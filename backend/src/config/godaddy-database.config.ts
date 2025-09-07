import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class GoDaddyDatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USER || 'filmxane_user',
      password: process.env.DB_PASS || 'password',
      database: process.env.DB_NAME || 'filmxane_db',
      entities: [
        __dirname + '/../entities/*.entity{.ts,.js}',
      ],
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
      ssl: false, // GoDaddy shared hosting'de SSL gerekmez
    };
  }
}
