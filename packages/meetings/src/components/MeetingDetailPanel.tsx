import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { CalendarClock, Trash2, UserPlus, Users, Video, X } from "lucide-react";
import {
  Badge,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@qlp/ui";
import {
  MediaRoomStatus,
  ParticipantRole,
  type ResponseMediaRoomDto,
  type ResponseMediaRoomParticipantDto,
} from "@qlp/api-client";
import { MeetingStatusBadge } from "./MeetingStatusBadge";
import type { MeetingUser } from "../types";

interface MeetingDetailPanelProps {
  meeting: ResponseMediaRoomDto;
  participants: ResponseMediaRoomParticipantDto[];
  users: MeetingUser[];
  isLoadingParticipants?: boolean;
  isMutating?: boolean;
  canManage: boolean;
  joinHref?: string;
  onEdit: () => void;
  onEnd: () => void;
  onDelete: () => void;
  onInvite: (userId: string, role: ParticipantRole) => void;
  onRemoveParticipant: (userId: string) => void;
  onClose: () => void;
}

export function MeetingDetailPanel({
  meeting,
  participants,
  users,
  isLoadingParticipants,
  isMutating,
  canManage,
  joinHref,
  onEdit,
  onEnd,
  onDelete,
  onInvite,
  onRemoveParticipant,
  onClose,
}: MeetingDetailPanelProps) {
  const { t } = useTranslation("meetings");
  const [inviteUserId, setInviteUserId] = useState("");
  const [inviteRole, setInviteRole] = useState<ParticipantRole>(
    ParticipantRole.STUDENT,
  );

  const taken = participants.length + 1;
  const capacity = meeting.maxParticipants;
  const isFull = capacity > 0 && taken >= capacity;
  const isFinished = meeting.status === MediaRoomStatus.FINISHED;

  const nameOf = useMemo(() => {
    const byId = new Map(users.map((u) => [u.id, u]));
    return (id: string) => {
      const user = byId.get(id);
      if (!user) return id;
      return (
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        user.username ||
        id
      );
    };
  }, [users]);

  const invitable = useMemo(
    () =>
      users.filter(
        (u) =>
          u.id !== meeting.hostId &&
          !participants.some((p) => p.userId === u.id),
      ),
    [users, participants, meeting.hostId],
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-start justify-between gap-2 border-b p-4">
        <div className="min-w-0 space-y-1">
          <h3 className="truncate font-semibold">{meeting.title}</h3>
          <div className="flex flex-wrap items-center gap-2">
            <MeetingStatusBadge status={meeting.status} />
            {capacity > 0 && (
              <Badge variant={isFull ? "destructive" : "secondary"} className="gap-1">
                <Users className="size-3" />
                {t("detail.spots", { taken, capacity })}
              </Badge>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-auto p-4">
        {meeting.description && (
          <p className="text-sm text-muted-foreground">{meeting.description}</p>
        )}

        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarClock className="size-4" />
            {meeting.scheduledStartAt
              ? format(new Date(meeting.scheduledStartAt), "EEE d MMM · HH:mm")
              : t("detail.unscheduled")}
            {meeting.scheduledEndAt &&
              ` – ${format(new Date(meeting.scheduledEndAt), "HH:mm")}`}
          </div>
          <div className="text-muted-foreground">
            {t("detail.host")}:{" "}
            <span className="font-medium text-foreground">
              {meeting.hostName ?? nameOf(meeting.hostId)}
            </span>
          </div>
        </div>

        {joinHref && !isFinished && (
          <Button asChild className="w-full">
            <a
              href={joinHref}
              {...(/^https?:\/\//.test(joinHref)
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
            >
              <Video className="size-4" />
              {t("actions.open")}
            </a>
          </Button>
        )}

        {canManage && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">{t("detail.participants")}</h4>
            {isLoadingParticipants && (
              <span className="text-xs text-muted-foreground">{t("detail.loading")}</span>
            )}
          </div>

          <div className="rounded-md border">
            <div className="flex items-center justify-between border-b px-3 py-2 text-sm">
              <span className="truncate">{meeting.hostName ?? nameOf(meeting.hostId)}</span>
              <Badge variant="outline">{t("roles.host")}</Badge>
            </div>
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between gap-2 border-b px-3 py-2 text-sm last:border-b-0"
              >
                <span className="truncate">{nameOf(participant.userId)}</span>
                <div className="flex shrink-0 items-center gap-1">
                  <Badge variant="outline">{t(`roles.${participant.role}`)}</Badge>
                  {canManage && !isFinished && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      disabled={isMutating}
                      onClick={() => onRemoveParticipant(participant.userId)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {participants.length === 0 && !isLoadingParticipants && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                {t("detail.noParticipants")}
              </div>
            )}
          </div>
        </div>
        )}

        {canManage && !isFinished && (
          <div className="space-y-2 rounded-md border p-3">
            <h4 className="text-sm font-medium">{t("detail.invite")}</h4>
            {isFull ? (
              <p className="text-xs text-destructive">{t("detail.full")}</p>
            ) : (
              <div className="space-y-2">
                <Select value={inviteUserId} onValueChange={setInviteUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("detail.selectUser")} />
                  </SelectTrigger>
                  <SelectContent>
                    {invitable.map((user) => (
                      <SelectItem key={user.id} value={user.id as string}>
                        {nameOf(user.id as string)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={inviteRole}
                  onValueChange={(value) => setInviteRole(value as ParticipantRole)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ParticipantRole.STUDENT}>
                      {t("roles.student")}
                    </SelectItem>
                    <SelectItem value={ParticipantRole.OBSERVER}>
                      {t("roles.observer")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  className="w-full"
                  disabled={!inviteUserId || isMutating}
                  onClick={() => {
                    onInvite(inviteUserId, inviteRole);
                    setInviteUserId("");
                  }}
                >
                  <UserPlus className="size-4" />
                  {t("actions.invite")}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {canManage && (
        <div className={cn("flex flex-wrap gap-2 border-t p-3")}>
          <Button variant="secondary" onClick={onEdit} disabled={isMutating || isFinished}>
            {t("actions.edit")}
          </Button>
          <Button variant="outline" onClick={onEnd} disabled={isMutating || isFinished}>
            {t("actions.end")}
          </Button>
          <Button variant="destructive" onClick={onDelete} disabled={isMutating}>
            {t("actions.delete")}
          </Button>
        </div>
      )}
    </div>
  );
}
