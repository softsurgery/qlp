import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { TemplateRepository } from '../repositories/template.repository';
import { TemplateEntity } from '../entities/template.entity';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';

@Injectable()
export class TemplateService extends AbstractCrudService<TemplateEntity> {
  constructor(private readonly templateRepository: TemplateRepository) {
    super(templateRepository);
  }

  @Transactional()
  async save(template: Partial<TemplateEntity>): Promise<TemplateEntity> {
    const existingTemplate = await this.findOneByName(template.name);

    if (existingTemplate) {
      Object.assign(existingTemplate, template);
      return this.templateRepository.save(existingTemplate);
    }

    const templateInstance = this.templateRepository.create(template);
    return await this.templateRepository.save(templateInstance);
  }

  async saveMany(templates: Partial<TemplateEntity>[]): Promise<TemplateEntity[]> {
    return this.templateRepository.saveMany(templates);
  }

  //Extended Methods ===========================================================================

  async findOneByName(name?: string): Promise<TemplateEntity | null> {
    return this.templateRepository.findOne({
      where: { name },
      relations: ['styles'],
    });
  }
}
