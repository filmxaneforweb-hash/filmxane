import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { User, UserRole, UserStatus } from '../../entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {
    // Verify JWT service is properly injected
    if (!this.jwtService) {
      throw new Error('JWT Service not properly injected');
    }
  }

  async register(registerDto: RegisterDto): Promise<{ user: User; token: string }> {
    const { email, password, firstName, lastName } = registerDto;
    
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new ConflictException('Bu email adresi zaten kullanılıyor');
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user with active status and verified email
      const user = this.userRepository.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        emailVerificationToken: null,
      });

      const savedUser = await this.userRepository.save(user);

      // Generate JWT token
      const token = this.generateToken(savedUser);

      return { user: savedUser, token };
    } catch (error) {
      // Re-throw ConflictException as is
      if (error instanceof ConflictException) {
        throw error;
      }
      
      // For other errors, throw a generic message
      throw new ConflictException('Kayıt olurken bir hata oluştu');
    }
  }

  async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
    const { email, password } = loginDto;
    
    try {
      // Find user
      const user = await this.userRepository.findOne({ where: { email } });
      
      if (!user) {
        throw new UnauthorizedException('Email veya şifre hatalı');
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('Email veya şifre hatalı');
      }

      // Check if user is active
      if (user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('Hesap aktif değil');
      }

      // Update last login
      user.lastLoginAt = new Date();
      await this.userRepository.save(user);

      // Generate JWT token
      const token = this.generateToken(user);

      return { user, token };
    } catch (error) {
      // Re-throw UnauthorizedException as is
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      // For other errors, throw a generic message
      throw new UnauthorizedException('Giriş yapılırken bir hata oluştu');
    }
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id: payload.sub } });
      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('Kullanıcı bulunamadı veya aktif değil');
      }
      return user;
    } catch (error) {
      // Re-throw UnauthorizedException as is
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      // For other errors, throw a generic UnauthorizedException
      throw new UnauthorizedException('Kullanıcı doğrulanamadı');
    }
  }

  async refreshToken(userId: string): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı');
    }

    const token = this.generateToken(user);
    return { token };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if email exists or not
      return;
    }

    // Generate reset token
    const resetToken = uuidv4();
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // 1 hour expiry

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;

    await this.userRepository.save(user);

    // TODO: Send email with reset link
    console.log(`Password reset token for ${email}: ${resetToken}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        passwordResetToken: token,
        passwordResetExpires: new Date(),
      },
    });

    if (!user) {
      throw new UnauthorizedException('Şifre sıfırlama token\'ı geçersiz veya süresi dolmuş');
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await this.userRepository.save(user);
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new UnauthorizedException('Email doğrulama token\'ı geçersiz');
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;

    await this.userRepository.save(user);
  }

  private generateToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  async adminLogin(email: string, password: string): Promise<{ user: User; token: string }> {
    console.log('🔐 Admin login attempt:', { email, passwordLength: password?.length });

    // Find admin user
    const user = await this.userRepository.findOne({ 
      where: { 
        email,
        role: UserRole.ADMIN 
      } 
    });
    
    console.log('👤 Admin user found:', user ? { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      status: user.status
    } : 'NOT_FOUND');
    
    if (!user) {
      console.log('❌ Admin user not found for email:', email);
      throw new UnauthorizedException('ئیمەیڵ یان وشەی نهێنی هەڵەیە');
    }

    // Check if user is active
    if (user.status !== UserStatus.ACTIVE) {
      console.log('❌ Admin user is not active:', user.status);
      throw new UnauthorizedException('هەژمار نەچالاکە');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('🔑 Admin password check:', { isValid: isPasswordValid });
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password for admin:', email);
      throw new UnauthorizedException('ئیمەیڵ یان وشەی نهێنی هەڵەیە');
    }

    // Generate JWT token
    const token = this.generateToken(user);
    console.log('🎫 Admin token generated:', token ? 'SUCCESS' : 'FAILED');

    return { user, token };
  }

  async createAdminUser(email: string, password: string, firstName: string, lastName: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const adminUser = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    });

    return await this.userRepository.save(adminUser);
  }
}
