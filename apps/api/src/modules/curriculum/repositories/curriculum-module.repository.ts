import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseVersioningAbstractRepository } from 'src/shared/database/repositories/database-versioning.repository';
import { CurriculumModuleEntity } from '../entities/curriculum-module.entity';

@Injectable()
export class CurriculumModuleRepository extends DatabaseVersioningAbstractRepository<CurriculumModuleEntity> {
  constructor(
    @InjectRepository(CurriculumModuleEntity)
    private readonly moduleRepository: Repository<CurriculumModuleEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(moduleRepository, txHost);
  }
}
