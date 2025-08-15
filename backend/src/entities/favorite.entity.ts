import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Video } from './video.entity';

@Entity('favorites')
@Unique(['userId', 'videoId'])
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  videoId: string;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Video, (video) => video.favorites, { onDelete: 'CASCADE' })
  video: Video;
}
