import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseVersioningAbstractRepository } from 'src/shared/database/repositories/database-versioning.repository';
import { CurriculumEntity } from '../entities/curriculum.entity';

@Injectable()
export class CurriculumRepository extends DatabaseVersioningAbstractRepository<CurriculumEntity> {
  constructor(
    @InjectRepository(CurriculumEntity)
    private readonly curriculumRepository: Repository<CurriculumEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(curriculumRepository, txHost);
  }
}
