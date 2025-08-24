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
    console.log('🔍 Favori ekleme isteği:', { userId: req.user?.id, videoId: body.videoId, type: body.type })
    try {
      const result = await this.favoritesService.addToFavorites(req.user.id, body.videoId, body.type)
      console.log('✅ Favori ekleme başarılı:', result)
      return { success: true, data: result }
    } catch (error) {
      console.error('❌ Favori ekleme hatası:', error)
      return { success: false, error: error.message }
    }
  }

  @Delete()
  @ApiOperation({ summary: 'Favorilerden çıkar' })
  @ApiResponse({ status: 200, description: 'Favorilerden başarıyla çıkarıldı' })
  async removeFromFavorites(@Req() req, @Body() body: { videoId: string }) {
    console.log('🔍 Favori çıkarma isteği:', { userId: req.user?.id, videoId: body.videoId })
    try {
      await this.favoritesService.removeFromFavorites(req.user.id, body.videoId)
      console.log('✅ Favori çıkarma başarılı')
      return { success: true, message: 'Favori çıkarıldı' }
    } catch (error) {
      console.error('❌ Favori çıkarma hatası:', error)
      return { success: false, error: error.message }
    }
  }

  @Post('check')
  @ApiOperation({ summary: 'Favori durumunu kontrol et' })
  @ApiResponse({ status: 200, description: 'Favori durumu' })
  async checkFavoriteStatus(@Req() req, @Body() body: { videoId: string }) {
    console.log('🔍 Favori durumu kontrol:', { userId: req.user?.id, videoId: body.videoId })
    try {
      const result = await this.favoritesService.checkFavoriteStatus(req.user.id, body.videoId)
      console.log('✅ Favori durumu kontrol başarılı:', result)
      return { success: true, data: result }
    } catch (error) {
      console.error('❌ Favori durumu kontrol hatası:', error)
      return { success: false, error: error.message }
    }
  }

  @Get('my-favorites')
  @ApiOperation({ summary: 'Kullanıcının favorileri' })
  @ApiResponse({ status: 200, description: 'Kullanıcının favori listesi' })
  async getUserFavorites(@Req() req) {
    console.log('🔍 Kullanıcı favorileri isteniyor:', { userId: req.user?.id })
    try {
      const result = await this.favoritesService.getUserFavorites(req.user.id)
      console.log('✅ Kullanıcı favorileri başarılı:', result.length, 'favori bulundu')
      
      // Her favori için video verilerini kontrol et
      result.forEach((favorite, index) => {
        console.log(`🔍 Favori ${index + 1}:`, {
          id: favorite.id,
          videoId: favorite.videoId,
          type: favorite.type,
          video: favorite.video ? {
            id: favorite.video.id,
            title: favorite.video.title,
            thumbnailUrl: favorite.video.thumbnailUrl,
            posterUrl: favorite.video.posterUrl,
            thumbnailPath: favorite.video.thumbnailPath
          } : 'Video data yok'
        })
      })
      
      return { success: true, data: result }
    } catch (error) {
      console.error('❌ Kullanıcı favorileri hatası:', error)
      return { success: false, error: error.message }
    }
  }

  @Get('count/:videoId')
  @ApiOperation({ summary: 'Video favori sayısı' })
  @ApiResponse({ status: 200, description: 'Video favori sayısı' })
  async getFavoriteCount(@Param('videoId') videoId: string) {
    return await this.favoritesService.getFavoriteCount(videoId)
  }
}
