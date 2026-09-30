import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  addDays,
  differenceInMinutes,
  format,
  isSameDay,
  isToday,
  startOfDay,
} from "date-fns";
import { cn } from "@qlp/ui";
import type { ResponseMediaRoomDto } from "@qlp/api-client";
import { MeetingStatusDot } from "./MeetingStatusBadge";

const DAY_START_HOUR = 7;
const DAY_END_HOUR = 22;
const HOUR_HEIGHT_PX = 56;
const DEFAULT_DURATION_MIN = 60;

interface MeetingsWeekGridProps {
  weekStart: Date;
  meetings: ResponseMediaRoomDto[];
  selectedId?: string;
  onSelect: (meeting: ResponseMediaRoomDto) => void;
  onCreateAt: (start: Date) => void;
  canCreate?: boolean;
  isLoading?: boolean;
}

interface PositionedMeeting {
  meeting: ResponseMediaRoomDto;
  top: number;
  height: number;
  column: number;
  columns: number;
}

function layoutDay(meetings: ResponseMediaRoomDto[]): PositionedMeeting[] {
  const sorted = [...meetings].sort(
    (a, b) =>
      new Date(a.scheduledStartAt ?? 0).getTime() -
      new Date(b.scheduledStartAt ?? 0).getTime(),
  );

  const clusters: ResponseMediaRoomDto[][] = [];
  let current: ResponseMediaRoomDto[] = [];
  let clusterEnd = 0;

  for (const meeting of sorted) {
    const start = new Date(meeting.scheduledStartAt as string).getTime();
    const end = meeting.scheduledEndAt
      ? new Date(meeting.scheduledEndAt).getTime()
      : start + DEFAULT_DURATION_MIN * 60_000;

    if (current.length && start >= clusterEnd) {
      clusters.push(current);
      current = [];
      clusterEnd = 0;
    }
    current.push(meeting);
    clusterEnd = Math.max(clusterEnd, end);
  }
  if (current.length) clusters.push(current);

  const positioned: PositionedMeeting[] = [];

  for (const cluster of clusters) {
    cluster.forEach((meeting, index) => {
      const start = new Date(meeting.scheduledStartAt as string);
      const end = meeting.scheduledEndAt
        ? new Date(meeting.scheduledEndAt)
        : new Date(start.getTime() + DEFAULT_DURATION_MIN * 60_000);

      const minutesFromTop =
        differenceInMinutes(start, startOfDay(start)) - DAY_START_HOUR * 60;
      const durationMin = Math.max(30, differenceInMinutes(end, start));

      positioned.push({
        meeting,
        top: Math.max(0, (minutesFromTop / 60) * HOUR_HEIGHT_PX),
        height: (durationMin / 60) * HOUR_HEIGHT_PX,
        column: index,
        columns: cluster.length,
      });
    });
  }

  return positioned;
}

export function MeetingsWeekGrid({
  weekStart,
  meetings,
  selectedId,
  onSelect,
  onCreateAt,
  canCreate = true,
  isLoading,
}: MeetingsWeekGridProps) {
  const { t } = useTranslation("meetings");

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const hours = useMemo(
    () =>
      Array.from(
        { length: DAY_END_HOUR - DAY_START_HOUR + 1 },
        (_, i) => DAY_START_HOUR + i,
      ),
    [],
  );

  const scheduled = meetings.filter((m) => m.scheduledStartAt);
  const unscheduled = meetings.filter((m) => !m.scheduledStartAt);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid shrink-0 grid-cols-[3.5rem_repeat(7,minmax(0,1fr))] border-b">
        <div />
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              "border-l px-2 py-2 text-center",
              isToday(day) && "bg-primary/5",
            )}
          >
            <div className="text-xs uppercase text-muted-foreground">
              {format(day, "EEE")}
            </div>
            <div
              className={cn(
                "text-sm font-semibold",
                isToday(day) && "text-primary",
              )}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      <div className="relative min-h-0 flex-1 overflow-auto">
        <div className="grid grid-cols-[3.5rem_repeat(7,minmax(0,1fr))]">
          <div>
            {hours.map((hour) => (
              <div
                key={hour}
                className="relative border-b text-[10px] text-muted-foreground"
                style={{ height: HOUR_HEIGHT_PX }}
              >
                <span className="absolute -top-1.5 right-1">{hour}:00</span>
              </div>
            ))}
          </div>

          {days.map((day) => {
            const dayMeetings = scheduled.filter((m) =>
              isSameDay(new Date(m.scheduledStartAt as string), day),
            );
            const positioned = layoutDay(dayMeetings);

            return (
              <div key={day.toISOString()} className="relative border-l">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className={cn(
                      "border-b transition-colors",
                      canCreate && "cursor-pointer hover:bg-accent/40",
                    )}
                    style={{ height: HOUR_HEIGHT_PX }}
                    onClick={
                      canCreate
                        ? () => {
                            const start = new Date(day);
                            start.setHours(hour, 0, 0, 0);
                            onCreateAt(start);
                          }
                        : undefined
                    }
                    title={canCreate ? t("grid.createAt", { time: `${hour}:00` }) : undefined}
                  />
                ))}

                {positioned.map(({ meeting, top, height, column, columns }) => (
                  <button
                    key={meeting.id}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelect(meeting);
                    }}
                    className={cn(
                      "absolute overflow-hidden rounded-md border px-1.5 py-1 text-left text-xs shadow-sm transition-shadow",
                      "bg-primary/10 border-primary/30 hover:shadow-md",
                      meeting.status === "finished" &&
                        "bg-muted border-border text-muted-foreground",
                      meeting.status === "active" &&
                        "bg-emerald-500/15 border-emerald-500/40",
                      selectedId === meeting.id && "ring-2 ring-primary",
                    )}
                    style={{
                      top,
                      height: Math.max(height, 26),
                      left: `calc(${(column / columns) * 100}% + 2px)`,
                      width: `calc(${100 / columns}% - 4px)`,
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <MeetingStatusDot status={meeting.status} />
                      <span className="truncate font-medium">{meeting.title}</span>
                    </div>
                    <div className="truncate text-[10px] opacity-80">
                      {format(new Date(meeting.scheduledStartAt as string), "HH:mm")}
                      {meeting.maxParticipants > 0 &&
                        ` · ${t("grid.spots", { count: meeting.maxParticipants })}`}
                    </div>
                  </button>
                ))}
              </div>
            );
          })}
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px]" />
        )}
      </div>

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
                onClick={() => onSelect(meeting)}
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
    </div>
  );
}
