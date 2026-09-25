import { useTranslation } from "react-i18next";
import { Badge, cn } from "@qlp/ui";
import { MediaRoomStatus } from "@qlp/api-client";

const TONE: Record<string, string> = {
  [MediaRoomStatus.IDLE]: "bg-muted-foreground/50",
  [MediaRoomStatus.ACTIVE]: "bg-emerald-500 animate-pulse",
  [MediaRoomStatus.FINISHED]: "bg-border",
};

export function MeetingStatusDot({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-block size-1.5 shrink-0 rounded-full",
        TONE[status] ?? TONE[MediaRoomStatus.IDLE],
      )}
    />
  );
}

export function MeetingStatusBadge({ status }: { status: string }) {
  const { t } = useTranslation("meetings");
  return (
    <Badge
      variant={status === MediaRoomStatus.ACTIVE ? "default" : "secondary"}
      className="gap-1.5"
    >
      <MeetingStatusDot status={status} />
      {t(`status.${status}`)}
    </Badge>
  );
}
