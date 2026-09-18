import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';
import { AbstractUserEntity } from 'src/shared/abstract-user-management/entities/abstract-user.entity';
import { UserService } from 'src/modules/user-management/services/user.service';
import { MediaRoomEntity } from '../entities/media-room.entity';
import { MediaRoomRepository } from '../repositories/media-room.repository';
import { MediaRoomParticipantService } from './media-room-participant.service';
import { MediaRoomStatus } from '../enums/media-room-status.enum';
import { ParticipantRole, PARTICIPANT_ROLE_RANK } from '../enums/participant-role.enum';
import {
  MEDIA_HOST_CAPABLE_ROLE_IDS,
  MEDIA_PRIVILEGED_ROLE_IDS,
  MEDIA_ROOM_NAME_PREFIX,
} from '../constants/media.constant';
import { CreateMediaRoomDto } from '../dtos/create-media-room.dto';
import { UpdateMediaRoomDto } from '../dtos/update-media-room.dto';
import {
  MediaAccessDeniedException,
  MediaHostAssignmentDeniedException,
  MediaRoleEscalationException,
  MediaRoomCapacityException,
  MediaRoomClosedException,
  MediaRoomManagementDeniedException,
  MediaRoomNotFoundException,
} from '../errors/media.errors';

@Injectable()
export class MediaRoomService extends AbstractCrudService<MediaRoomEntity> {
  constructor(
    private readonly mediaRoomRepository: MediaRoomRepository,
    private readonly participantService: MediaRoomParticipantService,
    private readonly userService: UserService,
  ) {
    super(mediaRoomRepository);
  }

