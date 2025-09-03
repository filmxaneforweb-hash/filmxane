import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'هەموو بەکارهێنەرەکان' })
  @ApiResponse({ status: 200, description: 'لیستی بەکارهێنەرەکان' })
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get('profile')
  @ApiOperation({ summary: 'پڕۆفایلی بەکارهێنەر' })
  @ApiResponse({ status: 200, description: 'زانیاری بەکارهێنەر' })
  async getProfile(@Req() req: any) {
    return await this.usersService.getProfile(req.user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'نوێکردنەوەی پڕۆفایل' })
  @ApiResponse({ status: 200, description: 'پڕۆفایل بە سەرکەوتوویی نوێکرا' })
  async updateProfile(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateProfile(req.user.id, updateUserDto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'بەکارهێنەر بەپێی ID' })
  @ApiResponse({ status: 200, description: 'زانیاری بەکارهێنەر' })
  async findById(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'نوێکردنەوەی بەکارهێنەر' })
  @ApiResponse({ status: 200, description: 'بەکارهێنەر بە سەرکەوتوویی نوێکرا' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'سڕینەوەی بەکارهێنەر' })
  @ApiResponse({ status: 200, description: 'بەکارهێنەر بە سەرکەوتوویی سڕایەوە' })
  async delete(@Param('id') id: string) {
    await this.usersService.delete(id);
    return { message: 'بەکارهێنەر بە سەرکەوتوویی سڕایەوە' };
  }

  @Get('stats/overview')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'ئامارەکانی بەکارهێنەرەکان' })
  @ApiResponse({ status: 200, description: 'ئامارەکانی بەکارهێنەرەکان' })
  async getStats() {
    return await this.usersService.getStats();
  }
}
