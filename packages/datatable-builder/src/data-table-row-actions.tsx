import React from "react";

import { DataTableConfig } from "./types";

import { Row } from "@tanstack/react-table";
import { Edit, Ellipsis, Telescope, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@qlp/ui";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  context: DataTableConfig<TData>;
}

export function DataTableRowActions<TData>({
  row,
  context,
}: DataTableRowActionsProps<TData>) {
  const entity = row.original;

  const { t } = useTranslation("common");

  const targetAndTrigger = (callback: (entity: TData) => void) => {
    if (callback) {
      context.targetEntity?.(entity);
      // Wait for DropdownMenu close animation to finish to release pointer-events lock
      setTimeout(() => {
        callback(entity);
      }, 150);
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Ellipsis className="h-4 w-4" />
          <span className="sr-only">{t("commands.actions")}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-40 font-medium"
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <DropdownMenuLabel className="text-center font-black text-xs">
          {t("commands.actions")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {context.inspectCallback && (
          <>
            <DropdownMenuItem
              onClick={() =>
                targetAndTrigger(() => context.inspectCallback?.(entity))
              }
            >
              <Telescope className="size-4" />
              <span className="mx-1 text-xs">{t("commands.inspect")}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {Object.values(context.additionalActions ?? {}).map((group, index) => (
          <React.Fragment key={`group-${index}`}>
            {group.map((action, idx) => {
              if (action.isActionVisible && !action.isActionVisible(entity)) {
                return null;
              }

              return (
                <DropdownMenuItem
                  key={`action-${idx}`}
                  onClick={() =>
                    targetAndTrigger(() => action.actionCallback?.(entity))
                  }
                >
                  {action.actionIcon}
                  <span className="mx-1 text-xs">{action.actionLabel}</span>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
          </React.Fragment>
        ))}

        {context.updateCallback && (
          <DropdownMenuItem
            onClick={() =>
              targetAndTrigger(() => context.updateCallback?.(entity))
            }
          >
            <Edit className="size-4" />
            <span className="mx-1 text-xs">{t("commands.edit")}</span>
          </DropdownMenuItem>
        )}

        {context.deleteCallback && (
          <DropdownMenuItem
            onClick={() =>
              targetAndTrigger(() => context.deleteCallback?.(entity))
            }
          >
            <Trash2 className="size-4" />
            <span className="mx-1 text-xs">{t("commands.delete")}</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
