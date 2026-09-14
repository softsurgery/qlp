import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { VersionedEntityHelper } from 'src/shared/database/entities/versioned-entity.helper';
import { AbstractUserEntity } from 'src/shared/abstract-user-management/entities/abstract-user.entity';
import { ExamQuestionType } from '../enums/exam-question-type.enum';
import { CurriculumModuleEntity } from './curriculum-module.entity';

export interface ExamQuestion {
  id: string;
  prompt: string;
  type: ExamQuestionType;
  options?: string[];
  answer?: string;
  points: number;
}

@Entity('curriculum_exams')
export class CurriculumExamEntity extends VersionedEntityHelper {
  @Index()
  @Column()
  moduleId: string;

  @ManyToOne(() => CurriculumModuleEntity, (module) => module.exams, {
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'moduleId', referencedColumnName: 'id' })
  module?: CurriculumModuleEntity;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int', nullable: true })
  durationMinutes?: number;

  @Column({ type: 'int', default: 0 })
  passingScore: number;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  questions: ExamQuestion[];

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ nullable: true })
  createdById?: string;

  @ManyToOne(() => AbstractUserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById' })
  createdBy?: AbstractUserEntity;
}
