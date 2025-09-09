import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video, VideoType, VideoStatus } from '../../entities/video.entity';
import { User, UserStatus, UserRole } from '../../entities/user.entity';
import { Subscription, SubscriptionPlan } from '../../entities/subscription.entity';
import { Series } from '../../entities/series.entity';
import { SystemSettings } from '../../entities/settings.entity';
import { AdminGateway } from '../../gateways/admin.gateway';
import * as bcrypt from 'bcryptjs';

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
    // Tek seferde tüm istatistikleri al
    const [
      totalMovies,
      totalSeries,
      totalUsers,
      totalViewsResult,
      featuredContent,
      newContent
    ] = await Promise.all([
      this.videosRepository.count({ where: { type: VideoType.MOVIE } }),
      this.videosRepository.count({ where: { type: VideoType.SERIES } }),
      this.usersRepository.count(),
      this.videosRepository
        .createQueryBuilder('video')
        .select('SUM(video.views)', 'sum')
        .getRawOne(),
      this.videosRepository.count({ where: { isFeatured: true } }),
      this.videosRepository.count({ 
        where: { 
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days
        } 
      })
    ]);

    const totalViews = parseInt(totalViewsResult?.sum) || 0;

    return {
      totalMovies,
      totalSeries,
      totalUsers,
      totalViews,
      featuredContent,
      newContent,
    };
  }

  async getChartData() {
    // Get last 6 months of data - optimize with single query
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const currentDate = new Date();
    const chartData = [];

    // Tek seferde tüm ayların verilerini al
    const monthQueries = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      monthQueries.push({
        month: months[5 - i],
        start: monthStart,
        end: monthEnd
      });
    }

    // Parallel olarak tüm ayların verilerini al
    const monthData = await Promise.all(
      monthQueries.map(async ({ month, start, end }) => {
        const [views, users, movies] = await Promise.all([
          this.videosRepository
            .createQueryBuilder('video')
            .select('SUM(video.views)', 'sum')
            .where('video.createdAt >= :start', { start })
            .andWhere('video.createdAt <= :end', { end })
            .getRawOne(),
          this.usersRepository
            .createQueryBuilder('user')
            .where('user.createdAt >= :start', { start })
            .andWhere('user.createdAt <= :end', { end })
            .getCount(),
          this.videosRepository
            .createQueryBuilder('video')
            .where('video.type = :type', { type: VideoType.MOVIE })
            .andWhere('video.createdAt >= :start', { start })
            .andWhere('video.createdAt <= :end', { end })
            .getCount()
        ]);

        return {
          name: month,
          views: parseInt(views?.sum) || 0,
          users,
          movies,
        };
      })
    );

    return monthData;
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

    const activities: any[] = [];

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
        siteDescription: 'Platforma fîlm û rêzefîlman',
        maintenanceMode: false,
        allowRegistration: true,
        allowComments: true,
        maxUploadSize: 100,
        allowedFileTypes: ['mp4', 'avi', 'mov', 'mkv'],
        emailNotifications: true,
        pushNotifications: true,
        theme: 'auto'
      });
      settings = await this.settingsRepository.save(defaultSettings);
    }

    // Return settings in the format expected by frontend
    return {
      siteName: settings.siteName || 'Filmxane',
      siteDescription: settings.siteDescription || 'Platforma fîlm û rêzefîlman',
      maintenanceMode: settings.maintenanceMode || false,
      allowRegistration: settings.allowRegistration || true,
      allowComments: settings.allowComments || true,
      maxUploadSize: settings.maxUploadSize || 100,
      allowedFileTypes: settings.allowedFileTypes || ['mp4', 'avi', 'mov', 'mkv'],
      emailNotifications: settings.emailNotifications || true,
      pushNotifications: settings.pushNotifications || true,
      theme: settings.theme || 'auto'
    };
  }

  async updateSystemSettings(updateData: any) {
    // Get current settings
    let settings = await this.settingsRepository.findOne({ where: {} });
    
    if (!settings) {
      // Create new settings if none exist
      settings = this.settingsRepository.create({
        siteName: updateData.siteName || 'Filmxane',
        siteDescription: updateData.siteDescription || 'Platforma fîlm û rêzefîlman',
        maintenanceMode: updateData.maintenanceMode || false,
        allowRegistration: updateData.allowRegistration || true,
        allowComments: updateData.allowComments || true,
        maxUploadSize: updateData.maxUploadSize || 100,
        allowedFileTypes: updateData.allowedFileTypes || ['mp4', 'avi', 'mov', 'mkv'],
        emailNotifications: updateData.emailNotifications || true,
        pushNotifications: updateData.pushNotifications || true,
        theme: updateData.theme || 'auto'
      });
    } else {
      // Update existing settings
      Object.assign(settings, updateData);
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
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role || 'user',
      status: user.status || 'active',
      emailVerified: user.emailVerified || false,
      subscription: {
        plan: user.subscription?.plan || 'basic',
        status: user.subscription?.status || 'active'
      },
      createdAt: user.createdAt.toISOString(),
      lastLogin: user.lastLoginAt?.toISOString() || null
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
      const video = new Video();
      Object.assign(video, {
        title: createVideoDto.title || '',
        description: createVideoDto.description || '',
        genre: JSON.stringify(genreArray), // JSON string olarak sakla
        year: parseInt(createVideoDto.year) || new Date().getFullYear(),
        releaseYear: parseInt(createVideoDto.year) || new Date().getFullYear(),
        duration: (parseInt(createVideoDto.duration) || 0) * 60, // Dakikayı saniyeye çevir
        isFeatured: Boolean(createVideoDto.isFeatured),
        isNew: Boolean(createVideoDto.isNew),
        type: createVideoDto.type || VideoType.MOVIE, // DTO'dan type'ı al
        views: 0,
        viewCount: 0,
        rating: 0,
        videoPath: `/uploads/videos/${videoFilename}`,
        thumbnailPath: thumbnailPath,
        thumbnailUrl: thumbnailPath, // thumbnailUrl'yi de set et
        trailerUrl: createVideoDto.trailerUrl || null, // Fragman URL'ini ekle
        episodeNumber: createVideoDto.episodeNumber || null,
        seasonNumber: createVideoDto.seasonNumber || null, // Series için season number
        seriesId: createVideoDto.seriesId || null, // Series için series ID
        status: VideoStatus.PUBLISHED,
        uploadedById: await this.getAdminUserId(), // Gerçek admin user ID'sini al
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('Video entity created:', video);
      
      const savedVideo = await this.videosRepository.save(video);
      console.log('Video saved to database:', savedVideo);
      
      // WebSocket ile admin'lere bildir
      this.adminGateway.notifyVideoAdded(savedVideo);
      
      return savedVideo;
    } catch (error) {
      console.error('Error creating video:', error);
      throw new Error(`Failed to create video: ${error.message}`);
    }
  }

  async updateContent(id: string, updateContentDto: any) {
    try {
      console.log('🔄 Updating content with ID:', id)
      console.log('📝 Update data:', updateContentDto)
      
      const content = await this.videosRepository.findOne({ where: { id } })
      if (!content) {
        throw new Error('Content not found')
      }
      
      // Update fields
      if (updateContentDto.title) content.title = updateContentDto.title
      if (updateContentDto.description) content.description = updateContentDto.description
      if (updateContentDto.year) content.year = parseInt(updateContentDto.year)
      if (updateContentDto.rating) content.rating = parseFloat(updateContentDto.rating)
      if (updateContentDto.isFeatured !== undefined) content.isFeatured = Boolean(updateContentDto.isFeatured)
      if (updateContentDto.isNew !== undefined) content.isNew = Boolean(updateContentDto.isNew)
      if (updateContentDto.trailerUrl !== undefined) content.trailerUrl = updateContentDto.trailerUrl // Fragman URL'ini güncelle
      if (updateContentDto.thumbnailUrl) content.thumbnailUrl = updateContentDto.thumbnailUrl
      if (updateContentDto.posterUrl) content.posterUrl = updateContentDto.posterUrl
      
      // Update genre if provided
      if (updateContentDto.genre) {
        let genreArray = updateContentDto.genre
        if (typeof genreArray === 'string') {
          try {
            genreArray = JSON.parse(genreArray)
          } catch (error) {
            genreArray = genreArray.split(',').map((g: string) => g.trim())
          }
        }
        if (Array.isArray(genreArray)) {
          content.genre = JSON.stringify(genreArray)
        }
      }
      
      content.updatedAt = new Date()
      
      const updatedContent = await this.videosRepository.save(content)
      console.log('✅ Content updated successfully:', updatedContent.id)
      
      return updatedContent
    } catch (error) {
      console.error('❌ Error updating content:', error)
      throw new Error(`Failed to update content: ${error.message}`)
    }
  }

  async createSeries(createSeriesDto: any, thumbnailFile?: Express.Multer.File, posterFile?: Express.Multer.File) {
    try {
      console.log('📝 Creating series with data:', createSeriesDto);
      
      // Ensure genre is an array
      let genreArray = createSeriesDto.genre;
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
      
      // Ensure totalSeasons and totalEpisodes are numbers
      const totalSeasons = typeof createSeriesDto.totalSeasons === 'string' 
        ? parseInt(createSeriesDto.totalSeasons) || 1 
        : createSeriesDto.totalSeasons || 1;
        
      const totalEpisodes = typeof createSeriesDto.totalEpisodes === 'string' 
        ? parseInt(createSeriesDto.totalEpisodes) || 1 
        : createSeriesDto.totalEpisodes || 1;
      
      console.log('✅ Processed series data:');
      console.log('  genre:', genreArray, 'type:', typeof genreArray);
      console.log('  totalSeasons:', totalSeasons, 'type:', typeof totalSeasons);
      console.log('  totalEpisodes:', totalEpisodes, 'type:', typeof totalEpisodes);
      
      // For now, we'll create a video with type SERIES
      // In the future, you might want a separate series table
      const series = new Video();
      Object.assign(series, {
        title: createSeriesDto.title,
        description: createSeriesDto.description,
        genre: JSON.stringify(genreArray), // JSON string olarak sakla
        year: createSeriesDto.year,
        rating: createSeriesDto.rating || 0,
        status: createSeriesDto.status || 'ongoing',
        totalSeasons: totalSeasons,
        totalEpisodes: totalEpisodes,
        thumbnailUrl: thumbnailFile ? `/uploads/thumbnails/${thumbnailFile.filename}` : null,
        posterUrl: posterFile ? `/uploads/posters/${posterFile.filename}` : null,
        trailerUrl: createSeriesDto.trailerUrl || null, // Fragman URL'ini ekle
        type: VideoType.SERIES,
        views: 0,
        isFeatured: createSeriesDto.isFeatured || false,
        isNew: createSeriesDto.isNew || true
      });

      const savedSeries = await this.videosRepository.save(series);
      console.log('✅ Series created successfully:', savedSeries);
      
      // WebSocket ile admin'lere bildir
      this.adminGateway.notifySeriesAdded(savedSeries);
      
      return savedSeries;
    } catch (error) {
      console.error('❌ Error creating series:', error);
      throw new Error(`Failed to create series: ${error.message}`);
    }
  }

  async getMovies() {
    return this.getAllMovies();
  }

  async getSeries() {
    return this.getAllSeries();
  }

  private async getAdminUserId(): Promise<string> {
    const adminUser = await this.usersRepository.findOne({
      where: { role: UserRole.ADMIN }
    });
    
    if (!adminUser) {
      throw new Error('Admin user not found. Please run database seeds first.');
    }
    
    return adminUser.id;
  }

  async getAllContent() {
    const allVideos = await this.videosRepository.find({
      order: { createdAt: 'DESC' }
    });

    return allVideos.map(video => ({
      id: video.id,
      title: video.title,
      type: video.type === VideoType.MOVIE ? 'movie' : 'series',
      thumbnail: video.thumbnailUrl || 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Content',
      views: video.views || 0,
      rating: video.rating || 0,
      isFeatured: video.isFeatured || false,
      isNew: new Date().getTime() - video.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000, // 7 days
      status: video.status || 'published',
      createdAt: video.createdAt.toISOString(),
      genre: video.genre ? JSON.parse(video.genre) : []
    }));
  }

  async deleteContent(contentId: string) {
    const content = await this.videosRepository.findOne({ where: { id: contentId } });
    
    if (!content) {
      throw new Error('Content not found');
    }

    // Delete the content
    await this.videosRepository.remove(content);
    
    // WebSocket ile admin'lere bildir
    this.adminGateway.notifyContentDeleted(contentId);
    
    return { success: true, message: 'Content deleted successfully' };
  }

  async toggleContentFeature(contentId: string, isFeatured: boolean) {
    const content = await this.videosRepository.findOne({ where: { id: contentId } });
    
    if (!content) {
      throw new Error('Content not found');
    }

    content.isFeatured = isFeatured;
    await this.videosRepository.save(content);
    
    // WebSocket ile admin'lere bildir
    this.adminGateway.notifyContentUpdated(content);
    
    return { success: true, message: `Content ${isFeatured ? 'featured' : 'unfeatured'} successfully` };
  }

  async updateContentStatus(contentId: string, status: string) {
    const content = await this.videosRepository.findOne({ where: { id: contentId } });
    
    if (!content) {
      throw new Error('Content not found');
    }

    content.status = status as any;
    await this.videosRepository.save(content);
    
    // WebSocket ile admin'lere bildir
    this.adminGateway.notifyContentUpdated(content);
    
    return { success: true, message: `Content status updated to ${status}` };
  }

  async getUserStats() {
    const [
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      usersByRole
    ] = await Promise.all([
      this.usersRepository.count(),
      this.usersRepository.count({ where: { status: UserStatus.ACTIVE } }),
      this.usersRepository.count({
        where: {
          createdAt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }),
      this.usersRepository
        .createQueryBuilder('user')
        .select('user.role', 'role')
        .addSelect('COUNT(*)', 'count')
        .groupBy('user.role')
        .getRawMany()
    ]);

    return {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      newUsersThisMonth,
      usersByRole: usersByRole.reduce((acc, item) => {
        acc[item.role] = parseInt(item.count);
        return acc;
      }, {})
    };
  }

  async getRecentActivity() {
    // Son 24 saatteki aktiviteleri getir
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const [
      recentVideos,
      recentUsers
    ] = await Promise.all([
      this.videosRepository.find({
        where: {
          createdAt: oneDayAgo
        },
        order: { createdAt: 'DESC' },
        take: 5
      }),
      this.usersRepository.find({
        where: {
          createdAt: oneDayAgo
        },
        order: { createdAt: 'DESC' },
        take: 5
      })
    ]);

    const activities: any[] = [];

    // Yeni videolar
    recentVideos.forEach(video => {
      activities.push({
        icon: 'plus',
        iconColor: 'text-green-500',
        message: `New ${video.type} "${video.title}" uploaded`,
        time: this.getTimeAgo(video.createdAt)
      });
    });

    // Yeni kullanıcılar
    recentUsers.forEach(user => {
      activities.push({
        icon: 'users',
        iconColor: 'text-blue-500',
        message: `New user registered: ${user.email}`,
        time: this.getTimeAgo(user.createdAt)
      });
    });

    // Popüler içerikler (yüksek görüntülenme)
    const popularVideos = await this.videosRepository.find({
      order: { views: 'DESC' },
      take: 3
    });

    popularVideos.forEach(video => {
      if (video.views > 1000) {
        activities.push({
          icon: 'trending',
          iconColor: 'text-yellow-500',
          message: `${video.type} "${video.title}" reached ${video.views.toLocaleString()} views`,
          time: this.getTimeAgo(video.updatedAt)
        });
      }
    });

    return activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);
  }

  private getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  }

  async updateUser(userId: string, updateData: any) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new Error('User not found');
    }

    // Update user data
    if (updateData.firstName) user.firstName = updateData.firstName;
    if (updateData.lastName) user.lastName = updateData.lastName;
    if (updateData.email) user.email = updateData.email;
    
    await this.usersRepository.save(user);

    return {
      success: true,
      message: 'User updated successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt.toISOString(),
        lastLogin: user.lastLoginAt?.toISOString() || null
      }
    };
  }

  async deleteUser(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new Error('User not found');
    }

    // Don't allow deleting admin users
    if (user.role === 'admin') {
      throw new Error('Cannot delete admin users');
    }

    await this.usersRepository.remove(user);

    return {
      success: true,
      message: 'User deleted successfully'
    };
  }

  async changeUserRole(userId: string, newRole: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new Error('User not found');
    }

    // Validate role
    if (!['user', 'moderator', 'admin'].includes(newRole)) {
      throw new Error('Invalid role');
    }

    // Convert string role to enum
    let roleEnum;
    switch (newRole) {
      case 'user':
        roleEnum = 'user';
        break;
      case 'moderator':
        roleEnum = 'moderator';
        break;
      case 'admin':
        roleEnum = 'admin';
        break;
      default:
        throw new Error('Invalid role');
    }

    user.role = roleEnum as any;
    await this.usersRepository.save(user);

    return {
      success: true,
      message: `User role changed to ${newRole}`,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt.toISOString(),
        lastLogin: user.lastLoginAt?.toISOString() || null
      }
    };
  }

  async createAdmin(email: string, password: string) {
    // Mevcut kullanıcıyı kontrol et
    const existingUser = await this.usersRepository.findOne({
      where: { email }
    });

    if (existingUser) {
      // Mevcut kullanıcıyı admin yap
      existingUser.role = UserRole.ADMIN;
      existingUser.isAdmin = true;
      existingUser.status = UserStatus.ACTIVE;
      await this.usersRepository.save(existingUser);
      return { message: 'Kullanıcı admin yapıldı!', user: existingUser };
    } else {
      // Yeni admin kullanıcısı oluştur
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const adminUser = this.usersRepository.create({
        email,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        isAdmin: true,
        status: UserStatus.ACTIVE,
        emailVerified: true
      });

      const savedUser = await this.usersRepository.save(adminUser);
      return { message: 'Admin kullanıcısı oluşturuldu!', user: savedUser };
    }
  }
}
