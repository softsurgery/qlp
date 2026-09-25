import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccessToken, VideoGrant } from 'livekit-server-sdk';
import { MEDIA_ROLE_GRANTS } from '../constants/media-role-grants.constant';
import { ParticipantRole } from '../enums/participant-role.enum';
import { MediaNotConfiguredException } from '../errors/media.errors';

export interface SignMediaTokenParams {
  roomName: string;
  identity: string;
  name: string;
  role: ParticipantRole;
  custom?: Record<string, unknown>;
  context?: Record<string, unknown>;
}

export interface SignedMediaToken {
  token: string;
  expiresInSeconds: number;
}

@Injectable()
export class MediaTokenService {
  private readonly logger = new Logger(MediaTokenService.name);

  constructor(private readonly configService: ConfigService) {
    if (!this.isConfigured()) {
      this.logger.warn(
        'LIVEKIT_API_KEY / LIVEKIT_API_SECRET are not set - media token issuance is disabled',
      );
    }
  }

  isConfigured(): boolean {
    return Boolean(
      this.configService.get<string>('livekit.apiKey') &&
        this.configService.get<string>('livekit.apiSecret'),
    );
  }

  get livekitUrl(): string {
    return this.configService.get<string>('livekit.url') as string;
  }

  get tokenTtl(): number {
    const ttl = this.configService.get<number>('livekit.tokenTtl');
    return Number.isFinite(ttl) && (ttl as number) > 0 ? (ttl as number) : 3600;
  }

  buildGrant(role: ParticipantRole, roomName: string): VideoGrant {
    return { ...MEDIA_ROLE_GRANTS[role], room: roomName };
  }

  async sign(params: SignMediaTokenParams): Promise<SignedMediaToken> {
    const apiKey = this.configService.get<string>('livekit.apiKey');
    const apiSecret = this.configService.get<string>('livekit.apiSecret');

    if (!apiKey || !apiSecret) {
      throw new MediaNotConfiguredException();
    }

    const ttl = this.tokenTtl;

    const accessToken = new AccessToken(apiKey, apiSecret, {
      identity: params.identity,
      name: params.name,
      ttl,
      metadata: JSON.stringify({
        ...params.context,
        custom: params.custom ?? {},
        userId: params.identity,
        role: params.role,
      }),
    });

    accessToken.addGrant(this.buildGrant(params.role, params.roomName));

    return {
      token: await accessToken.toJwt(),
      expiresInSeconds: ttl,
    };
  }
}
