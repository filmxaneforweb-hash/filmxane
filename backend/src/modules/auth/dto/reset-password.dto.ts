import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'وشەی نهێنی نوێ',
    example: 'newpassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'وشەی نهێنی دەبێت لانیکەم ٦ پیت بێت' })
  newPassword: string;
}
