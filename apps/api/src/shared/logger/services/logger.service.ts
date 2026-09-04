import { Injectable } from '@nestjs/common';
import { LogRepository } from '../repositories/log.repository';
import { LogEntity } from '../entities/log.entity';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';

@Injectable()
export class LoggerService extends AbstractCrudService<LogEntity> {
  constructor(private readonly loggerRepository: LogRepository) {
    super(loggerRepository);
  }
}
