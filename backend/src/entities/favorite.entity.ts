import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { User } from './user.entity'
import { Video } from './video.entity'

@Entity('favorites')
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 36 })
  userId: string

  @Column({ type: 'varchar', length: 36 })
  videoId: string

  @Column({ type: 'varchar', length: 10, default: 'movie' })
  type: 'movie' | 'series'

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  // Relations
  @ManyToOne(() => User, user => user.favorites)
  user: User

  @ManyToOne(() => Video, video => video.favorites)
  video: Video
}
