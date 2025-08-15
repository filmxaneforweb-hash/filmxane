import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'ئیمەیڵی بەکارهێنەر',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'ئیمەیڵێکی دروست بنووسە' })
  email: string;

  @ApiProperty({
    description: 'وشەی نهێنی',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'وشەی نهێنی دەبێت لانیکەم ٦ پیت بێت' })
  password: string;

  @ApiProperty({
    description: 'ناوی یەکەم',
    example: 'ئەحمەد',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'ناوی دووەم',
    example: 'محەممەد',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'ژمارەی مۆبایل',
    example: '+9647501234567',
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
