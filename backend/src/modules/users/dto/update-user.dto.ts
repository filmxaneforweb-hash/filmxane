import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'ناوی یەکەم',
    example: 'ئەحمەد',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'ناوی دووەم',
    example: 'محەممەد',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'ئیمەیڵی بەکارهێنەر',
    example: 'user@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'ئیمەیڵێکی دروست بنووسە' })
  email?: string;

  @ApiProperty({
    description: 'ژمارەی مۆبایل',
    example: '+9647501234567',
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: 'بەڕێزە',
    example: 'زانیاری دەربارەی بەکارهێنەر',
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    description: 'ئەڤاتار',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;
}
