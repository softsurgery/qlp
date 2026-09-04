import { AbstractUserEntity } from 'src/shared/abstract-user-management/entities/abstract-user.entity';
import { Gender } from 'src/modules/user-management/enums/gender.enum';
import { ChildEntity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { StorageEntity } from 'src/shared/storage/entities/storage.entity';

@ChildEntity()
export class UserEntity extends AbstractUserEntity {
  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender?: Gender;

  @ManyToOne(() => StorageEntity, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'pictureId' })
  picture?: StorageEntity;

  @Column({ nullable: true })
  pictureId?: number;
}
