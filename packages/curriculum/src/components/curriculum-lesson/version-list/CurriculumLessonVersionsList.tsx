import React from "react";
import { useTranslation } from "react-i18next";
import { DataTable, type DataTableConfig } from "@qlp/datatable-builder";
import { useBreadcrumb, useIntro } from "@qlp/contexts";
import type { ResponseCurriculumLessonDto } from "@qlp/api-client";
import { useCurriculum, useCurriculumModules, useCurriculumLessonVersions } from "../../../hooks";
import { useCurriculumLessonVersionColumns } from "./columns";
import { cn } from "@qlp/ui";

export interface CurriculumLessonVersionsListProps {
  className?: string;
  lessonId: string;
  moduleId?: string;
  curriculumId?: string;
}

export function CurriculumLessonVersionsList({
  className,
  lessonId,
  moduleId,
  curriculumId,
}: CurriculumLessonVersionsListProps) {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("curriculum");

  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();

  const { versions, isVersionsPending: isLoading } =
    useCurriculumLessonVersions({ lessonId, join: "createdBy" });
  const { curriculum } = useCurriculum({ id: curriculumId });
  const { modules } = useCurriculumModules({ id: curriculumId });

  const module = modules.find((item) => item.id === moduleId);
  const lessonTitle = versions?.[0]?.title || lessonId;

  React.useEffect(() => {
    if (setRoutes && curriculumId && moduleId && curriculum && module) {
      setRoutes([
        { title: t("title", "Curriculum"), href: "/curriculum" },
        {
          title: curriculum.title,
          href: `/curriculum/${curriculumId}/edit`,
        },
        {
          title: module.title,
          href: `/curriculum/${curriculumId}/modules/${moduleId}/edit`,
        },
        {
          title: lessonTitle,
          href: `/curriculum/${curriculumId}/modules/${moduleId}/lessons/${lessonId}/edit`,
        },
        { title: tCommon("commands.history", "History") },
      ]);
    }
    if (setIntro && curriculum && module) {
      setIntro(
        `${t("lessonVersions", "Lesson Versions")} - ${lessonTitle}`,
        `${curriculum.title} / ${module.title} — ${t("lessonVersionsDescription", "History of lesson changes")}`,
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
    lessonId,
    curriculum?.title,
    module?.title,
    lessonTitle,
  ]);

  const columns = useCurriculumLessonVersionColumns();

  const context: DataTableConfig<ResponseCurriculumLessonDto> = {
    singularName: "Version",
    pluralName: "Versions",
    createCallback: undefined,
    updateCallback: undefined,
    deleteCallback: undefined,
    inspectCallback: undefined,
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
