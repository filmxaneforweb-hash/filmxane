import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Feature } from './feature.entity';

export enum SubscriptionPlan {
  BASIC = 'basic',
  PREMIUM = 'premium',
  FAMILY = 'family',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  PENDING = 'pending',
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    default: SubscriptionPlan.BASIC,
  })
  plan: SubscriptionPlan;

  @Column({
    type: 'varchar',
    default: SubscriptionStatus.PENDING,
  })
  status: SubscriptionStatus;

  @Column({
    type: 'varchar',
    default: BillingCycle.MONTHLY,
  })
  billingCycle: BillingCycle;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  stripeSubscriptionId?: string;

  @Column({ nullable: true })
  stripeCustomerId?: string;

  @Column({ nullable: true })
  stripePriceId?: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ nullable: true })
  cancelledAt?: Date;

  @Column({ nullable: true })
  cancellationReason?: string;

  @Column({ default: false })
  autoRenew: boolean;

  @Column({ default: 0 })
  maxProfiles: number;

  @Column({ default: 0 })
  maxQuality: number; // 0: SD, 1: HD, 2: Full HD, 3: UHD

  @Column({ default: false })
  canDownload: boolean;

  @Column({ default: false })
  canWatchOffline: boolean;

  // Features are now stored in separate Feature entity
  // @Column({ type: 'jsonb', nullable: true })
  // features: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => User, (user) => user.subscription)
  @JoinColumn()
  user: User;

  @OneToMany(() => Feature, (feature) => feature.subscription, {
    cascade: true,
    eager: false,
  })
  features: Feature[];

  // Virtual properties
  get isActive(): boolean {
    return this.status === SubscriptionStatus.ACTIVE && new Date() <= this.endDate;
  }

  get isExpired(): boolean {
    return new Date() > this.endDate;
  }

  get daysUntilExpiry(): number {
    const now = new Date();
    const expiry = new Date(this.endDate);
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get formattedAmount(): string {
    return `$${this.amount.toFixed(2)}`;
  }

  get planDisplayName(): string {
    const planNames = {
      [SubscriptionPlan.BASIC]: 'Bingehîn',
      [SubscriptionPlan.PREMIUM]: 'Premium',
      [SubscriptionPlan.FAMILY]: 'Malbat',
    };
    return planNames[this.plan] || this.plan;
  }

  get billingCycleDisplayName(): string {
    const cycleNames = {
      [BillingCycle.MONTHLY]: 'Mehane',
      [BillingCycle.YEARLY]: 'Salane',
    };
    return cycleNames[this.billingCycle] || this.billingCycle;
  }
}
