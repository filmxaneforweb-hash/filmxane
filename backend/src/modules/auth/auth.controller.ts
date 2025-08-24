import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  Param,
  ConflictException,
  UnauthorizedException,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { User } from '../../entities/user.entity';
import { UserRole } from '../../entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Hesap oluşturma' })
  @ApiResponse({ status: 201, description: 'Hesap başarıyla oluşturuldu' })
  @ApiResponse({ status: 409, description: 'Email zaten kullanılıyor' })
  async register(@Body() registerDto: RegisterDto) {
    try {
      const result = await this.authService.register(registerDto);
      return {
        success: true,
        data: result,
        message: 'Hesap başarıyla oluşturuldu'
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        return {
          success: false,
          error: 'Bu email adresi zaten kullanılıyor'
        };
      }
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Giriş yapma' })
  @ApiResponse({ status: 200, description: 'Başarıyla giriş yapıldı' })
  @ApiResponse({ status: 401, description: 'Email veya şifre hatalı' })
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto);
      return {
        success: true,
        data: result,
        message: 'Başarıyla giriş yapıldı'
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return {
          success: false,
          error: 'Email veya şifre hatalı'
        };
      }
      throw error;
    }
  }

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin girişi' })
  @ApiResponse({ status: 200, description: 'Admin başarıyla giriş yaptı' })
  @ApiResponse({ status: 401, description: 'Geçersiz kimlik bilgileri' })
  async adminLogin(@Body() adminLoginDto: AdminLoginDto) {
    try {
      const result = await this.authService.adminLogin(adminLoginDto.email, adminLoginDto.password);
      return {
        success: true,
        data: result,
        message: 'Admin başarıyla giriş yaptı'
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return {
          success: false,
          error: 'Email veya şifre hatalı'
        };
      }
      throw error;
    }
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Şifremi unuttum' })
  @ApiResponse({ status: 200, description: 'Şifre sıfırlama emaili gönderildi' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto.email);
    return { message: 'Eğer email adresi mevcutsa, şifre sıfırlama linki gönderildi' };
  }

  @Post('reset-password/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Şifre sıfırlama' })
  @ApiResponse({ status: 200, description: 'Şifre başarıyla sıfırlandı' })
  @ApiResponse({ status: 401, description: 'Token geçersiz veya süresi dolmuş' })
  async resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    await this.authService.resetPassword(token, resetPasswordDto.newPassword);
    return { message: 'Şifre başarıyla sıfırlandı' };
  }

  @Post('verify-email/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Email doğrulama' })
  @ApiResponse({ status: 200, description: 'Email başarıyla doğrulandı' })
  @ApiResponse({ status: 401, description: 'Token geçersiz' })
  async verifyEmail(@Param('token') token: string) {
    await this.authService.verifyEmail(token);
    return { message: 'Email başarıyla doğrulandı' };
  }

  @Post('verify-admin')
  async verifyAdmin(@Body() body: { email: string }, @Headers('authorization') authHeader: string) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          success: false,
          error: 'Token bulunamadı'
        };
      }

      const token = authHeader.substring(7);
      
      // Token'ı doğrula
      const decoded = this.jwtService.verify(token);
      
      // Kullanıcıyı bul
      const user = await this.usersService.findByEmail(body.email);
      
      if (!user) {
        return {
          success: false,
          error: 'Kullanıcı bulunamadı'
        };
      }

      // Admin rolünü kontrol et
      if (user.role !== UserRole.ADMIN) {
        return {
          success: false,
          error: 'Admin yetkisi yok',
          isAdmin: false
        };
      }

      return {
        success: true,
        isAdmin: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      };

    } catch (error) {
      console.error('Admin verification error:', error);
      return {
        success: false,
        error: 'Token doğrulanamadı'
      };
    }
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Token yenileme' })
  @ApiResponse({ status: 200, description: 'Yeni token oluşturuldu' })
  @ApiResponse({ status: 401, description: 'Token süresi dolmuş' })
  async refreshToken(@Req() req) {
    return await this.authService.refreshToken(req.user.id);
  }

  @Get('test')
  @ApiOperation({ summary: 'Test endpoint' })
  @ApiResponse({ status: 200, description: 'Auth endpoint çalışıyor' })
  async test() {
    return { 
      message: 'Auth endpoint çalışıyor',
      timestamp: new Date().toISOString(),
      jwtSecret: process.env.JWT_SECRET ? 'PRESENT' : 'MISSING'
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı bilgileri' })
  @ApiResponse({ status: 200, description: 'Kullanıcı bilgileri' })
  @ApiResponse({ status: 401, description: 'Token süresi dolmuş' })
  async getProfile(@Req() req) {
    const user = req.user;
    
    // Return user data without sensitive information
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      bio: user.bio,
      emailVerified: user.emailVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
