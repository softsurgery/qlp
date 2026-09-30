import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseVersioningAbstractRepository } from 'src/shared/database/repositories/database-versioning.repository';
import { CurriculumLessonEntity } from '../entities/curriculum-lesson.entity';

@Injectable()
export class CurriculumLessonRepository extends DatabaseVersioningAbstractRepository<CurriculumLessonEntity> {
  constructor(
    @InjectRepository(CurriculumLessonEntity)
    private readonly lessonRepository: Repository<CurriculumLessonEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(lessonRepository, txHost);
  }
}
