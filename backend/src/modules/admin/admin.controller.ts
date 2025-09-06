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
  Put,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AdminService } from './admin.service';
import { CreateVideoDto } from '../videos/dto/create-video.dto';
import { CreateSeriesDto } from '../series/dto/create-series.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('chart-data')
  getChartData() {
    return this.adminService.getChartData();
  }

  @Get('pie-data')
  getPieData() {
    return this.adminService.getPieData();
  }

  @Get('recent-activities')
  getRecentActivities() {
    return this.adminService.getRecentActivities();
  }

  @Get('top-content')
  getTopContent() {
    return this.adminService.getTopContent();
  }

  @Get('genres')
  getGenres() {
    return this.adminService.getGenres();
  }

  @Get('notifications')
  getNotifications() {
    return this.adminService.getNotifications();
  }

  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('movies')
  getAllMovies() {
    return this.adminService.getAllMovies();
  }

  @Get('series')
  getAllSeries() {
    return this.adminService.getAllSeries();
  }

  @Get('user-stats')
  getUserStats() {
    return this.adminService.getUserStats();
  }

  @Get('movies/stats')
  getMovieStats() {
    return this.adminService.getMovieStats();
  }

  @Get('series/stats')
  getSeriesStats() {
    return this.adminService.getSeriesStats();
  }

  @Get('settings')
  getSystemSettings() {
    return this.adminService.getSystemSettings();
  }

  @Get('recent-activity')
  getRecentActivity() {
    return this.adminService.getRecentActivity();
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() updateData: any) {
    try {
      return await this.adminService.updateUser(id, updateData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    try {
      return await this.adminService.deleteUser(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('users/:id/role')
  async changeUserRole(@Param('id') id: string, @Body() roleData: { role: string }) {
    try {
      return await this.adminService.changeUserRole(id, roleData.role);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('settings')
  updateSystemSettings(@Body() settings: any) {
    return this.adminService.updateSystemSettings(settings);
  }

  @Post('videos')
  @UseInterceptors(FilesInterceptor('files', 2)) // video + thumbnail
  async createVideo(
    @Body() body: any,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          // Allow both video and image files
          new FileTypeValidator({ fileType: '.(mp4|avi|mov|mkv|jpg|jpeg|png|gif)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 1024 * 5 }) // 5GB (5 * 1024^3 bytes)
        ],
        fileIsRequired: true, // Video file is required
      }),
    ) files: Express.Multer.File[],
  ) {
    try {
      console.log('🎬 ===== VIDEO UPLOAD STARTED =====')
      console.log('🎬 Raw body received:', body)
      
      // Parse JSON data if it's in 'data' field
      let createVideoDto: CreateVideoDto;
      if (body.data && typeof body.data === 'string') {
        try {
          createVideoDto = JSON.parse(body.data);
          console.log('🎬 Parsed video data:', createVideoDto)
        } catch (error) {
          console.log('❌ JSON parse error:', error)
          throw new HttpException('Invalid JSON data', HttpStatus.BAD_REQUEST);
        }
      } else {
        createVideoDto = body;
      }
      
      console.log('🎬 Creating video with data:', createVideoDto)
      console.log('📁 Files received:', files?.length || 0)
      if (files && files.length > 0) {
        files.forEach((file, index) => {
          console.log(`📁 File ${index + 1}:`, file.originalname, file.size, file.mimetype)
        })
      }
      console.log('🎬 Trailer URL:', createVideoDto.trailerUrl || 'Not provided')
      
      // Validate required fields
      if (!createVideoDto.title || createVideoDto.title.trim().length === 0) {
        console.log('❌ Title validation failed:', createVideoDto.title)
        throw new HttpException('Title is required', HttpStatus.BAD_REQUEST);
      }
      console.log('✅ Title:', createVideoDto.title)
      
      if (!createVideoDto.description || createVideoDto.description.trim().length === 0) {
        console.log('❌ Description validation failed:', createVideoDto.description)
        throw new HttpException('Description is required', HttpStatus.BAD_REQUEST);
      }
      console.log('✅ Description:', createVideoDto.description)
      
      if (!createVideoDto.genre || !Array.isArray(createVideoDto.genre) || createVideoDto.genre.length === 0) {
        console.log('❌ Genre validation failed:', createVideoDto.genre)
        throw new HttpException('Genre is required and must be an array', HttpStatus.BAD_REQUEST);
      }
      console.log('✅ Genre:', createVideoDto.genre)
      
      if (!createVideoDto.duration || createVideoDto.duration <= 0) {
        console.log('❌ Duration validation failed:', createVideoDto.duration)
        throw new HttpException('Duration must be greater than 0', HttpStatus.BAD_REQUEST);
      }
      console.log('✅ Duration:', createVideoDto.duration)
      
      if (!createVideoDto.year || createVideoDto.year <= 0) {
        console.log('❌ Year validation failed:', createVideoDto.year)
        throw new HttpException('Year must be greater than 0', HttpStatus.BAD_REQUEST);
      }
      console.log('✅ Year:', createVideoDto.year)
      
      if (!createVideoDto.type) {
        console.log('❌ Type validation failed:', createVideoDto.type)
        throw new HttpException('Type is required', HttpStatus.BAD_REQUEST);
      }
      console.log('✅ Type:', createVideoDto.type)
      
      // Validate series-specific fields
      if (createVideoDto.type === 'series') {
        if (!createVideoDto.seasonNumber || createVideoDto.seasonNumber <= 0) {
          console.log('❌ Season number validation failed for series:', createVideoDto.seasonNumber)
          throw new HttpException('Season number is required for series', HttpStatus.BAD_REQUEST);
        }
        if (!createVideoDto.episodeNumber || createVideoDto.episodeNumber <= 0) {
          console.log('❌ Episode number validation failed for series:', createVideoDto.episodeNumber)
          throw new HttpException('Episode number is required for series', HttpStatus.BAD_REQUEST);
        }
        console.log('✅ Series validation passed - Season:', createVideoDto.seasonNumber, 'Episode:', createVideoDto.episodeNumber)
      }
      
      // Find video and thumbnail files from the files array
      console.log('🔍 Validating files...')
      console.log('📁 All files:', files?.map(f => ({ name: f.originalname, type: f.mimetype, size: f.size })))
      
      const videoFile = files?.find(f => f.mimetype.startsWith('video/'));
      const thumbnailFile = files?.find(f => f.mimetype.startsWith('image/'));
      
      if (!videoFile) {
        console.log('❌ No video file found')
        throw new HttpException('Video file is required', HttpStatus.BAD_REQUEST);
      }
      
      console.log('✅ Video file found:', { name: videoFile.originalname, size: videoFile.size, type: videoFile.mimetype })
      if (thumbnailFile) {
        console.log('✅ Thumbnail file found:', { name: thumbnailFile.originalname, size: thumbnailFile.size, type: thumbnailFile.mimetype })
      }
      
      // Create video using admin service
      console.log('🚀 Calling admin service createVideo...')
      const result = await this.adminService.createVideo(createVideoDto, videoFile, thumbnailFile);
      
      console.log('✅ Video created successfully:', result)
      console.log('🎬 ===== VIDEO UPLOAD COMPLETED =====')
      
      return {
        success: true,
        data: result,
        message: 'Video başarıyla oluşturuldu'
      };
      
    } catch (error) {
      console.error('❌ Error creating video:', error)
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        error.message || 'Video oluşturulurken bir hata oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('content/:id')
  async updateContent(
    @Param('id') id: string,
    @Body() updateContentDto: any
  ) {
    try {
      console.log('🔄 Updating content with ID:', id)
      console.log('📝 Update data:', updateContentDto)
      
      const result = await this.adminService.updateContent(id, updateContentDto)
      
      return {
        success: true,
        data: result,
        message: 'Content updated successfully'
      }
    } catch (error) {
      console.error('❌ Error updating content:', error)
      throw new HttpException(
        error.message || 'Error updating content',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post('series')
  @UseInterceptors(FilesInterceptor('files', 2))
  async createSeries(
    @Body() createSeriesDto: CreateSeriesDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          // Allow both video and image files for series
          new FileTypeValidator({ fileType: '.(mp4|avi|mov|mkv|webm|m4v|flv|wmv|jpg|jpeg|png|gif)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 100 }) // 100MB for videos
        ],
        fileIsRequired: true, // At least one file is required
      }),
    ) files: Express.Multer.File[],
  ) {
    try {
      console.log('📝 Received series data:', createSeriesDto);
      console.log('🔍 DEBUG received totalSeasons:', {
        value: createSeriesDto.totalSeasons,
        type: typeof createSeriesDto.totalSeasons,
        isString: typeof createSeriesDto.totalSeasons === 'string',
        isNumber: typeof createSeriesDto.totalSeasons === 'number',
        isUndefined: createSeriesDto.totalSeasons === undefined,
        isNull: createSeriesDto.totalSeasons === null
      });
      console.log('🔍 Raw totalSeasons:', createSeriesDto.totalSeasons, 'type:', typeof createSeriesDto.totalSeasons);
      console.log('🔍 Raw totalEpisodes:', createSeriesDto.totalEpisodes, 'type:', typeof createSeriesDto.totalEpisodes);
      
      // Ensure genre is an array
      if (typeof createSeriesDto.genre === 'string') {
        try {
          createSeriesDto.genre = JSON.parse(createSeriesDto.genre);
          console.log('✅ Genre parsed from JSON:', createSeriesDto.genre);
        } catch (error) {
          console.log('⚠️ Failed to parse genre JSON, using empty array');
          createSeriesDto.genre = [];
        }
      }
      
      // Ensure genre is an array
      if (!Array.isArray(createSeriesDto.genre)) {
        console.log('⚠️ Genre is not an array, converting to empty array');
        createSeriesDto.genre = [];
      }
      
      // Convert other fields to proper types
      if (typeof createSeriesDto.year === 'string') {
        createSeriesDto.year = parseInt(createSeriesDto.year) || new Date().getFullYear();
      }
      
      if (typeof createSeriesDto.rating === 'string') {
        createSeriesDto.rating = parseFloat(createSeriesDto.rating) || 0;
      }
      
      if (typeof createSeriesDto.totalSeasons === 'string') {
        const parsedSeasons = parseInt(createSeriesDto.totalSeasons);
        console.log('🔄 Parsing totalSeasons:', createSeriesDto.totalSeasons, '→', parsedSeasons);
        createSeriesDto.totalSeasons = isNaN(parsedSeasons) || parsedSeasons <= 0 ? 1 : parsedSeasons;
      }
      
      if (typeof createSeriesDto.totalEpisodes === 'string') {
        const parsedEpisodes = parseInt(createSeriesDto.totalEpisodes);
        console.log('🔄 Parsing totalEpisodes:', createSeriesDto.totalEpisodes, '→', parsedEpisodes);
        createSeriesDto.totalEpisodes = isNaN(parsedEpisodes) || parsedEpisodes <= 0 ? 1 : parsedEpisodes;
      }
      
      if (typeof createSeriesDto.isFeatured === 'string') {
        createSeriesDto.isFeatured = createSeriesDto.isFeatured === 'true';
      }
      
      if (typeof createSeriesDto.isNew === 'string') {
        createSeriesDto.isNew = createSeriesDto.isNew === 'true';
      }
      
      // Validate required fields
      if (!createSeriesDto.title || !createSeriesDto.title.trim()) {
        throw new HttpException('Title is required', HttpStatus.BAD_REQUEST);
      }
      
      if (!createSeriesDto.description || !createSeriesDto.description.trim()) {
        throw new HttpException('Description is required', HttpStatus.BAD_REQUEST);
      }
      
      if (!createSeriesDto.totalSeasons || createSeriesDto.totalSeasons <= 0) {
        throw new HttpException('Total seasons must be greater than 0', HttpStatus.BAD_REQUEST);
      }
      
      if (!createSeriesDto.totalEpisodes || createSeriesDto.totalEpisodes <= 0) {
        throw new HttpException('Total episodes must be greater than 0', HttpStatus.BAD_REQUEST);
      }
      
      if (!createSeriesDto.genre || createSeriesDto.genre.length === 0) {
        throw new HttpException('At least one genre is required', HttpStatus.BAD_REQUEST);
      }
      
      console.log('✅ Final processed series data:');
      console.log('  genre:', createSeriesDto.genre, 'type:', typeof createSeriesDto.genre);
      console.log('  year:', createSeriesDto.year, 'type:', typeof createSeriesDto.year);
      console.log('  rating:', createSeriesDto.rating, 'type:', typeof createSeriesDto.rating);
      console.log('  totalSeasons:', createSeriesDto.totalSeasons, 'type:', typeof createSeriesDto.totalSeasons);
      console.log('  totalEpisodes:', createSeriesDto.totalEpisodes, 'type:', typeof createSeriesDto.totalEpisodes);
      console.log('  isFeatured:', createSeriesDto.isFeatured, 'type:', typeof createSeriesDto.isFeatured);
      console.log('  isNew:', createSeriesDto.isNew, 'type:', typeof createSeriesDto.isNew);
      
      // Find video and thumbnail/poster files from the files array
      console.log('🔍 Processing uploaded files...');
      console.log('📁 All files:', files?.map(f => ({ name: f.originalname, type: f.mimetype, size: f.size })));
      
      const videoFile = files?.find(f => f.mimetype.startsWith('video/'));
      const thumbnailFile = files?.find(f => f.mimetype.startsWith('image/') && f.fieldname === 'thumbnail');
      const posterFile = files?.find(f => f.mimetype.startsWith('image/') && f.fieldname === 'poster');
      
      if (!videoFile) {
        console.log('❌ No video file found');
        throw new HttpException('Video file is required for series', HttpStatus.BAD_REQUEST);
      }
      
      console.log('✅ Video file found:', videoFile.originalname, 'type:', videoFile.mimetype, 'size:', videoFile.size);
      if (thumbnailFile) {
        console.log('✅ Thumbnail file found:', thumbnailFile.originalname, 'type:', thumbnailFile.mimetype, 'size:', thumbnailFile.size);
      }
      if (posterFile) {
        console.log('✅ Poster file found:', posterFile.originalname, 'type:', posterFile.mimetype, 'size:', posterFile.size);
      }
      
      console.log('🚀 Calling admin service...');
      const result = await this.adminService.createSeries(createSeriesDto, thumbnailFile, posterFile);
      console.log('✅ Series created successfully:', result);
      return { success: true, data: result, message: 'Series created successfully' };
    } catch (error) {
      console.error('❌ Error in createSeries controller:', error);
      
      // If it's a validation error, return proper HTTP status
      if (error instanceof HttpException) {
        throw error; // Re-throw HttpException to get proper HTTP status
      }
      
      // Return proper error response
      return { 
        success: false, 
        error: error.message || 'Failed to create series',
        details: error.stack
      };
    }
  }

  @Get('content/all')
  getAllContent() {
    return this.adminService.getAllContent();
  }

  @Delete('content/:id')
  deleteContent(@Param('id') id: string) {
    return this.adminService.deleteContent(id);
  }

  @Patch('content/:id/feature')
  toggleContentFeature(@Param('id') id: string, @Body() body: { isFeatured: boolean }) {
    return this.adminService.toggleContentFeature(id, body.isFeatured);
  }

  @Patch('content/:id/status')
  updateContentStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.adminService.updateContentStatus(id, body.status);
  }
}
