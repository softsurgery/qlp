import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { VersionedEntityHelper } from 'src/shared/database/entities/versioned-entity.helper';
import { AbstractUserEntity } from 'src/shared/abstract-user-management/entities/abstract-user.entity';
import { CurriculumStatus } from '../enums/curriculum-status.enum';
import { CurriculumModuleEntity } from './curriculum-module.entity';
import { CurriculumLessonMaterialEntity } from './curriculum-lesson-material.entity';

@Entity('curriculum_lessons')
export class CurriculumLessonEntity extends VersionedEntityHelper {
  @Index()
  @Column()
  moduleId: string;

  @ManyToOne(() => CurriculumModuleEntity, (module) => module.lessons, {
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'moduleId', referencedColumnName: 'id' })
  module?: CurriculumModuleEntity;

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

  @OneToMany(() => CurriculumLessonMaterialEntity, (material) => material.lesson, {
    cascade: ['soft-remove', 'recover', 'remove'],
  })
  materials?: CurriculumLessonMaterialEntity[];
}
