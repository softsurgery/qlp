import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BookingStatus } from '@qlp/shared';
import { TutorProfile } from '../../tutor/entities/tutor-profile.entity';
import { User } from '../../user/entities/user.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tutor_id' })
  tutorId: string;

  @ManyToOne(() => TutorProfile)
  @JoinColumn({ name: 'tutor_id' })
  tutor: TutorProfile;

  @Column({ name: 'student_id' })
  studentId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @Column({ name: 'start_time', type: 'timestamptz' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamptz' })
  endTime: Date;

  @Column({ type: 'varchar', default: BookingStatus.REQUESTED })
  status: BookingStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'video_room_url', nullable: true })
  videoRoomUrl: string;

  @Column({ name: 'video_room_name', nullable: true })
  videoRoomName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
