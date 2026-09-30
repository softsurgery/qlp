import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MediaRoomStatus } from '../enums/media-room-status.enum';

export class ResponseMediaRoomSummaryDto {
  @ApiProperty()
  @Expose()
  roomId: string;

  @ApiProperty()
  @Expose()
  roomName: string;

  @ApiProperty({ enum: MediaRoomStatus })
  @Expose()
  status: MediaRoomStatus;

  @ApiProperty()
  @Expose()
  numParticipants: number;

  @ApiProperty({ type: String, description: 'ISO-8601 timestamp' })
  @Expose()
  createdAt: string;

  @ApiProperty()
  @Expose()
  isRecording: boolean;
}
