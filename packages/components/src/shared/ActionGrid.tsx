import React from "react";
import { ListCheck } from "lucide-react";
import { cn } from "@qlp/ui";

export type ActionGridColor =
  | "default"
  | "primary"
  | "destructive"
  | "muted"
  | "secondary";

export interface ActionGridItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  color?: ActionGridColor;
}

interface ActionGridProps {
  actions: ActionGridItem[];
  className?: string;
  color?: ActionGridColor;
}

export function ActionGrid({ actions, className, color }: ActionGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full",
        className,
      )}
    >
      {actions.map((action, index) => {
        const itemColor = action.color || color || "primary";
        const colorClass =
          itemColor === "destructive"
            ? "text-destructive hover:bg-destructive/10"
            : itemColor === "muted"
              ? "text-muted-foreground hover:bg-muted hover:text-foreground"
              : itemColor === "secondary"
                ? "text-secondary-foreground hover:bg-secondary"
                : itemColor === "default"
                  ? "text-foreground hover:bg-accent hover:text-accent-foreground"
                  : "text-primary hover:bg-primary/10";

        return (
          <button
            key={index}
            type="button"
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              colorClass
            )}
            onClick={action.onClick}
            disabled={action.disabled}
          >
            <div className="flex items-center justify-center">
              {action.icon ? (
                React.isValidElement(action.icon) ? (
                  React.cloneElement(action.icon, {
                    className: cn("h-6 w-6", action.icon.props.className),
                  } as React.HTMLAttributes<HTMLElement>)
                ) : (
                  action.icon
                )
              ) : (
                <ListCheck className="h-6 w-6" />
              )}
            </div>
            <span className="text-xs font-medium text-center leading-tight">
              {action.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
