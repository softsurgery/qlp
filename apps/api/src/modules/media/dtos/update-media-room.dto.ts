import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { MediaRoomStatus } from '../enums/media-room-status.enum';

export class UpdateMediaRoomDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: MediaRoomStatus, required: false })
  @IsEnum(MediaRoomStatus)
  @IsOptional()
  status?: MediaRoomStatus;

  @ApiProperty({ required: false, type: String })
  @IsDateString()
  @IsOptional()
  scheduledStartAt?: string;

  @ApiProperty({ required: false, type: String })
  @IsDateString()
  @IsOptional()
  scheduledEndAt?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  maxParticipants?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isRecordingEnabled?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  curriculumLessonId?: string;
}
