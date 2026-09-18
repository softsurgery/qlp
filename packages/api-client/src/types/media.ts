import type { DatabaseEntity } from "./utils/database-entity.js";

export enum ParticipantRole {
  HOST = "host",
  STUDENT = "student",
  OBSERVER = "observer",
}

export enum MediaRoomStatus {
  IDLE = "idle",
  ACTIVE = "active",
  FINISHED = "finished",
}

export interface ResponseMediaRoomDto extends DatabaseEntity {
  id: string;
  roomName: string;
  title: string;
  description?: string;
  status: MediaRoomStatus;
  hostId: string;
  scheduledStartAt?: string;
  scheduledEndAt?: string;
  startedAt?: string;
  endedAt?: string;
  maxParticipants: number;
  isRecordingEnabled: boolean;
  curriculumLessonId?: string;
}

export interface ResponseMediaRoomParticipantDto extends DatabaseEntity {
  id: string;
  roomId: string;
  userId: string;
  role: ParticipantRole;
  lastJoinedAt?: string;
}

export interface CreateMediaRoomParticipantDto {
  userId: string;
  role: ParticipantRole;
}

export interface CreateMediaRoomDto {
  title: string;
  description?: string;
  hostId?: string;
  scheduledStartAt?: string;
  scheduledEndAt?: string;
  maxParticipants?: number;
  isRecordingEnabled?: boolean;
  curriculumLessonId?: string;
  participants?: CreateMediaRoomParticipantDto[];
}

export interface UpdateMediaRoomDto {
  title?: string;
  description?: string;
  status?: MediaRoomStatus;
  scheduledStartAt?: string;
  scheduledEndAt?: string;
  maxParticipants?: number;
  isRecordingEnabled?: boolean;
  curriculumLessonId?: string;
}
