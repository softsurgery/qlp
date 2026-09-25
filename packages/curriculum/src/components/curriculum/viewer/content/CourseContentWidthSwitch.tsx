import { useTranslation } from "react-i18next";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  cn,
} from "@qlp/ui";

export type ContentWidth = "full" | "wide" | "narrow";

export const CONTENT_WIDTHS: {
  id: ContentWidth;
  className: string;
  barClassName: string;
  labelKey: "viewer.widthFull" | "viewer.widthWide" | "viewer.widthNarrow";
}[] = [
  {
    id: "full",
    className: "w-full",
    barClassName: "w-5",
    labelKey: "viewer.widthFull",
  },
  {
    id: "wide",
    className: "mx-auto w-full max-w-5xl",
    barClassName: "w-3.5",
    labelKey: "viewer.widthWide",
  },
  {
    id: "narrow",
    className: "mx-auto w-full max-w-3xl",
    barClassName: "w-2",
    labelKey: "viewer.widthNarrow",
  },
];

export function isContentWidth(value: unknown): value is ContentWidth {
  return value === "full" || value === "wide" || value === "narrow";
}

interface CourseContentWidthSwitchProps {
  className?: string;
  value: ContentWidth;
  onChange: (width: ContentWidth) => void;
}

export const CourseContentWidthSwitch = ({
  className,
  value,
  onChange,
}: CourseContentWidthSwitchProps) => {
  const { t: tCommon } = useTranslation("curriculum-common");

  return (
    <TooltipProvider delayDuration={300}>
      <div
        role="radiogroup"
        aria-label={tCommon("viewer.contentWidth")}
        className={cn(
          "inline-flex items-center rounded-md border bg-background p-0.5",
          className,
        )}
      >
        {CONTENT_WIDTHS.map((option) => {
          const selected = option.id === value;
          return (
            <Tooltip key={option.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={tCommon(option.labelKey)}
                  onClick={() => onChange(option.id)}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-sm text-muted-foreground transition-colors",
                    "hover:bg-muted hover:text-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected && "bg-muted text-foreground",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "block h-3 rounded-[2px] border-2 border-current",
                      option.barClassName,
                    )}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent hideArrow side="bottom" sideOffset={6}>
                {tCommon(option.labelKey)}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};
