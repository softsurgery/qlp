import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { CurriculumModuleCollaboratorEntity } from '../entities/curriculum-module-collaborator.entity';

@Injectable()
export class CurriculumModuleCollaboratorRepository extends DatabaseAbstractRepository<CurriculumModuleCollaboratorEntity> {
  constructor(
    @InjectRepository(CurriculumModuleCollaboratorEntity)
    private readonly repository: Repository<CurriculumModuleCollaboratorEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(repository, txHost);
  }
}
