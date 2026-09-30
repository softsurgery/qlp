import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Search, X } from "lucide-react";
import { Button, Input, cn } from "@qlp/ui";
import type { ResponseMediaRoomDto } from "@qlp/api-client";
import { eventColorFor } from "../lib/eventColors";
import { meetingStart } from "../lib/calendar";
import { useDateLocale } from "../hooks/useDateLocale";

const MAX_RESULTS = 8;

interface MeetingsSearchProps {
  value: string;
  onChange: (value: string) => void;
  /** Meetings matching `value` in the loaded range. */
  results: ResponseMediaRoomDto[];
  onPick: (meeting: ResponseMediaRoomDto) => void;
  className?: string;
  /** Called when the search opens or closes, e.g. to give it a full row on narrow layouts. */
  onOpenChange?: (open: boolean) => void;
}

/** A search button that expands into an input with a list of matching meetings. */
export function MeetingsSearch({
  value,
  onChange,
  results,
  onPick,
  className,
  onOpenChange,
}: MeetingsSearchProps) {
  const { t } = useTranslation("meetings");
  const locale = useDateLocale();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(Boolean(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => onOpenChange?.(open), [open, onOpenChange]);

  const close = () => {
    onChange("");
    setOpen(false);
  };

  if (!open) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={className}
        aria-label={t("search.open")}
        onClick={() => {
          setOpen(true);
          requestAnimationFrame(() => inputRef.current?.focus());
        }}
      >
        <Search className="size-4" />
      </Button>
    );
  }

  const query = value.trim();

  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        autoFocus
        value={value}
        placeholder={t("search.placeholder")}
        aria-label={t("search.placeholder")}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          if (!value) setOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") close();
          if (event.key === "Enter" && results[0]) onPick(results[0]);
        }}
        className="h-9 w-full ps-8 pe-8 sm:w-60"
      />
      <button
        type="button"
        className="absolute end-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
        aria-label={t("search.clear")}
        // Keep focus in the input so the list doesn't close before the click lands.
        onMouseDown={(event) => event.preventDefault()}
        onClick={close}
      >
        <X className="size-4" />
      </button>

      {focused && query && (
        <div className="absolute end-0 top-full z-40 mt-1 w-full min-w-64 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md sm:w-80">
          {results.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground">{t("search.noResults")}</p>
          ) : (
            <ul className="max-h-72 overflow-auto py-1">
              {results.slice(0, MAX_RESULTS).map((meeting) => {
                const start = meetingStart(meeting);
                return (
                  <li key={meeting.id}>
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => onPick(meeting)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-start text-sm hover:bg-accent"
                    >
                      <span
                        className={cn(
                          "h-8 w-1 shrink-0 rounded-full",
                          eventColorFor(meeting.id).swatch,
                        )}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{meeting.title}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {start ? format(start, "PPp", { locale }) : t("grid.unscheduled")}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
