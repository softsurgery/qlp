import { Injectable, ForbiddenException } from '@nestjs/common';
import { AbstractVersioningCrudService } from 'src/shared/database/services/abstract-versioning-crud.service';
import { CurriculumLessonEntity } from '../entities/curriculum-lesson.entity';
import { CurriculumLessonRepository } from '../repositories/curriculum-lesson.repository';
import { CreateCurriculumLessonDto } from '../dtos/lesson/create-curriculum-lesson.dto';
import { UpdateCurriculumLessonDto } from '../dtos/lesson/update-curriculum-lesson.dto';
import { CurriculumLessonCollaboratorRepository } from '../repositories/curriculum-lesson-collaborator.repository';

@Injectable()
export class CurriculumLessonService extends AbstractVersioningCrudService<CurriculumLessonEntity> {
  constructor(
    private readonly lessonRepository: CurriculumLessonRepository,
    private readonly collaboratorRepository: CurriculumLessonCollaboratorRepository,
  ) {
    super(lessonRepository);
  }

  async addOrUpdateCollaborator(lessonId: string, userId: string, role: string, actorId?: string) {
    if (actorId) {
      await this.assertCanEdit(lessonId, actorId);
    }
    const existing = await this.collaboratorRepository.findOne({
      where: { lessonId, userId },
    });
    if (existing) {
      existing.role = role as any;
      return this.collaboratorRepository.save(existing);
    }
    return this.collaboratorRepository.save(
      this.collaboratorRepository.create({ lessonId, userId, role: role as any }),
    );
  }

  async removeCollaborator(lessonId: string, userId: string, actorId?: string) {
    if (actorId) {
      await this.assertCanEdit(lessonId, actorId);
    }
    const existing = await this.collaboratorRepository.findOne({
      where: { lessonId, userId },
    });
    if (existing) {
      await this.collaboratorRepository.remove(existing);
    }
  }

  async assertCanEdit(id: string, actorId: string) {
    const lesson = await this.findOneById(id);
    if (!lesson) return;
    if (lesson.ownerId === actorId) return;

    const isEditor = await this.collaboratorRepository.findOne({
      where: { lessonId: id, userId: actorId, role: 'EDITOR' as any },
    });

    if (!isEditor) {
      throw new ForbiddenException('You do not have permission to edit this lesson');
    }
  }

  async createForModule(moduleId: string, dto: CreateCurriculumLessonDto) {
    const siblings = await this.findAll({ filter: `moduleId||$eq||${moduleId}` });
    return this.save({
      moduleId,
      title: dto.title,
      description: dto.description,
      sortOrder: dto.sortOrder ?? siblings.length,
      ownerId: dto.ownerId,
    });
  }

  async updateLesson(id: string, dto: UpdateCurriculumLessonDto, actorId?: string) {
    if (actorId) {
      await this.assertCanEdit(id, actorId);
    }
    return this.update(id, dto);
  }

  async softDelete(id: string, actorId?: string): Promise<CurriculumLessonEntity | null> {
    if (actorId) {
      await this.assertCanEdit(id, actorId);
    }
    return super.softDelete(id);
  }

  async findLatestByModule(moduleId: string) {
    return this.findAll({
      filter: `moduleId||$eq||${moduleId}`,
      sort: 'sortOrder',
    });
  }
}
