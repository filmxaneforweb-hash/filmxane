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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'هەژمار دروستکردن' })
  @ApiResponse({ status: 201, description: 'هەژمار بە سەرکەوتوویی دروستکرا' })
  @ApiResponse({ status: 409, description: 'ئیمەیڵ پێشتر بەکارهاتووە' })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'چوونەژوورەوە' })
  @ApiResponse({ status: 200, description: 'بە سەرکەوتوویی چووەژوورەوە' })
  @ApiResponse({ status: 401, description: 'ئیمەیڵ یان وشەی نهێنی هەڵەیە' })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, description: 'Admin logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async adminLogin(@Body() adminLoginDto: AdminLoginDto) {
    return await this.authService.adminLogin(adminLoginDto.email, adminLoginDto.password);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'وشەی نهێنی لەبیرچووە' })
  @ApiResponse({ status: 200, description: 'ئیمەیڵی نوێکردنەوە نێردرا' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto.email);
    return { message: 'ئەگەر ئیمەیڵەکە هەبێت، لینکی نوێکردنەوە نێردرا' };
  }

  @Post('reset-password/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'وشەی نهێنی نوێکردنەوە' })
  @ApiResponse({ status: 200, description: 'وشەی نهێنی بە سەرکەوتوویی نوێکرا' })
  @ApiResponse({ status: 401, description: 'تۆکێن بەسەرچووە یان هەڵەیە' })
  async resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    await this.authService.resetPassword(token, resetPasswordDto.newPassword);
    return { message: 'وشەی نهێنی بە سەرکەوتوویی نوێکرا' };
  }

  @Post('verify-email/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'پشتڕاستکردنەوەی ئیمەیڵ' })
  @ApiResponse({ status: 200, description: 'ئیمەیڵ بە سەرکەوتوویی پشتڕاستکرایەوە' })
  @ApiResponse({ status: 401, description: 'تۆکێن هەڵەیە' })
  async verifyEmail(@Param('token') token: string) {
    await this.authService.verifyEmail(token);
    return { message: 'ئیمەیڵ بە سەرکەوتوویی پشتڕاستکرایەوە' };
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تۆکێنی نوێکردنەوە' })
  @ApiResponse({ status: 200, description: 'تۆکێنی نوێ دروستکرا' })
  @ApiResponse({ status: 401, description: 'تۆکێن بەسەرچووە' })
  async refreshToken(@Req() req) {
    return await this.authService.refreshToken(req.user.id);
  }

  @Get('test')
  @ApiOperation({ summary: 'Test endpoint' })
  @ApiResponse({ status: 200, description: 'Auth endpoint working' })
  async test() {
    return { 
      message: 'Auth endpoint working',
      timestamp: new Date().toISOString(),
      jwtSecret: process.env.JWT_SECRET ? 'PRESENT' : 'MISSING'
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'زانیاری بەکارهێنەر' })
  @ApiResponse({ status: 200, description: 'زانیاری بەکارهێنەر' })
  @ApiResponse({ status: 401, description: 'تۆکێن بەسەرچووە' })
  async getProfile(@Req() req) {
    return req.user;
  }
}
