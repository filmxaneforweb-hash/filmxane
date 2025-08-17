import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video, VideoType, VideoStatus } from '../../entities/video.entity';
import { User, UserStatus } from '../../entities/user.entity';
import { Subscription, SubscriptionPlan } from '../../entities/subscription.entity';
import { Series } from '../../entities/series.entity';
import { SystemSettings } from '../../entities/settings.entity';
import { AdminGateway } from '../../gateways/admin.gateway';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Series)
    private seriesRepository: Repository<Series>,
    @InjectRepository(SystemSettings)
    private settingsRepository: Repository<SystemSettings>,
    private adminGateway: AdminGateway,
  ) {}

  async getStats() {
    const totalMovies = await this.videosRepository.count({ where: { type: VideoType.MOVIE } });
    const totalSeries = await this.videosRepository.count({ where: { type: VideoType.SERIES } });
    const totalUsers = await this.usersRepository.count();
    const totalViewsResult = await this.videosRepository
      .createQueryBuilder('video')
      .select('SUM(video.views)', 'sum')
      .getRawOne();
    const totalViews = parseInt(totalViewsResult.sum) || 0;

    return {
      totalMovies,
      totalSeries,
      totalUsers,
      totalViews,
    };
  }

  async getChartData() {
    // Get last 6 months of data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const currentDate = new Date();
    const chartData = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const views = await this.videosRepository
        .createQueryBuilder('video')
        .select('SUM(video.views)', 'sum')
        .where('video.createdAt >= :start', { start: monthStart })
        .andWhere('video.createdAt <= :end', { end: monthEnd })
        .getRawOne();

      const users = await this.usersRepository
        .createQueryBuilder('user')
        .where('user.createdAt >= :start', { start: monthStart })
        .andWhere('user.createdAt <= :end', { end: monthEnd })
        .getCount();

      const movies = await this.videosRepository
        .createQueryBuilder('video')
        .where('video.type = :type', { type: VideoType.MOVIE })
        .andWhere('video.createdAt >= :start', { start: monthStart })
        .andWhere('video.createdAt <= :end', { end: monthEnd })
        .getCount();

      chartData.push({
        name: months[5 - i],
        views: parseInt(views.sum) || 0,
        users,
        movies,
      });
    }

    return chartData;
  }

  async getPieData() {
    const movies = await this.videosRepository.count({ where: { type: VideoType.MOVIE } });
    const series = await this.videosRepository.count({ where: { type: VideoType.SERIES } });
    const documentaries = await this.videosRepository.count({ where: { type: VideoType.DOCUMENTARY } });
    const shorts = await this.videosRepository.count({ where: { type: VideoType.SHORT } });

    return [
      { name: 'Movies', value: movies, color: '#3B82F6' },
      { name: 'Series', value: series, color: '#10B981' },
      { name: 'Documentaries', value: documentaries, color: '#8B5CF6' },
      { name: 'Shorts', value: shorts, color: '#F59E0B' },
    ];
  }

  async getRecentActivities() {
    // Get recent videos and users
    const recentVideos = await this.videosRepository
      .createQueryBuilder('video')
      .orderBy('video.createdAt', 'DESC')
      .limit(4)
      .getMany();

    const recentUsers = await this.usersRepository
      .createQueryBuilder('user')
      .orderBy('user.createdAt', 'DESC')
      .limit(2)
      .getMany();

    const activities = [];

    // Add video activities
    recentVideos.forEach((video, index) => {
      const timeDiff = Date.now() - video.createdAt.getTime();
      const minutes = Math.floor(timeDiff / (1000 * 60));
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      
      let timeText;
      if (days > 0) {
        timeText = `${days} day${days > 1 ? 's' : ''} ago`;
      } else if (hours > 0) {
        timeText = `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else if (minutes > 0) {
        timeText = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } else {
        timeText = 'Just now';
      }

      activities.push({
        id: video.id,
        action: `New ${video.type} uploaded`,
        content: video.title,
        time: timeText,
        type: video.type,
        status: 'success',
        createdAt: video.createdAt,
      });
    });

    // Add user activities
    recentUsers.forEach((user, index) => {
      const timeDiff = Date.now() - user.createdAt.getTime();
      const minutes = Math.floor(timeDiff / (1000 * 60));
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      
      let timeText;
      if (days > 0) {
        timeText = `${days} day${days > 1 ? 's' : ''} ago`;
      } else if (hours > 0) {
        timeText = `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else if (minutes > 0) {
        timeText = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } else {
        timeText = 'Just now';
      }

      activities.push({
        id: `user-${user.id}`,
        action: 'New user registered',
        content: `${user.firstName} ${user.lastName}`,
        time: timeText,
        type: 'user',
        status: 'success',
        createdAt: user.createdAt,
      });
    });

    // Sort by creation date and limit to 4
    return activities
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 4);
  }

  async getTopContent() {
    const topVideos = await this.videosRepository
      .createQueryBuilder('video')
      .orderBy('video.views', 'DESC')
      .limit(3)
      .getMany();

    return topVideos.map((video, index) => ({
      id: video.id,
      title: video.title,
      type: video.type === VideoType.MOVIE ? 'Movie' : 'Series',
      views: video.views.toLocaleString(),
      rating: video.rating || 0,
      thumbnail: video.thumbnailUrl || '🎬',
    }));
  }

  async getGenres() {
    // Get genres from existing videos
    const videoGenres = await this.videosRepository
      .createQueryBuilder('video')
      .select('DISTINCT video.genre', 'genre')
      .getRawMany();

    // Default genres if no videos exist
    const defaultGenres = [
      'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
      'Drama', 'Family', 'Fantasy', 'Horror', 'Mystery', 'Romance',
      'Sci-Fi', 'Thriller', 'War', 'Western', 'Biography', 'History',
      'Sport', 'Musical', 'Film-Noir', 'Short', 'Reality-TV', 'Talk-Show'
    ];

    // If we have video genres, use them, otherwise use defaults
    if (videoGenres.length > 0) {
      const parsedGenres = videoGenres
        .map(g => g.genre)
        .filter(Boolean)
        .flatMap(genre => {
          try {
            // Try to parse JSON string
            if (typeof genre === 'string') {
              return JSON.parse(genre);
            }
            return genre;
          } catch {
            // If parsing fails, treat as single genre
            return [genre];
          }
        })
        .filter(Boolean);

      // Combine video genres with defaults and remove duplicates
      const allGenres = [...new Set([...parsedGenres, ...defaultGenres])];
      return allGenres.sort();
    }

    return defaultGenres.sort();
  }

  async getNotifications() {
    // Get recent system activities and user actions
    const recentVideos = await this.videosRepository
      .createQueryBuilder('video')
      .orderBy('video.createdAt', 'DESC')
      .limit(3)
      .getMany();

    const recentUsers = await this.usersRepository
      .createQueryBuilder('user')
      .orderBy('user.createdAt', 'DESC')
      .limit(2)
      .getMany();

    const notifications = [];

    // Add video notifications
    recentVideos.forEach((video) => {
      const minutesAgo = Math.floor((Date.now() - video.createdAt.getTime()) / (1000 * 60));
      const timeText = minutesAgo < 60 ? `${minutesAgo} min ago` : `${Math.floor(minutesAgo / 60)} hour ago`;
      
      notifications.push({
        id: `video-${video.id}`,
        message: `New ${video.type} uploaded: ${video.title}`,
        time: timeText,
        unread: minutesAgo < 30, // Mark as unread if less than 30 minutes ago
        type: 'success',
        createdAt: video.createdAt,
      });
    });

    // Add user notifications
    recentUsers.forEach((user) => {
      const minutesAgo = Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60));
      const timeText = minutesAgo < 60 ? `${minutesAgo} min ago` : `${Math.floor(minutesAgo / 60)} hour ago`;
      
      notifications.push({
        id: `user-${user.id}`,
        message: `New user registered: ${user.firstName} ${user.lastName}`,
        time: timeText,
        unread: minutesAgo < 30,
        type: 'info',
        createdAt: user.createdAt,
      });
    });

    // Add system notifications
    const systemNotifications = [
      {
        id: 'system-1',
        message: 'System update completed',
        time: '1 hour ago',
        unread: false,
        type: 'warning',
        createdAt: new Date(Date.now() - 60 * 60 * 1000),
      },
      {
        id: 'system-2',
        message: 'Database backup successful',
        time: '2 hours ago',
        unread: false,
        type: 'success',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      }
    ];

    notifications.push(...systemNotifications);

    // Sort by creation date and limit to 10
    return notifications
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10);
  }

  async getUserProfile(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  }

  async updateUserProfile(userId: string, updateData: any) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new Error('User not found');
    }

    // Update allowed fields
    if (updateData.firstName) user.firstName = updateData.firstName;
    if (updateData.lastName) user.lastName = updateData.lastName;
    if (updateData.email) user.email = updateData.email;
    if (updateData.avatar) user.avatar = updateData.avatar;

    await this.usersRepository.save(user);
    return user;
  }

  async getSystemSettings() {
    // Get settings from database or create default
    let settings = await this.settingsRepository.findOne({ where: {} });
    
    if (!settings) {
      // Create default settings if none exist
      const defaultSettings = this.settingsRepository.create({
        siteName: 'Filmxane',
        siteDescription: 'Kurdish Video Platform',
        maintenanceMode: false,
        allowRegistrations: true,
        maxUploadSize: '100MB',
        supportedVideoFormats: '["MP4", "AVI", "MOV", "MKV"]',
        supportedImageFormats: '["JPG", "PNG", "GIF"]',
        defaultLanguage: 'ku',
        timezone: 'Asia/Baghdad',
        version: '1.0.0',
      });
      settings = await this.settingsRepository.save(defaultSettings);
    }

    // Calculate server uptime (simplified)
    const uptime = '24h 0m 0s' // For now, we'll use a static value

    // Get current server time
    const now = new Date()
    const serverTime = now.toISOString()
    
    // Parse the JSON strings to arrays for frontend
    let videoFormats = ['MP4', 'AVI', 'MOV', 'MKV']
    let imageFormats = ['JPG', 'PNG', 'GIF']
    
    try {
      if (settings.supportedVideoFormats) {
        videoFormats = JSON.parse(settings.supportedVideoFormats)
      }
      if (settings.supportedImageFormats) {
        imageFormats = JSON.parse(settings.supportedImageFormats)
      }
    } catch (error) {
      console.log('Error parsing formats, using defaults')
    }
    
    // Return settings with real-time server info
    return {
      ...settings,
      supportedVideoFormats: videoFormats,
      supportedImageFormats: imageFormats,
      serverTime: serverTime,
      uptime: uptime,
      lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
    };
  }

  async updateSystemSettings(updateData: Partial<SystemSettings>) {
    // Get current settings
    let settings = await this.settingsRepository.findOne({ where: {} });
    
    if (!settings) {
      // Create new settings if none exist
      settings = this.settingsRepository.create(updateData as SystemSettings);
    } else {
      // Update existing settings
      Object.assign(settings, updateData);
    }
    
    // Convert arrays back to JSON strings for storage
    if (updateData.supportedVideoFormats && Array.isArray(updateData.supportedVideoFormats)) {
      settings.supportedVideoFormats = JSON.stringify(updateData.supportedVideoFormats)
    }
    if (updateData.supportedImageFormats && Array.isArray(updateData.supportedImageFormats)) {
      settings.supportedImageFormats = JSON.stringify(updateData.supportedImageFormats)
    }
    
    // Save to database
    const savedSettings = await this.settingsRepository.save(settings);
    
    // WebSocket ile admin'lere bildir
    this.adminGateway.notifySettingsUpdated(savedSettings);
    
    return savedSettings;
  }

  async getAllUsers() {
    const users = await this.usersRepository.find({
      order: { createdAt: 'DESC' }
    });

    return users.map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phoneNumber || '+964 XXX XXX XXXX',
      role: user.role || 'user',
      status: user.status === 'active' ? 'active' : 'inactive',
      subscription: user.subscription?.plan || 'basic',
      joinDate: user.createdAt.toISOString().split('T')[0],
      lastLogin: user.lastLoginAt?.toISOString().split('T')[0] || 'Never',
      totalWatched: 0, // TODO: Implement from user activity
      favorites: 0, // TODO: Implement from favorites
      reviews: 0, // TODO: Implement from reviews
      isVerified: user.emailVerified || false,
      isPremium: user.subscription?.plan === 'premium' || user.subscription?.plan === 'family'
    }));
  }

  async getAllMovies() {
    const movies = await this.videosRepository.find({
      where: { type: VideoType.MOVIE },
      order: { createdAt: 'DESC' }
    });

    return movies.map(movie => ({
      id: movie.id,
      title: movie.title,
      description: movie.description || 'No description available',
      thumbnail: movie.thumbnailUrl || 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Movie',
      genre: movie.genre ? [movie.genre] : ['drama'],
      year: movie.releaseYear || new Date().getFullYear(),
      rating: movie.rating || 0,
      duration: movie.duration || 120,
      views: movie.views || 0,
      isFeatured: movie.isFeatured || false,
      isNew: new Date().getTime() - movie.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000 // 7 days
    }));
  }

  async getAllSeries() {
    const series = await this.videosRepository.find({
      where: { type: VideoType.SERIES },
      order: { createdAt: 'DESC' }
    });

    return series.map(series => ({
      id: series.id,
      title: series.title,
      description: series.description || 'No description available',
      thumbnail: series.thumbnailUrl || 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Series',
      genre: series.genre ? [series.genre] : ['drama'],
      year: series.releaseYear || new Date().getFullYear(),
      rating: series.rating || 0,
      status: series.status || 'ongoing',
      seasons: series.seasonNumber || 1,
      episodes: series.episodeNumber || 12,
      views: series.views || 0,
      isFeatured: series.isFeatured || false,
      isNew: new Date().getTime() - series.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000 // 7 days
    }));
  }

  async getUserStats() {
    const totalUsers = await this.usersRepository.count();
    const activeUsers = await this.usersRepository.count({ where: { status: UserStatus.ACTIVE } });
    const premiumUsers = await this.usersRepository.count({ 
      where: { subscription: { plan: SubscriptionPlan.PREMIUM } } 
    });
    const familyUsers = await this.usersRepository.count({ 
      where: { subscription: { plan: SubscriptionPlan.FAMILY } } 
    });
    const verifiedUsers = await this.usersRepository.count({ where: { emailVerified: true } });

    return {
      total: totalUsers,
      active: activeUsers,
      premium: premiumUsers + familyUsers,
      verified: verifiedUsers,
      totalWatched: 0, // TODO: Implement from user activity
      totalFavorites: 0 // TODO: Implement from favorites
    };
  }

  async getMovieStats() {
    const totalMovies = await this.videosRepository.count({ where: { type: VideoType.MOVIE } });
    const featuredMovies = await this.videosRepository.count({ 
      where: { type: VideoType.MOVIE, isFeatured: true } 
    });
    const newMovies = await this.videosRepository.count({ 
      where: { 
        type: VideoType.MOVIE,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days
      } 
    });
    const totalViews = await this.videosRepository
      .createQueryBuilder('video')
      .select('SUM(video.views)', 'sum')
      .where('video.type = :type', { type: VideoType.MOVIE })
      .getRawOne();

    return {
      total: totalMovies,
      featured: featuredMovies,
      new: newMovies,
      totalViews: parseInt(totalViews.sum) || 0
    };
  }

  async getSeriesStats() {
    const totalSeries = await this.videosRepository.count({ where: { type: VideoType.SERIES } });
    const featuredSeries = await this.videosRepository.count({ 
      where: { type: VideoType.SERIES, isFeatured: true } 
    });
    const newSeries = await this.videosRepository.count({ 
      where: { 
        type: VideoType.SERIES,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days
      } 
    });
    const totalViews = await this.videosRepository
      .createQueryBuilder('video')
      .select('SUM(video.views)', 'sum')
      .where('video.type = :type', { type: VideoType.SERIES })
      .getRawOne();

    return {
      total: totalSeries,
      featured: featuredSeries,
      new: newSeries,
      totalViews: parseInt(totalViews.sum) || 0,
      totalSeasons: 0, // TODO: Implement from series structure
      totalEpisodes: 0 // TODO: Implement from series structure
    };
  }

  async createVideo(createVideoDto: any, videoFile: Express.Multer.File, thumbnailFile?: Express.Multer.File) {
    try {
      console.log('Creating video with DTO:', createVideoDto);
      console.log('Video file:', videoFile.originalname, videoFile.size, videoFile.mimetype);
      if (thumbnailFile) {
        console.log('Thumbnail file:', thumbnailFile.originalname, thumbnailFile.size, thumbnailFile.mimetype);
      }
      
      // Generate unique filename for video
      const videoId = require('crypto').randomUUID();
      const videoExtension = require('path').extname(videoFile.originalname);
      const videoFilename = `${videoId}${videoExtension}`;
      
      console.log('Generated video filename:', videoFilename);
      
      // Save video file
      const videoPath = require('path').join(process.cwd(), 'uploads', 'videos', videoFilename);
      const videoDir = require('path').dirname(videoPath);
      
      if (!require('fs').existsSync(videoDir)) {
        require('fs').mkdirSync(videoDir, { recursive: true });
        console.log('Created video directory:', videoDir);
      }
      
      require('fs').writeFileSync(videoPath, videoFile.buffer);
      console.log('Video file saved to:', videoPath);
      
      // Save thumbnail if provided
      let thumbnailPath = null;
      if (thumbnailFile) {
        const thumbnailExtension = require('path').extname(thumbnailFile.originalname);
        const thumbnailFilename = `${videoId}_thumb${thumbnailExtension}`;
        const thumbnailPathFull = require('path').join(process.cwd(), 'uploads', 'thumbnails', thumbnailFilename);
        const thumbnailDir = require('path').dirname(thumbnailPathFull);
        
        if (!require('fs').existsSync(thumbnailDir)) {
          require('fs').mkdirSync(thumbnailDir, { recursive: true });
          console.log('Created thumbnail directory:', thumbnailDir);
        }
        
        require('fs').writeFileSync(thumbnailPathFull, thumbnailFile.buffer);
        thumbnailPath = `/uploads/thumbnails/${thumbnailFilename}`;
        console.log('Thumbnail file saved to:', thumbnailPathFull);
      }
      
      // Ensure genre is an array
      let genreArray = createVideoDto.genre;
      if (typeof genreArray === 'string') {
        try {
          genreArray = JSON.parse(genreArray);
        } catch (error) {
          console.log('Failed to parse genre, using empty array');
          genreArray = [];
        }
      }
      if (!Array.isArray(genreArray)) {
        genreArray = [];
      }
      
      console.log('Final genre array:', genreArray);
      
      // Create video entity
      const video = this.videosRepository.create({
        title: createVideoDto.title || '',
        description: createVideoDto.description || '',
        genre: JSON.stringify(genreArray), // JSON string olarak sakla
        year: parseInt(createVideoDto.year) || new Date().getFullYear(),
        releaseYear: parseInt(createVideoDto.year) || new Date().getFullYear(),
        duration: parseInt(createVideoDto.duration) || 0,
        isFeatured: Boolean(createVideoDto.isFeatured),
        isNew: Boolean(createVideoDto.isNew),
        type: VideoType.MOVIE,
        views: 0,
        viewCount: 0,
        rating: 0,
        videoPath: `/uploads/videos/${videoFilename}`,
        thumbnailPath: thumbnailPath,
        thumbnailUrl: thumbnailPath, // thumbnailUrl'yi de set et
        episodeNumber: createVideoDto.episodeNumber || null,
        status: VideoStatus.PUBLISHED,
        uploadedById: await this.getAdminUserId(), // Gerçek admin user ID'sini al
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('Video entity created:', video);
      
      const savedVideo = await this.videosRepository.save(video);
      console.log('Video saved to database:', savedVideo.id);
      
      // WebSocket ile admin'lere bildir
      this.adminGateway.notifyVideoAdded(savedVideo);
      
      return savedVideo;
    } catch (error) {
      console.error('Error creating video:', error);
      throw new Error(`Failed to create video: ${error.message}`);
    }
  }

  async createSeries(createSeriesDto: any, thumbnailFile?: Express.Multer.File, posterFile?: Express.Multer.File) {
    // For now, we'll create a video with type SERIES
    // In the future, you might want a separate series table
    const series = this.videosRepository.create({
      ...createSeriesDto,
      thumbnailUrl: thumbnailFile ? `/uploads/thumbnails/${thumbnailFile.filename}` : null,
      posterUrl: posterFile ? `/uploads/posters/${posterFile.filename}` : null,
      type: VideoType.SERIES,
      views: 0,
      rating: 0,
      isFeatured: false,
      isNew: true
    });

    const savedSeries = await this.videosRepository.save(series);
    
    // WebSocket ile admin'lere bildir
    this.adminGateway.notifySeriesAdded(savedSeries);
    
    return savedSeries;
  }

  async getMovies() {
    return this.getAllMovies();
  }

  async getSeries() {
    return this.getAllSeries();
  }

  private async getAdminUserId(): Promise<string> {
    const adminUser = await this.usersRepository.findOne({
      where: { email: 'admin@filmxane.com' }
    });
    
    if (!adminUser) {
      throw new Error('Admin user not found. Please run database seeds first.');
    }
    
    return adminUser.id;
  }
}
