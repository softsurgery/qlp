import React from "react";
import { useTranslation } from "react-i18next";
import { DataTable, type DataTableConfig } from "@qlp/datatable-builder";
import { useApp, useBreadcrumb, useIntro } from "@qlp/contexts";
import type { ResponseCurriculumModuleDto } from "@qlp/api-client";
import { useCurriculum, useCurriculumModuleVersions } from "../../../hooks";
import { useCurriculumModuleVersionColumns } from "./columns";
import { cn } from "@qlp/ui";

export interface CurriculumModuleVersionsListProps {
  className?: string;
  moduleId: string;
  curriculumId?: string;
}

export function CurriculumModuleVersionsList({
  className,
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

  const columns = useCurriculumModuleVersionColumns();

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
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden gap-4",
        className,
      )}
    >
      <DataTable
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
        containerClassName="min-h-0 overflow-auto"
        columns={columns}
        data={versions || []}
        context={context}
        isPending={isLoading}
      />
    </div>
  );
}
