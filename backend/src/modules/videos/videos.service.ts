import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Video, VideoStatus } from '../../entities/video.entity';
import { Category } from '../../entities/category.entity';
import { Favorite } from '../../entities/favorite.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  async findAll(query: any = {}): Promise<Video[]> {
    const queryBuilder = this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.categories', 'categories')
      .leftJoinAndSelect('video.uploadedBy', 'uploadedBy')
      .where('video.status = :status', { status: VideoStatus.PUBLISHED });

    if (query.category) {
      queryBuilder.andWhere('categories.id = :categoryId', { categoryId: query.category });
    }

    if (query.search) {
      queryBuilder.andWhere(
        '(video.title ILIKE :search OR video.description ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    if (query.type) {
      queryBuilder.andWhere('video.type = :type', { type: query.type });
    }

    return await queryBuilder
      .orderBy('video.createdAt', 'DESC')
      .getMany();
  }

  async findById(id: string): Promise<Video> {
    const video = await this.videoRepository.findOne({
      where: { id },
      relations: ['categories', 'uploadedBy', 'favorites'],
    });

    if (!video) {
      throw new NotFoundException('ڤیدیۆ نەدۆزرایەوە');
    }

    return video;
  }

  async create(createVideoDto: CreateVideoDto, userId: string): Promise<Video> {
    // Tags'i JSON string'e çevir
    const { tags, ...videoData } = createVideoDto;
    const processedTags = tags ? JSON.stringify(tags) : '[]';

    const video = this.videoRepository.create({
      ...videoData,
      tags: processedTags,
      uploadedById: userId, // uploadedBy yerine uploadedById kullan
    });

    if (createVideoDto.categoryIds) {
      const categories = await this.categoryRepository.findByIds(createVideoDto.categoryIds);
      video.categories = categories;
    }

    return await this.videoRepository.save(video);
  }

  async update(id: string, updateVideoDto: UpdateVideoDto): Promise<Video> {
    const video = await this.findById(id);
    
    // Tags'i JSON string'e çevir
    const { tags, ...videoData } = updateVideoDto;
    if (tags) {
      video.tags = JSON.stringify(tags);
    }
    
    Object.assign(video, videoData);

    if (updateVideoDto.categoryIds) {
      const categories = await this.categoryRepository.findByIds(updateVideoDto.categoryIds);
      video.categories = categories;
    }

    return await this.videoRepository.save(video);
  }

  async delete(id: string): Promise<void> {
    const video = await this.findById(id);
    await this.videoRepository.remove(video);
  }

  async toggleFavorite(videoId: string, userId: string): Promise<{ isFavorite: boolean }> {
    const existingFavorite = await this.favoriteRepository.findOne({
      where: { videoId, userId },
    });

    if (existingFavorite) {
      await this.favoriteRepository.remove(existingFavorite);
      return { isFavorite: false };
    } else {
      const favorite = this.favoriteRepository.create({
        videoId,
        userId,
      });
      await this.favoriteRepository.save(favorite);
      return { isFavorite: true };
    }
  }

  async getFavorites(userId: string): Promise<Video[]> {
    return await this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.favorites', 'favorites')
      .leftJoinAndSelect('video.categories', 'categories')
      .where('favorites.userId = :userId', { userId })
      .andWhere('video.status = :status', { status: VideoStatus.PUBLISHED })
      .orderBy('favorites.createdAt', 'DESC')
      .getMany();
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.videoRepository.increment({ id }, 'viewCount', 1);
  }

  async getFeatured(): Promise<Video[]> {
    return await this.videoRepository.find({
      where: { isFeatured: true, status: VideoStatus.PUBLISHED },
      relations: ['categories'],
      order: { createdAt: 'DESC' },
      take: 10,
    });
  }

  async getTrending(): Promise<Video[]> {
    return await this.videoRepository.find({
      where: { isTrending: true, status: VideoStatus.PUBLISHED },
      relations: ['categories'],
      order: { viewCount: 'DESC' },
      take: 10,
    });
  }

  async getStats(): Promise<{
    totalVideos: number;
    publishedVideos: number;
    totalViews: number;
    totalFavorites: number;
  }> {
    const totalVideos = await this.videoRepository.count();
    const publishedVideos = await this.videoRepository.count({
      where: { status: VideoStatus.PUBLISHED },
    });

    const viewStats = await this.videoRepository
      .createQueryBuilder('video')
      .select('SUM(video.viewCount)', 'totalViews')
      .getRawOne();

    const favoriteStats = await this.favoriteRepository.count();

    return {
      totalVideos,
      publishedVideos,
      totalViews: parseInt(viewStats.totalViews) || 0,
      totalFavorites: favoriteStats,
    };
  }
}
