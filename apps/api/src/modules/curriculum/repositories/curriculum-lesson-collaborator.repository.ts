import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { CurriculumLessonCollaboratorEntity } from '../entities/curriculum-lesson-collaborator.entity';

@Injectable()
export class CurriculumLessonCollaboratorRepository extends DatabaseAbstractRepository<CurriculumLessonCollaboratorEntity> {
  constructor(
    @InjectRepository(CurriculumLessonCollaboratorEntity)
    private readonly repository: Repository<CurriculumLessonCollaboratorEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(repository, txHost);
  }
}
