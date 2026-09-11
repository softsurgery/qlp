import React from "react";
import { useTranslation } from "react-i18next";
import type { ColumnDef } from "@tanstack/react-table";
import {
  DataTableCell,
  DataTableCellVariant,
  DataTableColumnHeader,
  DataTableRowActions,
  type DataTableColumnFilterOption,
  type DataTableConfig,
} from "@qlp/datatable-builder";
import type { ResponseCurriculumDto } from "@qlp/api-client";
import { Badge } from "@qlp/ui";
import { capitalize } from "lodash";

export function useCurriculumColumns(
  context: DataTableConfig<ResponseCurriculumDto>,
  statusFilterOptions: DataTableColumnFilterOption[],
): ColumnDef<ResponseCurriculumDto>[] {
  const { t } = useTranslation("curriculum");

  return React.useMemo(
    () =>
      [
        {
          accessorKey: "title",
          meta: {
            title: t("columns.title"),
            filterKey: "title",
            filterField: "title",
            filterType: "string",
          },
          size: 250,
          maxSize: 400,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t("columns.title")}
              attribute="title"
              context={context}
            />
          ),
          cell: ({ row }) => (
            <div className="w-[200px] lg:w-[300px]">
              <div className="font-semibold truncate">{row.original.title}</div>

              {row.original.description && (
                <div className="line-clamp-2 text-xs text-muted-foreground mt-1">
                  {row.original.description}
                </div>
              )}
            </div>
          ),
          enableSorting: true,
        },
        {
          accessorKey: "slug",
          meta: {
            title: t("columns.slug"),
            filterKey: "slug",
            filterField: "slug",
            filterType: "string",
          },
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t("columns.slug")}
              attribute="slug"
              context={context}
            />
          ),
          cell: ({ row }) => (
            <span className="font-mono text-xs text-muted-foreground">
              {row.original.slug}
            </span>
          ),
          enableSorting: true,
        },
        {
          accessorKey: "status",
          meta: {
            title: t("columns.status"),
            filterKey: "status",
            filterField: "status",
            filterType: "select",
            filterOptions: statusFilterOptions,
          },
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t("columns.status")}
              attribute="status"
              context={context}
            />
          ),
          cell: ({ row }) => <Badge>{capitalize(row.original.status)}</Badge>,
          enableSorting: true,
        },
        {
          accessorKey: "owner",
          meta: {
            title: t("columns.owner"),
          },
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t("columns.owner")}
              attribute="owner"
              context={context}
            />
          ),
          cell: ({ row }) => (
            <div className="text-sm">
              {row.original.owner
                ? `${row.original.owner.firstName} ${row.original.owner.lastName}`
                : "-"}
            </div>
          ),
          enableSorting: false,
        },
        {
          accessorKey: "createdAt",
          meta: { title: t("columns.createdAt") },
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
              variant={DataTableCellVariant.DATE}
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
          meta: { title: t("columns.updatedAt") },
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
              variant={DataTableCellVariant.DATE}
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
          enableSorting: false,
          enableHiding: false,
          cell: ({ row }) => (
            <DataTableRowActions row={row} context={context} />
          ),
        },
      ] satisfies ColumnDef<ResponseCurriculumDto>[],
    [context, statusFilterOptions, t],
  );
}
