import React from "react";
import { useTranslation } from "react-i18next";
import { DataTable, type DataTableConfig } from "@qlp/datatable-builder";
import { useApp, useBreadcrumb, useIntro } from "@qlp/contexts";
import type { ResponseCurriculumModuleDto } from "@qlp/api-client";
import { useCurriculum, useCurriculumModules, useCurriculumModuleVersions } from "../../../hooks";
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
  const { t: tGlobal } = useTranslation("global");
  const { t: tCommon } = useTranslation("curriculum-common");
    const { t: tModule } = useTranslation("curriculum-module");
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin"
      ? baseApi.adminCurriculumModules
      : baseApi.curriculumModules;

  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();

  const { versions, isVersionsPending: isLoading } =
    useCurriculumModuleVersions({ moduleId, join: "owner,createdBy" });
  const { curriculum } = useCurriculum({ id: curriculumId });
  const { modules } = useCurriculumModules({ id: curriculumId });

  const module = modules.find((item) => item.id === moduleId);

  React.useEffect(() => {
    if (setRoutes && curriculumId && curriculum && module) {
      setRoutes([
        { title: tCommon("title"), href: "/curriculum" },
        {
          title: curriculum.title,
          href: `/curriculum/${curriculumId}/edit`,
        },
        {
          title: module.title,
          href: `/curriculum/${curriculumId}/modules/${moduleId}/edit`,
        },
        { title: tGlobal("commands.history") },
      ]);
    }
    if (setIntro && curriculum && module) {
      setIntro(
        `${tModule("moduleVersions")} - ${module.title}`,
        `${curriculum.title} — ${tModule("moduleVersionsDescription")}`,
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
          tCommon,
          tModule,
          tGlobal,
        tCommon,
    curriculumId,
    moduleId,
    curriculum?.title,
    module?.title,
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
