import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    const secret = configService.get('JWT_SECRET') || 'filmxane_super_secret_key_2024';
    console.log('🔐 JWT Strategy configured with secret:', secret ? 'PRESENT' : 'MISSING');
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.authService.validateUser(payload);
      if (!user) {
        throw new UnauthorizedException('Kullanıcı bulunamadı');
      }
      return user;
    } catch (error) {
      // Re-throw UnauthorizedException as is
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      // For other errors, throw a generic UnauthorizedException
      throw new UnauthorizedException('Token doğrulanamadı');
    }
  }
}
