import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Subscription } from './subscription.entity';

export enum FeatureType {
  VIDEO_QUALITY = 'video_quality',
  DOWNLOAD = 'download',
  OFFLINE_WATCHING = 'offline_watching',
  PROFILES = 'profiles',
  AD_FREE = 'ad_free',
  EXCLUSIVE_CONTENT = 'exclusive_content',
  MULTI_DEVICE = 'multi_device',
  CUSTOM_SUBTITLES = 'custom_subtitles',
  AUDIO_TRACKS = 'audio_tracks',
  PARENTAL_CONTROL = 'parental_control',
}

export enum FeatureValueType {
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  STRING = 'string',
}

@Entity('features')
export class Feature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    enum: FeatureType,
  })
  type: FeatureType;

  @Column({
    type: 'varchar',
    enum: FeatureValueType,
  })
  valueType: FeatureValueType;

  @Column({ type: 'text' })
  value: string; // JSON string olarak saklanacak

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Subscription, (subscription) => subscription.features, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subscriptionId' })
  subscription: Subscription;

  @Column()
  subscriptionId: string;

  // Virtual properties
  get parsedValue(): boolean | number | string {
    try {
      return JSON.parse(this.value);
    } catch {
      return this.value;
    }
  }

  get displayName(): string {
    const names = {
      [FeatureType.VIDEO_QUALITY]: 'Kalîteya Vîdyoyê',
      [FeatureType.DOWNLOAD]: 'Daxistin',
      [FeatureType.OFFLINE_WATCHING]: 'Temaşekirina Offline',
      [FeatureType.PROFILES]: 'Profîlên',
      [FeatureType.AD_FREE]: 'Bê Reklam',
      [FeatureType.EXCLUSIVE_CONTENT]: 'Naveroka Taybet',
      [FeatureType.MULTI_DEVICE]: 'Çend Cîhaz',
      [FeatureType.CUSTOM_SUBTITLES]: 'Altyaziyên Taybet',
      [FeatureType.AUDIO_TRACKS]: 'Rêzikên Dengê',
      [FeatureType.PARENTAL_CONTROL]: 'Kontrola Dê û Bav',
    };
    return names[this.type] || this.type;
  }

  get displayValue(): string {
    if (this.valueType === FeatureValueType.BOOLEAN) {
      return this.parsedValue ? 'Hêye' : 'Nîne';
    }
    if (this.valueType === FeatureValueType.NUMBER) {
      return this.parsedValue.toString();
    }
    return this.parsedValue as string;
  }
}
