import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseInterceptors, 
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  Query,
  Headers
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { VideoType } from '../../entities/video.entity';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 2)) // video + thumbnail
  async create(
    @Body() createVideoDto: CreateVideoDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(mp4|avi|mov|mkv|webm|m4v|flv|wmv)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 1024 * 5 }) // 5GB (5 * 1024^3 bytes)
        ],
        fileIsRequired: true,
      }),
    ) files: Express.Multer.File[]
  ) {
    const videoFile = files[0]; // First file is video
    const thumbnailFile = files[1]; // Second file is thumbnail (optional)
    
    return this.videosService.create(createVideoDto, videoFile, thumbnailFile);
  }

  @Get()
  findAll() {
    return this.videosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videosService.findOne(id);
  }

  @Get('type/:type')
  findByType(@Param('type') type: string) {
    return this.videosService.findByType(type as VideoType);
  }

  @Get('featured/featured')
  findFeatured() {
    return this.videosService.findFeatured();
  }

  @Get('new/new')
  findNew() {
    return this.videosService.findNew();
  }

  @Get('search/filter')
  async searchWithFilters(
    @Query('query') query?: string,
    @Query('genre') genre?: string,
    @Query('year') year?: string,
    @Query('type') type?: string,
    @Query('rating') rating?: string,
    @Query('duration') duration?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.videosService.searchWithFilters({
      query,
      genre,
      year,
      type,
      rating,
      duration,
      sortBy,
      sortOrder: sortOrder || 'DESC',
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20
    });
  }

  @Get('genres/all')
  async getAllGenres() {
    return this.videosService.getAllGenres();
  }

  @Get('watch-time')
  async getWatchTime(@Headers('authorization') authHeader?: string) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          totalMinutes: 0,
          totalViews: 0,
          completedVideos: 0,
          message: 'Kullanıcı kimlik doğrulaması gerekli'
        };
      }

      const token = authHeader.replace('Bearer ', '');
      // JWT token'dan user ID'yi çıkar (basit implementasyon)
      // Gerçek uygulamada JWT service kullanılmalı
      const userId = this.extractUserIdFromToken(token);
      
      if (!userId) {
        return {
          totalMinutes: 0,
          totalViews: 0,
          completedVideos: 0,
          message: 'Geçersiz token'
        };
      }

      const watchStats = await this.videosService.getWatchTime(userId);
      
      return {
        ...watchStats,
        message: 'İzleme istatistikleri başarıyla alındı'
      };
    } catch (error) {
      console.error('İzleme süresi alınamadı:', error);
      return {
        totalMinutes: 0,
        totalViews: 0,
        completedVideos: 0,
        message: 'İzleme süresi alınamadı'
      };
    }
  }

  // Basit token parsing (gerçek uygulamada JWT service kullanılmalı)
  private extractUserIdFromToken(token: string): string | null {
    try {
      // JWT token'ı decode et
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        // Eğer JWT formatında değilse, localStorage'dan gelen token olabilir
        // Bu durumda basit parsing yap
        try {
          const decoded = Buffer.from(token, 'base64').toString();
          const parsed = JSON.parse(decoded);
          return parsed.userId || parsed.sub || null;
        } catch {
          return null;
        }
      }
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      return payload.userId || payload.sub || null;
    } catch (error) {
      console.error('Token parsing hatası:', error);
      return null;
    }
  }

  @Get('years/all')
  async getAllYears() {
    return this.videosService.getAllYears();
  }

  @Get('stats/overview')
  async getStatsOverview() {
    return this.videosService.getStatsOverview();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videosService.update(id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videosService.remove(id);
  }

  @Post(':id/views')
  incrementViews(@Param('id') id: string) {
    return this.videosService.incrementViews(id);
  }

  @Post(':id/share')
  incrementShares(@Param('id') id: string) {
    return this.videosService.incrementShares(id);
  }

  @Post('fix-urls')
  async fixVideoUrls() {
    return this.videosService.fixVideoUrls();
  }

  @Post('watch-history')
  async saveWatchHistory(@Body() watchHistoryDto: any, @Headers('authorization') authHeader?: string) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          success: false,
          message: 'Kullanıcı kimlik doğrulaması gerekli'
        };
      }

      const token = authHeader.replace('Bearer ', '');
      const userId = this.extractUserIdFromToken(token);
      
      if (!userId) {
        return {
          success: false,
          message: 'Geçersiz token'
        };
      }

      // Mevcut izleme geçmişini kontrol et
      const existingHistory = await this.videosService.findWatchHistory(userId, watchHistoryDto.videoId);
      
      if (existingHistory) {
        // Mevcut kaydı güncelle
        const updatedHistory = await this.videosService.updateWatchHistory(existingHistory.id, {
          watchDuration: watchHistoryDto.watchDuration,
          totalViews: existingHistory.totalViews + 1,
          isCompleted: watchHistoryDto.isCompleted,
          lastWatchedAt: new Date()
        });
        
        return {
          success: true,
          message: 'İzleme geçmişi güncellendi',
          data: updatedHistory
        };
      } else {
        // Yeni kayıt oluştur
        const newHistory = await this.videosService.createWatchHistory({
          userId: userId,
          videoId: watchHistoryDto.videoId,
          watchDuration: watchHistoryDto.watchDuration,
          totalViews: 1,
          isCompleted: watchHistoryDto.isCompleted,
          lastWatchedAt: new Date()
        });
        
        return {
          success: true,
          message: 'İzleme geçmişi oluşturuldu',
          data: newHistory
        };
      }
    } catch (error) {
      console.error('İzleme geçmişi kaydedilemedi:', error);
      return {
        success: false,
        message: 'İzleme geçmişi kaydedilemedi'
      };
    }
  }
}
