import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import {
  DataTableCell,
  DataTableCellVariant,
  DataTableColumnHeader,
  DataTableRowActions,
  type DataTableConfig,
} from "@qlp/datatable-builder";
import {
  Badge,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@qlp/ui";
import type { ResponseRoleDto } from "@qlp/api-client";
import { formatPermissionLabel } from "./utils";
import React from "react";

export const useRoleColumns = (
  context: DataTableConfig<ResponseRoleDto>,
): ColumnDef<ResponseRoleDto>[] => {
  const { t } = useTranslation("role");
  const { t: tCommon } = useTranslation("common");

  return React.useMemo(
    () => [
      {
        accessorKey: "label",
        meta: {
          title: t("columns.label"),
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("columns.label")}
            attribute="label"
            context={context}
          />
        ),
        cell: ({ row }) => <div>{row.original.label}</div>,
        enableSorting: true,
      },
      {
        accessorKey: "description",
        meta: {
          title: t("columns.description"),
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("columns.description")}
            attribute="description"
            context={context}
          />
        ),
        cell: ({ row }) => (
          <div>{row.original.description || t("columns.noDescription")}</div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "permissions",
        meta: {
          title: t("columns.permissions"),
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("columns.permissions")}
            attribute="permissions"
            context={context}
          />
        ),
        cell: ({ row }) => {
          const entries =
            row.original.permissions?.map((p) => p.permission) ?? [];
          if (entries.length === 0) {
            return (
              <div className="opacity-70">{t("columns.noPermissions")}</div>
            );
          }
          const visiblePermissions = entries.slice(0, 2);
          const hiddenPermissions = entries.slice(2);
          return (
            <div className="flex flex-wrap gap-1">
              {visiblePermissions.map((entry, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="whitespace-nowrap font-normal"
                >
                  {formatPermissionLabel(entry?.label) ||
                    tCommon("general.unknown")}
                </Badge>
              ))}
              {hiddenPermissions.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="outline"
                        className="cursor-pointer whitespace-nowrap font-normal"
                      >
                        +{hiddenPermissions.length} {tCommon("general.more")}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="flex max-h-64 max-w-sm flex-wrap gap-1 overflow-y-auto bg-card p-2 shadow-md"
                    >
                      {hiddenPermissions.map((entry, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="justify-center whitespace-nowrap font-normal"
                        >
                          {formatPermissionLabel(entry?.label) ||
                            tCommon("general.unknown")}
                        </Badge>
                      ))}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "createdAt",
        meta: {
          title: t("columns.createdAt"),
          filterKey: "createdAt",
          filterField: "createdAt",
          filterType: "date-range",
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("columns.createdAt")}
            attribute="createdAt"
            context={context}
          />
        ),
        cell: ({ row }) => (
          <DataTableCell
            variant={DataTableCellVariant.DATE_TIME}
            value={
              row.original.createdAt
                ? new Date(row.original.createdAt)
                : undefined
            }
          />
        ),
        enableSorting: true,
      },
      {
        accessorKey: "updatedAt",
        meta: {
          title: t("columns.updatedAt"),
          filterKey: "updatedAt",
          filterField: "updatedAt",
          filterType: "date-range",
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("columns.updatedAt")}
            attribute="updatedAt"
            context={context}
          />
        ),
        cell: ({ row }) => (
          <DataTableCell
            variant={DataTableCellVariant.DATE_TIME}
            value={
              row.original.updatedAt
                ? new Date(row.original.updatedAt)
                : undefined
            }
          />
        ),
        enableSorting: true,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex justify-center">
            <DataTableRowActions row={row} context={context} />
          </div>
        ),
      },
    ],
    [],
  );
};
