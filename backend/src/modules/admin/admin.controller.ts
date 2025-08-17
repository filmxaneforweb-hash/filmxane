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
      
      console.log('✅ Final processed data:')
      console.log('  genre:', createVideoDto.genre, 'type:', typeof createVideoDto.genre)
      console.log('  year:', createVideoDto.year, 'type:', typeof createVideoDto.year)
      console.log('  rating:', createVideoDto.rating, 'type:', typeof createVideoDto.rating)
      console.log('  duration:', createVideoDto.duration, 'type:', typeof createVideoDto.duration)
      console.log('  isFeatured:', createVideoDto.isFeatured, 'type:', typeof createVideoDto.isFeatured)
      console.log('  isNew:', createVideoDto.isNew, 'type:', typeof createVideoDto.isNew)
      
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
  createSeries(
    @Body() createSeriesDto: CreateSeriesDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(jpg|jpeg|png|gif)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }) // 5MB
        ],
        fileIsRequired: false,
      }),
    ) files: Express.Multer.File[],
  ) {
    const thumbnailFile = files?.find(f => f.fieldname === 'thumbnail');
    const posterFile = files?.find(f => f.fieldname === 'poster');
    
    return this.adminService.createSeries(createSeriesDto, thumbnailFile, posterFile);
  }
}
