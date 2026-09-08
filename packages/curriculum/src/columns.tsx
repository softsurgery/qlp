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
import { StatusBadge, VersionBadge } from "./StatusBadge";

export function useCurriculumColumns(
  context: DataTableConfig<ResponseCurriculumDto>,
  statusFilterOptions: DataTableColumnFilterOption[],
): ColumnDef<ResponseCurriculumDto>[] {
  const { t } = useTranslation("curriculum");

  return React.useMemo(
    () => [
      {
        accessorKey: "title",
        meta: {
          title: t("columns.title"),
          filterKey: "title",
          filterField: "title",
          filterType: "string",
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("columns.title")}
            attribute="title"
            context={context}
          />
        ),
        cell: ({ row }) => (
          <div className="min-w-40">
            <div className="font-semibold">{row.original.title}</div>
            {row.original.description && (
              <div className="line-clamp-1 text-xs text-muted-foreground">
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
          <span className="font-mono text-xs text-muted-foreground">{row.original.slug}</span>
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
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
        enableSorting: true,
      },
      {
        accessorKey: "version",
        meta: { title: t("columns.version") },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("columns.version")}
            attribute="version"
            context={context}
          />
        ),
        cell: ({ row }) => (
          <VersionBadge version={row.original.version} isLatest={row.original.isLatest} />
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
            value={row.original.updatedAt ? new Date(row.original.updatedAt) : undefined}
          />
        ),
        enableSorting: true,
      },
      {
        id: "actions",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => <DataTableRowActions row={row} context={context} />,
      },
    ],
    [context, statusFilterOptions, t],
  );
}
