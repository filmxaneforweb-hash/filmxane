import { IsString, IsNumber, IsArray, IsOptional, IsBoolean, IsEnum } from 'class-validator';

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

  @IsNumber()
  year: number;

  @IsNumber()
  rating: number;

  @IsEnum(SeriesStatus)
  status: SeriesStatus;

  @IsNumber()
  seasons: number;

  @IsNumber()
  episodes: number;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsString()
  poster?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isNew?: boolean;
}
