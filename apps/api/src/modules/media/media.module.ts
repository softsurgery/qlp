import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserManagementModule } from 'src/modules/user-management/user-management.module';
import { MediaRoomEntity } from './entities/media-room.entity';
import { MediaRoomParticipantEntity } from './entities/media-room-participant.entity';
import { MediaRoomAttendanceEntity } from './entities/media-room-attendance.entity';
import { MediaRecordingEntity } from './entities/media-recording.entity';
import { MediaWebhookEventEntity } from './entities/media-webhook-event.entity';
import { MediaRoomRepository } from './repositories/media-room.repository';
import { MediaRoomParticipantRepository } from './repositories/media-room-participant.repository';
import { MediaRoomAttendanceRepository } from './repositories/media-room-attendance.repository';
import { MediaRecordingRepository } from './repositories/media-recording.repository';
import { MediaWebhookEventRepository } from './repositories/media-webhook-event.repository';
import { MediaTokenService } from './services/media-token.service';
import { MediaRoomService } from './services/media-room.service';
import { MediaRoomParticipantService } from './services/media-room-participant.service';
import { MediaAttendanceService } from './services/media-attendance.service';
import { MediaRecordingService } from './services/media-recording.service';
import { MediaWebhookService } from './services/media-webhook.service';
import { MediaService } from './services/media.service';

@Module({
  providers: [
    MediaRoomRepository,
    MediaRoomParticipantRepository,
    MediaRoomAttendanceRepository,
    MediaRecordingRepository,
    MediaWebhookEventRepository,
    MediaTokenService,
    MediaRoomParticipantService,
    MediaAttendanceService,
    MediaRecordingService,
    MediaRoomService,
    MediaWebhookService,
    MediaService,
  ],
  exports: [
    MediaService,
    MediaRoomService,
    MediaRoomParticipantService,
    MediaAttendanceService,
    MediaRecordingService,
    MediaWebhookService,
    MediaTokenService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      MediaRoomEntity,
      MediaRoomParticipantEntity,
      MediaRoomAttendanceEntity,
      MediaRecordingEntity,
      MediaWebhookEventEntity,
    ]),
    ConfigModule,
    UserManagementModule,
  ],
})
export class MediaModule {}
