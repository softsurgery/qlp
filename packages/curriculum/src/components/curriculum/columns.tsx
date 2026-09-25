import React from "react";
import { useTranslation } from "react-i18next";
import type { ColumnDef } from "@tanstack/react-table";
import {
  DataTableCell,
  DataTableCellVariant,
  DataTableColumnHeader,
  DataTableRowActions,
  UserAvatarCell,
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
  const { t: tCommon } = useTranslation("curriculum-common");

  return React.useMemo(
    () =>
      [
        {
          accessorKey: "title",
          meta: {
            title: tCommon("columns.title"),
            filterKey: "title",
            filterField: "title",
            filterType: "string",
          },
          size: 250,
          maxSize: 400,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={tCommon("columns.title")}
              attribute="title"
              context={context}
            />
          ),
          cell: ({ row }) => (
            <div>
              <div className="font-semibold truncate">{row.original.title}</div>

              {row.original.description && (
                <div
                  className="line-clamp-2 text-xs text-muted-foreground mt-1"
                  dangerouslySetInnerHTML={{ __html: row.original.description }}
                />
              )}
            </div>
          ),
          enableSorting: true,
        },
        {
          accessorKey: "slug",
          meta: {
            title: tCommon("columns.slug"),
            filterKey: "slug",
            filterField: "slug",
            filterType: "string",
          },
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={tCommon("columns.slug")}
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
          accessorKey: "version",
          meta: {
            title: tCommon("columns.version"),
          },
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={tCommon("columns.version")}
              attribute="version"
              context={context}
            />
          ),
          cell: ({ row }) => (
            <div className="text-sm">{row.original.version}</div>
          ),
          enableSorting: true,
        },
        {
          accessorKey: "status",
          meta: {
            title: tCommon("columns.status"),
            filterKey: "status",
            filterField: "status",
            filterType: "select",
            filterOptions: statusFilterOptions,
          },
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={tCommon("columns.status")}
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
            title: tCommon("columns.owner"),
          },
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={tCommon("columns.owner")}
              attribute="owner"
              context={context}
            />
          ),
          cell: ({ row }) => (
            <UserAvatarCell user={row.original.owner} />
          ),
          enableSorting: false,
        },
        {
          accessorKey: "createdBy",
          meta: {
            title: tCommon("columns.createdBy"),
          },
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={tCommon("columns.createdBy")}
              attribute="createdBy"
              context={context}
            />
          ),
          cell: ({ row }) => (
            <UserAvatarCell user={row.original.createdBy} />
          ),
          enableSorting: false,
        },
        {
          accessorKey: "createdAt",
          meta: {
            title: tCommon("columns.createdAt"),
            filterKey: "createdAt",
            filterField: "createdAt",
            filterType: "date-range",
          },
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={tCommon("columns.createdAt")}
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
            title: tCommon("columns.updatedAt"),
            filterKey: "updatedAt",
            filterField: "updatedAt",
            filterType: "date-range",
          },
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={tCommon("columns.updatedAt")}
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
          enableSorting: false,
          enableHiding: false,
          cell: ({ row }) => (
            <DataTableRowActions row={row} context={context} />
          ),
        },
      ] satisfies ColumnDef<ResponseCurriculumDto>[],
    [context, statusFilterOptions, tCommon],
  );
}
