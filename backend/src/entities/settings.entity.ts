import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('system_settings')
export class SystemSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'Filmxane' })
  siteName: string;

  @Column({ default: 'Kurdish Video Platform' })
  siteDescription: string;

  @Column({ default: false })
  maintenanceMode: boolean;

  @Column({ default: true })
  allowRegistrations: boolean;

  @Column({ default: '100MB' })
  maxUploadSize: string;

  @Column({ type: 'text', default: '["MP4", "AVI", "MOV", "MKV"]' })
  supportedVideoFormats: string; // JSON string olarak saklanacak

  @Column({ type: 'text', default: '["JPG", "PNG", "GIF"]' })
  supportedImageFormats: string; // JSON string olarak saklanacak

  @Column({ default: 'ku' })
  defaultLanguage: string;

  @Column({ default: 'Asia/Baghdad' })
  timezone: string;

  @Column({ default: '1.0.0' })
  version: string;

  @Column({ nullable: true })
  serverTime: string;

  @Column({ nullable: true })
  uptime: string;

  @Column({ nullable: true })
  lastBackup: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Getter ve setter metodları
  get parsedVideoFormats(): string[] {
    try {
      return JSON.parse(this.supportedVideoFormats || '[]');
    } catch {
      return ['MP4', 'AVI', 'MOV', 'MKV'];
    }
  }

  set parsedVideoFormats(formats: string[]) {
    this.supportedVideoFormats = JSON.stringify(formats);
  }

  get parsedImageFormats(): string[] {
    try {
      return JSON.parse(this.supportedImageFormats || '[]');
    } catch {
      return ['JPG', 'PNG', 'GIF'];
    }
  }

  set parsedImageFormats(formats: string[]) {
    this.supportedImageFormats = JSON.stringify(formats);
  }
}
