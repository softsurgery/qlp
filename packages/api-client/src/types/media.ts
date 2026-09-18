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

export enum LiveKitEventType {
  ROOM_STARTED = "room_started",
  ROOM_FINISHED = "room_finished",
  PARTICIPANT_JOINED = "participant_joined",
  PARTICIPANT_LEFT = "participant_left",
  TRACK_PUBLISHED = "track_published",
  TRACK_UNPUBLISHED = "track_unpublished",
  EGRESS_STARTED = "egress_started",
  EGRESS_ENDED = "egress_ended",
}

export interface CreateMediaTokenDto {
  roomId: string;
  participantId?: string;
  participantName?: string;
  role?: ParticipantRole;
  metadata?: Record<string, unknown>;
}

export interface MediaTokenResponseDto {
  token: string;
  roomName: string;
  livekitUrl: string;
  expiresInSeconds?: number;
  role: ParticipantRole;
}

export interface MediaRoomSummaryDto {
  roomId: string;
  roomName: string;
  status: MediaRoomStatus;
  numParticipants: number;
  createdAt: string;
  isRecording: boolean;
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
  livekitSid?: string;
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

export interface LiveSubtitlePacket {
  speakerId: string;
  speakerName: string;
  text: string;
  timestamp: number;
  isFinal: boolean;
  language?: string;
}

export interface LiveKitWebhookPayload {
  event: LiveKitEventType | string;
  room?: {
    sid: string;
    name: string;
    emptyTimeout: number;
    maxParticipants: number;
    creationTime: number;
    metadata?: string;
    numParticipants: number;
  };
  participant?: {
    sid: string;
    identity: string;
    state: number;
    joinedAt: number;
    name: string;
    metadata?: string;
  };
  egressInfo?: {
    egressId: string;
    roomId: string;
    roomName: string;
    status: number;
    startedAt?: number;
    endedAt?: number;
    fileResults?: Array<{
      filename: string;
      downloadUrl?: string;
      size: number;
    }>;
  };
  id?: string;
  createdAt?: number;
}
