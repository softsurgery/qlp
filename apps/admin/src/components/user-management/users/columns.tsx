import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import {
  DataTableCell,
  DataTableCellVariant,
  DataTableColumnHeader,
  DataTableRowActions,
  type DataTableColumnFilterOption,
  type DataTableConfig,
} from "@qlp/datatable-builder";
import { Badge } from "@qlp/ui";
import type { ResponseUserDto } from "@qlp/api-client";
import { cn } from "@/lib/utils";
import { identifyUserAvatar } from "@/lib/user";
import UserAvatarCell from "./UserAvatarCell";
import React from "react";

export const useUserColumns = (
  context: DataTableConfig<ResponseUserDto>,
  roleFilterOptions?: DataTableColumnFilterOption[],
): ColumnDef<ResponseUserDto>[] => {
  const { t } = useTranslation("user-management");
  const { t: tCommon } = useTranslation("common");

  return React.useMemo(
    () => [
      {
        accessorKey: "photo",
        meta: {
          title: t("userManagement.columns.photo"),
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("userManagement.columns.photo")}
            attribute="photo"
            context={context}
          />
        ),
        cell: ({ row }) => (
          <UserAvatarCell
            pictureId={row.original.pictureId}
            fallback={identifyUserAvatar(row.original)}
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: "username",
        meta: {
          title: t("userManagement.columns.username"),
          filterKey: "username",
          filterField: "username",
          filterType: "string",
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("userManagement.columns.username")}
            attribute="username"
            context={context}
          />
        ),
        cell: ({ row }) => (
          <div className="font-bold">{row.original.username}</div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "email",
        meta: {
          title: t("userManagement.columns.email"),
          filterKey: "email",
          filterField: "email",
          filterType: "string",
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("userManagement.columns.email")}
            attribute="email"
            context={context}
          />
        ),
        cell: ({ row }) => (
          <div className="font-bold">{row.original.email}</div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "firstName",
        meta: {
          title: t("userManagement.columns.firstName"),
          filterKey: "firstName",
          filterField: "firstName",
          filterType: "string",
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("userManagement.columns.firstName")}
            attribute="firstName"
            context={context}
          />
        ),
        cell: ({ row }) => (
          <div>
            {row.original.firstName || (
              <span className="opacity-70">
                {t("userManagement.errors.notDefined")}
              </span>
            )}
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "lastName",
        meta: {
          title: t("userManagement.columns.lastName"),
          filterKey: "lastName",
          filterField: "lastName",
          filterType: "string",
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("userManagement.columns.lastName")}
            attribute="lastName"
            context={context}
          />
        ),
        cell: ({ row }) => (
          <div>
            {row.original.lastName || (
              <span className="opacity-70">
                {t("userManagement.errors.notDefined")}
              </span>
            )}
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "dateOfBirth",
        meta: {
          title: t("userManagement.columns.dateOfBirth"),
          filterKey: "dateOfBirth",
          filterField: "dateOfBirth",
          filterType: "date-range",
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("userManagement.columns.dateOfBirth")}
            attribute="dateOfBirth"
            context={context}
          />
        ),
        cell: ({ row }) => (
          <div>
            {(row.original.dateOfBirth &&
              format(new Date(row.original.dateOfBirth), "yyyy-MM-dd")) || (
              <span className="opacity-70">
                {t("userManagement.errors.notDefined")}
              </span>
            )}
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "role",
        meta: {
          title: t("userManagement.columns.role"),
          filterKey: "role",
          filterType: "select",
          filterMultiSelect: true,
          filterOptions: roleFilterOptions,
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("userManagement.columns.role")}
            attribute="role.label"
            context={context}
          />
        ),
        cell: ({ row }) => (
          <div>
            {row.original.role?.label || (
              <span className="opacity-70">
                {t("userManagement.errors.roleNotFound")}
              </span>
            )}
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "isActive",
        meta: {
          title: t("userManagement.columns.isActive"),
          filterKey: "isActive",
          filterType: "options",
          filterOptions: [
            { label: tCommon("answer.yes"), filter: "isActive||$eq||1" },
            { label: tCommon("answer.no"), filter: "isActive||$eq||0" },
          ],
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("userManagement.columns.isActive")}
            attribute="isActive"
            context={context}
          />
        ),
        cell: ({ row }) => (
          <Badge
            variant={row.original.isActive ? "default" : "secondary"}
            className={cn("font-bold")}
          >
            {row.original.isActive
              ? tCommon("answer.yes")
              : tCommon("answer.no")}
          </Badge>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "isApproved",
        meta: {
          title: t("userManagement.columns.isApproved"),
          filterKey: "isApproved",
          filterType: "options",
          filterOptions: [
            { label: tCommon("answer.yes"), filter: "isApproved||$eq||1" },
            { label: tCommon("answer.no"), filter: "isApproved||$eq||0" },
          ],
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("userManagement.columns.isApproved")}
            attribute="isApproved"
            context={context}
          />
        ),
        cell: ({ row }) => (
          <Badge
            variant={row.original.isApproved ? "default" : "secondary"}
            className={cn("font-bold")}
          >
            {row.original.isApproved
              ? tCommon("answer.yes")
              : tCommon("answer.no")}
          </Badge>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "createdAt",
        meta: {
          title: t("userManagement.columns.createdAt"),
          filterKey: "createdAt",
          filterField: "createdAt",
          filterType: "date-range",
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("userManagement.columns.createdAt")}
            attribute="createdAt"
            context={context}
          />
        ),
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
        enableSorting: true,
      },
      {
        accessorKey: "updatedAt",
        meta: {
          title: t("userManagement.columns.updatedAt"),
          filterKey: "updatedAt",
          filterField: "updatedAt",
          filterType: "date-range",
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("userManagement.columns.updatedAt")}
            attribute="updatedAt"
            context={context}
          />
        ),
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
        enableSorting: true,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex justify-center">
            <DataTableRowActions row={row} context={context} />
          </div>
        ),
      },
    ],
    [roleFilterOptions],
  );
};
