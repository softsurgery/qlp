import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ParticipantRole } from '../enums/participant-role.enum';
import { CreateMediaTokenDto } from '../dtos/create-media-token.dto';
import { MediaRoomService } from './media-room.service';
import { MediaRoomParticipantService } from './media-room-participant.service';
import { MediaTokenService } from './media-token.service';

export interface IssuedMediaToken {
  token: string;
  roomName: string;
  livekitUrl: string;
  expiresInSeconds: number;
  role: ParticipantRole;
}

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly mediaRoomService: MediaRoomService,
    private readonly participantService: MediaRoomParticipantService,
    private readonly mediaTokenService: MediaTokenService,
  ) {}

  async issueToken(dto: CreateMediaTokenDto, userId: string): Promise<IssuedMediaToken> {
    const room = await this.mediaRoomService.findRoomOrFail(dto.roomId);
    this.mediaRoomService.assertJoinable(room);

    const { role: grantedRole, user } = await this.mediaRoomService.resolveParticipantRole(
      room,
      userId,
    );
    const role = this.mediaRoomService.reconcileRequestedRole(grantedRole, dto.role);

    const displayName =
      [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
      dto.participantName ||
      user.username;

    const { token, expiresInSeconds } = await this.mediaTokenService.sign({
      roomName: room.roomName,
      identity: userId,
      name: displayName,
      role,
      custom: dto.metadata,
      context: { roomId: room.id },
    });

    await this.participantService.markJoined(room.id, userId);

    this.logger.log(`Issued ${role} token for user ${userId} on room ${room.id}`);

    return {
      token,
      roomName: room.roomName,
      livekitUrl: this.mediaTokenService.livekitUrl,
      expiresInSeconds,
      role,
    };
  }
}
