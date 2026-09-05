import { useDialog } from "@qlp/hooks";
import { Spinner } from "@qlp/components";
import { Button } from "@qlp/ui";
import { useTranslation } from "react-i18next";

interface UserDeleteDialogProps {
  userFullname?: string;
  deleteUser?: () => void;
  isDeletePending?: boolean;
}

export const useUserDeleteDialog = ({
  userFullname,
  deleteUser,
  isDeletePending,
}: UserDeleteDialogProps) => {
  const { t } = useTranslation("user-management");
  const { t: tCommon } = useTranslation("common");
  const close = { current: () => {} };
  const {
    DialogFragment: deleteUserDialog,
    openDialog: openDeleteUserDialog,
    closeDialog: closeDeleteUserDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t("userManagement.dialogs.deleteUserTitle")}{" "}
        <span className="font-light">{userFullname}</span>?
      </div>
    ),
    description: t("userManagement.dialogs.deleteUserDescription"),
    children: (
      <div className="flex justify-end gap-2">
        <Button
          variant="destructive"
          onClick={() => {
            deleteUser?.();
            close.current();
          }}
        >
          {tCommon("common.buttons.delete")}
          <Spinner show={isDeletePending} />
        </Button>
        <Button variant="secondary" onClick={() => close.current()}>
          {tCommon("common.buttons.cancel")}
        </Button>
      </div>
    ),
    className: "w-[500px]",
  });
  close.current = closeDeleteUserDialog;

  return { deleteUserDialog, openDeleteUserDialog, closeDeleteUserDialog };
};
