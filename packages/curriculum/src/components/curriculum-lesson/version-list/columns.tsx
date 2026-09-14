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
import type { ResponseCurriculumLessonDto } from "@qlp/api-client";

export function useCurriculumLessonVersionColumns(): ColumnDef<ResponseCurriculumLessonDto>[] {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("curriculum");

  return React.useMemo<ColumnDef<ResponseCurriculumLessonDto>[]>(
    () => [
      {
        accessorKey: "title",
        header: t("fields.title", "Title"),
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
        header: tCommon("fields.version", "Version"),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="text-sm">{row.original.version}</span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: tCommon("fields.status", "Status"),
        cell: ({ row }) => (
          <Badge>{capitalize(row.original.status || "Draft")}</Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        header: tCommon("fields.createdAt", "Created At"),
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
        header: tCommon("fields.updatedAt", "Updated At"),
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
        header: tCommon("fields.createdBy", "Created By"),
        cell: ({ row }) => (
          <UserAvatarCell user={row.original.createdBy as any} />
        ),
      },
    ],
    [t, tCommon],
  );
}
