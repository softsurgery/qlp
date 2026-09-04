import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractUserEntity } from 'src/shared/abstract-user-management/entities/abstract-user.entity';
import { NotificationType } from 'src/app/enums/notification-type.enum';

@Entity('notification')
export class NotificationEntity extends EntityHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'enum', enum: NotificationType, nullable: true })
  type: NotificationType;

  @ManyToOne(() => AbstractUserEntity, (user) => user.notifications, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: AbstractUserEntity;

  @Column({ nullable: true })
  userId?: string;

  @Column({ type: 'json', nullable: true })
  payload?: object;

  @Column({
    type: 'timestamp',
    precision: 3,
    nullable: true,
  })
  readAt?: Date;
}
