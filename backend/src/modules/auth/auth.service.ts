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
    console.log('🔐 AuthService constructor - JWT Service check:', {
      jwtServiceExists: !!this.jwtService,
      jwtServiceType: typeof this.jwtService,
      jwtServiceMethods: this.jwtService ? Object.getOwnPropertyNames(Object.getPrototypeOf(this.jwtService)) : 'N/A'
    });
    
    if (!this.jwtService) {
      console.error('❌ JWT Service not properly injected');
      throw new Error('JWT Service not properly injected');
    }
    
    console.log('✅ JWT Service properly injected in AuthService');
  }

  async register(registerDto: RegisterDto): Promise<{ user: User; token: string }> {
    const { email, password, firstName, lastName } = registerDto;
    
    try {
      console.log('🚀 Register attempt:', { email, firstName, lastName, passwordLength: password?.length });
      
      // Check if JWT service is available
      if (!this.jwtService) {
        console.error('❌ JWT Service is not available');
        throw new Error('JWT Service not available');
      }
      
      // Check if user already exists
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        console.log('❌ User already exists:', email);
        throw new ConflictException('Bu email adresi zaten kullanılıyor');
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      console.log('🔐 Password hashed successfully');

      // Create user with active status and verified email
      const user = this.userRepository.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        emailVerificationToken: undefined,
      });

      console.log('👤 User object created:', { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName });

      const savedUser = await this.userRepository.save(user);
      console.log('💾 User saved to database:', savedUser);

      // Generate JWT token
      console.log('🎫 Attempting to generate JWT token...');
      const token = this.generateToken(savedUser);
      console.log('✅ JWT token generated successfully:', token ? `Length: ${token.length}` : 'FAILED');

      if (!token) {
        console.error('❌ JWT token generation failed');
        throw new Error('JWT token generation failed');
      }

      console.log('🎉 Registration successful:', { userId: savedUser, tokenLength: token.length });
      return { user: savedUser, token };
    } catch (error) {
      console.error('❌ Registration error:', error);
      
      // Re-throw ConflictException as is
      if (error instanceof ConflictException) {
        throw error;
      }
      
      // For other errors, throw a generic message
      throw new ConflictException('Kayıt olurken bir hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
    }
  }

  async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
    const { email, password } = loginDto;
    
    try {
      console.log('🔐 Login attempt:', { email, passwordLength: password?.length });
      
      // Check if JWT service is available
      if (!this.jwtService) {
        console.error('❌ JWT Service is not available in login');
        throw new Error('JWT Service not available');
      }
      
      // Find user
      const user = await this.userRepository.findOne({ where: { email } });
      
      if (!user) {
        console.log('❌ User not found for login:', email);
        throw new UnauthorizedException('Email veya şifre hatalı');
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        console.log('❌ Invalid password for login:', email);
        throw new UnauthorizedException('Email veya şifre hatalı');
      }

      // Check if user is active
      if (user.status !== UserStatus.ACTIVE) {
        console.log('❌ User account not active:', email, user.status);
        throw new UnauthorizedException('Hesap aktif değil');
      }

      // Update last login
      user.lastLoginAt = new Date();
      await this.userRepository.save(user);
      console.log('✅ Last login updated for user:', email);

      // Generate JWT token
      console.log('🎫 Attempting to generate JWT token for login...');
      const token = this.generateToken(user);
      console.log('✅ JWT token generated for login:', token ? `Length: ${token.length}` : 'FAILED');

      if (!token) {
        console.error('❌ JWT token generation failed for login');
        throw new Error('JWT token generation failed');
      }

      console.log('🎉 Login successful:', { userId: user.id, email: user.email });
      return { user, token };
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // Re-throw UnauthorizedException as is
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      // For other errors, throw a generic message
      throw new UnauthorizedException('Giriş yapılırken bir hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
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
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

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
    user.emailVerificationToken = undefined;

    await this.userRepository.save(user);
  }

  private generateToken(user: User): string {
    try {
      console.log('🔐 generateToken called with user:', { id: user.id, email: user.email, role: user.role });
      
      // Check if JWT service is available
      if (!this.jwtService) {
        console.error('❌ JWT Service is null in generateToken');
        throw new Error('JWT Service is null');
      }
      
      // Create JWT payload
      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };
      
      console.log('📝 JWT payload created:', payload);
      
      // Generate real JWT token
      const token = this.jwtService.sign(payload);
      console.log('🎫 JWT token signed successfully:', token ? `Length: ${token.length}` : 'FAILED');
      
      if (!token) {
        console.error('❌ JWT sign returned null/undefined');
        throw new Error('JWT sign returned null/undefined');
      }
      
      return token;
    } catch (error) {
      console.error('❌ Error in generateToken:', error);
      
      // Fallback to manual token if JWT fails
      console.log('🔄 Falling back to manual token generation...');
      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
      };
      
      const manualToken = Buffer.from(JSON.stringify(payload)).toString('base64');
      console.log('🎫 Manual fallback token created:', manualToken ? `Length: ${manualToken.length}` : 'FAILED');
      
      return manualToken;
    }
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
