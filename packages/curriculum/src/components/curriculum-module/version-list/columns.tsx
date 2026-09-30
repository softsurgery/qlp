import React from "react";
import { useTranslation } from "react-i18next";
import type { ColumnDef } from "@tanstack/react-table";
import {
  UserAvatarCell,
  DataTableCell,
  DataTableCellVariant,
} from "@qlp/datatable-builder";
import { Badge } from "@qlp/ui";
import { capitalize } from "lodash";
import type { ResponseCurriculumModuleDto } from "@qlp/api-client";

export function useCurriculumModuleVersionColumns(): ColumnDef<ResponseCurriculumModuleDto>[] {
  const { t: tCommon } = useTranslation("curriculum-common");
  return React.useMemo<ColumnDef<ResponseCurriculumModuleDto>[]>(
    () => [
      {
        accessorKey: "title",
        header: tCommon("fields.title"),
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
      },
      {
        accessorKey: "version",
        header: tCommon("fields.version"),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="text-sm">{row.original.version}</span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: tCommon("fields.status"),
        cell: ({ row }) => (
          <Badge>{capitalize(row.original.status || "Draft")}</Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        header: tCommon("fields.createdAt"),
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
      },
      {
        accessorKey: "updatedAt",
        header: tCommon("fields.updatedAt"),
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
      },
      {
        accessorKey: "createdBy",
        header: tCommon("fields.createdBy"),
        cell: ({ row }) => (
          <UserAvatarCell user={row.original.createdBy as any} />
        ),
      },
    ],
    [tCommon, tCommon],
  );
}
