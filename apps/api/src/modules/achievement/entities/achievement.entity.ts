import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { AchievementCategory } from '@qlp/shared';

@Entity('achievements')
export class Achievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar' })
  category: AchievementCategory;

  @Column()
  icon: string;

  @Column({ name: 'trigger_event' })
  triggerEvent: string;

  @Column({ name: 'trigger_threshold', default: 1 })
  triggerThreshold: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
