import { ConflictException, Injectable, ForbiddenException } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { AbstractVersioningCrudService } from 'src/shared/database/services/abstract-versioning-crud.service';
import { CurriculumEntity } from '../entities/curriculum.entity';
import { CurriculumRepository } from '../repositories/curriculum.repository';
import { CurriculumStatus } from '../enums/curriculum-status.enum';
import { CreateCurriculumDto } from '../dtos/curriculum/create-curriculum.dto';
import { UpdateCurriculumDto } from '../dtos/curriculum/update-curriculum.dto';
import { CurriculumModuleService } from './curriculum-module.service';
import { CurriculumLessonService } from './curriculum-lesson.service';
import { CurriculumLessonMaterialService } from './curriculum-lesson-material.service';
import { CurriculumExamService } from './curriculum-exam.service';
import { CurriculumCollaboratorRepository } from '../repositories/curriculum-collaborator.repository';

@Injectable()
export class CurriculumService extends AbstractVersioningCrudService<CurriculumEntity> {
  constructor(
    private readonly curriculumRepository: CurriculumRepository,
    private readonly moduleService: CurriculumModuleService,
    private readonly lessonService: CurriculumLessonService,
    private readonly materialService: CurriculumLessonMaterialService,
    private readonly examService: CurriculumExamService,
    private readonly collaboratorRepository: CurriculumCollaboratorRepository,
  ) {
    super(curriculumRepository);
  }

  async addOrUpdateCollaborator(
    curriculumId: string,
    userId: string,
    role: string,
    actorId?: string,
  ) {
    if (actorId) {
      await this.assertCanEdit(curriculumId, actorId);
    }
    const existing = await this.collaboratorRepository.findOne({
      where: { curriculumId, userId },
    });
    if (existing) {
      existing.role = role as any;
      return this.collaboratorRepository.save(existing);
    }
    return this.collaboratorRepository.save(
      this.collaboratorRepository.create({ curriculumId, userId, role: role as any }),
    );
  }

  async removeCollaborator(curriculumId: string, userId: string, actorId?: string) {
    if (actorId) {
      await this.assertCanEdit(curriculumId, actorId);
    }
    const existing = await this.collaboratorRepository.findOne({
      where: { curriculumId, userId },
    });
    if (existing) {
      await this.collaboratorRepository.remove(existing);
    }
  }

  private slugify(value: string) {
    const slug = value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return slug || `curriculum-${Date.now()}`;
  }

  private async assertUniqueSlug(slug: string, excludeId?: string) {
    const existing = await this.findOneByCondition({
      filter: `slug||$eq||${slug}`,
    });
    if (existing && existing.id !== excludeId) {
      throw new ConflictException(`Curriculum slug "${slug}" is already in use`);
    }
  }

  async assertCanEdit(id: string, actorId: string) {
    const curriculum = await this.findOneById(id);
    if (!curriculum) return;
    if (curriculum.ownerId === actorId) return;

    const isEditor = await this.collaboratorRepository.findOne({
      where: { curriculumId: id, userId: actorId, role: 'EDITOR' as any },
    });

    if (!isEditor) {
      throw new ForbiddenException('You do not have permission to edit this curriculum');
    }
  }

  async createCurriculum(dto: CreateCurriculumDto) {
    const slug = this.slugify(dto.slug || dto.title);
    await this.assertUniqueSlug(slug);
    return this.save({
      title: dto.title,
      slug,
      description: dto.description,
      status: dto.status ?? CurriculumStatus.Draft,
      ownerId: dto.ownerId,
    });
  }

  async updateCurriculum(id: string, dto: UpdateCurriculumDto, actorId?: string) {
    if (actorId) {
      await this.assertCanEdit(id, actorId);
    }
    const latest = await this.findOneById(id);
    const slug = dto.slug ? this.slugify(dto.slug) : latest.slug;
    await this.assertUniqueSlug(slug, id);
    return this.update(id, {
      ...dto,
      slug,
    });
  }

  async getTree(id: string, version?: number) {
    const curriculum =
      version != null ? await this.findOneByVersion(id, version) : await this.findOneById(id);
    const modules = await this.moduleService.findLatestByCurriculum(id);

    const nestedModules = await Promise.all(
      modules.map(async (module) => {
        const [lessons, exams] = await Promise.all([
          this.lessonService.findLatestByModule(module.id),
          this.examService.findLatestByModule(module.id),
        ]);

        const lessonsWithMaterials = await Promise.all(
          lessons.map(async (lesson) => ({
            ...lesson,
            materials: await this.materialService.findLatestByLesson(lesson.id),
          })),
        );

        return {
          ...module,
          lessons: lessonsWithMaterials,
          exams,
        };
      }),
    );

    return {
      ...curriculum,
      modules: nestedModules,
    };
  }

  @Transactional()
  async softDeleteTree(id: string, actorId?: string) {
    if (actorId) {
      await this.assertCanEdit(id, actorId);
    }
    const modules = await this.moduleService.findLatestByCurriculum(id);
    await Promise.all(
      modules.map(async (module) => {
        const [lessons, exams] = await Promise.all([
          this.lessonService.findLatestByModule(module.id),
          this.examService.findLatestByModule(module.id),
        ]);

        await Promise.all(
          lessons.map(async (lesson) => {
            const materials = await this.materialService.findLatestByLesson(lesson.id);
            await Promise.all(
              materials.map((material) => this.materialService.softDelete(material.id)),
            );
            await this.lessonService.softDelete(lesson.id);
          }),
        );

        await Promise.all(exams.map((exam) => this.examService.softDelete(exam.id)));
        await this.moduleService.softDelete(module.id);
      }),
    );

    return this.softDelete(id);
  }
}
