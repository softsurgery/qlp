import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { TemplateStyleRepository } from '../repositories/template-style.repository';
import { TemplateStyleEntity } from '../entities/template-style.entity';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';

@Injectable()
export class TemplateStyleService extends AbstractCrudService<TemplateStyleEntity> {
  constructor(private readonly templateStyleRepository: TemplateStyleRepository) {
    super(templateStyleRepository);
  }

  @Transactional()
  async save(style: Partial<TemplateStyleEntity>): Promise<TemplateStyleEntity> {
    const existingStyle = await this.findOneByName(style.name);
    if (existingStyle) {
      return this.templateStyleRepository.save({
        ...existingStyle,
        ...style,
      });
    }
    return this.templateStyleRepository.save(style);
  }

  async saveMany(styles: Partial<TemplateStyleEntity>[]): Promise<TemplateStyleEntity[]> {
    return this.templateStyleRepository.saveMany(styles);
  }

  //Extended Methods ===========================================================================

  async findOneByName(name?: string): Promise<TemplateStyleEntity | null> {
    return this.templateStyleRepository.findOne({ where: { name } });
  }
}
