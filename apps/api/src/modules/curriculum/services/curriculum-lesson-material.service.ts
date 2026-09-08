import { Injectable } from '@nestjs/common';
import { AbstractVersioningCrudService } from 'src/shared/database/services/abstract-versioning-crud.service';
import { CurriculumLessonMaterialEntity } from '../entities/curriculum-lesson-material.entity';
import { CurriculumLessonMaterialRepository } from '../repositories/curriculum-lesson-material.repository';
import { CreateCurriculumMaterialDto } from '../dtos/material/create-curriculum-material.dto';
import { UpdateCurriculumMaterialDto } from '../dtos/material/update-curriculum-material.dto';

@Injectable()
export class CurriculumLessonMaterialService extends AbstractVersioningCrudService<CurriculumLessonMaterialEntity> {
  constructor(private readonly materialRepository: CurriculumLessonMaterialRepository) {
    super(materialRepository);
  }

  async createForLesson(lessonId: string, dto: CreateCurriculumMaterialDto) {
    const siblings = await this.findAll({ filter: `lessonId||$eq||${lessonId}` });
    return this.save({
      lessonId,
      title: dto.title,
      description: dto.description,
      type: dto.type,
      content: dto.content,
      storageId: dto.storageId,
      sortOrder: dto.sortOrder ?? siblings.length,
    });
  }

  async updateMaterial(id: string, dto: UpdateCurriculumMaterialDto) {
    return this.update(id, dto);
  }

  async findLatestByLesson(lessonId: string) {
    return this.findAll({
      filter: `lessonId||$eq||${lessonId}`,
      sort: 'sortOrder',
    });
  }
}
