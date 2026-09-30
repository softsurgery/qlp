import { randomUUID } from 'crypto';
import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, Unique } from 'typeorm';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { AbstractUserEntity } from 'src/shared/abstract-user-management/entities/abstract-user.entity';
import { MediaRoomEntity } from './media-room.entity';
import { ParticipantRole } from '../enums/participant-role.enum';

@Entity('media_room_participants')
@Unique('UQ_media_room_participant', ['roomId', 'userId'])
export class MediaRoomParticipantEntity extends EntityHelper {
  @PrimaryColumn()
  id: string;

  @BeforeInsert()
  assignId() {
    if (!this.id) {
      this.id = randomUUID();
    }
  }

  @ManyToOne(() => MediaRoomEntity, (room) => room.participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  room?: MediaRoomEntity;

  @Index()
  @Column()
  roomId: string;

  @ManyToOne(() => AbstractUserEntity, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'userId' })
  user?: AbstractUserEntity;

  @Index()
  @Column()
  userId: string;

  @Column({ type: 'enum', enum: ParticipantRole, default: ParticipantRole.STUDENT })
  role: ParticipantRole;

  @Column({ type: 'timestamp', nullable: true })
  lastJoinedAt?: Date;
}
