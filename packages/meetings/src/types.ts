import type {
  MeetingResource,
  ResponseMediaRoomDto,
  ResponseUserDto,
  UserResource,
} from "@qlp/api-client";

export type { MeetingResource };

// Mirrors the API's role ids (BasicRoles / ExtendedRoles).
export const MEETING_ROLE_IDS = {
  admin: "Admin",
  tutor: "Tutor",
  student: "Student",
} as const;

export interface MeetingsUiProps {
  api: MeetingResource;
  userApi: UserResource;
  currentUserId: string;
  isAdmin?: boolean;
  joinBasePath?: string;
  className?: string;
}

export interface MeetingWithSpots extends ResponseMediaRoomDto {
  takenSpots?: number;
}

export type MeetingUser = ResponseUserDto & {
  roleId?: string;
  role?: { id: string; label: string };
};
