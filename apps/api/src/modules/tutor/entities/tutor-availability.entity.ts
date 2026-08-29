import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TutorProfile } from './tutor-profile.entity';

@Entity('tutor_availability')
export class TutorAvailability {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tutor_id' })
  tutorId: string;

  @ManyToOne(() => TutorProfile, (t) => t.availability)
  @JoinColumn({ name: 'tutor_id' })
  tutor: TutorProfile;

  @Column({ name: 'day_of_week' })
  dayOfWeek: number;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({ default: 'UTC' })
  timezone: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
