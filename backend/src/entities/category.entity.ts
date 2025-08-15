import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Video } from './video.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  nameEn?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ nullable: true })
  parentId?: string;

  @Column({ type: 'simple-json', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToMany(() => Video, (video) => video.categories)
  videos: Video[];

  // Virtual properties
  get displayName(): string {
    return this.nameEn || this.name;
  }

  get videoCount(): number {
    return this.videos?.length || 0;
  }
}
