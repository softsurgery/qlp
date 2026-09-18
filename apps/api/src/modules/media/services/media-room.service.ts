import { Injectable } from '@nestjs/common';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';
import { AbstractUserEntity } from 'src/shared/abstract-user-management/entities/abstract-user.entity';
import { UserService } from 'src/modules/user-management/services/user.service';
import { MediaRoomEntity } from '../entities/media-room.entity';
import { MediaRoomRepository } from '../repositories/media-room.repository';
import { MediaRoomParticipantService } from './media-room-participant.service';
import { MediaRoomStatus } from '../enums/media-room-status.enum';
import { ParticipantRole, PARTICIPANT_ROLE_RANK } from '../enums/participant-role.enum';
import {
  MEDIA_PRIVILEGED_ROLE_IDS,
} from '../constants/media.constant';
import {
  MediaAccessDeniedException,
  MediaRoleEscalationException,
  MediaRoomClosedException,
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
}
