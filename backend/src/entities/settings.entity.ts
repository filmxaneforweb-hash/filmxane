import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('system_settings')
export class SystemSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'Filmxane' })
  siteName: string;

  @Column({ default: 'Platforma fîlm û rêzefîlman' })
  siteDescription: string;

  @Column({ default: false })
  maintenanceMode: boolean;

  @Column({ default: true })
  allowRegistration: boolean;

  @Column({ default: true })
  allowComments: boolean;

  @Column({ default: 100 })
  maxUploadSize: number;

  @Column({ type: 'simple-array', default: 'mp4,avi,mov,mkv' })
  allowedFileTypes: string[];

  @Column({ default: true })
  emailNotifications: boolean;

  @Column({ default: true })
  pushNotifications: boolean;

  @Column({ default: 'auto' })
  theme: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
