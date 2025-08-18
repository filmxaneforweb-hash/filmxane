import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from '../../entities/video.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { VideoType, VideoStatus } from '../../entities/video.entity';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
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
    await this.videosRepository.increment({ id }, 'views', 1);
  }

  async incrementShares(id: string): Promise<void> {
    await this.videosRepository.increment({ id }, 'shares', 1);
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
}
