import { randomUUID } from 'crypto';
import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { MediaRoomEntity } from './media-room.entity';
import { MediaRecordingStatus } from '../enums/media-recording-status.enum';

@Entity('media_recordings')
export class MediaRecordingEntity extends EntityHelper {
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
  egressId: string;

  @ManyToOne(() => MediaRoomEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'mediaRoomId' })
  room?: MediaRoomEntity;

  @Index()
  @Column({ nullable: true })
  mediaRoomId?: string;

  @Index()
  @Column()
  roomName: string;

  @Column({ type: 'enum', enum: MediaRecordingStatus, default: MediaRecordingStatus.PENDING })
  status: MediaRecordingStatus;

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  endedAt?: Date;

  @Column({ type: 'int', nullable: true })
  durationSeconds?: number;

  @Column({ nullable: true })
  filename?: string;

  @Column({ type: 'text', nullable: true })
  fileUrl?: string;

  @Column({ type: 'bigint', nullable: true })
  sizeBytes?: string;

  @Column({ type: 'text', nullable: true })
  error?: string;
}
