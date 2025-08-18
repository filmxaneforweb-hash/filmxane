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

  @Get('users/stats')
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

  @Put('settings')
  updateSystemSettings(@Body() settings: any) {
    return this.adminService.updateSystemSettings(settings);
  }

  @Post('videos')
  @UseInterceptors(FilesInterceptor('files', 2))
  async createVideo(
    @Body() createVideoDto: CreateVideoDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          // Allow both video and image files
          new FileTypeValidator({ fileType: '.(mp4|avi|mov|mkv|jpg|jpeg|png|gif)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 100 }) // 100MB
        ],
        fileIsRequired: true, // Video file is required
      }),
    ) files: Express.Multer.File[],
  ) {
    try {
      console.log('🎬 Admin video upload started');
      console.log('Files received:', files?.length || 0);
      console.log('📝 Raw DTO:', createVideoDto);
      console.log('📝 DTO type:', typeof createVideoDto);
      console.log('📝 DTO keys:', Object.keys(createVideoDto || {}));
      
      // Validate required fields
      console.log('🔍 Validating fields...')
      
      if (!createVideoDto.title || !createVideoDto.title.trim()) {
        console.log('❌ Title validation failed:', createVideoDto.title)
        throw new HttpException('Title is required', HttpStatus.BAD_REQUEST);
      }
      console.log('✅ Title:', createVideoDto.title)
      
      if (!createVideoDto.description || !createVideoDto.description.trim()) {
        console.log('❌ Description validation failed:', createVideoDto.description)
        throw new HttpException('Description is required', HttpStatus.BAD_REQUEST);
      }
      console.log('✅ Description:', createVideoDto.description)
      
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
      
      console.log('✅ Video file found:', videoFile.originalname, 'type:', videoFile.mimetype, 'size:', videoFile.size);
      if (thumbnailFile) {
        console.log('✅ Thumbnail file found:', thumbnailFile.originalname, 'type:', thumbnailFile.mimetype, 'size:', thumbnailFile.size);
      } else {
        console.log('ℹ️ No thumbnail file provided');
      }
      
      // Parse genre from JSON string if it's a string
      console.log('🔍 Processing genre...')
      console.log('📝 Original genre:', createVideoDto.genre, 'type:', typeof createVideoDto.genre)
      
      if (typeof createVideoDto.genre === 'string') {
        try {
          createVideoDto.genre = JSON.parse(createVideoDto.genre);
          console.log('✅ Genre parsed from JSON:', createVideoDto.genre)
        } catch (error) {
          console.log('⚠️ Failed to parse genre JSON, using empty array')
          createVideoDto.genre = [];
        }
      }
      
      // Ensure genre is an array
      if (!Array.isArray(createVideoDto.genre)) {
        console.log('⚠️ Genre is not an array, converting to empty array')
        createVideoDto.genre = [];
      }
      
      // Convert other fields to proper types
      if (typeof createVideoDto.year === 'string') {
        createVideoDto.year = parseInt(createVideoDto.year) || new Date().getFullYear()
      }
      
      if (typeof createVideoDto.rating === 'string') {
        createVideoDto.rating = parseFloat(createVideoDto.rating) || 0
      }
      
      if (typeof createVideoDto.duration === 'string') {
        createVideoDto.duration = parseInt(createVideoDto.duration) || 0
      }
      
      if (typeof createVideoDto.isFeatured === 'string') {
        createVideoDto.isFeatured = createVideoDto.isFeatured === 'true'
      }
      
      if (typeof createVideoDto.isNew === 'string') {
        createVideoDto.isNew = createVideoDto.isNew === 'true'
      }
      
      // Convert episodeNumber and seasonNumber to numbers
      if (typeof createVideoDto.episodeNumber === 'string') {
        const parsed = parseInt(createVideoDto.episodeNumber)
        createVideoDto.episodeNumber = isNaN(parsed) ? null : parsed
      }
      
      if (typeof createVideoDto.seasonNumber === 'string') {
        const parsed = parseInt(createVideoDto.seasonNumber)
        createVideoDto.seasonNumber = isNaN(parsed) ? null : parsed
      }
      
      console.log('✅ Final processed data:')
      console.log('  genre:', createVideoDto.genre, 'type:', typeof createVideoDto.genre)
      console.log('  year:', createVideoDto.year, 'type:', typeof createVideoDto.year)
      console.log('  rating:', createVideoDto.rating, 'type:', typeof createVideoDto.rating)
      console.log('  duration:', createVideoDto.duration, 'type:', typeof createVideoDto.duration)
      console.log('  isFeatured:', createVideoDto.isFeatured, 'type:', typeof createVideoDto.isFeatured)
      console.log('  isNew:', createVideoDto.isNew, 'type:', typeof createVideoDto.isNew)
      console.log('  episodeNumber:', createVideoDto.episodeNumber, 'type:', typeof createVideoDto.episodeNumber)
      console.log('  seasonNumber:', createVideoDto.seasonNumber, 'type:', typeof createVideoDto.seasonNumber)
      
      console.log('🚀 Calling admin service...')
      const result = await this.adminService.createVideo(createVideoDto, videoFile, thumbnailFile);
      console.log('✅ Video created successfully:', result)
      return { success: true, data: result, message: 'Video created successfully' };
    } catch (error) {
      console.error('❌ Error in createVideo controller:', error);
      
      // If it's a validation error, return proper HTTP status
      if (error instanceof HttpException) {
        throw error; // Re-throw HttpException to get proper HTTP status
      }
      
      // Return proper error response
      return { 
        success: false, 
        error: error.message || 'Failed to create video',
        details: error.stack
      };
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
