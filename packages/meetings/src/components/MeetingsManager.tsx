import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { addDays, endOfWeek, format, startOfWeek } from "date-fns";
import { CalendarPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { useDialog } from "@qlp/hooks";
import { Button, cn } from "@qlp/ui";
import {
  MediaRoomStatus,
  ParticipantRole,
  type ResponseMediaRoomDto,
} from "@qlp/api-client";
import {
  meetingErrorMessage,
  useMeetingCapabilities,
  useMeetingMutations,
  useMeetingParticipants,
  useMeetingsCalendar,
} from "../hooks/useMeetings";
import { MeetingsWeekGrid } from "./MeetingsWeekGrid";
import { MeetingDetailPanel } from "./MeetingDetailPanel";
import { MeetingForm, type MeetingFormValues } from "./MeetingFormDialog";
import type { MeetingUser, MeetingsUiProps } from "../types";

export function MeetingsManager({
  api,
  userApi,
  currentUserId,
  isAdmin: isAdminProp,
  joinBasePath = "/video",
  className,
}: MeetingsUiProps) {
  const { t } = useTranslation("meetings");

  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [draftStart, setDraftStart] = useState<Date | undefined>();

  const range = useMemo(() => {
    const from = weekStart;
    const to = endOfWeek(weekStart, { weekStartsOn: 1 });
    return { from: from.toISOString(), to: to.toISOString() };
  }, [weekStart]);

  const capabilities = useMeetingCapabilities(api);
  const isAdmin = capabilities.data?.isAdmin ?? isAdminProp ?? false;
  const canSchedule = capabilities.data?.canSchedule ?? false;

  const calendar = useMeetingsCalendar(api, range.from, range.to);
  const meetings = calendar.data ?? [];
  const selected = meetings.find((m) => m.id === selectedId);

  const canManage = (meeting?: ResponseMediaRoomDto) =>
    Boolean(meeting && (isAdmin || meeting.hostId === currentUserId));

  const participants = useMeetingParticipants(
    api,
    canManage(selected) ? selected?.id : undefined,
  );
  const mutations = useMeetingMutations(api);

  const usersQuery = useQuery({
    queryKey: ["meetings", "users"],
    queryFn: () => userApi.findAll(),
    staleTime: 60_000,
    enabled: canSchedule,
  });
  const users = (usersQuery.data ?? []) as MeetingUser[];

  const hostOptions = useMemo(
    () => users.filter((u) => u.roleId === "Admin" || u.roleId === "Tutor"),
    [users],
  );

  const isMutating =
    mutations.create.isPending ||
    mutations.update.isPending ||
    mutations.invite.isPending ||
    mutations.removeParticipant.isPending ||
    mutations.end.isPending ||
    mutations.remove.isPending;

  const fail = (error: unknown, fallbackKey: string) =>
    toast.error(meetingErrorMessage(error, t(fallbackKey)));

  const [editing, setEditing] = useState<ResponseMediaRoomDto | undefined>();
  const closeRef = { current: () => {} };

  const submitForm = (values: MeetingFormValues) => {
    const payload = {
      title: values.title,
      description: values.description || undefined,
      scheduledStartAt: values.scheduledStartAt,
      scheduledEndAt: values.scheduledEndAt,
      maxParticipants: values.maxParticipants,
    };

    if (editing) {
      mutations.update.mutate(
        { id: editing.id, dto: payload },
        {
          onSuccess: () => {
            toast.success(t("messages.updated"));
            closeRef.current();
          },
          onError: (error) => fail(error, "messages.updateFailed"),
        },
      );
      return;
    }

    mutations.create.mutate(
      { ...payload, hostId: isAdmin ? values.hostId : undefined },
      {
        onSuccess: (created) => {
          toast.success(t("messages.created"));
          setSelectedId(created.id);
          closeRef.current();
        },
        onError: (error) => fail(error, "messages.createFailed"),
      },
    );
  };

  const { DialogFragment, openDialog, closeDialog } = useDialog({
    title: editing ? t("form.editTitle") : t("form.createTitle"),
    description: editing ? t("form.editDescription") : t("form.createDescription"),
    children: (
      <MeetingForm
        meeting={editing}
        defaultStart={draftStart}
        hostOptions={hostOptions}
        isAdmin={isAdmin}
        isPending={isMutating}
        onSubmit={submitForm}
        onCancel={() => closeRef.current()}
      />
    ),
    className: "w-[560px] max-w-[95vw]",
  });
  closeRef.current = closeDialog;

  const openCreate = (start?: Date) => {
    if (!canSchedule) return;
    setEditing(undefined);
    setDraftStart(start);
    openDialog();
  };

  const openEdit = (meeting: ResponseMediaRoomDto) => {
    setEditing(meeting);
    setDraftStart(undefined);
    openDialog();
  };

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setWeekStart((w) => addDays(w, -7))}
            aria-label={t("nav.previousWeek")}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setWeekStart((w) => addDays(w, 7))}
            aria-label={t("nav.nextWeek")}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
          >
            {t("nav.today")}
          </Button>
          <span className="ml-2 text-sm font-medium">
            {format(weekStart, "d MMM")} –{" "}
            {format(endOfWeek(weekStart, { weekStartsOn: 1 }), "d MMM yyyy")}
          </span>
        </div>

        {canSchedule && (
          <Button onClick={() => openCreate()}>
            <CalendarPlus className="size-4" />
            {t("actions.create")}
          </Button>
        )}
      </div>

      {calendar.isError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
          {meetingErrorMessage(calendar.error, t("messages.loadFailed"))}
        </div>
      )}

      <div className="flex min-h-0 flex-1 gap-3">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border">
          <MeetingsWeekGrid
            weekStart={weekStart}
            meetings={meetings}
            selectedId={selectedId}
            onSelect={(meeting) => setSelectedId(meeting.id)}
            onCreateAt={openCreate}
            canCreate={canSchedule}
            isLoading={calendar.isFetching}
          />
        </div>

        {selected && (
          <aside className="hidden w-80 shrink-0 overflow-hidden rounded-lg border lg:block">
            <MeetingDetailPanel
              meeting={selected}
              participants={participants.data ?? []}
              users={users}
              isLoadingParticipants={participants.isLoading}
              isMutating={isMutating}
              canManage={canManage(selected)}
              joinHref={
                selected.status !== MediaRoomStatus.FINISHED
                  ? `${joinBasePath}/${selected.id}`
                  : undefined
              }
              onEdit={() => openEdit(selected)}
              onEnd={() =>
                mutations.end.mutate(selected.id, {
                  onSuccess: () => toast.success(t("messages.ended")),
                  onError: (error) => fail(error, "messages.endFailed"),
                })
              }
              onDelete={() =>
                mutations.remove.mutate(selected.id, {
                  onSuccess: () => {
                    toast.success(t("messages.deleted"));
                    setSelectedId(undefined);
                  },
                  onError: (error) => fail(error, "messages.deleteFailed"),
                })
              }
              onInvite={(userId, role: ParticipantRole) =>
                mutations.invite.mutate(
                  { id: selected.id, dto: { userId, role } },
                  {
                    onSuccess: () => toast.success(t("messages.invited")),
                    onError: (error) => fail(error, "messages.inviteFailed"),
                  },
                )
              }
              onRemoveParticipant={(userId) =>
                mutations.removeParticipant.mutate(
                  { id: selected.id, userId },
                  {
                    onSuccess: () => toast.success(t("messages.participantRemoved")),
                    onError: (error) => fail(error, "messages.removeFailed"),
                  },
                )
              }
              onClose={() => setSelectedId(undefined)}
            />
          </aside>
        )}
      </div>

      {DialogFragment}
    </div>
  );
}
