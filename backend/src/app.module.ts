import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { VideosModule } from './modules/videos/videos.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AdminModule } from './modules/admin/admin.module';

// Config
import { DatabaseConfig } from './config/database.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
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
    SubscriptionsModule,
    PaymentsModule,
    AdminModule,
  ],
})
export class AppModule {}
