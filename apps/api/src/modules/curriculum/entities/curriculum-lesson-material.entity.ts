import { Column, Entity, Index } from 'typeorm';
import { VersionedEntityHelper } from 'src/shared/database/entities/versioned-entity.helper';
import { MaterialType } from '../enums/material-type.enum';

@Entity('curriculum_lesson_materials')
export class CurriculumLessonMaterialEntity extends VersionedEntityHelper {
  @Index()
  @Column()
  lessonId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: MaterialType })
  type: MaterialType;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ nullable: true })
  storageId?: number;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;
}
