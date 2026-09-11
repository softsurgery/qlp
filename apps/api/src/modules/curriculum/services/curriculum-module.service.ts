import { Injectable, ForbiddenException } from '@nestjs/common';
import { AbstractVersioningCrudService } from 'src/shared/database/services/abstract-versioning-crud.service';
import { CurriculumModuleEntity } from '../entities/curriculum-module.entity';
import { CurriculumModuleRepository } from '../repositories/curriculum-module.repository';
import { CreateCurriculumModuleDto } from '../dtos/module/create-curriculum-module.dto';
import { UpdateCurriculumModuleDto } from '../dtos/module/update-curriculum-module.dto';
import { CurriculumModuleCollaboratorRepository } from '../repositories/curriculum-module-collaborator.repository';

@Injectable()
export class CurriculumModuleService extends AbstractVersioningCrudService<CurriculumModuleEntity> {
  constructor(
    private readonly moduleRepository: CurriculumModuleRepository,
    private readonly collaboratorRepository: CurriculumModuleCollaboratorRepository,
  ) {
    super(moduleRepository);
  }

  async addOrUpdateCollaborator(moduleId: string, userId: string, role: string, actorId?: string) {
    if (actorId) {
      await this.assertCanEdit(moduleId, actorId);
    }
    const existing = await this.collaboratorRepository.findOne({
      where: { moduleId, userId },
    });
    if (existing) {
      existing.role = role as any;
      return this.collaboratorRepository.save(existing);
    }
    return this.collaboratorRepository.save(
      this.collaboratorRepository.create({ moduleId, userId, role: role as any }),
    );
  }

  async removeCollaborator(moduleId: string, userId: string, actorId?: string) {
    if (actorId) {
      await this.assertCanEdit(moduleId, actorId);
    }
    const existing = await this.collaboratorRepository.findOne({
      where: { moduleId, userId },
    });
    if (existing) {
      await this.collaboratorRepository.remove(existing);
    }
  }

  async assertCanEdit(id: string, actorId: string) {
    const module = await this.findOneById(id);
    if (!module) return;
    if (module.ownerId === actorId) return;

    const isEditor = await this.collaboratorRepository.findOne({
      where: { moduleId: id, userId: actorId, role: 'EDITOR' as any },
    });

    if (!isEditor) {
      throw new ForbiddenException('You do not have permission to edit this module');
    }
  }

  async createForCurriculum(curriculumId: string, dto: CreateCurriculumModuleDto) {
    const siblings = await this.findAll({ filter: `curriculumId||$eq||${curriculumId}` });
    const sortOrder = dto.sortOrder ?? siblings.length;
    return this.save({
      curriculumId,
      title: dto.title,
      description: dto.description,
      sortOrder,
      ownerId: dto.ownerId,
    });
  }

  async updateModule(id: string, dto: UpdateCurriculumModuleDto, actorId?: string) {
    if (actorId) {
      await this.assertCanEdit(id, actorId);
    }
    return this.update(id, dto);
  }

  async softDelete(id: string, actorId?: string): Promise<CurriculumModuleEntity | null> {
    if (actorId) {
      await this.assertCanEdit(id, actorId);
    }
    return super.softDelete(id);
  }

  async findLatestByCurriculum(curriculumId: string) {
    const modules = await this.findAll({
      filter: `curriculumId||$eq||${curriculumId}`,
      sort: 'sortOrder',
    });
    return modules;
  }
}
