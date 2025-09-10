import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Video } from './video.entity';

export enum SubtitleFormat {
  SRT = 'srt',
  VTT = 'vtt',
  ASS = 'ass',
  SSA = 'ssa',
}

@Entity('subtitles')
export class Subtitle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  language: string; // 'tr', 'en', 'ku', etc.

  @Column()
  languageName: string; // 'Türkçe', 'English', 'Kurdish', etc.

  @Column({
    type: 'varchar',
    default: SubtitleFormat.SRT,
  })
  format: SubtitleFormat;

  @Column()
  fileUrl: string; // Subtitle dosyasının URL'i

  @Column({ nullable: true })
  filePath?: string; // Server'daki dosya yolu

  @Column({ default: true })
  isDefault: boolean; // Varsayılan altyazı mı?

  @Column({ default: true })
  isActive: boolean; // Aktif mi?

  @Column({ nullable: true })
  description?: string; // Açıklama

  @Column({ default: 0 })
  downloadCount: number; // İndirme sayısı

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Video, (video) => video.subtitles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'videoId' })
  video: Video;

  @Column()
  videoId: string;

  // Virtual properties
  get fileExtension(): string {
    return this.format.toUpperCase();
  }

  get isSRT(): boolean {
    return this.format === SubtitleFormat.SRT;
  }

  get isVTT(): boolean {
    return this.format === SubtitleFormat.VTT;
  }

  get isASS(): boolean {
    return this.format === SubtitleFormat.ASS || this.format === SubtitleFormat.SSA;
  }
}
