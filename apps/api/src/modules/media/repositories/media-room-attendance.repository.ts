import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { MediaRoomAttendanceEntity } from '../entities/media-room-attendance.entity';

@Injectable()
export class MediaRoomAttendanceRepository extends DatabaseAbstractRepository<MediaRoomAttendanceEntity> {
  constructor(
    @InjectRepository(MediaRoomAttendanceEntity)
    private readonly attendanceRepository: Repository<MediaRoomAttendanceEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(attendanceRepository, txHost);
  }
}
