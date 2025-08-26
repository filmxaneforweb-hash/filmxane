import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Video, VideoType, VideoQuality, VideoStatus } from '../../entities/video.entity';
import { WatchHistory } from '../../entities/watch-history.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
    @InjectRepository(WatchHistory)
    private watchHistoryRepository: Repository<WatchHistory>,
  ) {}

  async create(createVideoDto: CreateVideoDto, videoFile: Express.Multer.File, thumbnailFile?: Express.Multer.File): Promise<Video> {
    const video = new Video();
    
    // Generate unique filename
    const videoId = uuidv4();
    const videoExtension = path.extname(videoFile.originalname);
    const videoFilename = `${videoId}${videoExtension}`;
    
    // Save video file
    const videoPath = path.join(process.cwd(), 'uploads', 'videos', videoFilename);
    const videoDir = path.dirname(videoPath);
    
    if (!fs.existsSync(videoDir)) {
      fs.mkdirSync(videoDir, { recursive: true });
    }
    
    fs.writeFileSync(videoPath, videoFile.buffer);
    
    // Save thumbnail if provided
    let thumbnailPath = null;
    if (thumbnailFile) {
      const thumbnailExtension = path.extname(thumbnailFile.originalname);
      const thumbnailFilename = `${videoId}_thumb${thumbnailExtension}`;
      thumbnailPath = path.join(process.cwd(), 'uploads', 'thumbnails', thumbnailFilename);
      const thumbnailDir = path.dirname(thumbnailPath);
      
      if (!fs.existsSync(thumbnailDir)) {
        fs.mkdirSync(thumbnailDir, { recursive: true });
      }
      
      fs.writeFileSync(thumbnailPath, thumbnailFile.buffer);
      thumbnailPath = `/uploads/thumbnails/${thumbnailFilename}`;
    }
    
    // Set video properties
    video.title = createVideoDto.title;
    video.description = createVideoDto.description;
    video.genre = JSON.stringify(createVideoDto.genre); // Array'i JSON string olarak sakla
    video.year = createVideoDto.year;
    video.rating = createVideoDto.rating || 0;
    video.duration = createVideoDto.duration;
    video.views = 0;
    video.isFeatured = createVideoDto.isFeatured || false;
    video.isNew = createVideoDto.isNew || false;
    video.type = createVideoDto.type; // 'movie' or 'series'
    video.videoPath = `/uploads/videos/${videoFilename}`;
    video.videoUrl = `/uploads/videos/${videoFilename}`; // Frontend için URL
    video.thumbnailPath = thumbnailPath;
    video.thumbnailUrl = thumbnailPath; // Frontend için URL
    video.episodeNumber = createVideoDto.episodeNumber;
    video.seasonNumber = createVideoDto.seasonNumber;
    video.seriesId = createVideoDto.seriesId;
    
    return this.videosRepository.save(video);
  }

  async findAll(): Promise<Video[]> {
    return this.videosRepository.find({
      where: { status: VideoStatus.PUBLISHED },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Video> {
    return this.videosRepository.findOne({ where: { id } });
  }

  async update(id: string, updateVideoDto: UpdateVideoDto): Promise<Video> {
    // Genre alanını JSON string olarak dönüştür
    const updateData: any = { ...updateVideoDto };
    if (updateData.genre) {
      updateData.genre = JSON.stringify(updateData.genre);
    }
    
    await this.videosRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const video = await this.findOne(id);
    if (video) {
      // Delete video file
      if (video.videoPath) {
        const videoPath = path.join(process.cwd(), video.videoPath);
        if (fs.existsSync(videoPath)) {
          fs.unlinkSync(videoPath);
        }
      }
      
      // Delete thumbnail file
      if (video.thumbnailPath) {
        const thumbnailPath = path.join(process.cwd(), video.thumbnailPath);
        if (fs.existsSync(thumbnailPath)) {
          fs.unlinkSync(thumbnailPath);
        }
      }
      
      await this.videosRepository.remove(video);
    }
  }

  async findByType(type: VideoType): Promise<Video[]> {
    return this.videosRepository.find({ 
      where: { 
        type,
        status: VideoStatus.PUBLISHED
      },
      order: { createdAt: 'DESC' }
    });
  }

  async findFeatured(): Promise<Video[]> {
    return this.videosRepository.find({ 
      where: { 
        isFeatured: true,
        status: VideoStatus.PUBLISHED
      },
      order: { createdAt: 'DESC' }
    });
  }

  async findNew(): Promise<Video[]> {
    return this.videosRepository.find({ 
      where: { 
        isNew: true,
        status: VideoStatus.PUBLISHED
      },
      order: { createdAt: 'DESC' }
    });
  }

  async incrementViews(id: string): Promise<void> {
    await this.videosRepository
      .createQueryBuilder()
      .update(Video)
      .set({ views: () => 'views + 1' })
      .where('id = :id', { id })
      .execute();
  }

  async incrementShares(id: string): Promise<void> {
    await this.videosRepository
      .createQueryBuilder()
      .update(Video)
      .set({ shares: () => 'shares + 1' })
      .where('id = :id', { id })
      .execute();
  }

  async getWatchProgress(videoId: string, authHeader?: string): Promise<any> {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          success: false,
          message: 'Kullanıcı kimlik doğrulaması gerekli'
        };
      }

      const token = authHeader.replace('Bearer ', '');
      // JWT token'dan user ID'yi çıkar
      const userId = this.extractUserIdFromToken(token);
      
      if (!userId) {
        return {
          success: false,
          message: 'Geçersiz token'
        };
      }

      // Watch history'yi bul
      const watchHistory = await this.watchHistoryRepository.findOne({
        where: { userId, videoId }
      });

      if (!watchHistory) {
        return {
          success: true,
          data: {
            watchDuration: 0,
            isCompleted: false,
            lastWatchedAt: null
          }
        };
      }

      return {
        success: true,
        data: {
          watchDuration: watchHistory.watchDuration,
          isCompleted: watchHistory.isCompleted,
          lastWatchedAt: watchHistory.lastWatchedAt
        }
      };
    } catch (error) {
      console.error('Watch progress alınamadı:', error);
      return {
        success: false,
        message: 'Watch progress alınamadı'
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

  async fixVideoUrls(): Promise<{ updated: number; total: number }> {
    const videos = await this.videosRepository.find();
    let updatedCount = 0;
    
    for (const video of videos) {
      let needsUpdate = false;
      
      // videoUrl güncelle
      if (!video.videoUrl && video.videoPath) {
        video.videoUrl = video.videoPath;
        needsUpdate = true;
      }
      
      // thumbnailUrl güncelle
      if (!video.thumbnailUrl && video.thumbnailPath) {
        video.thumbnailUrl = video.thumbnailPath;
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await this.videosRepository.save(video);
        updatedCount++;
      }
    }
    
    return { updated: updatedCount, total: videos.length };
  }

  // Gelişmiş filtreleme ve arama
  async searchWithFilters(filters: {
    query?: string;
    genre?: string;
    year?: string;
    type?: string;
    rating?: string;
    duration?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
  }) {
    const queryBuilder = this.videosRepository.createQueryBuilder('video')
      .where('video.status = :status', { status: VideoStatus.PUBLISHED });

    // Arama sorgusu
    if (filters.query) {
      queryBuilder.andWhere(
        '(video.title LIKE :query OR video.description LIKE :query)',
        { query: `%${filters.query}%` }
      );
    }

    // Tür filtresi
    if (filters.type) {
      queryBuilder.andWhere('video.type = :type', { type: filters.type });
    }

    // Yıl filtresi
    if (filters.year && filters.year !== 'all') {
      queryBuilder.andWhere('video.year = :year', { year: parseInt(filters.year) });
    }

    // Rating filtresi
    if (filters.rating && filters.rating !== 'all') {
      const [minRating, maxRating] = filters.rating.split('-').map(r => parseFloat(r));
      if (maxRating) {
        queryBuilder.andWhere('video.rating BETWEEN :minRating AND :maxRating', { minRating, maxRating });
      } else {
        queryBuilder.andWhere('video.rating >= :minRating', { minRating });
      }
    }

    // Süre filtresi
    if (filters.duration && filters.duration !== 'all') {
      const [minDuration, maxDuration] = filters.duration.split('-').map(d => parseInt(d));
      if (maxDuration) {
        queryBuilder.andWhere('video.duration BETWEEN :minDuration AND :maxDuration', { minDuration, maxDuration });
      } else {
        queryBuilder.andWhere('video.duration >= :minDuration', { minDuration });
      }
    }

    // Genre filtresi (JSON string içinde arama)
    if (filters.genre && filters.genre !== 'all') {
      queryBuilder.andWhere('video.genre LIKE :genre', { genre: `%${filters.genre}%` });
    }

    // Sıralama
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'DESC';
    queryBuilder.orderBy(`video.${sortBy}`, sortOrder);

    // Sayfalama
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const [items, total] = await queryBuilder
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      success: true,
      data: {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  // Tüm genre'leri getir
  async getAllGenres() {
    const videos = await this.videosRepository.find({
      where: { status: VideoStatus.PUBLISHED },
      select: ['genre']
    });

    const allGenres = new Set<string>();
    videos.forEach(video => {
      if (video.genre) {
        try {
          const genres = JSON.parse(video.genre);
          if (Array.isArray(genres)) {
            genres.forEach(genre => allGenres.add(genre));
          }
        } catch {
          if (video.genre) allGenres.add(video.genre);
        }
      }
    });

    return {
      success: true,
      data: Array.from(allGenres).sort()
    };
  }

  // Tüm yılları getir
  async getAllYears() {
    const years = await this.videosRepository
      .createQueryBuilder('video')
      .select('DISTINCT video.year', 'year')
      .where('video.status = :status', { status: VideoStatus.PUBLISHED })
      .andWhere('video.year IS NOT NULL')
      .orderBy('video.year', 'DESC')
      .getRawMany();

    return {
      success: true,
      data: years.map(y => y.year).filter(Boolean)
    };
  }

  // İstatistik genel bakış
  async getStatsOverview() {
    const totalVideos = await this.videosRepository.count({
      where: { status: VideoStatus.PUBLISHED }
    });

    const totalMovies = await this.videosRepository.count({
      where: { 
        type: VideoType.MOVIE,
        status: VideoStatus.PUBLISHED
      }
    });

    const totalSeries = await this.videosRepository.count({
      where: { 
        type: VideoType.SERIES,
        status: VideoStatus.PUBLISHED
      }
    });

    const featuredCount = await this.videosRepository.count({
      where: { 
        isFeatured: true,
        status: VideoStatus.PUBLISHED
      }
    });

    const newCount = await this.videosRepository.count({
      where: { 
        isNew: true,
        status: VideoStatus.PUBLISHED
      }
    });

    return {
      success: true,
      data: {
        totalVideos,
        totalMovies,
        totalSeries,
        featuredCount,
        newCount
      }
    };
  }

  async getWatchTime(userId: string): Promise<{ totalMinutes: number; totalViews: number; completedVideos: number }> {
    try {
      // Kullanıcının izleme geçmişini getir
      const watchHistory = await this.watchHistoryRepository.find({
        where: { userId },
        relations: ['video']
      });

      let totalMinutes = 0;
      let totalViews = 0;
      let completedVideos = 0;

      watchHistory.forEach(record => {
        totalMinutes += record.watchDuration || 0;
        totalViews += record.totalViews || 0;
        if (record.isCompleted) {
          completedVideos++;
        }
      });

      return {
        totalMinutes,
        totalViews,
        completedVideos
      };
    } catch (error) {
      console.error('İzleme süresi hesaplanamadı:', error);
      return {
        totalMinutes: 0,
        totalViews: 0,
        completedVideos: 0
      };
    }
  }

  async findWatchHistory(userId: string, videoId: string): Promise<WatchHistory | null> {
    try {
      return await this.watchHistoryRepository.findOne({
        where: { userId, videoId }
      });
    } catch (error) {
      console.error('İzleme geçmişi bulunamadı:', error);
      return null;
    }
  }

  async updateWatchHistory(id: string, updateData: Partial<WatchHistory>): Promise<WatchHistory> {
    try {
      await this.watchHistoryRepository.update(id, updateData);
      return await this.watchHistoryRepository.findOne({ where: { id } });
    } catch (error) {
      console.error('İzleme geçmişi güncellenemedi:', error);
      throw error;
    }
  }

  async createWatchHistory(createData: Partial<WatchHistory>): Promise<WatchHistory> {
    try {
      const watchHistory = this.watchHistoryRepository.create(createData);
      return await this.watchHistoryRepository.save(watchHistory);
    } catch (error) {
      console.error('İzleme geçmişi oluşturulamadı:', error);
      throw error;
    }
  }
}
