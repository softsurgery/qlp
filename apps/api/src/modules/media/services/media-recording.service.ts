import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { EgressInfo, EgressStatus } from 'livekit-server-sdk';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';
import { MediaRecordingEntity } from '../entities/media-recording.entity';
import { MediaRecordingRepository } from '../repositories/media-recording.repository';
import { MediaRecordingStatus } from '../enums/media-recording-status.enum';
import { fromNanos } from '../utils/livekit-time.util';

@Injectable()
export class MediaRecordingService extends AbstractCrudService<MediaRecordingEntity> {
  constructor(private readonly recordingRepository: MediaRecordingRepository) {
    super(recordingRepository);
  }

  findByEgressId(egressId: string): Promise<MediaRecordingEntity | null> {
    return this.recordingRepository.findOne({ where: { egressId } });
  }

  findByRoom(mediaRoomId: string): Promise<MediaRecordingEntity[]> {
    return this.recordingRepository.findAll({ where: { mediaRoomId } });
  }

  private toStatus(status: EgressStatus): MediaRecordingStatus {
    switch (status) {
      case EgressStatus.EGRESS_STARTING:
        return MediaRecordingStatus.PENDING;
      case EgressStatus.EGRESS_ACTIVE:
      case EgressStatus.EGRESS_ENDING:
        return MediaRecordingStatus.ACTIVE;
      case EgressStatus.EGRESS_COMPLETE:
        return MediaRecordingStatus.COMPLETED;
      case EgressStatus.EGRESS_FAILED:
        return MediaRecordingStatus.FAILED;
      case EgressStatus.EGRESS_ABORTED:
        return MediaRecordingStatus.ABORTED;
      default:
        return MediaRecordingStatus.PENDING;
    }
  }

  @Transactional()
  async applyEgressInfo(
    egressInfo: EgressInfo,
    mediaRoomId?: string,
  ): Promise<MediaRecordingEntity | null> {
    const status = this.toStatus(egressInfo.status);
    const file = egressInfo.fileResults?.[0];

    const payload = {
      mediaRoomId,
      roomName: egressInfo.roomName,
      status,
      startedAt: fromNanos(egressInfo.startedAt),
      endedAt: fromNanos(egressInfo.endedAt),
      durationSeconds: file?.duration ? Number(file.duration / 1_000_000_000n) : undefined,
      filename: file?.filename,
      fileUrl: file?.location,
      sizeBytes: file?.size != null ? String(file.size) : undefined,
      error: egressInfo.error || undefined,
    };

    const existing = await this.findByEgressId(egressInfo.egressId);
    if (!existing) {
      return this.recordingRepository.save({
        id: randomUUID(),
        egressId: egressInfo.egressId,
        ...payload,
      });
    }

    const changes = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined),
    );

    return this.recordingRepository.update(existing.id, changes);
  }
}
