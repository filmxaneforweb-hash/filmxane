import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Favorite } from './favorite.entity';

export enum VideoType {
  MOVIE = 'movie',
  SERIES = 'series',
  DOCUMENTARY = 'documentary',
  SHORT = 'short',
}

export enum VideoStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  PROCESSING = 'processing',
  FAILED = 'failed',
}

export enum VideoQuality {
  HD = 'hd',
  FULL_HD = 'full_hd',
  UHD = 'uhd',
}

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  genre: string; // Veritabanında text olarak saklanacak, JSON string

  @Column({
    type: 'varchar',
    default: VideoType.MOVIE,
  })
  type: VideoType;

  @Column({
    type: 'varchar',
    default: VideoStatus.DRAFT,
  })
  status: VideoStatus;

  @Column({ nullable: true })
  duration?: number; // seconds

  @Column({ nullable: true })
  year?: number;

  @Column({ nullable: true })
  releaseYear?: number;

  @Column({ nullable: true })
  director?: string;

  @Column({ nullable: true })
  cast?: string;

  @Column({ nullable: true })
  language?: string;

  @Column({ nullable: true })
  subtitleLanguage?: string;

  @Column({ nullable: true })
  ageRating?: string;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  rating?: number;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likeCount: number;

  @Column({ default: 0 })
  dislikeCount: number;

  @Column({ default: 0 })
  shares: number;

  // Video files
  @Column({ nullable: true })
  videoUrl?: string;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column({ nullable: true })
  posterUrl?: string;

  @Column({ nullable: true })
  trailerUrl?: string;

  @Column({
    type: 'varchar',
    default: VideoQuality.HD,
  })
  quality: VideoQuality;

  // Series specific fields
  @Column({ nullable: true })
  seasonNumber?: number;

  @Column({ nullable: true })
  episodeNumber?: number;

  @Column({ nullable: true })
  totalEpisodes?: number;

  @Column({ nullable: true })
  seriesId?: string;

  @Column({ nullable: true })
  totalSeasons?: number;

  // Metadata
  @Column({ type: 'text', nullable: true })
  metadata?: string; // Veritabanında text olarak saklanacak, JSON string

  @Column({ type: 'text', default: '[]' })
  tags: string; // JSON string olarak saklanacak

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: false })
  isNew: boolean;

  @Column({ nullable: true })
  videoPath?: string;

  @Column({ nullable: true })
  thumbnailPath?: string;

  @Column({ nullable: true })
  publishedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.uploadedVideos)
  @JoinColumn({ name: 'uploadedById' })
  uploadedBy: User;

  @Column()
  uploadedById: string;

  @ManyToMany(() => Category, (category) => category.videos)
  @JoinTable({
    name: 'video_categories',
    joinColumn: { name: 'videoId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  categories: Category[];

  @OneToMany(() => Favorite, (favorite) => favorite.video)
  favorites: Favorite[];

  // Virtual properties
  get isSeries(): boolean {
    return this.type === VideoType.SERIES;
  }

  get isPublished(): boolean {
    return this.status === VideoStatus.PUBLISHED;
  }

  get formattedDuration(): string {
    if (!this.duration) return '';
    const hours = Math.floor(this.duration / 3600);
    const minutes = Math.floor((this.duration % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }

  get averageRating(): number {
    const totalVotes = this.likeCount + this.dislikeCount;
    return totalVotes > 0 ? (this.likeCount / totalVotes) * 5 : 0;
  }

  // Genre için getter ve setter
  get parsedGenre(): string[] {
    try {
      return JSON.parse(this.genre || '[]');
    } catch {
      return [];
    }
  }

  set parsedGenre(genre: string[]) {
    this.genre = JSON.stringify(genre);
  }

  // Metadata için getter ve setter
  get parsedMetadata(): Record<string, any> {
    try {
      return JSON.parse(this.metadata || '{}');
    } catch {
      return {};
    }
  }

  set parsedMetadata(metadata: Record<string, any>) {
    this.metadata = JSON.stringify(metadata);
  }

  // Tags için getter ve setter
  get parsedTags(): string[] {
    try {
      return JSON.parse(this.tags || '[]');
    } catch {
      return [];
    }
  }

  set parsedTags(tags: string[]) {
    this.tags = JSON.stringify(tags);
  }
}
