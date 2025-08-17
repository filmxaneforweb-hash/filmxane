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

    console.log('🚀 Register attempt:', { 
      email, 
      firstName, 
      lastName, 
      passwordLength: password?.length 
    });

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    console.log('👤 Existing user check:', existingUser ? 'FOUND' : 'NOT_FOUND');
    
    if (existingUser) {
      console.log('❌ User already exists with email:', email);
      throw new ConflictException('ئیمەیڵ پێشتر بەکارهاتووە');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      emailVerificationToken: uuidv4(),
    });

    const savedUser = await this.userRepository.save(user);
    console.log('✅ User saved successfully:', { 
      id: savedUser.id, 
      email: savedUser.email, 
      role: savedUser.role 
    });

    // Generate JWT token
    console.log('🎫 Generating JWT token for new user:', savedUser.id);
    const token = this.generateToken(savedUser);
    console.log('🎫 Token generated:', token ? 'SUCCESS' : 'FAILED', 'Length:', token?.length);

    return { user: savedUser, token };
  }

  async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
    const { email, password } = loginDto;
    
    console.log('🔐 Login attempt:', { email, passwordLength: password?.length });

    // Find user
    const user = await this.userRepository.findOne({ where: { email } });
    console.log('👤 User found:', user ? { 
      id: user.id, 
      email: user.email, 
      status: user.status,
      passwordHash: user.password?.substring(0, 20) + '...',
      passwordLength: user.password?.length
    } : 'NOT_FOUND');
    
    if (!user) {
      console.log('❌ User not found for email:', email);
      throw new UnauthorizedException('ئیمەیڵ یان وشەی نهێنی هەڵەیە');
    }

    // Check password
    console.log('🔑 Password check:', { 
      providedPassword: password, 
      hashedPassword: user.password?.substring(0, 20) + '...',
      passwordLength: user.password?.length 
    });
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('✅ Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('ئیمەیڵ یان وشەی نهێنی هەڵەیە');
    }

    // Check if user is active
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('هەژمارەکە چالاک نییە');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    // Generate JWT token
    console.log('🎫 Generating JWT token for user:', user.id);
    const token = this.generateToken(user);
    console.log('🎫 Token generated:', token ? 'SUCCESS' : 'FAILED', 'Length:', token?.length);

    return { user, token };
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: payload.sub } });
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('بەکارهێنەر نەدۆزرایەوە');
    }
    return user;
  }

  async refreshToken(userId: string): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('بەکارهێنەر نەدۆزرایەوە');
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
      throw new UnauthorizedException('تۆکێنی نوێکردنەوەی وشەی نهێنی بەسەرچووە یان هەڵەیە');
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
      throw new UnauthorizedException('تۆکێنی پشتڕاستکردنەوەی ئیمەیڵ هەڵەیە');
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
