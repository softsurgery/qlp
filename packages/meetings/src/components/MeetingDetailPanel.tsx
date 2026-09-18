import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { CalendarClock, Video, X } from "lucide-react";
import {
  Button,
  cn,
} from "@qlp/ui";
import {
  MediaRoomStatus,
  type ResponseMediaRoomDto,
} from "@qlp/api-client";
import { MeetingStatusBadge } from "./MeetingStatusBadge";
import type { MeetingUser } from "../types";

interface MeetingDetailPanelProps {
  meeting: ResponseMediaRoomDto;
  users: MeetingUser[];
  isMutating?: boolean;
  canManage: boolean;
  joinHref?: string;
  onEdit: () => void;
  onEnd: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function MeetingDetailPanel({
  meeting,
  users,
  isMutating,
  canManage,
  joinHref,
  onEdit,
  onEnd,
  onDelete,
  onClose,
}: MeetingDetailPanelProps) {
  const { t } = useTranslation("meetings");

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


  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-start justify-between gap-2 border-b p-4">
        <div className="min-w-0 space-y-1">
          <h3 className="truncate font-semibold">{meeting.title}</h3>
          <div className="flex flex-wrap items-center gap-2">
            <MeetingStatusBadge status={meeting.status} />
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
