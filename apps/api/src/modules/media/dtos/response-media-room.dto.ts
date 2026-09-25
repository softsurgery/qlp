import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { MediaRoomStatus } from '../enums/media-room-status.enum';

export class ResponseMediaRoomDto extends ResponseDtoHelper {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  roomName: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty({ required: false })
  @Expose()
  description?: string;

  @ApiProperty({ enum: MediaRoomStatus })
  @Expose()
  status: MediaRoomStatus;

  @ApiProperty()
  @Expose()
  hostId: string;

  @ApiProperty({ required: false })
  @Expose()
  hostName?: string;

  @ApiProperty({ required: false, type: Date })
  @Expose()
  scheduledStartAt?: Date;

  @ApiProperty({ required: false, type: Date })
  @Expose()
  scheduledEndAt?: Date;

  @ApiProperty({ required: false, type: Date })
  @Expose()
  startedAt?: Date;

  @ApiProperty({ required: false, type: Date })
  @Expose()
  endedAt?: Date;

  @ApiProperty()
  @Expose()
  maxParticipants: number;

  @ApiProperty()
  @Expose()
  isRecordingEnabled: boolean;

  @ApiProperty({ required: false })
  @Expose()
  curriculumLessonId?: string;

  @ApiProperty({ required: false })
  @Expose()
  livekitSid?: string;
}
