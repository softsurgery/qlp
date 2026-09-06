import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Copy } from "lucide-react";
import { buildDataTableFilterString, DataTable, useDataTableState, type DataTableConfig } from "@qlp/datatable-builder";
import { useBreadcrumb, useIntro, useUI } from "@qlp/contexts";
import { useDebounce } from "@qlp/hooks";
import type {
  CreateRoleDto,
  ResponseRoleDto,
  ServerErrorResponse,
  UpdateRoleDto,
} from "@qlp/api-client";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useRoleColumns } from "./columns";
import { useRoleUpdateSheet } from "./modals/RoleUpdateSheet";
import { useRoleDeleteDialog } from "./modals/RoleDeleteDialog";
import { useRoleDuplicateDialog } from "./modals/RoleDuplicateDialog";
import { useRoleCreateSheet } from "./modals/RoleCreateSheet";
import { useRoleStore } from "@/hooks/stores/useRoleStore";

interface RolesProps {
  className?: string;
}

export default function Roles({ className }: RolesProps) {
  const { t, ready } = useTranslation("role");
  const { t: tUser } = useTranslation("user-management");
  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setEnableMainOverflow, clearEnableMainOverflow } = useUI();

  React.useEffect(() => {
    setIntro?.(t("page.title"), t("page.description"));
    setRoutes?.([
      { title: tUser("userManagement.nav.title"), href: "/user-management/users" },
      { title: t("page.title") },
    ]);
    setEnableMainOverflow?.(false);
    return () => {
      clearIntro?.();
      clearRoutes?.();
      clearEnableMainOverflow?.();
    };
  }, [
    clearEnableMainOverflow,
    clearIntro,
    clearRoutes,
    ready,
    setEnableMainOverflow,
    setIntro,
    setRoutes,
    t,
    tUser,
  ]);

  const roleStore = useRoleStore();
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
  } = useDataTableState("roles-table", { order: true, sortKey: "id" });

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

  const {
    data: rolesResponse,
    isPending: isRolesPending,
    refetch: refetchRoles,
  } = useQuery({
    queryKey: [
      "roles",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
      debouncedColumnFilters,
    ],
    queryFn: () =>
      api.role.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? "ASC" : "DESC"}`,
        search: debouncedSearchTerm,
        filter: filterString,
      }),
  });

  const roles = rolesResponse?.data ?? [];

  const { mutate: createRole, isPending: isCreationPending } = useMutation({
    mutationFn: (role: CreateRoleDto) => api.role.create(role),
    onSuccess: () => {
      toast.success(t("messages.createSuccess"));
      refetchRoles();
      roleStore.reset();
      closeCreateRoleSheet();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { mutate: updateRole, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: { id?: string; role?: UpdateRoleDto }) =>
      api.role.update(data.id, data.role),
    onSuccess: () => {
      toast.success(t("messages.updateSuccess"));
      refetchRoles();
      roleStore.reset();
      closeUpdateRoleSheet();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { mutate: deleteRole, isPending: isDeletionPending } = useMutation({
    mutationFn: (id?: string) => api.role.remove(id),
    onSuccess: () => {
      toast.success(t("messages.deleteSuccess"));
      refetchRoles();
      roleStore.reset();
      closeDeleteRoleDialog();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { mutate: duplicateRole, isPending: isDuplicationPending } =
    useMutation({
      mutationFn: (id?: string) => api.role.duplicate(id),
      onSuccess: () => {
        toast.success(t("messages.duplicateSuccess"));
        refetchRoles();
        roleStore.reset();
        closeDuplicateRoleDialog();
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(error.response?.data?.message);
      },
    });

  const { createRoleSheet, openCreateRoleSheet, closeCreateRoleSheet } =
    useRoleCreateSheet({
      createRole: () => createRole(roleStore.createDto),
      isCreatePending: isCreationPending,
      resetRole: () => roleStore.reset(),
    });

  const { updateRoleSheet, openUpdateRoleSheet, closeUpdateRoleSheet } =
    useRoleUpdateSheet({
      updateRole: () =>
        updateRole({ id: roleStore.response?.id, role: roleStore.updateDto }),
      isUpdatePending: isUpdatePending,
      resetRole: () => roleStore.reset(),
    });

  const { deleteRoleDialog, openDeleteRoleDialog, closeDeleteRoleDialog } =
    useRoleDeleteDialog({
      representation: roleStore.response?.label,
      deleteRole: () => deleteRole(roleStore.response?.id),
      isDeletionPending,
      resetRole: () => roleStore.reset(),
    });

  const {
    duplicateRoleDialog,
    openDuplicateRoleDialog,
    closeDuplicateRoleDialog,
  } = useRoleDuplicateDialog({
    representation: roleStore.response?.label,
    duplicateRole: () => duplicateRole(roleStore.response?.id),
    isDuplicationPending,
    resetRole: () => roleStore.reset(),
  });

  const context: DataTableConfig<ResponseRoleDto> = {
    singularName: t("page.singularName"),
    pluralName: t("page.pluralName"),
    createCallback: openCreateRoleSheet,
    updateCallback: openUpdateRoleSheet,
    deleteCallback: openDeleteRoleDialog,
    additionalActions: {
      1: [
        {
          actionCallback: openDuplicateRoleDialog,
          actionLabel: t("actions.duplicate"),
          actionIcon: <Copy className="h-4 w-4" />,
          isActionVisible: () => true,
        },
      ],
    },
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: rolesResponse?.meta.pageCount || 0,
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
    targetEntity: (role) => {
      roleStore.set("response", role);
      roleStore.set<UpdateRoleDto>("updateDto", {
        label: role.label,
        description: role.description,
        permissions: (role.permissions ?? []).map((permission) => ({
          permissionId: permission.permissionId,
        })),
      });
    },
  };

  const columns = useRoleColumns(context);
  const isPending =
    isRolesPending || paging || resizing || searching || sorting || filtering;

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", className)}>
      <DataTable
        className="flex min-h-0 flex-1 flex-col overflow-hidden p-1"
        containerClassName="min-h-0 overflow-auto"
        columns={columns}
        data={roles}
        context={context}
        isPending={isPending}
      />
      {createRoleSheet}
      {deleteRoleDialog}
      {updateRoleSheet}
      {duplicateRoleDialog}
    </div>
  );
}
