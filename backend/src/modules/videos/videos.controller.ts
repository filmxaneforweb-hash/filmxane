import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('videos')
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  @ApiOperation({ summary: 'هەموو ڤیدیۆکان' })
  @ApiResponse({ status: 200, description: 'لیستی ڤیدیۆکان' })
  async findAll(@Query() query: any) {
    return await this.videosService.findAll(query);
  }

  @Get('featured')
  @ApiOperation({ summary: 'ڤیدیۆ بەربەلاوەکان' })
  @ApiResponse({ status: 200, description: 'لیستی ڤیدیۆ بەربەلاوەکان' })
  async getFeatured() {
    return await this.videosService.getFeatured();
  }

  @Get('trending')
  @ApiOperation({ summary: 'ڤیدیۆ بەناوبانگەکان' })
  @ApiResponse({ status: 200, description: 'لیستی ڤیدیۆ بەناوبانگەکان' })
  async getTrending() {
    return await this.videosService.getTrending();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ڤیدیۆ بەپێی ID' })
  @ApiResponse({ status: 200, description: 'زانیاری ڤیدیۆ' })
  async findById(@Param('id') id: string) {
    const video = await this.videosService.findById(id);
    await this.videosService.incrementViewCount(id);
    return video;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'دروستکردنی ڤیدیۆ' })
  @ApiResponse({ status: 201, description: 'ڤیدیۆ بە سەرکەوتوویی دروستکرا' })
  async create(@Body() createVideoDto: CreateVideoDto, @Req() req) {
    return await this.videosService.create(createVideoDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'نوێکردنەوەی ڤیدیۆ' })
  @ApiResponse({ status: 200, description: 'ڤیدیۆ بە سەرکەوتوویی نوێکرا' })
  async update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return await this.videosService.update(id, updateVideoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'سڕینەوەی ڤیدیۆ' })
  @ApiResponse({ status: 200, description: 'ڤیدیۆ بە سەرکەوتوویی سڕایەوە' })
  async delete(@Param('id') id: string) {
    await this.videosService.delete(id);
    return { message: 'ڤیدیۆ بە سەرکەوتوویی سڕایەوە' };
  }

  @Post(':id/favorite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'گۆڕینی دۆخی دڵخۆش' })
  @ApiResponse({ status: 200, description: 'دۆخی دڵخۆش گۆڕدرا' })
  async toggleFavorite(@Param('id') id: string, @Req() req) {
    return await this.videosService.toggleFavorite(id, req.user.id);
  }

  @Get('favorites/my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ڤیدیۆ دڵخۆشەکانم' })
  @ApiResponse({ status: 200, description: 'لیستی ڤیدیۆ دڵخۆشەکان' })
  async getFavorites(@Req() req) {
    return await this.videosService.getFavorites(req.user.id);
  }

  @Get('stats/overview')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ئامارەکانی ڤیدیۆکان' })
  @ApiResponse({ status: 200, description: 'ئامارەکانی ڤیدیۆکان' })
  async getStats() {
    return await this.videosService.getStats();
  }
}
