/*
 * Cool colours for calendar events, each with light and dark variants. Class names are
 * written out in full so Tailwind can find them.
 */
export interface EventColor {
  /** Border, background and title colour of an event chip or card. */
  chip: string;
  /** The secondary text (time) inside it. */
  muted: string;
  /** A solid swatch, e.g. for search results. */
  swatch: string;
}

export const EVENT_COLORS: readonly EventColor[] = [
  {
    chip: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/70 dark:text-blue-300",
    muted: "text-blue-600/80 dark:text-blue-400/80",
    swatch: "bg-blue-500",
  },
  {
    chip: "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300",
    muted: "text-indigo-600/80 dark:text-indigo-400/80",
    swatch: "bg-indigo-500",
  },
  {
    chip: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/70 dark:text-violet-300",
    muted: "text-violet-600/80 dark:text-violet-400/80",
    swatch: "bg-violet-500",
  },
  {
    chip: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950/70 dark:text-purple-300",
    muted: "text-purple-600/80 dark:text-purple-400/80",
    swatch: "bg-purple-500",
  },
  {
    chip: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-800 dark:bg-fuchsia-950/70 dark:text-fuchsia-300",
    muted: "text-fuchsia-600/80 dark:text-fuchsia-400/80",
    swatch: "bg-fuchsia-500",
  },
  {
    chip: "border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-800 dark:bg-pink-950/70 dark:text-pink-300",
    muted: "text-pink-600/80 dark:text-pink-400/80",
    swatch: "bg-pink-500",
  },
  {
    chip: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/70 dark:text-sky-300",
    muted: "text-sky-600/80 dark:text-sky-400/80",
    swatch: "bg-sky-500",
  },
  {
    chip: "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-300",
    muted: "text-cyan-600/80 dark:text-cyan-400/80",
    swatch: "bg-cyan-500",
  },
  {
    chip: "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950/70 dark:text-teal-300",
    muted: "text-teal-600/80 dark:text-teal-400/80",
    swatch: "bg-teal-500",
  },
  {
    chip: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300",
    muted: "text-emerald-600/80 dark:text-emerald-400/80",
    swatch: "bg-emerald-500",
  },
];

/**
 * A colour picked from the palette by the meeting id: random-looking across meetings, but
 * the same meeting keeps its colour across reloads and views.
 */
export function eventColorFor(id: string): EventColor {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return EVENT_COLORS[Math.abs(hash) % EVENT_COLORS.length];
}
