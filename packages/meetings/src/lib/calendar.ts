import {
  addDays,
  addMonths,
  addWeeks,
  differenceInMinutes,
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
  type Locale,
} from "date-fns";
import { ar, enUS } from "date-fns/locale";
import type { ResponseMediaRoomDto } from "@qlp/api-client";

export type CalendarView = "day" | "week" | "month";

export const CALENDAR_VIEWS: CalendarView[] = ["day", "week", "month"];

export const WEEK_OPTIONS = { weekStartsOn: 1 } as const;

// Visible hours in the day/week grid, widened when a meeting falls outside them.
export const DEFAULT_DAY_START_HOUR = 7;
export const DEFAULT_DAY_END_HOUR = 22;
export const HOUR_HEIGHT_PX = 56;
export const DEFAULT_DURATION_MIN = 60;

const DATE_LOCALES: Record<string, Locale> = { en: enUS, ar };

export function dateLocaleFor(language: string | undefined): Locale {
  return DATE_LOCALES[language?.split("-")[0] ?? "en"] ?? enUS;
}

/** The days a view shows around its anchor date. Month includes the leading/trailing week days. */
export function visibleDays(view: CalendarView, anchor: Date): Date[] {
  const { from, to } = visibleRange(view, anchor);
  const days: Date[] = [];
  for (let day = from; day <= to; day = addDays(day, 1)) days.push(day);
  return days;
}

export function visibleRange(view: CalendarView, anchor: Date): { from: Date; to: Date } {
  switch (view) {
    case "day":
      return { from: startOfDay(anchor), to: endOfDay(anchor) };
    case "week":
      return {
        from: startOfWeek(anchor, WEEK_OPTIONS),
        to: endOfWeek(anchor, WEEK_OPTIONS),
      };
    case "month":
      return {
        from: startOfWeek(startOfMonth(anchor), WEEK_OPTIONS),
        to: endOfWeek(endOfMonth(anchor), WEEK_OPTIONS),
      };
  }
}

export function stepAnchor(view: CalendarView, anchor: Date, direction: 1 | -1): Date {
  switch (view) {
    case "day":
      return addDays(anchor, direction);
    case "week":
      return addWeeks(anchor, direction);
    case "month":
      return addMonths(anchor, direction);
  }
}

export function meetingStart(meeting: ResponseMediaRoomDto): Date | undefined {
  return meeting.scheduledStartAt ? new Date(meeting.scheduledStartAt) : undefined;
}

export function meetingEnd(meeting: ResponseMediaRoomDto): Date | undefined {
  const start = meetingStart(meeting);
  if (!start) return undefined;
  return meeting.scheduledEndAt
    ? new Date(meeting.scheduledEndAt)
    : new Date(start.getTime() + DEFAULT_DURATION_MIN * 60_000);
}

export function sortByStart(meetings: ResponseMediaRoomDto[]): ResponseMediaRoomDto[] {
  return [...meetings].sort(
    (a, b) => (meetingStart(a)?.getTime() ?? 0) - (meetingStart(b)?.getTime() ?? 0),
  );
}

/** Hours to draw so that every meeting in view is visible, never narrower than the defaults. */
export function hourBounds(meetings: ResponseMediaRoomDto[]): { start: number; end: number } {
  let start = DEFAULT_DAY_START_HOUR;
  let end = DEFAULT_DAY_END_HOUR;
  for (const meeting of meetings) {
    const from = meetingStart(meeting);
    const to = meetingEnd(meeting);
    if (!from || !to) continue;
    start = Math.min(start, from.getHours());
    // A meeting ending exactly on the hour doesn't need the next row.
    const endHour = to.getMinutes() > 0 ? to.getHours() + 1 : to.getHours();
    // Meetings running past midnight are clipped to the end of their day.
    end = Math.max(end, to.getDate() === from.getDate() ? endHour : 24);
  }
  return { start, end: Math.min(end, 24) };
}

export interface PositionedMeeting {
  meeting: ResponseMediaRoomDto;
  top: number;
  height: number;
  column: number;
  columns: number;
}

/** Places a day's meetings on the time grid; overlapping meetings share the width side by side. */
export function layoutDay(
  meetings: ResponseMediaRoomDto[],
  startHour: number,
): PositionedMeeting[] {
  const clusters: ResponseMediaRoomDto[][] = [];
  let current: ResponseMediaRoomDto[] = [];
  let clusterEnd = 0;

  for (const meeting of sortByStart(meetings)) {
    const start = meetingStart(meeting)!.getTime();
    const end = meetingEnd(meeting)!.getTime();
    if (current.length && start >= clusterEnd) {
      clusters.push(current);
      current = [];
      clusterEnd = 0;
    }
    current.push(meeting);
    clusterEnd = Math.max(clusterEnd, end);
  }
  if (current.length) clusters.push(current);

  return clusters.flatMap((cluster) =>
    cluster.map((meeting, index) => {
      const start = meetingStart(meeting)!;
      const end = meetingEnd(meeting)!;
      const minutesFromTop =
        differenceInMinutes(start, startOfDay(start)) - startHour * 60;
      const durationMin = Math.max(30, differenceInMinutes(end, start));
      return {
        meeting,
        top: Math.max(0, (minutesFromTop / 60) * HOUR_HEIGHT_PX),
        height: (durationMin / 60) * HOUR_HEIGHT_PX,
        column: index,
        columns: cluster.length,
      };
    }),
  );
}
