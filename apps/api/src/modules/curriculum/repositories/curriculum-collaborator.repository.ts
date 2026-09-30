import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { CurriculumCollaboratorEntity } from '../entities/curriculum-collaborator.entity';

@Injectable()
export class CurriculumCollaboratorRepository extends DatabaseAbstractRepository<CurriculumCollaboratorEntity> {
  constructor(
    @InjectRepository(CurriculumCollaboratorEntity)
    private readonly repository: Repository<CurriculumCollaboratorEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(repository, txHost);
  }
}
