import { useDialog } from "@qlp/hooks";
import { Spinner } from "@qlp/components";
import { Button } from "@qlp/ui";
import { useTranslation } from "react-i18next";

interface RoleDeleteDialogProps {
  representation?: string;
  deleteRole?: () => void;
  isDeletionPending?: boolean;
  resetRole?: () => void;
}

export const useRoleDeleteDialog = ({
  representation,
  deleteRole,
  isDeletionPending,
  resetRole,
}: RoleDeleteDialogProps) => {
  const { t } = useTranslation("role");
  const close = { current: () => {} };
  const {
    DialogFragment: deleteRoleDialog,
    openDialog: openDeleteRoleDialog,
    closeDialog: closeDeleteRoleDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t("dialogs.delete.title")} <span className="font-light">{representation}</span>?
      </div>
    ),
    description: t("dialogs.delete.description"),
    children: (
      <div className="flex justify-end gap-2">
        <Button
          onClick={() => {
            deleteRole?.();
            close.current();
          }}
        >
          {t("dialogs.delete.confirm")}
          <Spinner show={isDeletionPending} />
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            resetRole?.();
            close.current();
          }}
        >
          {t("dialogs.delete.cancel")}
        </Button>
      </div>
    ),
    className: "w-[500px]",
    onToggle: resetRole,
  });
  close.current = closeDeleteRoleDialog;

  return { deleteRoleDialog, openDeleteRoleDialog, closeDeleteRoleDialog };
};
