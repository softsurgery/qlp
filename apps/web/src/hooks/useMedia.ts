import { useMutation, useQuery } from "@tanstack/react-query";
import type { CreateMediaTokenDto } from "@qlp/api-client";
import { api } from "../lib/api";

export const MEDIA_ROOM_QUERY_KEY = (roomId: string) =>
  ["media", "room", roomId] as const;

export type MediaErrorKind =
  | "forbidden"
  | "notFound"
  | "ended"
  | "notOpen"
  | "unavailable"
  | "unknown";

export function classifyMediaError(error: unknown): MediaErrorKind {
  const status = (error as { response?: { status?: number } })?.response?.status;
  switch (status) {
    case 403:
      return "forbidden";
    case 404:
      return "notFound";
    case 409:
      return "ended";
    case 425:
      return "notOpen";
    case 503:
      return "unavailable";
    default:
      return "unknown";
  }
}

/** When a "notOpen" refusal says the session opens, if the API told us. */
export function mediaErrorOpensAt(error: unknown): Date | undefined {
  const opensAt = (error as { response?: { data?: { opensAt?: string } } })?.response?.data
    ?.opensAt;
  const date = opensAt ? new Date(opensAt) : undefined;
  return date && !Number.isNaN(date.getTime()) ? date : undefined;
}

export function useMediaRoom(roomId: string | undefined) {
  return useQuery({
    queryKey: MEDIA_ROOM_QUERY_KEY(roomId ?? ""),
    queryFn: () => api.media.getRoom(roomId as string),
    enabled: Boolean(roomId),
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useMediaToken() {
  return useMutation({
    mutationFn: (dto: CreateMediaTokenDto) => api.media.requestToken(dto),
    retry: false,
  });
}
