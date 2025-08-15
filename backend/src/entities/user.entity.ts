import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Subscription } from './subscription.entity';
import { Video } from './video.entity';
import { Favorite } from './favorite.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({
    type: 'varchar',
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    type: 'varchar',
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  lastLoginAt?: Date;

  @Column({ nullable: true })
  emailVerificationToken?: string;

  @Column({ nullable: true })
  passwordResetToken?: string;

  @Column({ nullable: true })
  passwordResetExpires?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => Subscription, (subscription) => subscription.user)
  subscription: Subscription;

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @OneToMany(() => Video, (video) => video.uploadedBy)
  uploadedVideos: Video[];

  // Virtual properties
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  get isModerator(): boolean {
    return this.role === UserRole.MODERATOR || this.role === UserRole.ADMIN;
  }
}
