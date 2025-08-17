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

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  nameKurdish?: string;

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

  @Column({ type: 'text', nullable: true })
  metadata?: string; // simple-json yerine text kullanıyoruz

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
}