  async findRoomOrFail(roomId: string): Promise<MediaRoomEntity> {
    const room = await this.mediaRoomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new MediaRoomNotFoundException(roomId);
    }
    return room;
  }

  findByRoomName(roomName: string): Promise<MediaRoomEntity | null> {
    return this.mediaRoomRepository.findOne({ where: { roomName } });
  }

  private isPrivilegedUser(user?: AbstractUserEntity | null): boolean {
    return Boolean(user?.roleId && MEDIA_PRIVILEGED_ROLE_IDS.includes(user.roleId));
  }

  isPrivileged(user?: AbstractUserEntity | null): boolean {
    return this.isPrivilegedUser(user);
  }

  async getUserOrFail(userId: string): Promise<AbstractUserEntity> {
    const user = await this.userService.repository.findOne({ where: { id: userId } });
    if (!user || !user.isActive || !user.isApproved) {
      throw new MediaAccessDeniedException('This account cannot access live sessions');
    }
    return user;
  }

  canSchedule(user?: AbstractUserEntity | null): boolean {
    return Boolean(user?.roleId && MEDIA_HOST_CAPABLE_ROLE_IDS.includes(user.roleId));
  }

  async assertCanSchedule(userId: string): Promise<AbstractUserEntity> {
    const user = await this.getUserOrFail(userId);
    if (!this.canSchedule(user)) {
      throw new MediaRoomManagementDeniedException(
        'Only tutors and administrators can schedule sessions',
      );
    }
    return user;
  }

  async assertCanManage(room: MediaRoomEntity, userId: string): Promise<AbstractUserEntity> {
    const user = await this.getUserOrFail(userId);
    if (room.hostId !== userId && !this.isPrivilegedUser(user)) {
      throw new MediaRoomManagementDeniedException();
    }
    return user;
  }

  async assertCapacityForInvite(room: MediaRoomEntity, incoming = 1): Promise<void> {
    if (!room.maxParticipants || room.maxParticipants <= 0) return;

    const roster = await this.participantService.findByRoom(room.id);
    const taken = roster.length + 1;
    if (taken + incoming > room.maxParticipants) {
      throw new MediaRoomCapacityException(room.maxParticipants);
    }
  }

  async resolveParticipantRole(
    room: MediaRoomEntity,
    userId: string,
  ): Promise<{ role: ParticipantRole; user: AbstractUserEntity }> {
    const user = await this.getUserOrFail(userId);

    if (room.hostId === userId || this.isPrivilegedUser(user)) {
      return { role: ParticipantRole.HOST, user };
    }

    const participant = await this.participantService.findByRoomAndUser(room.id, userId);
    if (!participant) {
      throw new MediaAccessDeniedException();
    }

    return { role: participant.role, user };
  }

  reconcileRequestedRole(granted: ParticipantRole, requested?: ParticipantRole): ParticipantRole {
    if (!requested || requested === granted) {
      return granted;
    }
    if (PARTICIPANT_ROLE_RANK[requested] > PARTICIPANT_ROLE_RANK[granted]) {
      throw new MediaRoleEscalationException(requested, granted);
    }
    return requested;
  }

  assertJoinable(room: MediaRoomEntity): void {
    if (room.status === MediaRoomStatus.FINISHED || room.endedAt) {
      throw new MediaRoomClosedException();
    }
  }

  @Transactional()
  async createRoom(dto: CreateMediaRoomDto, requesterId: string): Promise<MediaRoomEntity> {
    const requester = await this.assertCanSchedule(requesterId);

    const wantsOtherHost = Boolean(dto.hostId && dto.hostId !== requesterId);
    if (wantsOtherHost && !this.isPrivilegedUser(requester)) {
      throw new MediaHostAssignmentDeniedException();
    }

    const hostId = dto.hostId ?? requesterId;
    if (wantsOtherHost) {
      const host = await this.getUserOrFail(hostId);
      if (!host.roleId || !MEDIA_HOST_CAPABLE_ROLE_IDS.includes(host.roleId)) {
        throw new MediaHostAssignmentDeniedException();
      }
    }

    const capacity = dto.maxParticipants ?? 0;
    const invites = dto.participants?.filter((p) => p.userId !== hostId) ?? [];
    if (capacity > 0 && invites.length + 1 > capacity) {
      throw new MediaRoomCapacityException(capacity);
    }

    const id = randomUUID();
    const room = await this.mediaRoomRepository.save({
      id,
      roomName: `${MEDIA_ROOM_NAME_PREFIX}-${id}`,
      title: dto.title,
      description: dto.description,
      status: MediaRoomStatus.IDLE,
      hostId,
      scheduledStartAt: dto.scheduledStartAt ? new Date(dto.scheduledStartAt) : undefined,
      scheduledEndAt: dto.scheduledEndAt ? new Date(dto.scheduledEndAt) : undefined,
      maxParticipants: capacity,
      isRecordingEnabled: dto.isRecordingEnabled ?? false,
      curriculumLessonId: dto.curriculumLessonId,
    });

    for (const participant of invites) {
      await this.participantService.upsertRole(room.id, participant.userId, participant.role);
    }

    return room;
  }

  @Transactional()
  async inviteParticipant(roomId: string, userId: string, role: ParticipantRole) {
    const room = await this.findRoomOrFail(roomId);
    await this.getUserOrFail(userId);
    await this.assertCapacityForInvite(room);
    return this.participantService.enroll(roomId, userId, role);
  }

  @Transactional()
  async updateRoom(roomId: string, dto: UpdateMediaRoomDto): Promise<MediaRoomEntity> {
    const room = await this.findRoomOrFail(roomId);

    const payload: QueryDeepPartialEntity<MediaRoomEntity> = {};
    if (dto.title !== undefined) payload.title = dto.title;
    if (dto.description !== undefined) payload.description = dto.description;
    if (dto.status !== undefined) payload.status = dto.status;
    if (dto.maxParticipants !== undefined) payload.maxParticipants = dto.maxParticipants;
    if (dto.isRecordingEnabled !== undefined) payload.isRecordingEnabled = dto.isRecordingEnabled;
    if (dto.curriculumLessonId !== undefined) payload.curriculumLessonId = dto.curriculumLessonId;
    if (dto.scheduledStartAt !== undefined) payload.scheduledStartAt = new Date(dto.scheduledStartAt);
    if (dto.scheduledEndAt !== undefined) payload.scheduledEndAt = new Date(dto.scheduledEndAt);

    if (Object.keys(payload).length === 0) {
      return room;
    }

    if (dto.maxParticipants !== undefined && dto.maxParticipants > 0) {
      const roster = await this.participantService.findByRoom(roomId);
      if (roster.length + 1 > dto.maxParticipants) {
        throw new MediaRoomCapacityException(dto.maxParticipants);
      }
    }

    if (dto.status === MediaRoomStatus.FINISHED && !room.endedAt) {
      payload.endedAt = new Date();
    }

    return (await this.mediaRoomRepository.update(roomId, payload)) ?? room;
  }

  @Transactional()
  async markStarted(
    roomId: string,
    livekitSid?: string,
    startedAt?: Date,
  ): Promise<MediaRoomEntity | null> {
    const room = await this.findRoomOrFail(roomId);
    if (room.status === MediaRoomStatus.FINISHED) {
      return room;
    }

    const payload: QueryDeepPartialEntity<MediaRoomEntity> = {};
    if (room.status !== MediaRoomStatus.ACTIVE) payload.status = MediaRoomStatus.ACTIVE;
    if (!room.startedAt) payload.startedAt = startedAt ?? new Date();
    if (livekitSid && !room.livekitSid) payload.livekitSid = livekitSid;

    if (Object.keys(payload).length === 0) {
      return room;
    }

    return this.mediaRoomRepository.update(roomId, payload);
  }

  @Transactional()
  async markFinished(roomId: string, endedAt?: Date): Promise<MediaRoomEntity | null> {
    const room = await this.findRoomOrFail(roomId);
    if (room.status === MediaRoomStatus.FINISHED && room.endedAt) {
      return room;
    }

    return this.mediaRoomRepository.update(roomId, {
      status: MediaRoomStatus.FINISHED,
      endedAt: room.endedAt ?? endedAt ?? new Date(),
    });
  }

  @Transactional()
  async deleteRoom(roomId: string): Promise<MediaRoomEntity | null> {
    await this.findRoomOrFail(roomId);
    return this.mediaRoomRepository.softDelete(roomId);
  }
}
