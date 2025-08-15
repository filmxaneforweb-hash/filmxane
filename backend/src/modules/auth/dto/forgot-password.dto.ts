import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'ئیمەیڵی بەکارهێنەر',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'ئیمەیڵێکی دروست بنووسە' })
  email: string;
}
