import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('settings')
export class Settings {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  key: string

  @Column('text')
  value: string

  @Column({ default: 'string' })
  type: 'string' | 'number' | 'boolean' | 'json'

  @Column({ default: true })
  isActive: boolean

  @Column({ nullable: true })
  description: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
