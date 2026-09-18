import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaRoomEntity } from './entities/media-room.entity';
import { MediaRoomParticipantEntity } from './entities/media-room-participant.entity';
import { MediaRoomRepository } from './repositories/media-room.repository';
import { MediaRoomParticipantRepository } from './repositories/media-room-participant.repository';
import { MediaTokenService } from './services/media-token.service';

@Module({
  providers: [
    MediaRoomRepository,
    MediaRoomParticipantRepository,
    MediaTokenService,
  ],
  exports: [
    MediaTokenService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      MediaRoomEntity,
      MediaRoomParticipantEntity,
    ]),
    ConfigModule,
  ],
})
export class MediaModule {}
