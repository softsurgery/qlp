import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseVersioningAbstractRepository } from 'src/shared/database/repositories/database-versioning.repository';
import { CurriculumExamEntity } from '../entities/curriculum-exam.entity';

@Injectable()
export class CurriculumExamRepository extends DatabaseVersioningAbstractRepository<CurriculumExamEntity> {
  constructor(
    @InjectRepository(CurriculumExamEntity)
    private readonly examRepository: Repository<CurriculumExamEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(examRepository, txHost);
  }
}
