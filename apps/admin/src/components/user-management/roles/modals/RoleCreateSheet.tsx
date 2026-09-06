import { BookUser } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RoleCreateForm } from "../forms/RoleCreateForm";
import { useSheet } from "@qlp/hooks";

interface RoleCreateSheet {
  createRole?: () => void;
  isCreatePending?: boolean;
  resetRole?: () => void;
}

export const useRoleCreateSheet = ({
  createRole,
  isCreatePending,
  resetRole,
}: RoleCreateSheet) => {
  const { t } = useTranslation("role");
  const close = { current: () => {} };
  const {
    SheetFragment: createRoleSheet,
    openSheet: openCreateRoleSheet,
    closeSheet: closeCreateRoleSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <BookUser />
        {t("sheet.create.title")}
      </div>
    ),
    description: t("sheet.create.description"),
    children: (
      <RoleCreateForm
        roleCallback={createRole}
        cancelCallback={() => {
          close.current();
          resetRole?.();
        }}
        isPending={isCreatePending}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: resetRole,
  });
  close.current = closeCreateRoleSheet;

  return { createRoleSheet, openCreateRoleSheet, closeCreateRoleSheet };
};
