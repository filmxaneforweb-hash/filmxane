import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Series, SeriesStatus } from '../../entities/series.entity';
import { CreateSeriesDto } from './dto/create-series.dto';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Series)
    private seriesRepository: Repository<Series>,
  ) {}

  async create(createSeriesDto: CreateSeriesDto): Promise<Series> {
    const series = this.seriesRepository.create(createSeriesDto);
    return this.seriesRepository.save(series);
  }

  async findAll(): Promise<Series[]> {
    return this.seriesRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Series | null> {
    return this.seriesRepository.findOne({ where: { id } });
  }

  async findByStatus(status: SeriesStatus): Promise<Series[]> {
    return this.seriesRepository.find({
      where: { status },
      order: { createdAt: 'DESC' }
    });
  }

  async findFeatured(): Promise<Series[]> {
    return this.seriesRepository.find({
      where: { isFeatured: true },
      order: { createdAt: 'DESC' }
    });
  }

  async findNew(): Promise<Series[]> {
    return this.seriesRepository.find({
      where: { isNew: true },
      order: { createdAt: 'DESC' }
    });
  }

  async update(id: string, updateSeriesDto: Partial<CreateSeriesDto>): Promise<Series> {
    await this.seriesRepository.update(id, updateSeriesDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.seriesRepository.delete(id);
  }

  async incrementViews(id: string): Promise<void> {
    await this.seriesRepository.increment({ id }, 'views', 1);
  }

  async getStats() {
    const [total, featured, newSeries] = await Promise.all([
      this.seriesRepository.count(),
      this.seriesRepository.count({ where: { isFeatured: true } }),
      this.seriesRepository.count({ where: { isNew: true } })
    ]);

    const totalViews = await this.seriesRepository
      .createQueryBuilder('series')
      .select('SUM(series.views)', 'total')
      .getRawOne();

    const totalSeasons = await this.seriesRepository
      .createQueryBuilder('series')
      .select('SUM(series.seasons)', 'total')
      .getRawOne();

    const totalEpisodes = await this.seriesRepository
      .createQueryBuilder('series')
      .select('SUM(series.episodes)', 'total')
      .getRawOne();

    return {
      total,
      featured,
      new: newSeries,
      totalViews: parseInt(totalViews.total) || 0,
      totalSeasons: parseInt(totalSeasons.total) || 0,
      totalEpisodes: parseInt(totalEpisodes.total) || 0
    };
  }
}
