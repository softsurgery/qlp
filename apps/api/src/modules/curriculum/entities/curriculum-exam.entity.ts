import { Column, Entity, Index } from 'typeorm';
import { VersionedEntityHelper } from 'src/shared/database/entities/versioned-entity.helper';
import { ExamQuestionType } from '../enums/exam-question-type.enum';

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
}
