import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { MediaRoomParticipantEntity } from '../entities/media-room-participant.entity';

@Injectable()
export class MediaRoomParticipantRepository extends DatabaseAbstractRepository<MediaRoomParticipantEntity> {
  constructor(
    @InjectRepository(MediaRoomParticipantEntity)
    private readonly mediaRoomParticipantRepository: Repository<MediaRoomParticipantEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(mediaRoomParticipantRepository, txHost);
  }
}
