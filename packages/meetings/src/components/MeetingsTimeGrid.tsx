import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { differenceInMinutes, format, isSameDay, isToday, startOfDay } from "date-fns";
import { cn } from "@qlp/ui";
import { MediaRoomStatus, type ResponseMediaRoomDto } from "@qlp/api-client";
import { HOUR_HEIGHT_PX, hourBounds, layoutDay, meetingEnd, meetingStart } from "../lib/calendar";
import { eventColorFor } from "../lib/eventColors";
import { useDateLocale } from "../hooks/useDateLocale";

interface MeetingsTimeGridProps {
  /** One day for the day view, seven for the week view. */
  days: Date[];
  meetings: ResponseMediaRoomDto[];
  selectedId?: string;
  onSelect: (meeting: ResponseMediaRoomDto) => void;
  onCreateAt: (start: Date) => void;
  /** Clicking a day header, e.g. to open that day in the day view. */
  onDayClick?: (day: Date) => void;
  canCreate?: boolean;
  /**
   * Minimum width of a day column. Below it the grid scrolls sideways instead of squeezing
   * seven days into a phone screen.
   */
  minColumnWidth?: string;
}

const GUTTER = "3.5rem";

export function MeetingsTimeGrid({
  days,
  meetings,
  selectedId,
  onSelect,
  onCreateAt,
  onDayClick,
  canCreate = true,
  minColumnWidth = "0px",
}: MeetingsTimeGridProps) {
  const { t } = useTranslation("meetings");
  const locale = useDateLocale();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isSingleDay = days.length === 1;

  const scheduled = useMemo(
    () =>
      meetings.filter((m) => {
        const start = meetingStart(m);
        return start && days.some((day) => isSameDay(start, day));
      }),
    [meetings, days],
  );

  const bounds = useMemo(() => hourBounds(scheduled), [scheduled]);
  const hours = useMemo(
    () => Array.from({ length: bounds.end - bounds.start }, (_, i) => bounds.start + i),
    [bounds],
  );

  // Keeps the "now" line moving.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  // Open on the current hour when today is visible, else on the first meeting, else 08:00.
  const firstDayKey = days[0]?.toDateString();
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const firstMeeting = scheduled
      .map((m) => meetingStart(m)!)
      .sort((a, b) => a.getTime() - b.getTime())[0];
    const targetHour = days.some((day) => isToday(day))
      ? new Date().getHours() - 1
      : (firstMeeting?.getHours() ?? 8);
    element.scrollTop = Math.max(0, (targetHour - bounds.start) * HOUR_HEIGHT_PX);
    // Only when the visible days change, not on every refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstDayKey, days.length]);

  const columns = `${GUTTER} repeat(${days.length}, minmax(${minColumnWidth}, 1fr))`;
  const nowOffset =
    ((differenceInMinutes(now, startOfDay(now)) - bounds.start * 60) / 60) * HOUR_HEIGHT_PX;
  const showNowLine = nowOffset >= 0 && nowOffset <= hours.length * HOUR_HEIGHT_PX;

  return (
    <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-auto">
      {/* Day headers stay visible while scrolling through the hours. */}
      <div
        className="sticky top-0 z-20 grid border-b bg-background"
        style={{ gridTemplateColumns: columns }}
      >
        <div className="sticky start-0 z-10 bg-background" />
        {days.map((day) => {
          const header = (
            <>
              <div className="text-xs uppercase text-muted-foreground">
                {format(day, isSingleDay ? "EEEE" : "EEE", { locale })}
              </div>
              <div
                className={cn(
                  "mx-auto flex size-7 items-center justify-center rounded-full text-sm font-semibold",
                  isToday(day) && "bg-primary text-primary-foreground",
                )}
              >
                {format(day, "d", { locale })}
              </div>
            </>
          );
          return onDayClick && !isSingleDay ? (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onDayClick(day)}
              className="border-s px-1 py-1.5 text-center transition-colors hover:bg-accent/40"
            >
              {header}
            </button>
          ) : (
            <div key={day.toISOString()} className="border-s px-1 py-1.5 text-center">
              {header}
            </div>
          );
        })}
      </div>

      <div className="grid" style={{ gridTemplateColumns: columns }}>
        {/* Hour labels stay visible while scrolling sideways through the week. */}
        <div className="sticky start-0 z-10 bg-background">
          {hours.map((hour) => (
            <div
              key={hour}
              className="relative border-b text-[10px] text-muted-foreground"
              style={{ height: HOUR_HEIGHT_PX }}
            >
              <span className="absolute end-1 top-0.5">
                {String(hour).padStart(2, "0")}:00
              </span>
            </div>
          ))}
        </div>

        {days.map((day) => {
          const positioned = layoutDay(
            scheduled.filter((m) => isSameDay(meetingStart(m)!, day)),
            bounds.start,
          );

          return (
            <div
              key={day.toISOString()}
              className={cn("relative border-s", isToday(day) && "bg-primary/[0.03]")}
            >
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
                  title={
                    canCreate
                      ? t("grid.createAt", { time: `${String(hour).padStart(2, "0")}:00` })
                      : undefined
                  }
                />
              ))}

              {isToday(day) && showNowLine && (
                <div
                  className="pointer-events-none absolute inset-x-0 z-[5] h-0.5 bg-destructive"
                  style={{ top: nowOffset }}
                >
                  <span className="absolute -start-1 -top-1 size-2.5 rounded-full bg-destructive" />
                </div>
              )}

              {positioned.map(({ meeting, top, height, column, columns: count }) => (
                <MeetingEventCard
                  key={meeting.id}
                  meeting={meeting}
                  detailed={isSingleDay}
                  selected={selectedId === meeting.id}
                  onSelect={onSelect}
                  style={{
                    top,
                    height: Math.max(height, 26),
                    insetInlineStart: `calc(${(column / count) * 100}% + 2px)`,
                    width: `calc(${100 / count}% - 4px)`,
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MeetingEventCard({
  meeting,
  detailed,
  selected,
  onSelect,
  style,
}: {
  meeting: ResponseMediaRoomDto;
  detailed: boolean;
  selected: boolean;
  onSelect: (meeting: ResponseMediaRoomDto) => void;
  style: CSSProperties;
}) {
  const { t } = useTranslation("meetings");
  const locale = useDateLocale();
  const color = eventColorFor(meeting.id);
  const start = meetingStart(meeting)!;
  const end = meetingEnd(meeting)!;
  const tall = typeof style.height === "number" && style.height >= 56;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onSelect(meeting);
      }}
      title={meeting.title}
      className={cn(
        "absolute z-[6] overflow-hidden rounded-md border px-1.5 py-1 text-start text-xs shadow-sm transition-shadow hover:shadow-md",
        color.chip,
        meeting.status === MediaRoomStatus.FINISHED && "opacity-50",
        selected && "ring-2 ring-ring ring-offset-1 ring-offset-background",
      )}
      style={style}
    >
      <div className="flex items-center gap-1">
        {meeting.status === MediaRoomStatus.ACTIVE && (
          <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-current" />
        )}
        <span className="truncate font-semibold">{meeting.title}</span>
      </div>
      <div className={cn("truncate text-[11px] tabular-nums", color.muted)}>
        {format(start, "p", { locale })} – {format(end, "p", { locale })}
        {meeting.maxParticipants > 0 &&
          ` · ${t("grid.spots", { count: meeting.maxParticipants })}`}
      </div>
      {detailed && tall && meeting.hostName && (
        <div className={cn("truncate text-[11px]", color.muted)}>
          {t("detail.host")}: {meeting.hostName}
        </div>
      )}
    </button>
  );
}
