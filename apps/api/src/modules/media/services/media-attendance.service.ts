import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { IsNull } from 'typeorm';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';
import { MediaRoomAttendanceEntity } from '../entities/media-room-attendance.entity';
import { MediaRoomAttendanceRepository } from '../repositories/media-room-attendance.repository';

export interface AttendanceParticipant {
  sid: string;
  identity: string;
  name?: string;
  joinedAt?: Date;
}

@Injectable()
export class MediaAttendanceService extends AbstractCrudService<MediaRoomAttendanceEntity> {
  constructor(private readonly attendanceRepository: MediaRoomAttendanceRepository) {
    super(attendanceRepository);
  }

  findByRoom(mediaRoomId: string): Promise<MediaRoomAttendanceEntity[]> {
    return this.attendanceRepository.findAll({ where: { mediaRoomId } });
  }

  private findByParticipantSid(
    mediaRoomId: string,
    participantSid: string,
  ): Promise<MediaRoomAttendanceEntity | null> {
    return this.attendanceRepository.findOne({ where: { mediaRoomId, participantSid } });
  }

  @Transactional()
  async openAttendance(
    mediaRoomId: string,
    participant: AttendanceParticipant,
  ): Promise<MediaRoomAttendanceEntity> {
    const existing = await this.findByParticipantSid(mediaRoomId, participant.sid);
    if (existing) {
      return existing;
    }

    return this.attendanceRepository.save({
      id: randomUUID(),
      mediaRoomId,
      participantSid: participant.sid,
      identity: participant.identity,
      displayName: participant.name,
      joinedAt: participant.joinedAt ?? new Date(),
    });
  }

  @Transactional()
  async closeAttendance(
    mediaRoomId: string,
    participantSid: string,
    leftAt = new Date(),
  ): Promise<MediaRoomAttendanceEntity | null> {
    const existing = await this.findByParticipantSid(mediaRoomId, participantSid);
    if (!existing) return null;
    if (existing.leftAt) return existing;

    const durationSeconds = Math.max(
      0,
      Math.round((leftAt.getTime() - new Date(existing.joinedAt).getTime()) / 1000),
    );

    return this.attendanceRepository.update(existing.id, { leftAt, durationSeconds });
  }

  @Transactional()
  async closeAllOpen(mediaRoomId: string, leftAt = new Date()): Promise<number> {
    const open = await this.attendanceRepository.findAll({
      where: { mediaRoomId, leftAt: IsNull() },
    });

    for (const row of open) {
      await this.closeAttendance(mediaRoomId, row.participantSid, leftAt);
    }

    return open.length;
  }
}
