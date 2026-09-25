import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';
import { MediaRoomParticipantEntity } from '../entities/media-room-participant.entity';
import { MediaRoomParticipantRepository } from '../repositories/media-room-participant.repository';
import { ParticipantRole } from '../enums/participant-role.enum';
import { MediaParticipantConflictException } from '../errors/media.errors';

@Injectable()
export class MediaRoomParticipantService extends AbstractCrudService<MediaRoomParticipantEntity> {
  constructor(private readonly participantRepository: MediaRoomParticipantRepository) {
    super(participantRepository);
  }

  findByRoomAndUser(roomId: string, userId: string): Promise<MediaRoomParticipantEntity | null> {
    return this.participantRepository.findOne({ where: { roomId, userId } });
  }

  findByRoom(roomId: string): Promise<MediaRoomParticipantEntity[]> {
    return this.participantRepository.findAll({ where: { roomId } });
  }

  findByUser(userId: string): Promise<MediaRoomParticipantEntity[]> {
    return this.participantRepository.findAll({ where: { userId } });
  }

  @Transactional()
  async enroll(
    roomId: string,
    userId: string,
    role: ParticipantRole,
  ): Promise<MediaRoomParticipantEntity> {
    const existing = await this.findByRoomAndUser(roomId, userId);
    if (existing) {
      throw new MediaParticipantConflictException();
    }
    return this.participantRepository.save({ id: randomUUID(), roomId, userId, role });
  }

  @Transactional()
  async upsertRole(
    roomId: string,
    userId: string,
    role: ParticipantRole,
  ): Promise<MediaRoomParticipantEntity> {
    const existing = await this.findByRoomAndUser(roomId, userId);
    if (!existing) {
      return this.participantRepository.save({ id: randomUUID(), roomId, userId, role });
    }
    if (existing.role === role) {
      return existing;
    }
    return (await this.participantRepository.update(existing.id, { role })) ?? existing;
  }

  @Transactional()
  async markJoined(roomId: string, userId: string): Promise<void> {
    const participant = await this.findByRoomAndUser(roomId, userId);
    if (!participant) return;
    await this.participantRepository.update(participant.id, { lastJoinedAt: new Date() });
  }

  @Transactional()
  async removeFromRoom(roomId: string, userId: string): Promise<void> {
    const participant = await this.findByRoomAndUser(roomId, userId);
    if (!participant) return;
    await this.participantRepository.softDelete(participant.id);
  }
}
