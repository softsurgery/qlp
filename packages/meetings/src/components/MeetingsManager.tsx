import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn, useDialog, useSheet } from "@qlp/ui";
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
import { useElementWidth } from "../hooks/useElementWidth";
import { MeetingsToolbar } from "./MeetingsToolbar";
import { MeetingsTimeGrid } from "./MeetingsTimeGrid";
import { MeetingsMonthGrid } from "./MeetingsMonthGrid";
import { MeetingDetailPanel } from "./MeetingDetailPanel";
import { MeetingForm, type MeetingFormValues } from "./MeetingFormDialog";
import { MEETING_ROLE_IDS, type MeetingUser, type MeetingsUiProps } from "../types";
import {
  stepAnchor,
  visibleDays,
  visibleRange,
  type CalendarView,
} from "../lib/calendar";

/*
 * Layout follows the width the meetings UI actually has (it sits next to the app sidebar),
 * not the screen width.
 */
// Below this: day view by default, toolbar on two rows.
const COMPACT_BELOW = 640;
// Below this the month view shows dots instead of titled chips.
const MONTH_CHIPS_FROM = 720;
// From this width the meeting details sit beside the calendar; below, they open in a drawer.
const SIDE_PANEL_FROM = 1024;

export function MeetingsManager({
  api,
  userApi,
  currentUserId,
  isAdmin: isAdminProp,
  joinBasePath = "/video",
  className,
}: MeetingsUiProps) {
  const { t } = useTranslation("meetings");

  const rootRef = useRef<HTMLDivElement>(null);
  const width = useElementWidth(rootRef);
  const measured = width > 0;
  const compact = measured && width < COMPACT_BELOW;
  const hasSidePanel = !measured || width >= SIDE_PANEL_FROM;

  // Until the user picks a view, narrow layouts open on a single day.
  const [chosenView, setChosenView] = useState<CalendarView | undefined>();
  const view: CalendarView = chosenView ?? (compact ? "day" : "week");
  const [anchor, setAnchor] = useState(() => new Date());
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [draftStart, setDraftStart] = useState<Date | undefined>();

  const range = useMemo(() => {
    const { from, to } = visibleRange(view, anchor);
    return { from: from.toISOString(), to: to.toISOString() };
  }, [view, anchor]);
  const days = useMemo(() => visibleDays(view, anchor), [view, anchor]);

  const openDay = (day: Date) => {
    setAnchor(day);
    setChosenView("day");
  };

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

  // Admins need the directory to assign tutors; tutors need it to invite students.
  const hostsAnyMeeting = meetings.some((m) => m.hostId === currentUserId);
  const usersQuery = useQuery({
    queryKey: ["meetings", "users"],
    queryFn: () => userApi.findAll(),
    staleTime: 60_000,
    enabled: canSchedule || hostsAnyMeeting,
  });
  const users = (usersQuery.data ?? []) as MeetingUser[];

  // The API refuses inactive or unapproved accounts, so never offer them.
  const eligibleUsers = useMemo(
    () => users.filter((u) => u.isActive && u.isApproved),
    [users],
  );

  const hostOptions = useMemo(
    () => eligibleUsers.filter((u) => u.roleId === MEETING_ROLE_IDS.tutor),
    [eligibleUsers],
  );

  const inviteCandidates = useMemo(
    () =>
      isAdmin
        ? eligibleUsers.filter((u) => u.id !== currentUserId)
        : eligibleUsers.filter((u) => u.roleId === MEETING_ROLE_IDS.student),
    [eligibleUsers, isAdmin, currentUserId],
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
        { id: editing.id, dto: { ...payload, hostId: isAdmin ? values.hostId : undefined } },
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
      { ...payload, hostId: values.hostId },
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
    description: editing
      ? t("form.editDescription")
      : t(isAdmin ? "form.createDescriptionAdmin" : "form.createDescription"),
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
    className: "w-[560px] max-w-[95vw] max-h-[90dvh] overflow-y-auto",
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

  const selectMeeting = (meeting: ResponseMediaRoomDto) => {
    setSelectedId(meeting.id);
    if (!hasSidePanel) openSheet();
  };

  const clearSelection = () => {
    setSelectedId(undefined);
    closeSheet();
  };

  const detailPanel = selected && (
    <MeetingDetailPanel
      meeting={selected}
      participants={participants.data ?? []}
      users={users}
      inviteCandidates={inviteCandidates}
      isLoadingParticipants={participants.isLoading}
      isMutating={isMutating}
      canManage={canManage(selected)}
      canDelete={isAdmin}
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
            clearSelection();
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
      onClose={clearSelection}
    />
  );

  // Narrow layouts show the details in a drawer, from the inline end (left in Arabic).
  const { SheetFragment, openSheet, closeSheet, isOpen: isSheetOpen } = useSheet({
    title: selected?.title,
    headerClassName: "sr-only",
    showCloseButton: false,
    className: "w-full p-0 sm:max-w-md",
    onToggle: () => setSelectedId(undefined),
    children: <div className="h-full">{detailPanel}</div>,
  });

  // Moving between layouts (sidebar toggle, rotation) keeps the selection in the right place.
  useEffect(() => {
    if (hasSidePanel && isSheetOpen) closeSheet();
    if (!hasSidePanel && selectedId && !isSheetOpen) openSheet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSidePanel]);

  const scheduledInView = meetings.filter((m) => m.scheduledStartAt);
  const unscheduled = meetings.filter((m) => !m.scheduledStartAt);

  return (
    <div ref={rootRef} className={cn("flex min-h-0 flex-1 flex-col gap-3", className)}>
      <MeetingsToolbar
        view={view}
        onViewChange={setChosenView}
        anchor={anchor}
        onNavigate={(direction) => setAnchor((current) => stepAnchor(view, current, direction))}
        onToday={() => setAnchor(new Date())}
        canCreate={canSchedule}
        onCreate={() => openCreate()}
        compact={compact}
      />

      {calendar.isError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
          {meetingErrorMessage(calendar.error, t("messages.loadFailed"))}
        </div>
      )}

      <div className="flex min-h-0 flex-1 gap-3">
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg border">
          {view === "month" ? (
            <MeetingsMonthGrid
              month={anchor}
              meetings={scheduledInView}
              selectedId={selectedId}
              onSelect={selectMeeting}
              onDayClick={openDay}
              compact={measured && width < MONTH_CHIPS_FROM}
            />
          ) : (
            <MeetingsTimeGrid
              days={days}
              meetings={scheduledInView}
              selectedId={selectedId}
              onSelect={selectMeeting}
              onCreateAt={openCreate}
              onDayClick={openDay}
              canCreate={canSchedule}
              minColumnWidth={view === "week" ? "5.5rem" : "0px"}
            />
          )}

          {unscheduled.length > 0 && (
            <div className="shrink-0 border-t p-2">
              <div className="mb-1 text-xs font-medium text-muted-foreground">
                {t("grid.unscheduled")}
              </div>
              <div className="flex flex-wrap gap-2">
                {unscheduled.map((meeting) => (
                  <button
                    key={meeting.id}
                    type="button"
                    onClick={() => selectMeeting(meeting)}
                    className={cn(
                      "rounded-md border bg-muted/40 px-2 py-1 text-xs hover:bg-accent",
                      selectedId === meeting.id && "ring-2 ring-primary",
                    )}
                  >
                    {meeting.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {calendar.isFetching && (
            <div className="pointer-events-none absolute inset-0 z-30 bg-background/40 backdrop-blur-[1px]" />
          )}
        </div>

        {hasSidePanel && detailPanel && (
          <aside className="w-80 shrink-0 overflow-hidden rounded-lg border xl:w-96">
            {detailPanel}
          </aside>
        )}
      </div>

      {!hasSidePanel && SheetFragment}
      {DialogFragment}
    </div>
  );
}
