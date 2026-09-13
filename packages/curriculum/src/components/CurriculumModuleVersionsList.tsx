import React from "react";
import { useTranslation } from "react-i18next";
import {
  DataTable,
  type DataTableConfig,
  UserAvatarCell,
  DataTableCell,
  DataTableCellVariant,
} from "@qlp/datatable-builder";
import { Badge } from "@qlp/ui";
import { capitalize } from "lodash";
import { useApp, useBreadcrumb, useIntro } from "@qlp/contexts";
import type { ResponseCurriculumModuleDto } from "@qlp/api-client";
import { identifyUser } from "@qlp/lib";
import type { ColumnDef } from "@tanstack/react-table";
import { useCurriculum, useCurriculumModuleVersions } from "../hooks";

export interface CurriculumModuleVersionsListProps {
  moduleId: string;
  curriculumId?: string;
}

export function CurriculumModuleVersionsList({
  moduleId,
  curriculumId,
}: CurriculumModuleVersionsListProps) {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("curriculum");
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin" ? baseApi.adminCurriculum : baseApi.curriculum;

  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();

  const { versions, isVersionsPending: isLoading } =
    useCurriculumModuleVersions({ moduleId, join: "owner,createdBy" });
  const { curriculum } = useCurriculum({
    id: curriculumId,
    join: "owner,createdBy",
  });

  const moduleTitle = versions?.[0]?.title || moduleId;

  React.useEffect(() => {
    if (setRoutes && curriculumId) {
      setRoutes([
        { title: t("title", "Curriculums"), href: "/curriculum" },
        {
          title: curriculum?.slug || curriculumId,
          href: `/curriculum/${curriculumId}/edit`,
        },
        {
          title: moduleTitle,
          href: `/curriculum/${curriculumId}/modules/${moduleId}/edit`,
        },
        { title: tCommon("commands.history", "History") },
      ]);
    }
    if (setIntro) {
      setIntro(
        `${t("moduleVersions", "Module Versions")}`,
        t("moduleVersionsDescription", "History of module changes"),
      );
    }
    return () => {
      if (clearRoutes) clearRoutes();
      if (clearIntro) clearIntro();
    };
  }, [
    setRoutes,
    clearRoutes,
    setIntro,
    clearIntro,
    t,
    tCommon,
    curriculumId,
    moduleId,
    curriculum?.slug,
    moduleTitle,
  ]);

  const columns = React.useMemo<ColumnDef<ResponseCurriculumModuleDto>[]>(
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
            {row.original.isLatest && (
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                {tCommon("status.latest", "Latest")}
              </span>
            )}
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

  const context: DataTableConfig<ResponseCurriculumModuleDto> = {
    singularName: "Version",
    pluralName: "Versions",
    createCallback: undefined,
    updateCallback: undefined,
    deleteCallback: undefined,
    inspectCallback: undefined, // Or maybe a way to view a module version if we want
    searchTerm: "",
    setSearchTerm: () => {},
    page: 1,
    totalPageCount: 1,
    setPage: () => {},
    size: versions?.length || 10,
    setSize: () => {},
    order: false,
    sortKey: "version",
    setSortDetails: () => {},
    columnFilters: {},
    setColumnFilter: () => {},
    reset: () => {},
  } as any;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden gap-4">
      <DataTable
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
        containerClassName="min-h-0 overflow-auto"
        columns={columns as any}
        data={versions || []}
        context={context}
        isPending={isLoading}
      />
    </div>
  );
}
