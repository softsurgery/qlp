import { useState } from "react";
import { useTranslation } from "react-i18next";
import { endOfMonth, format, getWeekOfMonth, startOfMonth } from "date-fns";
import { ArrowLeft, ArrowRight, CalendarPlus, ChevronDown } from "lucide-react";
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  cn,
} from "@qlp/ui";
import type { ResponseMediaRoomDto } from "@qlp/api-client";
import { CALENDAR_VIEWS, WEEK_OPTIONS, visibleRange, type CalendarView } from "../lib/calendar";
import { useDateLocale } from "../hooks/useDateLocale";
import { MeetingsSearch } from "./MeetingsSearch";

interface MeetingsToolbarProps {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  anchor: Date;
  onNavigate: (direction: 1 | -1) => void;
  onToday: () => void;
  canCreate: boolean;
  onCreate: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  searchResults: ResponseMediaRoomDto[];
  onSearchPick: (meeting: ResponseMediaRoomDto) => void;
  /** Narrow layout: controls wrap under the title, icon-only create button. */
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
  search,
  onSearchChange,
  searchResults,
  onSearchPick,
  compact = false,
}: MeetingsToolbarProps) {
  const { t } = useTranslation("meetings");
  const locale = useDateLocale();
  const [searchOpen, setSearchOpen] = useState(Boolean(search));

  const subtitle = useRangeSubtitle(view, anchor);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
      <div className="flex min-w-0 items-center gap-3">
        <TodayCard onClick={onToday} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-lg font-semibold leading-tight" aria-live="polite">
              {format(anchor, "LLLL yyyy", { locale })}
            </h2>
            <Badge variant="outline" className="shrink-0 font-medium">
              {t("header.week", { number: getWeekOfMonth(anchor, WEEK_OPTIONS) })}
            </Badge>
          </div>
          <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-wrap items-center gap-2",
          compact ? "w-full" : "ms-auto",
        )}
      >
        <MeetingsSearch
          value={search}
          onChange={onSearchChange}
          results={searchResults}
          onPick={onSearchPick}
          onOpenChange={setSearchOpen}
          className={cn(compact && searchOpen && "order-last basis-full")}
        />

        <div className="inline-flex items-center rounded-md border shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-e-none"
            onClick={() => onNavigate(-1)}
            aria-label={t(`nav.previous.${view}`)}
          >
            <ArrowLeft className="size-4 rtl:rotate-180" />
          </Button>
          <Button
            variant="ghost"
            className="rounded-none border-x px-3 font-medium"
            onClick={onToday}
          >
            {t("nav.today")}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-s-none"
            onClick={() => onNavigate(1)}
            aria-label={t(`nav.next.${view}`)}
          >
            <ArrowRight className="size-4 rtl:rotate-180" />
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1.5 font-medium shadow-sm">
              {t(`views.${view}View`)}
              <ChevronDown className="size-4 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={view}
              onValueChange={(value) => onViewChange(value as CalendarView)}
            >
              {CALENDAR_VIEWS.map((option) => (
                <DropdownMenuRadioItem key={option} value={option}>
                  {t(`views.${option}View`)}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {canCreate && (
          <Button
            onClick={onCreate}
            size={compact ? "icon" : "default"}
            className={cn(compact && "ms-auto")}
            aria-label={compact ? t("actions.create") : undefined}
          >
            <CalendarPlus className="size-4" />
            {!compact && t("actions.create")}
          </Button>
        )}
      </div>
    </div>
  );
}

/** Today's date as a small calendar card; clicking it jumps back to today. */
function TodayCard({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation("meetings");
  const locale = useDateLocale();
  const today = new Date();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t("nav.today")}
      title={format(today, "PPPP", { locale })}
      className="w-14 shrink-0 overflow-hidden rounded-lg border text-center shadow-sm transition-colors hover:bg-accent/40"
    >
      <div className="bg-muted py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {format(today, "LLL", { locale })}
      </div>
      <div className="py-0.5 text-lg font-bold leading-7 text-primary">
        {format(today, "d", { locale })}
      </div>
    </button>
  );
}

function useRangeSubtitle(view: CalendarView, anchor: Date): string {
  const locale = useDateLocale();
  const options = { locale };

  if (view === "day") return format(anchor, "PPPP", options);

  const { from, to } =
    view === "month"
      ? { from: startOfMonth(anchor), to: endOfMonth(anchor) }
      : visibleRange("week", anchor);
  return `${format(from, "PP", options)} – ${format(to, "PP", options)}`;
}
