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
  Query
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
  async getWatchTime() {
    // Şimdilik basit bir hesaplama - gelecekte gerçek izleme verileri eklenebilir
    return {
      totalMinutes: 0,
      message: 'İzlenme süresi henüz takip edilmiyor'
    };
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
}
