import type { AxiosInstance } from "axios";
import type {
  CreateMediaRoomDto,
  CreateMediaRoomParticipantDto,
  MediaCalendarQuery,
  MediaRoomSummaryDto,
  ResponseMediaRoomDto,
  ResponseMediaRoomParticipantDto,
  UpdateMediaRoomDto,
} from "../types/index.js";

export function createMeetingResource(
  http: AxiosInstance,
  basePath = "/media/meetings",
) {
  const calendar = async (
    query: MediaCalendarQuery,
  ): Promise<ResponseMediaRoomDto[]> => {
    const response = await http.get<ResponseMediaRoomDto[]>(
      `${basePath}/calendar`,
      { params: query },
    );
    return response.data;
  };

  const capabilities = async (): Promise<{
    canSchedule: boolean;
    isAdmin: boolean;
  }> => {
    const response = await http.get<{ canSchedule: boolean; isAdmin: boolean }>(
      `${basePath}/capabilities`,
    );
    return response.data;
  };

  const mine = async (): Promise<ResponseMediaRoomDto[]> => {
    const response = await http.get<ResponseMediaRoomDto[]>(`${basePath}/mine`);
    return response.data;
  };

  const findById = async (id: string): Promise<ResponseMediaRoomDto> => {
    const response = await http.get<ResponseMediaRoomDto>(`${basePath}/${id}`);
    return response.data;
  };

  const create = async (
    dto: CreateMediaRoomDto,
  ): Promise<ResponseMediaRoomDto> => {
    const response = await http.post<ResponseMediaRoomDto>(basePath, dto);
    return response.data;
  };

  const update = async (
    id: string,
    dto: UpdateMediaRoomDto,
  ): Promise<ResponseMediaRoomDto> => {
    const response = await http.put<ResponseMediaRoomDto>(
      `${basePath}/${id}`,
      dto,
    );
    return response.data;
  };

  const end = async (id: string): Promise<MediaRoomSummaryDto> => {
    const response = await http.post<MediaRoomSummaryDto>(
      `${basePath}/${id}/end`,
    );
    return response.data;
  };

  const remove = async (id: string): Promise<ResponseMediaRoomDto | null> => {
    const response = await http.delete<ResponseMediaRoomDto>(
      `${basePath}/${id}`,
    );
    return response.data;
  };

  const participants = async (
    id: string,
  ): Promise<ResponseMediaRoomParticipantDto[]> => {
    const response = await http.get<ResponseMediaRoomParticipantDto[]>(
      `${basePath}/${id}/participants`,
    );
    return response.data;
  };

  const invite = async (
    id: string,
    dto: CreateMediaRoomParticipantDto,
  ): Promise<ResponseMediaRoomParticipantDto> => {
    const response = await http.post<ResponseMediaRoomParticipantDto>(
      `${basePath}/${id}/participants`,
      dto,
    );
    return response.data;
  };

  const removeParticipant = async (
    id: string,
    userId: string,
  ): Promise<void> => {
    await http.delete(
      `${basePath}/${id}/participants/${encodeURIComponent(userId)}`,
    );
  };

  return {
    calendar,
    capabilities,
    mine,
    findById,
    create,
    update,
    end,
    remove,
    participants,
    invite,
    removeParticipant,
  };
}

export type MeetingResource = ReturnType<typeof createMeetingResource>;
