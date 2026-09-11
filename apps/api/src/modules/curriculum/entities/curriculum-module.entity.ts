import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { VersionedEntityHelper } from 'src/shared/database/entities/versioned-entity.helper';
import { AbstractUserEntity } from 'src/shared/abstract-user-management/entities/abstract-user.entity';

@Entity('curriculum_modules')
export class CurriculumModuleEntity extends VersionedEntityHelper {
  @Index()
  @Column()
  curriculumId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ nullable: true })
  ownerId?: string;

  @ManyToOne(() => AbstractUserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ownerId' })
  owner?: AbstractUserEntity;
}
