import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Room as LiveKitRoom, RoomServiceClient } from 'livekit-server-sdk';
import { MediaRoomEntity } from '../entities/media-room.entity';
import { MediaRoomStatus } from '../enums/media-room-status.enum';
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

export interface MediaRoomSummary {
  roomId: string;
  roomName: string;
  status: MediaRoomStatus;
  numParticipants: number;
  createdAt: string;
  isRecording: boolean;
}

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private roomClient?: RoomServiceClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly mediaRoomService: MediaRoomService,
    private readonly participantService: MediaRoomParticipantService,
    private readonly mediaTokenService: MediaTokenService,
  ) {}

  private getRoomClient(): RoomServiceClient | undefined {
    if (this.roomClient) return this.roomClient;

    const apiUrl = this.configService.get<string>('livekit.apiUrl');
    const apiKey = this.configService.get<string>('livekit.apiKey');
    const apiSecret = this.configService.get<string>('livekit.apiSecret');
    if (!apiUrl || !apiKey || !apiSecret) return undefined;

    this.roomClient = new RoomServiceClient(apiUrl, apiKey, apiSecret);
    return this.roomClient;
  }

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

    await this.ensureLiveKitRoom(room);
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

  async getRoomSummary(roomId: string, userId: string): Promise<MediaRoomSummary> {
    const room = await this.mediaRoomService.findRoomOrFail(roomId);
    await this.mediaRoomService.resolveParticipantRole(room, userId);

    const liveRoom = await this.fetchLiveRoom(room.roomName);
    return this.toSummary(room, liveRoom);
  }

  private async ensureLiveKitRoom(room: MediaRoomEntity): Promise<void> {
    const client = this.getRoomClient();
    if (!client) return;

    try {
      await client.createRoom({
        name: room.roomName,
        emptyTimeout: this.configService.get<number>('livekit.emptyTimeout'),
        maxParticipants: room.maxParticipants > 0 ? room.maxParticipants : undefined,
        metadata: JSON.stringify({ roomId: room.id, title: room.title }),
      });
    } catch (error) {
      this.logger.warn(`Could not pre-create LiveKit room ${room.roomName}: ${this.describe(error)}`);
    }
  }

  private async fetchLiveRoom(roomName: string): Promise<LiveKitRoom | undefined> {
    const client = this.getRoomClient();
    if (!client) return undefined;

    try {
      const rooms = await client.listRooms([roomName]);
      return rooms[0];
    } catch (error) {
      this.logger.warn(`Could not read LiveKit room ${roomName}: ${this.describe(error)}`);
      return undefined;
    }
  }

  private toSummary(room: MediaRoomEntity, liveRoom?: LiveKitRoom): MediaRoomSummary {
    const isFinished = room.status === MediaRoomStatus.FINISHED || Boolean(room.endedAt);

    return {
      roomId: room.id,
      roomName: room.roomName,
      status: isFinished
        ? MediaRoomStatus.FINISHED
        : liveRoom
          ? MediaRoomStatus.ACTIVE
          : room.status,
      numParticipants: liveRoom?.numParticipants ?? 0,
      createdAt: (room.createdAt ?? new Date()).toISOString(),
      isRecording: liveRoom?.activeRecording ?? false,
    };
  }

  private describe(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}
