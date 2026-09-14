import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { VersionedEntityHelper } from 'src/shared/database/entities/versioned-entity.helper';
import { MaterialType } from '../enums/material-type.enum';
import { CurriculumLessonEntity } from './curriculum-lesson.entity';

@Entity('curriculum_lesson_materials')
export class CurriculumLessonMaterialEntity extends VersionedEntityHelper {
  @Index()
  @Column()
  lessonId: string;

  @ManyToOne(() => CurriculumLessonEntity, (lesson) => lesson.materials, {
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'lessonId', referencedColumnName: 'id' })
  lesson?: CurriculumLessonEntity;

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
