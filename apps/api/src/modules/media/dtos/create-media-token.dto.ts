import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { ParticipantRole } from '../enums/participant-role.enum';

export class CreateMediaTokenDto {
  @ApiProperty()
  @IsString()
  roomId: string;

  @ApiProperty({ required: false, description: 'Advisory only - overridden by the caller identity' })
  @IsString()
  @IsOptional()
  participantId?: string;

  @ApiProperty({ required: false, description: 'Display name fallback when the profile has none' })
  @IsString()
  @IsOptional()
  participantName?: string;

  @ApiProperty({ enum: ParticipantRole, required: false, description: 'Requested role, downgrade only' })
  @IsEnum(ParticipantRole)
  @IsOptional()
  role?: ParticipantRole;

  @ApiProperty({ required: false, type: Object })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}
