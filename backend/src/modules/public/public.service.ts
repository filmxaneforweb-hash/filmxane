import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video, VideoType } from '../../entities/video.entity';
import { Category } from '../../entities/category.entity';

@Injectable()
export class PublicService {
  constructor(
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async getMovies() {
    try {
      const movies = await this.videosRepository.find({
        where: { type: VideoType.MOVIE },
        order: { createdAt: 'DESC' }
      });
      
      return {
        success: true,
        data: movies,
        message: 'Movies fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching movies:', error);
      return {
        success: false,
        data: [],
        message: 'Failed to fetch movies'
      };
    }
  }

  async getSeries() {
    try {
      const series = await this.videosRepository.find({
        where: { type: VideoType.SERIES },
        order: { createdAt: 'DESC' }
      });
      
      return {
        success: true,
        data: series,
        message: 'Series fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching series:', error);
      return {
        success: false,
        data: [],
        message: 'Failed to fetch series'
      };
    }
  }

  async getAllContent() {
    try {
      const allContent = await this.videosRepository.find({
        order: { createdAt: 'DESC' }
      });
      
      return {
        success: true,
        data: allContent,
        message: 'All content fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching all content:', error);
      return {
        success: false,
        data: [],
        message: 'Failed to fetch content'
      };
    }
  }

  async getCategories() {
    try {
      const categories = await this.categoriesRepository.find({
        where: { isActive: true },
        order: { name: 'ASC' }
      });
      
      return {
        success: true,
        data: categories,
        message: 'Categories fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        data: [],
        message: 'Failed to fetch categories'
      };
    }
  }
}
