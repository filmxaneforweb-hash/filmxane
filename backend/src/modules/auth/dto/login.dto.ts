import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
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
}
