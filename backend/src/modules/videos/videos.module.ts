import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { Video } from '../../entities/video.entity';
import { Category } from '../../entities/category.entity';
import { Favorite } from '../../entities/favorite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Video, Category, Favorite])],
  controllers: [VideosController],
  providers: [VideosService],
  exports: [VideosService],
})
export class VideosModule {}
