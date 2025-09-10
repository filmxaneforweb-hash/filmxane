import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subtitle, SubtitleFormat } from '../../entities/subtitle.entity';
import { Video } from '../../entities/video.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SubtitlesService {
  constructor(
    @InjectRepository(Subtitle)
    private subtitleRepository: Repository<Subtitle>,
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
  ) {}

  async createSubtitle(
    videoId: string,
    language: string,
    languageName: string,
    format: SubtitleFormat,
    fileUrl: string,
    filePath?: string,
    description?: string,
  ): Promise<Subtitle> {
    // Video'nun var olup olmadığını kontrol et
    const video = await this.videoRepository.findOne({ where: { id: videoId } });
    if (!video) {
      throw new NotFoundException('Video not found');
    }

    // Aynı dilde altyazı var mı kontrol et
    const existingSubtitle = await this.subtitleRepository.findOne({
      where: { videoId, language },
    });

    if (existingSubtitle) {
      throw new BadRequestException('Subtitle for this language already exists');
    }

    // Eğer ilk altyazı ise varsayılan yap
    const subtitleCount = await this.subtitleRepository.count({ where: { videoId } });
    const isDefault = subtitleCount === 0;

    const subtitle = this.subtitleRepository.create({
      videoId,
      language,
      languageName,
      format,
      fileUrl,
      filePath,
      description,
      isDefault,
    });

    return await this.subtitleRepository.save(subtitle);
  }

  async getSubtitlesByVideoId(videoId: string): Promise<Subtitle[]> {
    return await this.subtitleRepository.find({
      where: { videoId, isActive: true },
      order: { isDefault: 'DESC', language: 'ASC' },
    });
  }

  async getSubtitleById(id: string): Promise<Subtitle> {
    const subtitle = await this.subtitleRepository.findOne({ where: { id } });
    if (!subtitle) {
      throw new NotFoundException('Subtitle not found');
    }
    return subtitle;
  }

  async updateSubtitle(
    id: string,
    updates: Partial<Subtitle>,
  ): Promise<Subtitle> {
    const subtitle = await this.getSubtitleById(id);
    
    Object.assign(subtitle, updates);
    return await this.subtitleRepository.save(subtitle);
  }

  async deleteSubtitle(id: string): Promise<void> {
    const subtitle = await this.getSubtitleById(id);
    
    // Dosyayı sil
    if (subtitle.filePath && fs.existsSync(subtitle.filePath)) {
      fs.unlinkSync(subtitle.filePath);
    }

    await this.subtitleRepository.remove(subtitle);
  }

  async setDefaultSubtitle(id: string): Promise<Subtitle> {
    const subtitle = await this.getSubtitleById(id);
    
    // Aynı video'daki diğer altyazıları varsayılan olmaktan çıkar
    await this.subtitleRepository.update(
      { videoId: subtitle.videoId },
      { isDefault: false },
    );

    // Bu altyazıyı varsayılan yap
    subtitle.isDefault = true;
    return await this.subtitleRepository.save(subtitle);
  }

  async getSubtitleContent(id: string): Promise<string> {
    const subtitle = await this.getSubtitleById(id);
    
    if (subtitle.filePath && fs.existsSync(subtitle.filePath)) {
      return fs.readFileSync(subtitle.filePath, 'utf-8');
    }
    
    throw new NotFoundException('Subtitle file not found');
  }

  async incrementDownloadCount(id: string): Promise<void> {
    await this.subtitleRepository.increment({ id }, 'downloadCount', 1);
  }

  async getAvailableLanguages(): Promise<string[]> {
    const result = await this.subtitleRepository
      .createQueryBuilder('subtitle')
      .select('DISTINCT subtitle.language', 'language')
      .addSelect('subtitle.languageName', 'languageName')
      .where('subtitle.isActive = :isActive', { isActive: true })
      .getRawMany();

    return result.map(item => item.language);
  }

  async getLanguageNames(): Promise<{ language: string; languageName: string }[]> {
    const result = await this.subtitleRepository
      .createQueryBuilder('subtitle')
      .select('DISTINCT subtitle.language', 'language')
      .addSelect('subtitle.languageName', 'languageName')
      .where('subtitle.isActive = :isActive', { isActive: true })
      .getRawMany();

    return result;
  }
}
