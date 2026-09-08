import { Column, Entity, Index } from 'typeorm';
import { VersionedEntityHelper } from 'src/shared/database/entities/versioned-entity.helper';

@Entity('curriculum_lessons')
export class CurriculumLessonEntity extends VersionedEntityHelper {
  @Index()
  @Column()
  moduleId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;
}
