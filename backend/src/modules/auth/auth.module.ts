import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { User } from '../../entities/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // Hardcode JWT secret since .env file is not available
        const secret = 'filmxane_super_secret_jwt_key_2024_very_long_and_secure';
        console.log('🔐 JWT Module configured with hardcoded secret:', secret ? 'PRESENT' : 'MISSING');
        console.log('🔐 JWT Module secret length:', secret?.length);
        console.log('🔐 JWT Module secret preview:', secret?.substring(0, 20) + '...');
        
        const config = {
          secret,
          signOptions: {
            expiresIn: '7d',
          },
        };
        
        console.log('🔐 JWT Module final config:', JSON.stringify(config, null, 2));
        return config;
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
