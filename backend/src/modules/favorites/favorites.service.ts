import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Favorite } from '../../entities/favorite.entity'
import { User } from '../../entities/user.entity'
import { Video } from '../../entities/video.entity'

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Video)
    private videosRepository: Repository<Video>
  ) {}

  async addToFavorites(userId: string, videoId: string, type: 'movie' | 'series'): Promise<Favorite> {
    // Kullanıcı ve video var mı kontrol et
    const user = await this.usersRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı')
    }

    const video = await this.videosRepository.findOne({ where: { id: videoId } })
    if (!video) {
      throw new NotFoundException('Video bulunamadı')
    }

    // Zaten favorilerde mi kontrol et
    const existingFavorite = await this.favoritesRepository.findOne({
      where: { userId, videoId, isActive: true }
    })

    if (existingFavorite) {
      throw new ConflictException('Video zaten favorilerde')
    }

    // Yeni favori oluştur
    const favorite = this.favoritesRepository.create({
      userId,
      videoId,
      type,
      isActive: true
    })

    return await this.favoritesRepository.save(favorite)
  }

  async removeFromFavorites(userId: string, videoId: string): Promise<void> {
    const favorite = await this.favoritesRepository.findOne({
      where: { userId, videoId, isActive: true }
    })

    if (!favorite) {
      throw new NotFoundException('Favori bulunamadı')
    }

    favorite.isActive = false
    await this.favoritesRepository.save(favorite)
  }

  async checkFavoriteStatus(userId: string, videoId: string): Promise<{ isFavorite: boolean }> {
    const favorite = await this.favoritesRepository.findOne({
      where: { userId, videoId, isActive: true }
    })

    return { isFavorite: !!favorite }
  }

  async getUserFavorites(userId: string): Promise<Favorite[]> {
    console.log('🔍 getUserFavorites called for userId:', userId)
    
    const favorites = await this.favoritesRepository.find({
      where: { userId, isActive: true },
      relations: ['video'],
      order: { createdAt: 'DESC' }
    })
    
    console.log('🔍 Found favorites:', favorites.length)
    favorites.forEach(fav => {
      console.log('🔍 Favorite video data:', {
        id: fav.video?.id,
        title: fav.video?.title,
        thumbnailUrl: fav.video?.thumbnailUrl,
        posterUrl: fav.video?.posterUrl,
        thumbnailPath: fav.video?.thumbnailPath
      })
    })
    
    return favorites
  }

  async getFavoriteCount(videoId: string): Promise<number> {
    return await this.favoritesRepository.count({
      where: { videoId, isActive: true }
    })
  }
}
