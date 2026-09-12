import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  buildDataTableFilterString,
  DataTable,
  useDataTableState,
  type DataTableColumnFilterOption,
  type DataTableConfig,
} from "@qlp/datatable-builder";
import { useDebounce } from "@qlp/hooks";
import { useIntro, useBreadcrumb } from "@qlp/contexts";
import {
  CurriculumStatus,
  type CreateCurriculumDto,
  type ResponseCurriculumDto,
  type ServerErrorResponse,
} from "@qlp/api-client";
import { useCurriculumColumns } from "./columns";
import { errorMessage } from "./utils";
import React from "react";
import { useCurriculumDeleteDialog } from "./modals/CurriculumDeleteDialog";
import { useCurriculumStore } from "./hooks/stores/useCurriculumStore";
import { useApp } from "@qlp/contexts";

interface CurriculumListProps {
  className?: string;
}

export function CurriculumList({ className }: CurriculumListProps = {}) {
  const { t } = useTranslation("curriculum");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { api: baseApi, appType } = useApp();
  const api = appType === "admin" ? baseApi.adminCurriculum : baseApi.curriculum;

  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();

  const curriculumStore = useCurriculumStore();

  React.useEffect(() => {
    if (setIntro) {
      setIntro(t("title"), t("description"));
    }
    if (setRoutes) {
      setRoutes([{ title: t("title") }]);
    }
    return () => {
      if (clearIntro) clearIntro();
      if (clearRoutes) clearRoutes();
    };
  }, [setIntro, clearIntro, setRoutes, clearRoutes, t]);

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
  } = useDataTableState("curriculum-table", {
    order: false,
    sortKey: "updatedAt",
  });

  const { value: debouncedPage, loading: paging } = useDebounce(page);
  const { value: debouncedSize, loading: resizing } = useDebounce(size);
  const { value: debouncedSortDetails, loading: sorting } =
    useDebounce(sortDetails);
  const { value: debouncedSearchTerm, loading: searching } =
    useDebounce(searchTerm);
  const { value: debouncedColumnFilters, loading: filtering } =
    useDebounce(columnFilters);

  const filterString = React.useMemo(
    () => buildDataTableFilterString("", debouncedColumnFilters),
    [debouncedColumnFilters],
  );

  const listQuery = useQuery({
    queryKey: [
      "curriculum",
      "list",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails,
      debouncedSearchTerm,
      filterString,
    ],
    queryFn: () =>
      api.findPaginated({
        page: String(debouncedPage),
        limit: String(debouncedSize),
        search: debouncedSearchTerm,
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? "ASC" : "DESC"}`,
        filter: filterString,
        join: "owner",
      }),
  });

  const createMutation = useMutation({
    mutationFn: (dto: CreateCurriculumDto) => api.create(dto),
    onSuccess: (curriculum) => {
      toast.success(t("created"));
      void queryClient.invalidateQueries({ queryKey: ["curriculum"] });
      navigate(`/curriculum/${curriculum.id}/edit`);
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(errorMessage(error, t("saveError")));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.remove(id),
    onSuccess: () => {
      toast.success(t("deleted"));
      void queryClient.invalidateQueries({ queryKey: ["curriculum"] });
    },
    onError: (error: ServerErrorResponse) =>
      toast.error(errorMessage(error, t("deleteError"))),
  });

  const { deleteCurriculumDialog, openDeleteCurriculumDialog } =
    useCurriculumDeleteDialog({
      curriculumTitle: curriculumStore.response?.title,
      deleteCurriculum: () => {
        if (curriculumStore.response) {
          deleteMutation.mutate(curriculumStore.response.id);
        }
      },
      isDeletePending: deleteMutation.isPending,
    });

  const items = listQuery.data?.data ?? [];

  const context: DataTableConfig<ResponseCurriculumDto> = {
    singularName: t("item"),
    pluralName: t("title"),
    createCallback: () => navigate(`/curriculum/new`),
    inspectCallback: (entity) => navigate(`/curriculum/${entity.id}`),
    updateCallback: (entity) => navigate(`/curriculum/${entity.id}/edit`),
    deleteCallback: openDeleteCurriculumDialog,
    targetEntity: (entity) => curriculumStore.set("response", entity),
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: listQuery.data?.meta.pageCount || 0,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order, sortKey) => setSortDetails({ order, sortKey }),
    ...tableReset,
    columnFilters,
    setColumnFilter: (filterKey, filterParam) => {
      setPage(1);
      setColumnFilters((previous) => {
        if (!filterParam) {
          const { [filterKey]: _, ...rest } = previous;
          return rest;
        }
        return { ...previous, [filterKey]: filterParam };
      });
    },
  };

  const statusFilterOptions: DataTableColumnFilterOption[] = React.useMemo(
    () =>
      Object.values(CurriculumStatus).map((status) => ({
        label: t(`status.${status}`),
        filter: `status||$eq||${status}`,
      })),
    [t],
  );

  const columns = useCurriculumColumns(context, statusFilterOptions);
  const isPending =
    listQuery.isPending ||
    paging ||
    resizing ||
    searching ||
    sorting ||
    filtering;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden gap-4">
      <DataTable
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
        containerClassName="min-h-0 overflow-auto"
        columns={columns}
        data={items}
        context={context}
        isPending={isPending}
        footerPagination
      />
      {deleteCurriculumDialog}
    </div>
  );
}
