import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateMediaRoomDto,
  CreateMediaRoomParticipantDto,
  MeetingResource,
  UpdateMediaRoomDto,
} from "@qlp/api-client";

export const MEETINGS_KEY = "meetings";

export const meetingsCalendarKey = (from: string, to: string, hostId?: string) =>
  [MEETINGS_KEY, "calendar", from, to, hostId ?? "all"] as const;

export const meetingParticipantsKey = (id: string) =>
  [MEETINGS_KEY, "participants", id] as const;

export function meetingErrorMessage(error: unknown, fallback: string): string {
  const response = (error as { response?: { data?: { message?: string } } })?.response;
  return response?.data?.message || fallback;
}

export function useMeetingCapabilities(api: MeetingResource) {
  return useQuery({
    queryKey: [MEETINGS_KEY, "capabilities"],
    queryFn: () => api.capabilities(),
    staleTime: 5 * 60_000,
    retry: false,
  });
}

export function useMeetingsCalendar(
  api: MeetingResource,
  from: string,
  to: string,
  hostId?: string,
) {
  return useQuery({
    queryKey: meetingsCalendarKey(from, to, hostId),
    queryFn: () => api.calendar({ from, to, hostId }),
    retry: false,
  });
}

export function useMeetingParticipants(
  api: MeetingResource,
  meetingId: string | undefined,
) {
  return useQuery({
    queryKey: meetingParticipantsKey(meetingId ?? ""),
    queryFn: () => api.participants(meetingId as string),
    enabled: Boolean(meetingId),
    retry: false,
  });
}

export function useMeetingMutations(api: MeetingResource) {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [MEETINGS_KEY] });

  const create = useMutation({
    mutationFn: (dto: CreateMediaRoomDto) => api.create(dto),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateMediaRoomDto }) =>
      api.update(id, dto),
    onSuccess: invalidate,
  });

  const end = useMutation({
    mutationFn: (id: string) => api.end(id),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.remove(id),
    onSuccess: invalidate,
  });

  const invite = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: CreateMediaRoomParticipantDto }) =>
      api.invite(id, dto),
    onSuccess: invalidate,
  });

  const removeParticipant = useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      api.removeParticipant(id, userId),
    onSuccess: invalidate,
  });

  return { create, update, end, remove, invite, removeParticipant };
}
