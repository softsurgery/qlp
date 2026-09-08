import { useMemo, useState } from "react";
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
import { useIntro } from "@qlp/contexts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@qlp/ui";
import {
  CurriculumStatus,
  type CreateCurriculumDto,
  type CurriculumResource,
  type ResponseCurriculumDto,
  type ServerErrorResponse,
} from "@qlp/api-client";
import { ConfirmDialog } from "./ConfirmDialog";
import { CreateCurriculumForm } from "./forms/CreateCurriculumForm";
import { useCurriculumColumns } from "./columns";
import { useCurriculumChrome } from "./useCurriculumChrome";
import { errorMessage } from "./utils";

interface CurriculumListProps {
  api: CurriculumResource;
  basePath: string;
}

export function CurriculumList({ api, basePath }: CurriculumListProps) {
  const { t } = useTranslation("curriculum");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ResponseCurriculumDto | null>(null);

  useCurriculumChrome(
    t("title"),
    t("description"),
    [{ title: t("title") }],
    false,
  );

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
  } = useDataTableState("curriculum-table", { order: false, sortKey: "updatedAt" });

  const { value: debouncedPage, loading: paging } = useDebounce(page);
  const { value: debouncedSize, loading: resizing } = useDebounce(size);
  const { value: debouncedSortDetails, loading: sorting } = useDebounce(sortDetails);
  const { value: debouncedSearchTerm, loading: searching } = useDebounce(searchTerm);
  const { value: debouncedColumnFilters, loading: filtering } = useDebounce(columnFilters);

  const filterString = useMemo(
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
      }),
  });

  const createMutation = useMutation({
    mutationFn: (dto: CreateCurriculumDto) => api.create(dto),
    onSuccess: (curriculum) => {
      toast.success(t("created"));
      void queryClient.invalidateQueries({ queryKey: ["curriculum"] });
      setCreateOpen(false);
      navigate(`${basePath}/${curriculum.id}/edit`);
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(errorMessage(error, t("saveError")));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.remove(id),
    onSuccess: () => {
      toast.success(t("deleted"));
      setPendingDelete(null);
      void queryClient.invalidateQueries({ queryKey: ["curriculum"] });
    },
    onError: (error: ServerErrorResponse) => toast.error(errorMessage(error, t("deleteError"))),
  });

  const items = listQuery.data?.data ?? [];

  const context: DataTableConfig<ResponseCurriculumDto> = {
    singularName: t("item"),
    pluralName: t("title"),
    inspectCallback: (entity) => navigate(`${basePath}/${entity.id}`),
    createCallback: () => setCreateOpen(true),
    updateCallback: (entity) => navigate(`${basePath}/${entity.id}/edit`),
    deleteCallback: (entity) => setPendingDelete(entity),
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

  const statusFilterOptions: DataTableColumnFilterOption[] = useMemo(
    () =>
      Object.values(CurriculumStatus).map((status) => ({
        label: t(`status.${status}`),
        filter: `status||$eq||${status}`,
      })),
    [t],
  );

  const { title: introTitle } = useIntro();
  const columns = useCurriculumColumns(context, statusFilterOptions);
  const isPending = listQuery.isPending || paging || resizing || searching || sorting || filtering;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden gap-4">
      {!introTitle && (
        <div className="shrink-0 space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">{t("title")}</h2>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
      )}
      <DataTable
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
        containerClassName="min-h-0 overflow-auto"
        columns={columns}
        data={items}
        context={context}
        isPending={isPending}
        footerPagination={false}
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("createTitle")}</DialogTitle>
            <DialogDescription>{t("createDescription")}</DialogDescription>
          </DialogHeader>
          <CreateCurriculumForm
            pending={createMutation.isPending}
            onCancel={() => setCreateOpen(false)}
            onSubmit={(dto) => createMutation.mutate(dto)}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t("confirmDeleteTitle")}
        description={t("confirmDeleteCurriculum")}
        pending={deleteMutation.isPending}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
      />
    </div>
  );
}
