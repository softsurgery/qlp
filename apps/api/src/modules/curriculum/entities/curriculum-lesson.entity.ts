import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { VersionedEntityHelper } from 'src/shared/database/entities/versioned-entity.helper';
import { AbstractUserEntity } from 'src/shared/abstract-user-management/entities/abstract-user.entity';
import { CurriculumStatus } from '../enums/curriculum-status.enum';

@Entity('curriculum_lessons')
export class CurriculumLessonEntity extends VersionedEntityHelper {
  @Index()
  @Column()
  moduleId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: CurriculumStatus, default: CurriculumStatus.Draft })
  status: CurriculumStatus;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ nullable: true })
  createdById?: string;

  @ManyToOne(() => AbstractUserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById' })
  createdBy?: AbstractUserEntity;
}
