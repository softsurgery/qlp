import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { MediaRecordingEntity } from '../entities/media-recording.entity';

@Injectable()
export class MediaRecordingRepository extends DatabaseAbstractRepository<MediaRecordingEntity> {
  constructor(
    @InjectRepository(MediaRecordingEntity)
    private readonly recordingRepository: Repository<MediaRecordingEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(recordingRepository, txHost);
  }
}
