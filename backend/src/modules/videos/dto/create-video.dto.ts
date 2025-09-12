import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { VideoType } from '../../../entities/video.entity';

export class CreateVideoDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  genre: string[];

  @Type(() => Number)
  @IsNumber()
  year: number;


  @Type(() => Number)
  @IsNumber()
  duration: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isNew?: boolean;

  @IsEnum(VideoType)
  type: VideoType;

  @IsOptional()
  @IsNumber()
  episodeNumber?: number;

  @IsOptional()
  @IsNumber()
  seasonNumber?: number;

  @IsOptional()
  @IsString()
  seriesId?: string;

  @IsOptional()
  @IsString()
  trailerUrl?: string;
}
