import type { AxiosInstance } from "axios";
import type {
  CreateMediaRoomDto,
  CreateMediaRoomParticipantDto,
  MediaRoomSummaryDto,
  Paginated,
  QueryParams,
  ResponseMediaRoomDto,
  ResponseMediaRoomParticipantDto,
  UpdateMediaRoomDto,
} from "../types/index.js";

export function createAdminMediaResource(
  http: AxiosInstance,
  basePath = "/admin/media/rooms",
) {
  const findPaginated = async ({
    page = "1",
    limit = "12",
    sort,
    filter = "",
    search = "",
  }: QueryParams): Promise<Paginated<ResponseMediaRoomDto>> => {
    const params: { [key: string]: string | undefined } = { page, limit, sort };
    if (search) params.search = search;
    if (filter) params.filter = filter;
    const response = await http.get<Paginated<ResponseMediaRoomDto>>(
      `${basePath}/list`,
      { params },
    );
    return response.data;
  };

  const findAll = async (): Promise<ResponseMediaRoomDto[]> => {
    const response = await http.get<ResponseMediaRoomDto[]>(`${basePath}/all`);
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

  const findParticipants = async (
    id: string,
  ): Promise<ResponseMediaRoomParticipantDto[]> => {
    const response = await http.get<ResponseMediaRoomParticipantDto[]>(
      `${basePath}/${id}/participants`,
    );
    return response.data;
  };

  const addParticipant = async (
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
    findPaginated,
    findAll,
    findById,
    create,
    update,
    end,
    remove,
    findParticipants,
    addParticipant,
    removeParticipant,
  };
}

export type AdminMediaResource = ReturnType<typeof createAdminMediaResource>;
