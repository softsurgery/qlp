import type { ReactNode } from "react";
import { FileText } from "lucide-react";
import { cn } from "@qlp/ui";

interface CourseOutlineRowProps {
  className?: string;
  title: string;
  meta?: string;
  icon?: ReactNode;
  index?: number;
  onClick: () => void;
}

export const CourseOutlineRow = ({
  className,
  title,
  meta,
  icon,
  index,
  onClick,
}: CourseOutlineRowProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border bg-card px-4 py-3 text-start transition-colors hover:bg-muted/50",
        className,
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-semibold text-muted-foreground">
        {icon ?? index ?? <FileText className="size-4" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{title}</span>
        {meta ? (
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
            {meta}
          </span>
        ) : null}
      </span>
    </button>
  );
};
