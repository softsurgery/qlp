import { Injectable } from '@nestjs/common';
import { AbstractVersioningCrudService } from 'src/shared/database/services/abstract-versioning-crud.service';
import { CurriculumModuleEntity } from '../entities/curriculum-module.entity';
import { CurriculumModuleRepository } from '../repositories/curriculum-module.repository';
import { CreateCurriculumModuleDto } from '../dtos/module/create-curriculum-module.dto';
import { UpdateCurriculumModuleDto } from '../dtos/module/update-curriculum-module.dto';

@Injectable()
export class CurriculumModuleService extends AbstractVersioningCrudService<CurriculumModuleEntity> {
  constructor(private readonly moduleRepository: CurriculumModuleRepository) {
    super(moduleRepository);
  }

  async createForCurriculum(curriculumId: string, dto: CreateCurriculumModuleDto) {
    const siblings = await this.findAll({ filter: `curriculumId||$eq||${curriculumId}` });
    const sortOrder = dto.sortOrder ?? siblings.length;
    return this.save({
      curriculumId,
      title: dto.title,
      description: dto.description,
      sortOrder,
    });
  }

  async updateModule(id: string, dto: UpdateCurriculumModuleDto) {
    return this.update(id, dto);
  }

  async findLatestByCurriculum(curriculumId: string) {
    const modules = await this.findAll({
      filter: `curriculumId||$eq||${curriculumId}`,
      sort: 'sortOrder',
    });
    return modules;
  }
}
