import React from "react";
import { ListCheck } from "lucide-react";
import { cn } from "@qlp/ui";

export interface ActionGridItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

interface ActionGridProps {
  actions: ActionGridItem[];
  className?: string;
}

export function ActionGrid({ actions, className }: ActionGridProps) {
  return (
    <div
      className={cn("grid grid-cols-4 gap-2 w-full p-2 rounded-lg", className)}
    >
      {actions.map((action, index) => {
        return (
          <button
            key={index}
            type="button"
            className="flex flex-col items-center justify-center gap-1.5 p-2 text-primary hover:bg-primary/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={action.onClick}
            disabled={action.disabled}
          >
            <div className="flex items-center justify-center">
              {action.icon ? (
                React.isValidElement(action.icon) ? (
                  React.cloneElement(action.icon, {
                    className: cn("h-6 w-6", action.icon.props.className),
                  })
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
