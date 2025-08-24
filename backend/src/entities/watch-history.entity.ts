import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Video } from './video.entity';

@Entity()
export class WatchHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Video, { onDelete: 'CASCADE' })
  video: Video;

  @Column()
  videoId: string;

  @Column({ type: 'int', default: 0 })
  watchDuration: number; // Dakika cinsinden

  @Column({ type: 'int', default: 0 })
  totalViews: number; // Toplam izleme sayısı

  @Column({ type: 'boolean', default: false })
  isCompleted: boolean; // Film tamamen izlendi mi?

  @Column({ type: 'datetime', nullable: true })
  lastWatchedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
