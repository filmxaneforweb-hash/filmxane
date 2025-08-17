import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { VideosModule } from './modules/videos/videos.module';
import { SeriesModule } from './modules/series/series.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AdminModule } from './modules/admin/admin.module';

// Gateways
import { AdminGateway } from './gateways/admin.gateway';

// Config
import { DatabaseConfig } from './config/database.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [
        () => ({
          JWT_SECRET: process.env.JWT_SECRET || 'filmxane_super_secret_key_2024',
          JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
          CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3002',
        }),
      ],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLE_TTL) || 60,
        limit: parseInt(process.env.THROTTLE_LIMIT) || 100,
      },
    ]),

    // Scheduled tasks
    ScheduleModule.forRoot(),

    // Feature modules
    AuthModule,
    UsersModule,
    VideosModule,
    SeriesModule,
    CategoriesModule,
    SubscriptionsModule,
    PaymentsModule,
    AdminModule,
    
    // Gateways
    AdminGateway,
  ],
})
export class AppModule {}
