import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { format, isSameDay, isSameMonth, isToday } from "date-fns";
import { cn } from "@qlp/ui";
import type { ResponseMediaRoomDto } from "@qlp/api-client";
import { MeetingStatusDot } from "./MeetingStatusBadge";
import { meetingStart, sortByStart, visibleDays } from "../lib/calendar";
import { useDateLocale } from "../hooks/useDateLocale";

const MAX_CHIPS = 3;
const MAX_DOTS = 3;

interface MeetingsMonthGridProps {
  /** Any date inside the month to show. */
  month: Date;
  meetings: ResponseMediaRoomDto[];
  selectedId?: string;
  onSelect: (meeting: ResponseMediaRoomDto) => void;
  /** Opens a day, e.g. in the day view. */
  onDayClick: (day: Date) => void;
  /** Narrow layouts show dots instead of titled chips. */
  compact?: boolean;
}

export function MeetingsMonthGrid({
  month,
  meetings,
  selectedId,
  onSelect,
  onDayClick,
  compact = false,
}: MeetingsMonthGridProps) {
  const { t } = useTranslation("meetings");
  const locale = useDateLocale();

  const days = useMemo(() => visibleDays("month", month), [month]);
  const weeks = days.length / 7;

  const byDay = useMemo(() => {
    const scheduled = sortByStart(meetings.filter((m) => m.scheduledStartAt));
    return days.map((day) => scheduled.filter((m) => isSameDay(meetingStart(m)!, day)));
  }, [days, meetings]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto">
      <div className="sticky top-0 z-10 grid shrink-0 grid-cols-7 border-b bg-background">
        {days.slice(0, 7).map((day) => (
          <div
            key={day.toISOString()}
            className="py-2 text-center text-xs uppercase text-muted-foreground"
          >
            {format(day, compact ? "EEEEE" : "EEE", { locale })}
          </div>
        ))}
      </div>

      <div
        className="grid min-h-0 flex-1 grid-cols-7"
        style={{
          gridTemplateRows: `repeat(${weeks}, minmax(${compact ? "3.5rem" : "6.5rem"}, 1fr))`,
        }}
      >
        {days.map((day, index) => {
          const dayMeetings = byDay[index];
          const inMonth = isSameMonth(day, month);
          const hidden = dayMeetings.length - (compact ? MAX_DOTS : MAX_CHIPS);

          return (
            <div
              key={day.toISOString()}
              role="button"
              tabIndex={0}
              onClick={() => onDayClick(day)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onDayClick(day);
                }
              }}
              aria-label={format(day, "PPPP", { locale })}
              className={cn(
                "flex min-w-0 cursor-pointer flex-col gap-1 overflow-hidden border-b border-s p-1 text-start transition-colors hover:bg-accent/40",
                index % 7 === 0 && "border-s-0",
                !inMonth && "bg-muted/30 text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center self-center rounded-full text-xs font-medium sm:self-start",
                  isToday(day) && "bg-primary text-primary-foreground",
                )}
              >
                {format(day, "d", { locale })}
              </span>

              {compact ? (
                dayMeetings.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-0.5">
                    {dayMeetings.slice(0, MAX_DOTS).map((meeting) => (
                      <MeetingStatusDot key={meeting.id} status={meeting.status} large />
                    ))}
                    {hidden > 0 && <span className="text-[9px] leading-none">+{hidden}</span>}
                  </div>
                )
              ) : (
                <>
                  {dayMeetings.slice(0, MAX_CHIPS).map((meeting) => (
                    <button
                      key={meeting.id}
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onSelect(meeting);
                      }}
                      className={cn(
                        "flex min-w-0 items-center gap-1 rounded px-1 py-0.5 text-start text-[11px] leading-tight",
                        "bg-primary/10 hover:bg-primary/20",
                        meeting.status === "finished" && "bg-muted text-muted-foreground",
                        meeting.status === "active" && "bg-emerald-500/15",
                        selectedId === meeting.id && "ring-1 ring-primary",
                      )}
                    >
                      <MeetingStatusDot status={meeting.status} />
                      <span className="shrink-0 tabular-nums opacity-80">
                        {format(meetingStart(meeting)!, "HH:mm")}
                      </span>
                      <span className="truncate">{meeting.title}</span>
                    </button>
                  ))}
                  {hidden > 0 && (
                    <span className="px-1 text-[11px] font-medium text-muted-foreground">
                      {t("grid.more", { count: hidden })}
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
