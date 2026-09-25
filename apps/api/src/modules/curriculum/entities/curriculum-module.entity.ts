import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { VersionedEntityHelper } from 'src/shared/database/entities/versioned-entity.helper';
import { AbstractUserEntity } from 'src/shared/abstract-user-management/entities/abstract-user.entity';
import { CurriculumStatus } from '../enums/curriculum-status.enum';
import { CurriculumEntity } from './curriculum.entity';
import { CurriculumLessonEntity } from './curriculum-lesson.entity';
import { CurriculumExamEntity } from './curriculum-exam.entity';

@Entity('curriculum_modules')
export class CurriculumModuleEntity extends VersionedEntityHelper {
  @Index()
  @Column()
  curriculumId: string;

  @ManyToOne(() => CurriculumEntity, (curriculum) => curriculum.modules, {
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'curriculumId', referencedColumnName: 'id' })
  curriculum?: CurriculumEntity;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: CurriculumStatus, default: CurriculumStatus.Draft })
  status: CurriculumStatus;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ nullable: true })
  ownerId?: string;

  @ManyToOne(() => AbstractUserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ownerId' })
  owner?: AbstractUserEntity;

  @Column({ nullable: true })
  createdById?: string;

  @ManyToOne(() => AbstractUserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById' })
  createdBy?: AbstractUserEntity;

  @OneToMany(() => CurriculumLessonEntity, (lesson) => lesson.module, {
    cascade: ['soft-remove', 'recover', 'remove'],
  })
  lessons?: CurriculumLessonEntity[];

  @OneToMany(() => CurriculumExamEntity, (exam) => exam.module, {
    cascade: ['soft-remove', 'recover', 'remove'],
  })
  exams?: CurriculumExamEntity[];
}
