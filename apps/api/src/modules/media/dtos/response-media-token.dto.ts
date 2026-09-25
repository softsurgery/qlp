import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ParticipantRole } from '../enums/participant-role.enum';

export class ResponseMediaTokenDto {
  @ApiProperty({ description: 'Signed LiveKit join token' })
  @Expose()
  token: string;

  @ApiProperty()
  @Expose()
  roomName: string;

  @ApiProperty({ description: 'wss:// endpoint the client SDK should dial' })
  @Expose()
  livekitUrl: string;

  @ApiProperty({ required: false })
  @Expose()
  expiresInSeconds?: number;

  @ApiProperty({ enum: ParticipantRole, description: 'Role actually granted by the server' })
  @Expose()
  role: ParticipantRole;
}
