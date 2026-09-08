import { Injectable } from '@nestjs/common';
import { AbstractVersioningCrudService } from 'src/shared/database/services/abstract-versioning-crud.service';
import { CurriculumLessonEntity } from '../entities/curriculum-lesson.entity';
import { CurriculumLessonRepository } from '../repositories/curriculum-lesson.repository';
import { CreateCurriculumLessonDto } from '../dtos/lesson/create-curriculum-lesson.dto';
import { UpdateCurriculumLessonDto } from '../dtos/lesson/update-curriculum-lesson.dto';

@Injectable()
export class CurriculumLessonService extends AbstractVersioningCrudService<CurriculumLessonEntity> {
  constructor(private readonly lessonRepository: CurriculumLessonRepository) {
    super(lessonRepository);
  }

  async createForModule(moduleId: string, dto: CreateCurriculumLessonDto) {
    const siblings = await this.findAll({ filter: `moduleId||$eq||${moduleId}` });
    return this.save({
      moduleId,
      title: dto.title,
      description: dto.description,
      sortOrder: dto.sortOrder ?? siblings.length,
    });
  }

  async updateLesson(id: string, dto: UpdateCurriculumLessonDto) {
    return this.update(id, dto);
  }

  async findLatestByModule(moduleId: string) {
    return this.findAll({
      filter: `moduleId||$eq||${moduleId}`,
      sort: 'sortOrder',
    });
  }
}
