import { randomUUID } from 'crypto';
import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { AbstractUserEntity } from 'src/shared/abstract-user-management/entities/abstract-user.entity';
import { MediaRoomStatus } from '../enums/media-room-status.enum';
import { MediaRoomParticipantEntity } from './media-room-participant.entity';

@Entity('media_rooms')
export class MediaRoomEntity extends EntityHelper {
  @PrimaryColumn()
  id: string;

  @BeforeInsert()
  assignId() {
    if (!this.id) {
      this.id = randomUUID();
    }
  }

  @Index({ unique: true })
  @Column()
  roomName: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: MediaRoomStatus, default: MediaRoomStatus.IDLE })
  status: MediaRoomStatus;

  @ManyToOne(() => AbstractUserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hostId' })
  host?: AbstractUserEntity;

  @Index()
  @Column()
  hostId: string;

  @Column({ type: 'timestamp', nullable: true })
  scheduledStartAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  scheduledEndAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  endedAt?: Date;

  @Column({ type: 'int', default: 0 })
  maxParticipants: number;

  @Column({ default: false })
  isRecordingEnabled: boolean;

  @Column({ nullable: true })
  livekitSid?: string;

  @Index()
  @Column({ nullable: true })
  curriculumLessonId?: string;

  @OneToMany(() => MediaRoomParticipantEntity, (participant) => participant.room)
  participants?: MediaRoomParticipantEntity[];
}
