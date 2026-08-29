import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccessToken } from 'livekit-server-sdk';
import { v4 as uuidv4 } from 'uuid';

export interface LiveKitJoinPayload {
  roomName: string;
  livekitUrl: string;
  token?: string;
  /** @deprecated use livekitUrl + token with LiveKit client SDK */
  url?: string;
}

@Injectable()
export class VideoService {
  constructor(private config: ConfigService) {}

  /**
   * Creates a LiveKit room identity and mints a participant token.
   * Per architecture PDF: one meeting → one room; tokens scoped to publish/subscribe.
   */
  async createRoom(
    bookingId: string,
    participantIdentity?: string,
    options?: { canPublish?: boolean; canSubscribe?: boolean },
  ): Promise<LiveKitJoinPayload> {
    const roomName = `qlp-${bookingId.slice(0, 8)}-${uuidv4().slice(0, 8)}`;
    const livekitUrl = this.config.get('LIVEKIT_URL') || '';
    const apiKey = this.config.get('LIVEKIT_API_KEY');
    const apiSecret = this.config.get('LIVEKIT_API_SECRET');

    if (livekitUrl && apiKey && apiSecret) {
      const identity = participantIdentity || `user-${uuidv4().slice(0, 8)}`;
      const token = new AccessToken(apiKey, apiSecret, {
        identity,
        ttl: '1h',
      });
      token.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: options?.canPublish ?? true,
        canSubscribe: options?.canSubscribe ?? true,
      });
      const jwt = await token.toJwt();
      return { roomName, livekitUrl, token: jwt };
    }

    // Dev fallback when LiveKit is not configured
    return {
      roomName,
      livekitUrl: livekitUrl || 'wss://livekit.example.local',
      url: `/video/dev?room=${roomName}`,
    };
  }

  /** Observer/silent join — subscribe only, no publish (open session audience). */
  async createObserverToken(bookingId: string, observerIdentity: string) {
    return this.createRoom(bookingId, observerIdentity, {
      canPublish: false,
      canSubscribe: true,
    });
  }
}
