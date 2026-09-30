import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ParticipantRole } from '../enums/participant-role.enum';

export class CreateMediaRoomParticipantDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty({ enum: ParticipantRole })
  @IsEnum(ParticipantRole)
  role: ParticipantRole;
}
