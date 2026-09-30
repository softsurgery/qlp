import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { WebhookEventStatus } from '../enums/webhook-event-status.enum';

@Entity('media_webhook_events')
export class MediaWebhookEventEntity extends EntityHelper {
  @PrimaryColumn()
  id: string;

  @Index()
  @Column()
  event: string;

  @Index()
  @Column({ nullable: true })
  roomName?: string;

  @Column({ nullable: true })
  mediaRoomId?: string;

  @Column({ type: 'enum', enum: WebhookEventStatus, default: WebhookEventStatus.PROCESSING })
  status: WebhookEventStatus;

  @Column({ type: 'timestamp', nullable: true })
  emittedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  processedAt?: Date;

  @Column({ type: 'int', default: 0 })
  attempts: number;

  @Column({ type: 'text', nullable: true })
  error?: string | null;
}
