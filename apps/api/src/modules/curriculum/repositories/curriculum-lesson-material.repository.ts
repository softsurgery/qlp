import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseVersioningAbstractRepository } from 'src/shared/database/repositories/database-versioning.repository';
import { CurriculumLessonMaterialEntity } from '../entities/curriculum-lesson-material.entity';

@Injectable()
export class CurriculumLessonMaterialRepository extends DatabaseVersioningAbstractRepository<CurriculumLessonMaterialEntity> {
  constructor(
    @InjectRepository(CurriculumLessonMaterialEntity)
    private readonly materialRepository: Repository<CurriculumLessonMaterialEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(materialRepository, txHost);
  }
}
