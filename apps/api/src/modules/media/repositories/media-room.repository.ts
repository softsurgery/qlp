import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { MediaRoomEntity } from '../entities/media-room.entity';

@Injectable()
export class MediaRoomRepository extends DatabaseAbstractRepository<MediaRoomEntity> {
  constructor(
    @InjectRepository(MediaRoomEntity)
    private readonly mediaRoomRepository: Repository<MediaRoomEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(mediaRoomRepository, txHost);
  }
}
