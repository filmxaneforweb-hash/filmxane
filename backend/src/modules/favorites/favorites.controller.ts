import { Controller, Post, Delete, Body, Param, Get, UseGuards, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { FavoritesService } from './favorites.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @ApiOperation({ summary: 'Favorilere ekle' })
  @ApiResponse({ status: 201, description: 'Favorilere başarıyla eklendi' })
  async addToFavorites(@Req() req, @Body() body: { videoId: string; type: 'movie' | 'series' }) {
    return await this.favoritesService.addToFavorites(req.user.id, body.videoId, body.type)
  }

  @Delete()
  @ApiOperation({ summary: 'Favorilerden çıkar' })
  @ApiResponse({ status: 200, description: 'Favorilerden başarıyla çıkarıldı' })
  async removeFromFavorites(@Req() req, @Body() body: { videoId: string }) {
    return await this.favoritesService.removeFromFavorites(req.user.id, body.videoId)
  }

  @Post('check')
  @ApiOperation({ summary: 'Favori durumunu kontrol et' })
  @ApiResponse({ status: 200, description: 'Favori durumu' })
  async checkFavoriteStatus(@Req() req, @Body() body: { videoId: string }) {
    return await this.favoritesService.checkFavoriteStatus(req.user.id, body.videoId)
  }

  @Get('my-favorites')
  @ApiOperation({ summary: 'Kullanıcının favorileri' })
  @ApiResponse({ status: 200, description: 'Kullanıcının favori listesi' })
  async getUserFavorites(@Req() req) {
    return await this.favoritesService.getUserFavorites(req.user.id)
  }

  @Get('count/:videoId')
  @ApiOperation({ summary: 'Video favori sayısı' })
  @ApiResponse({ status: 200, description: 'Video favori sayısı' })
  async getFavoriteCount(@Param('videoId') videoId: string) {
    return await this.favoritesService.getFavoriteCount(videoId)
  }
}
