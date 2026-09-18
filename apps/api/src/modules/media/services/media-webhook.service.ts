import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebhookEvent, WebhookReceiver } from 'livekit-server-sdk';
import { MediaRoomEntity } from '../entities/media-room.entity';
import { LiveKitEventType } from '../enums/livekit-event-type.enum';
import { WebhookEventStatus } from '../enums/webhook-event-status.enum';
import { MediaWebhookEventRepository } from '../repositories/media-webhook-event.repository';
import { MediaRoomService } from './media-room.service';
import { MediaRoomParticipantService } from './media-room-participant.service';
import { fromSeconds } from '../utils/livekit-time.util';
import {
  MediaNotConfiguredException,
  MediaWebhookSignatureException,
} from '../errors/media.errors';

export interface WebhookHandlingResult {
  status: 'processed' | 'duplicate' | 'ignored';
  event: string;
  eventId: string;
}

@Injectable()
export class MediaWebhookService {
  private readonly logger = new Logger(MediaWebhookService.name);
  private receiver?: WebhookReceiver;

  constructor(
    private readonly configService: ConfigService,
    private readonly webhookEventRepository: MediaWebhookEventRepository,
    private readonly mediaRoomService: MediaRoomService,
    private readonly participantService: MediaRoomParticipantService,
  ) {}

  private getReceiver(): WebhookReceiver {
    if (this.receiver) return this.receiver;

    const apiKey = this.configService.get<string>('livekit.webhookApiKey');
    const apiSecret = this.configService.get<string>('livekit.webhookApiSecret');

    if (!apiKey || !apiSecret) {
      throw new MediaNotConfiguredException();
    }

    this.receiver = new WebhookReceiver(apiKey, apiSecret);
    return this.receiver;
  }

  async handle(rawBody: string, authHeader?: string): Promise<WebhookHandlingResult> {
    const receiver = this.getReceiver();

    let event: WebhookEvent;
    try {
      event = await receiver.receive(rawBody, authHeader);
    } catch (error) {
      this.logger.warn(`Rejected webhook with invalid signature: ${this.describe(error)}`);
      throw new MediaWebhookSignatureException();
    }

    const eventId = this.resolveEventId(event);
    const room = event.room?.name
      ? await this.mediaRoomService.findByRoomName(event.room.name)
      : null;

    const claimed = await this.claim(eventId, event, room);
    if (!claimed) {
      this.logger.log(`Ignoring duplicate delivery of ${event.event} (${eventId})`);
      return { status: 'duplicate', event: event.event, eventId };
    }

    try {
      const applied = await this.dispatch(event, room);
      await this.finalize(eventId, applied ? WebhookEventStatus.COMPLETED : WebhookEventStatus.IGNORED);
      return { status: applied ? 'processed' : 'ignored', event: event.event, eventId };
    } catch (error) {
      await this.finalize(eventId, WebhookEventStatus.FAILED, this.describe(error));
      this.logger.error(`Failed handling ${event.event} (${eventId}): ${this.describe(error)}`);
      throw error;
    }
  }

  private resolveEventId(event: WebhookEvent): string {
    if (event.id) return event.id;

    const subject =
      event.participant?.sid ?? event.egressInfo?.egressId ?? event.room?.sid ?? 'unknown';
    return `${event.event}:${subject}:${event.createdAt?.toString() ?? '0'}`;
  }

  private async claim(
    eventId: string,
    event: WebhookEvent,
    room: MediaRoomEntity | null,
  ): Promise<boolean> {
    const existing = await this.webhookEventRepository.findOne({ where: { id: eventId } });

    if (existing) {
      if (existing.status !== WebhookEventStatus.FAILED) {
        return false;
      }
      await this.webhookEventRepository.update(eventId, {
        status: WebhookEventStatus.PROCESSING,
        attempts: existing.attempts + 1,
        error: null,
      });
      return true;
    }

    try {
      await this.webhookEventRepository.save({
        id: eventId,
        event: event.event,
        roomName: event.room?.name,
        mediaRoomId: room?.id,
        status: WebhookEventStatus.PROCESSING,
        emittedAt: fromSeconds(event.createdAt),
        attempts: 1,
      });
      return true;
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        return false;
      }
      throw error;
    }
  }

  private async finalize(eventId: string, status: WebhookEventStatus, error?: string) {
    await this.webhookEventRepository.update(eventId, {
      status,
      processedAt: new Date(),
      error: error ?? null,
    });
  }

  private isUniqueViolation(error: unknown): boolean {
    const code = (error as { driverError?: { code?: string }; code?: string })?.driverError?.code;
    return code === '23505' || (error as { code?: string })?.code === '23505';
  }

  private async dispatch(event: WebhookEvent, room: MediaRoomEntity | null): Promise<boolean> {
    switch (event.event) {
      case LiveKitEventType.ROOM_STARTED:
        return this.onRoomStarted(event, room);

      case LiveKitEventType.ROOM_FINISHED:
        return this.onRoomFinished(event, room);

      default:
        this.logger.debug(`No handler for webhook event ${event.event}`);
        return false;
    }
  }

  private unknownRoom(event: WebhookEvent): boolean {
    this.logger.warn(
      `Received ${event.event} for room "${event.room?.name ?? 'unnamed'}" not tracked by this control plane`,
    );
    return false;
  }

  private async onRoomStarted(event: WebhookEvent, room: MediaRoomEntity | null) {
    if (!room) return this.unknownRoom(event);

    await this.mediaRoomService.markStarted(
      room.id,
      event.room?.sid,
      fromSeconds(event.room?.creationTime),
    );
    this.logger.log(`Room ${room.id} started (sid ${event.room?.sid})`);
    return true;
  }

  private async onRoomFinished(event: WebhookEvent, room: MediaRoomEntity | null) {
    if (!room) return this.unknownRoom(event);

    const endedAt = fromSeconds(event.createdAt);
    await this.mediaRoomService.markFinished(room.id, endedAt);
    return true;
  }

  private describe(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}
