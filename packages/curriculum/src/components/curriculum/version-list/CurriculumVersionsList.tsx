import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useApp, useBreadcrumb, useIntro } from "@qlp/contexts";
import {
  DataTable,
  DataTableConfig,
  useDataTableState,
} from "@qlp/datatable-builder";
import { useDebounce } from "@qlp/hooks";
import { ResponseCurriculumDto } from "@qlp/api-client";
import { useCurriculumVersionColumns } from "./columns";
import { Loader2 } from "lucide-react";
import { cn } from "@qlp/ui";

interface CurriculumVersionsListProps {
  className?: string;
  curriculumId: string;
}

export function CurriculumVersionsList({
  className,
  curriculumId,
}: CurriculumVersionsListProps) {
  const { t } = useTranslation("curriculum");
  const { t: tCommon } = useTranslation("common");
  const navigate = useNavigate();
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin" ? baseApi.adminCurriculum : baseApi.curriculum;

  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();

  const { data: curriculum } = useQuery({
    queryKey: ["curriculum", curriculumId],
    queryFn: () => api.findById(curriculumId, { join: "owner,createdBy" }),
  });

  React.useEffect(() => {
    if (setRoutes && curriculum) {
      setRoutes([
        { title: t("title"), href: "/curriculum" },
        {
          title: curriculum.title,
          href: `/curriculum/${curriculumId}/edit`,
        },
        { title: tCommon("commands.history", "History") },
      ]);
    }
    if (setIntro && curriculum) {
      setIntro(
        `${t("versionsTitle", { defaultValue: "Curriculum Versions" })} - ${curriculum.title}`,
        t("versionsDescription", {
          defaultValue: "History of curriculum changes",
        }),
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
    curriculum?.title,
    curriculumId,
  ]);

  const {
    page,
    setPage,
    size,
    setSize,
    sortDetails,
    setSortDetails,
    searchTerm,
    setSearchTerm,
    columnFilters,
    setColumnFilters,
    tableReset,
  } = useDataTableState("curriculum-versions-table", {
    order: false,
    sortKey: "version",
  });

  const { value: debouncedPage, loading: paging } = useDebounce(page);
  const { value: debouncedSize, loading: resizing } = useDebounce(size);

  const {
    data: listData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "curriculum",
      curriculumId,
      "versions",
      debouncedPage,
      debouncedSize,
    ],
    queryFn: () =>
      api.findVersions(curriculumId, {
        page: String(debouncedPage),
        limit: String(debouncedSize),
        join: "owner,createdBy",
      }),
  });

  const context: DataTableConfig<ResponseCurriculumDto> = {
    singularName: t("item"),
    pluralName: t("title"),
    createCallback: undefined,
    inspectCallback: (entity: any) =>
      navigate(`/curriculum/${curriculumId}/versions/${entity.version}`),
    updateCallback: undefined,
    deleteCallback: undefined,
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: listData?.meta.pageCount || 0,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
    ...tableReset,
    columnFilters,
    setColumnFilter: (filterKey: string, filterParam: any) => {
      setPage(1);
      setColumnFilters((previous: any) => {
        if (!filterParam) {
          const { [filterKey]: _, ...rest } = previous;
          return rest;
        }
        return { ...previous, [filterKey]: filterParam };
      });
    },
  } as any;

  const columns = useCurriculumVersionColumns(context);

  const isPending = isLoading || paging || resizing;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-destructive">
        Failed to load curriculum versions.
      </div>
    );
  }

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
        data={listData?.data || []}
        context={context}
        isPending={isPending}
        footerPagination={true}
      />
    </div>
  );
}
