import React from "react";
import { useTranslation } from "react-i18next";
import type { ColumnDef } from "@tanstack/react-table";
import {
  UserAvatarCell,
  DataTableCell,
  DataTableCellVariant,
} from "@qlp/datatable-builder";
import { Badge } from "@qlp/ui";
import type { ResponseCurriculumExamDto } from "@qlp/api-client";

export function useCurriculumExamVersionColumns(): ColumnDef<ResponseCurriculumExamDto>[] {
  const { t: tCommon } = useTranslation("curriculum-common");
  return React.useMemo<ColumnDef<ResponseCurriculumExamDto>[]>(
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
        accessorKey: "durationMinutes",
        header: tCommon("fields.durationMinutes", { defaultValue: "Duration" }),
        cell: ({ row }) => (
          <span>{row.original.durationMinutes ? `${row.original.durationMinutes} mins` : "-"}</span>
        ),
      },
      {
        accessorKey: "passingScore",
        header: tCommon("fields.passingScore", { defaultValue: "Passing Score" }),
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.passingScore ?? 0}</Badge>
        ),
      },
      {
        accessorKey: "questions",
        header: tCommon("viewer.questionsCount", { defaultValue: "Questions" }),
        cell: ({ row }) => (
          <span>{row.original.questions?.length || 0}</span>
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
        accessorKey: "createdBy",
        header: tCommon("fields.createdBy"),
        cell: ({ row }) => (
          <UserAvatarCell user={row.original.createdBy as any} />
        ),
      },
    ],
    [tCommon],
  );
}
