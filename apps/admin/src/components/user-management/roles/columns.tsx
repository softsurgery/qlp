import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import {
  DataTableColumnHeader,
  DataTableRowActions,
  type DataTableConfig,
} from "@qlp/datatable-builder";
import {
  Badge,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@qlp/ui";
import type { ResponseRoleDto } from "@qlp/api-client";
import { formatPermissionLabel } from "./utils";

export const useRoleColumns = (
  context: DataTableConfig<ResponseRoleDto>,
): ColumnDef<ResponseRoleDto>[] => {
  const { t } = useTranslation("role");
  const { t: tCommon } = useTranslation("common");

  return [
    {
      accessorKey: "label",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("columns.label")}
          attribute="label"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row.original.label}</div>,
      enableSorting: true,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("columns.description")}
          attribute="description"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div>{row.original.description || t("columns.noDescription")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "permissions",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("columns.permissions")}
          attribute="permissions"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const entries =
          row.original.permissions?.map((p) => p.permission) ?? [];
        if (entries.length === 0) {
          return <div className="opacity-70">{t("columns.noPermissions")}</div>;
        }
        const visiblePermissions = entries.slice(0, 2);
        const hiddenPermissions = entries.slice(2);
        return (
          <div className="flex flex-wrap gap-1">
            {visiblePermissions.map((entry, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="whitespace-nowrap font-normal"
              >
                {formatPermissionLabel(entry?.label) ||
                  tCommon("general.unknown")}
              </Badge>
            ))}
            {hiddenPermissions.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="cursor-pointer whitespace-nowrap font-normal"
                    >
                      +{hiddenPermissions.length} {tCommon("general.more")}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="flex max-h-64 max-w-sm flex-wrap gap-1 overflow-y-auto bg-card p-2 shadow-md"
                  >
                    {hiddenPermissions.map((entry, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="justify-center whitespace-nowrap font-normal"
                      >
                        {formatPermissionLabel(entry?.label) ||
                          tCommon("general.unknown")}
                      </Badge>
                    ))}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DataTableRowActions row={row} context={context} />
        </div>
      ),
    },
  ];
};
