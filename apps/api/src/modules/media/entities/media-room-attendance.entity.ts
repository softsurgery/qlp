import { randomUUID } from 'crypto';
import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, Unique } from 'typeorm';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { MediaRoomEntity } from './media-room.entity';

@Entity('media_room_attendances')
@Unique('UQ_media_attendance_participant', ['mediaRoomId', 'participantSid'])
export class MediaRoomAttendanceEntity extends EntityHelper {
  @PrimaryColumn()
  id: string;

  @BeforeInsert()
  assignId() {
    if (!this.id) {
      this.id = randomUUID();
    }
  }

  @ManyToOne(() => MediaRoomEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mediaRoomId' })
  room?: MediaRoomEntity;

  @Index()
  @Column()
  mediaRoomId: string;

  @Column()
  participantSid: string;

  @Index()
  @Column()
  identity: string;

  @Column({ nullable: true })
  displayName?: string;

  @Column({ type: 'timestamp' })
  joinedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  leftAt?: Date;

  @Column({ type: 'int', nullable: true })
  durationSeconds?: number;
}
