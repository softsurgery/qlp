import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { format, isSameDay, isSameMonth, isToday } from "date-fns";
import { cn } from "@qlp/ui";
import { MediaRoomStatus, type ResponseMediaRoomDto } from "@qlp/api-client";
import { meetingStart, sortByStart, visibleDays } from "../lib/calendar";
import { eventColorFor } from "../lib/eventColors";
import { useDateLocale } from "../hooks/useDateLocale";

// Each day shows this many events, then "N more…".
const MAX_EVENTS = 2;
const MAX_DOTS = 3;

interface MeetingsMonthGridProps {
  /** Any date inside the month to show. */
  month: Date;
  meetings: ResponseMediaRoomDto[];
  selectedId?: string;
  onSelect: (meeting: ResponseMediaRoomDto) => void;
  /** Opens a day, e.g. in the day view. */
  onDayClick: (day: Date) => void;
  /** Narrow layouts show coloured dots instead of titled events. */
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
        {days.slice(0, 7).map((day, index) => (
          <div
            key={day.toISOString()}
            className={cn(
              "py-2 text-center text-xs font-medium text-muted-foreground",
              index > 0 && "border-s",
            )}
          >
            {format(day, compact ? "EEEEE" : "EEE", { locale })}
          </div>
        ))}
      </div>

      <div
        className="grid min-h-0 flex-1 grid-cols-7"
        style={{
          gridTemplateRows: `repeat(${weeks}, minmax(${compact ? "3.75rem" : "7.5rem"}, 1fr))`,
        }}
      >
        {days.map((day, index) => {
          const dayMeetings = byDay[index];
          const inMonth = isSameMonth(day, month);
          const limit = compact ? MAX_DOTS : MAX_EVENTS;
          const hidden = dayMeetings.length - limit;

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
                "flex min-w-0 cursor-pointer flex-col gap-1 overflow-hidden border-b p-1.5 text-start transition-colors hover:bg-accent/30",
                index % 7 !== 0 && "border-s",
                !inMonth && "bg-muted/40",
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  compact && "self-center",
                  !inMonth && "text-muted-foreground",
                  isToday(day) && "bg-primary text-primary-foreground",
                )}
              >
                {format(day, "d", { locale })}
              </span>

              {compact ? (
                dayMeetings.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-0.5">
                    {dayMeetings.slice(0, MAX_DOTS).map((meeting) => (
                      <span
                        key={meeting.id}
                        className={cn(
                          "size-1.5 rounded-full",
                          eventColorFor(meeting.id).swatch,
                          meeting.status === MediaRoomStatus.FINISHED && "opacity-40",
                        )}
                      />
                    ))}
                    {hidden > 0 && (
                      <span className="text-[9px] leading-none text-muted-foreground">
                        +{hidden}
                      </span>
                    )}
                  </div>
                )
              ) : (
                <>
                  {dayMeetings.slice(0, MAX_EVENTS).map((meeting) => (
                    <MonthEventChip
                      key={meeting.id}
                      meeting={meeting}
                      faded={!inMonth || meeting.status === MediaRoomStatus.FINISHED}
                      selected={selectedId === meeting.id}
                      onSelect={onSelect}
                    />
                  ))}
                  {hidden > 0 && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDayClick(day);
                      }}
                      className="self-start px-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      {t("grid.more", { count: hidden })}
                    </button>
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

function MonthEventChip({
  meeting,
  faded,
  selected,
  onSelect,
}: {
  meeting: ResponseMediaRoomDto;
  faded: boolean;
  selected: boolean;
  onSelect: (meeting: ResponseMediaRoomDto) => void;
}) {
  const locale = useDateLocale();
  const color = eventColorFor(meeting.id);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onSelect(meeting);
      }}
      title={meeting.title}
      className={cn(
        "flex min-w-0 items-center justify-between gap-1.5 rounded-md border px-1.5 py-0.5 text-start text-xs transition-opacity hover:opacity-90",
        color.chip,
        faded && "opacity-50",
        selected && "ring-2 ring-ring ring-offset-1 ring-offset-background",
      )}
    >
      <span className="flex min-w-0 items-center gap-1">
        {meeting.status === MediaRoomStatus.ACTIVE && (
          <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-current" />
        )}
        <span className="truncate font-semibold">{meeting.title}</span>
      </span>
      <span className={cn("shrink-0 tabular-nums", color.muted)}>
        {format(meetingStart(meeting)!, "p", { locale })}
      </span>
    </button>
  );
}
