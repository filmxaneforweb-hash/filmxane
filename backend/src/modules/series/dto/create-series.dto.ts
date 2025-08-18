import { IsString, IsArray, IsOptional, IsEnum } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export enum SeriesStatus {
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export class CreateSeriesDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  genre: string[];

  @Transform(({ value }) => parseInt(value))
  year: number;

  @Transform(({ value }) => parseFloat(value))
  rating: number;

  @IsEnum(SeriesStatus)
  status: SeriesStatus;

  @Transform(({ value }) => parseInt(value))
  totalSeasons: number;

  @Transform(({ value }) => parseInt(value))
  totalEpisodes: number;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsString()
  poster?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isFeatured?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isNew?: boolean;
}
