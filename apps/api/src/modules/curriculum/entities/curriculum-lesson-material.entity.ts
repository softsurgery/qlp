import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { VersionedEntityHelper } from 'src/shared/database/entities/versioned-entity.helper';
import { MaterialType } from '../enums/material-type.enum';
import { CurriculumLessonEntity } from './curriculum-lesson.entity';
import { StorageEntity } from 'src/shared/storage/entities/storage.entity';

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

  @ManyToOne(() => StorageEntity, {
    onDelete: 'SET NULL',
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'storageId', referencedColumnName: 'id' })
  storage?: StorageEntity;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;
}
