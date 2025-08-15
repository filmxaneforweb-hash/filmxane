import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray, IsEnum } from 'class-validator';
import { VideoType, VideoQuality } from '../../../entities/video.entity';

export class CreateVideoDto {
  @ApiProperty({
    description: 'ناونیشانی ڤیدیۆ',
    example: 'فیلمێکی کوردی',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'وەسفی ڤیدیۆ',
    example: 'فیلمێکی کوردی بە کوالیتی بەرز',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'جۆری ڤیدیۆ',
    enum: VideoType,
    example: VideoType.MOVIE,
  })
  @IsEnum(VideoType)
  type: VideoType;

  @ApiProperty({
    description: 'ماوەی ڤیدیۆ (چرکە)',
    example: 7200,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({
    description: 'ساڵی بڵاوکردنەوە',
    example: 2023,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  releaseYear?: number;

  @ApiProperty({
    description: 'دەرھێنەر',
    example: 'ئەحمەد محەممەد',
    required: false,
  })
  @IsOptional()
  @IsString()
  director?: string;

  @ApiProperty({
    description: 'ئەکتەرەکان',
    example: 'ئەحمەد، سارا، عەلی',
    required: false,
  })
  @IsOptional()
  @IsString()
  cast?: string;

  @ApiProperty({
    description: 'زمان',
    example: 'کوردی',
    required: false,
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({
    description: 'زمانی سەرتەیتڵ',
    example: 'کوردی',
    required: false,
  })
  @IsOptional()
  @IsString()
  subtitleLanguage?: string;

  @ApiProperty({
    description: 'تەمەنی گونجاو',
    example: '13+',
    required: false,
  })
  @IsOptional()
  @IsString()
  ageRating?: string;

  @ApiProperty({
    description: 'کوالیتی ڤیدیۆ',
    enum: VideoQuality,
    example: VideoQuality.HD,
  })
  @IsEnum(VideoQuality)
  quality: VideoQuality;

  @ApiProperty({
    description: 'لینکی ڤیدیۆ',
    example: 'https://example.com/video.mp4',
    required: false,
  })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiProperty({
    description: 'لینکی تەمبنیڵ',
    example: 'https://example.com/thumbnail.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiProperty({
    description: 'لینکی پۆستەر',
    example: 'https://example.com/poster.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  posterUrl?: string;

  @ApiProperty({
    description: 'لینکی تڕەیڵەر',
    example: 'https://example.com/trailer.mp4',
    required: false,
  })
  @IsOptional()
  @IsString()
  trailerUrl?: string;

  @ApiProperty({
    description: 'ژمارەی سیزن (بۆ زنجیرە)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  seasonNumber?: number;

  @ApiProperty({
    description: 'ژمارەی ئەپیزۆد (بۆ زنجیرە)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  episodeNumber?: number;

  @ApiProperty({
    description: 'کەڵەکەکان',
    example: ['فیلم', 'کوردی', 'دراما'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'ID کەڵەکەکان',
    example: ['uuid1', 'uuid2'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];
}
