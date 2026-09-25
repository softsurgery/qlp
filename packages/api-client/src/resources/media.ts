import type { AxiosInstance } from "axios";
import type {
  CreateMediaTokenDto,
  MediaRoomSummaryDto,
  MediaTokenResponseDto,
} from "../types/media.js";

export function createMediaResource(http: AxiosInstance, prefix = "/media") {
  const requestToken = async (
    dto: CreateMediaTokenDto,
  ): Promise<MediaTokenResponseDto> => {
    const response = await http.post<MediaTokenResponseDto>(
      `${prefix}/token`,
      dto,
    );
    return response.data;
  };

  const getRoom = async (roomId: string): Promise<MediaRoomSummaryDto> => {
    const response = await http.get<MediaRoomSummaryDto>(
      `${prefix}/rooms/${encodeURIComponent(roomId)}`,
    );
    return response.data;
  };

  return {
    requestToken,
    getRoom,
  };
}

export type MediaResource = ReturnType<typeof createMediaResource>;
