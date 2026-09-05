import { BookUser } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RoleUpdateForm } from "../forms/RoleUpdateForm";
import { useSheet } from "@/hooks/useSheet";

interface RoleUpdateSheet {
  updateRole?: () => void;
  isUpdatePending?: boolean;
  resetRole?: () => void;
}

export const useRoleUpdateSheet = ({
  updateRole,
  isUpdatePending,
  resetRole,
}: RoleUpdateSheet) => {
  const { t } = useTranslation("role");
  const close = { current: () => {} };
  const {
    SheetFragment: updateRoleSheet,
    openSheet: openUpdateRoleSheet,
    closeSheet: closeUpdateRoleSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <BookUser />
        {t("sheet.update.title")}
      </div>
    ),
    description: t("sheet.update.description"),
    children: (
      <RoleUpdateForm
        roleCallback={updateRole}
        cancelCallback={() => {
          close.current();
          resetRole?.();
        }}
        isPending={isUpdatePending}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: resetRole,
  });
  close.current = closeUpdateRoleSheet;

  return { updateRoleSheet, openUpdateRoleSheet, closeUpdateRoleSheet };
};
