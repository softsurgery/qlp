import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateMediaRoomParticipantDto } from './create-media-room-participant.dto';

export class CreateMediaRoomDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, description: 'Defaults to the authenticated caller' })
  @IsString()
  @IsOptional()
  hostId?: string;

  @ApiProperty({ required: false, type: String })
  @IsDateString()
  @IsOptional()
  scheduledStartAt?: string;

  @ApiProperty({ required: false, type: String })
  @IsDateString()
  @IsOptional()
  scheduledEndAt?: string;

  @ApiProperty({ required: false, description: '0 uses the LiveKit server default' })
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

  @ApiProperty({ required: false, type: [CreateMediaRoomParticipantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMediaRoomParticipantDto)
  @IsOptional()
  participants?: CreateMediaRoomParticipantDto[];
}
