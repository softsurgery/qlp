import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { LearnerLevel, LearnerGoal } from '@qlp/shared';
import { User } from '../../user/entities/user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'display_name', nullable: true })
  displayName: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ name: 'preferred_language', default: 'en' })
  preferredLanguage: string;

  @Column({ default: 'UTC' })
  timezone: string;

  @Column({ name: 'learner_level', type: 'varchar', nullable: true })
  learnerLevel: LearnerLevel;

  @Column({ name: 'learner_goals', type: 'text', array: true, nullable: true })
  learnerGoals: LearnerGoal[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
