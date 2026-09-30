import React from "react";
import { useTranslation } from "react-i18next";
import { DataTable, type DataTableConfig } from "@qlp/datatable-builder";
import { useBreadcrumb, useIntro } from "@qlp/contexts";
import type { ResponseCurriculumExamDto } from "@qlp/api-client";
import { useCurriculum, useCurriculumModules, useCurriculumExamVersions } from "../../../hooks";
import { useCurriculumExamVersionColumns } from "./columns";
import { cn } from "@qlp/ui";

export interface CurriculumExamVersionsListProps {
  className?: string;
  examId: string;
  moduleId?: string;
  curriculumId?: string;
}

export function CurriculumExamVersionsList({
  className,
  examId,
  moduleId,
  curriculumId,
}: CurriculumExamVersionsListProps) {
  const { t: tGlobal } = useTranslation("global");
  const { t: tCommon } = useTranslation("curriculum-common");

  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();

  const { versions, isVersionsPending: isLoading } =
    useCurriculumExamVersions({ examId, join: "createdBy" });
  const { curriculum } = useCurriculum({ id: curriculumId });
  const { modules } = useCurriculumModules({ id: curriculumId });

  const module = modules.find((item) => item.id === moduleId);
  const examTitle = versions?.[0]?.title || examId;

  React.useEffect(() => {
    if (setRoutes && curriculumId && moduleId && curriculum && module) {
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
        {
          title: examTitle,
          href: `/curriculum/${curriculumId}/modules/${moduleId}/exams/${examId}/edit`,
        },
        { title: tGlobal("commands.history") },
      ]);
    }
    if (setIntro && curriculum && module) {
      setIntro(
        `Exam Versions - ${examTitle}`,
        `${curriculum.title} / ${module.title} — Exam version history`,
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
    tGlobal,
    curriculumId,
    moduleId,
    examId,
    curriculum?.title,
    module?.title,
    examTitle,
  ]);

  const columns = useCurriculumExamVersionColumns();

  const context: DataTableConfig<ResponseCurriculumExamDto> = {
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
