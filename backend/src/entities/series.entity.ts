import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum SeriesStatus {
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Entity('series')
export class Series {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('simple-array')
  genre: string[];

  @Column()
  year: number;

  @Column('decimal', { precision: 3, scale: 1, default: 0 })
  rating: number;

  @Column({
    type: 'text',
    default: SeriesStatus.ONGOING
  })
  status: SeriesStatus;

  @Column()
  seasons: number;

  @Column()
  episodes: number;

  @Column({ default: 0 })
  views: number;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ nullable: true })
  poster: string;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: false })
  isNew: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
