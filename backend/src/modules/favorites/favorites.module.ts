import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FavoritesController } from './favorites.controller'
import { FavoritesService } from './favorites.service'
import { Favorite } from '../../entities/favorite.entity'
import { User } from '../../entities/user.entity'
import { Video } from '../../entities/video.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, User, Video])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService]
})
export class FavoritesModule {}
