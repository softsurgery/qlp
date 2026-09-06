import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { ArrowDown, ArrowUp } from "lucide-react";
import {
  buildDataTableFilterString,
  DataTable,
  useDataTableState,
  type DataTableColumnFilterOption,
  type DataTableConfig,
} from "@qlp/datatable-builder";
import { useIntro, useUI } from "@qlp/contexts";
import { useDebounce } from "@qlp/hooks";
import type {
  ResponseUserDto,
  ServerErrorResponse,
  UpdateUserDto,
} from "@qlp/api-client";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useUserColumns } from "./columns";
import { useUserDeleteDialog } from "./modals/UserDeleteDialog";
import { useActivateUserDialog } from "./modals/UserActivateDialog";
import { useDeactivateUserDialog } from "./modals/UserDeactivateDialog";
import { useApproveUserDialog } from "./modals/UserApproveDialog";
import { useDisapproveUserDialog } from "./modals/UserDisapproveDialog";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { useRoles } from "@/hooks/useRoles";

interface UsersProps {
  className?: string;
}

export const Users = ({ className }: UsersProps) => {
  const navigate = useNavigate();
  const { setIntro, clearIntro } = useIntro();
  const { setEnableMainOverflow, clearEnableMainOverflow } = useUI();
  const { t, ready } = useTranslation("user-management");

  React.useEffect(() => {
    setIntro?.(
      t("userManagement.page.users"),
      t("userManagement.page.description"),
    );
    setEnableMainOverflow?.(false);
    return () => {
      clearIntro?.();
      clearEnableMainOverflow?.();
    };
  }, [
    clearEnableMainOverflow,
    clearIntro,
    ready,
    setEnableMainOverflow,
    setIntro,
    t,
  ]);

  const userStore = useUserStore();
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
  } = useDataTableState("users-table", { order: true, sortKey: "id" });

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
    data: usersResponse,
    isPending: isUsersPending,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: [
      "users",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
      debouncedColumnFilters,
    ],
    queryFn: () =>
      api.user.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? "ASC" : "DESC"}`,
        search: debouncedSearchTerm,
        filter: filterString,
      }),
  });

  const users = usersResponse?.data ?? [];

  const { mutate: deleteUser, isPending: isDeletionPending } = useMutation({
    mutationFn: (id?: string) => api.user.remove(id),
    onSuccess: () => {
      toast.success(t("userManagement.messages.userDeletedSuccess"));
      refetchUsers();
    },
    onError: (error: ServerErrorResponse) =>
      toast.error(error.response?.data?.message ?? error.message),
  });

  const { mutate: activateUser, isPending: isActivationPending } = useMutation({
    mutationFn: (id?: string) => api.user.activate(id),
    onSuccess: () => {
      toast.success(t("userManagement.messages.userActivatedSuccess"));
      refetchUsers();
    },
    onError: (error: ServerErrorResponse) =>
      toast.error(error.response?.data?.message ?? error.message),
  });

  const { mutate: deactivateUser, isPending: isDeactivationPending } =
    useMutation({
      mutationFn: (id?: string) => api.user.deactivate(id),
      onSuccess: () => {
        toast.success(t("userManagement.messages.userDeactivatedSuccess"));
        refetchUsers();
      },
      onError: (error: ServerErrorResponse) =>
        toast.error(error.response?.data?.message ?? error.message),
    });

  const { mutate: approveUser, isPending: isApprovalPending } = useMutation({
    mutationFn: (id?: string) => api.user.approve(id),
    onSuccess: () => {
      toast.success(t("userManagement.messages.userApprovedSuccess"));
      refetchUsers();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { mutate: disapproveUser, isPending: isDisapprovalPending } =
    useMutation({
      mutationFn: (id?: string) => api.user.disapprove(id),
      onSuccess: () => {
        toast.success(t("userManagement.messages.userDisapprovedSuccess"));
        refetchUsers();
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(error.response?.data?.message);
      },
    });

  const handleReset = () => userStore.reset();

  const { deleteUserDialog, openDeleteUserDialog } = useUserDeleteDialog({
    userFullname:
      `${userStore.response?.firstName ?? ""} ${userStore.response?.lastName ?? ""}`.trim(),
    deleteUser: () => deleteUser(userStore.response?.id),
    isDeletePending: isDeletionPending,
  });

  const { activateUserDialog, openActivateUserDialog } = useActivateUserDialog({
    userFullname:
      `${userStore.response?.firstName ?? ""} ${userStore.response?.lastName ?? ""}`.trim(),
    activateUser: () => activateUser(userStore.response?.id),
    isActivationPending,
    resetUser: handleReset,
  });

  const { deactivateUserDialog, openDeactivateUserDialog } =
    useDeactivateUserDialog({
      userFullname:
        `${userStore.response?.firstName ?? ""} ${userStore.response?.lastName ?? ""}`.trim(),
      deactivateUser: () => deactivateUser(userStore.response?.id),
      isDeactivationPending,
      resetUser: handleReset,
    });

  const { approveUserDialog, openApproveUserDialog } = useApproveUserDialog({
    representation:
      `${userStore.response?.firstName ?? ""} ${userStore.response?.lastName ?? ""}`.trim(),
    approveUser: () => approveUser(userStore.response?.id),
    isApprovalPending,
    resetUser: handleReset,
  });

  const { disapproveUserDialog, openDisapproveUserDialog } =
    useDisapproveUserDialog({
      representation:
        `${userStore.response?.firstName ?? ""} ${userStore.response?.lastName ?? ""}`.trim(),
      disapproveUser: () => disapproveUser(userStore.response?.id),
      isDisapprovalPending,
      resetUser: handleReset,
    });

  const context: DataTableConfig<ResponseUserDto> = {
    singularName: t("userManagement.page.user"),
    pluralName: t("userManagement.page.users"),
    inspectCallback: (entity) => navigate(`/users/${entity.id}/edit`),
    createCallback: () => navigate("/users/new"),
    updateCallback: (entity) => navigate(`/users/${entity.id}/edit`),
    deleteCallback: openDeleteUserDialog,
    additionalActions: {
      1: [
        {
          actionCallback: openActivateUserDialog,
          actionLabel: t("userManagement.page.activate"),
          actionIcon: <ArrowUp />,
          isActionVisible: (user) => !user.isActive,
        },
        {
          actionCallback: openDeactivateUserDialog,
          actionLabel: t("userManagement.page.deactivate"),
          actionIcon: <ArrowDown />,
          isActionVisible: (user) => !!user.isActive,
        },
        {
          actionCallback: openApproveUserDialog,
          actionLabel: t("userManagement.page.approve"),
          actionIcon: <ArrowUp />,
          isActionVisible: (user) => !user.isApproved,
        },
        {
          actionCallback: openDisapproveUserDialog,
          actionLabel: t("userManagement.page.disapprove"),
          actionIcon: <ArrowDown />,
          isActionVisible: (user) => !!user.isApproved,
        },
      ],
    },
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: usersResponse?.meta.pageCount || 0,
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
    targetEntity: (user) => {
      userStore.set("response", user);
      userStore.set<UpdateUserDto>("updateDto", {
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        isActive: user.isActive,
        isApproved: user.isApproved,
        username: user.username,
        email: user.email,
        password: "",
        roleId: user.roleId,
        pictureId: user.pictureId,
      });
    },
  };

  const { roles } = useRoles();
  const roleFilterOptions: DataTableColumnFilterOption[] = React.useMemo(
    () =>
      roles.map((role) => ({
        label: role.label,
        filter: `roleId||$eq||${role.id}`,
      })),
    [roles],
  );

  const columns = useUserColumns(context, roleFilterOptions);
  const isPending =
    isUsersPending || paging || resizing || searching || sorting || filtering;

  return (
    <div
      className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", className)}
    >
      <DataTable
        className="flex min-h-0 flex-1 flex-col overflow-hidden p-1"
        containerClassName="min-h-0 overflow-auto"
        columns={columns}
        data={users}
        context={context}
        isPending={isPending}
      />
      {deleteUserDialog}
      {activateUserDialog}
      {deactivateUserDialog}
      {approveUserDialog}
      {disapproveUserDialog}
    </div>
  );
};
