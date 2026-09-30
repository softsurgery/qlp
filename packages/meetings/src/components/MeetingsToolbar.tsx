import { useTranslation } from "react-i18next";
import { format, isSameMonth, isSameYear } from "date-fns";
import { CalendarPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button, cn } from "@qlp/ui";
import { CALENDAR_VIEWS, visibleRange, type CalendarView } from "../lib/calendar";
import { useDateLocale } from "../hooks/useDateLocale";

interface MeetingsToolbarProps {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  anchor: Date;
  onNavigate: (direction: 1 | -1) => void;
  onToday: () => void;
  canCreate: boolean;
  onCreate: () => void;
  /** Narrow layout: title on its own row, icon-only create button. */
  compact?: boolean;
}

export function MeetingsToolbar({
  view,
  onViewChange,
  anchor,
  onNavigate,
  onToday,
  canCreate,
  onCreate,
  compact = false,
}: MeetingsToolbarProps) {
  const { t } = useTranslation("meetings");
  const title = useRangeTitle(view, anchor, compact);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate(-1)}
          aria-label={t(`nav.previous.${view}`)}
        >
          <ChevronLeft className="size-4 rtl:rotate-180" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate(1)}
          aria-label={t(`nav.next.${view}`)}
        >
          <ChevronRight className="size-4 rtl:rotate-180" />
        </Button>
        <Button variant="ghost" onClick={onToday}>
          {t("nav.today")}
        </Button>
      </div>

      <h2
        className={cn(
          "truncate text-sm font-semibold sm:text-base",
          compact ? "order-last basis-full" : "min-w-0 flex-1",
        )}
        aria-live="polite"
      >
        {title}
      </h2>

      <div
        role="tablist"
        aria-label={t("views.label")}
        className={cn("flex rounded-md border p-0.5", compact && "ms-auto")}
      >
        {CALENDAR_VIEWS.map((option) => (
          <Button
            key={option}
            role="tab"
            aria-selected={view === option}
            size="sm"
            variant={view === option ? "secondary" : "ghost"}
            className="h-7 px-2.5"
            onClick={() => onViewChange(option)}
          >
            {t(`views.${option}`)}
          </Button>
        ))}
      </div>

      {canCreate &&
        (compact ? (
          <Button size="icon" onClick={onCreate} aria-label={t("actions.create")}>
            <CalendarPlus className="size-4" />
          </Button>
        ) : (
          <Button onClick={onCreate}>
            <CalendarPlus className="size-4" />
            {t("actions.create")}
          </Button>
        ))}
    </div>
  );
}

function useRangeTitle(view: CalendarView, anchor: Date, compact: boolean): string {
  const locale = useDateLocale();
  const options = { locale };

  if (view === "day") {
    return format(anchor, compact ? "EEE d MMM yyyy" : "EEEE d MMMM yyyy", options);
  }
  if (view === "month") {
    return format(anchor, "MMMM yyyy", options);
  }

  const { from, to } = visibleRange("week", anchor);
  if (isSameMonth(from, to)) {
    return `${format(from, "d", options)} – ${format(to, "d MMM yyyy", options)}`;
  }
  if (isSameYear(from, to)) {
    return `${format(from, "d MMM", options)} – ${format(to, "d MMM yyyy", options)}`;
  }
  return `${format(from, "d MMM yyyy", options)} – ${format(to, "d MMM yyyy", options)}`;
}
