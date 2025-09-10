import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubtitlesController } from './subtitles.controller';
import { SubtitlesService } from './subtitles.service';
import { Subtitle } from '../../entities/subtitle.entity';
import { Video } from '../../entities/video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subtitle, Video])],
  controllers: [SubtitlesController],
  providers: [SubtitlesService],
  exports: [SubtitlesService],
})
export class SubtitlesModule {}
