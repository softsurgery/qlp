import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { ParticipantRole } from '../enums/participant-role.enum';

export class ResponseMediaRoomParticipantDto extends ResponseDtoHelper {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  roomId: string;

  @ApiProperty()
  @Expose()
  userId: string;

  @ApiProperty({ enum: ParticipantRole })
  @Expose()
  role: ParticipantRole;

  @ApiProperty({ required: false, type: Date })
  @Expose()
  lastJoinedAt?: Date;
}
