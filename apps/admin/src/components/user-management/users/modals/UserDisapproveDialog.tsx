import { useDialog } from "@qlp/hooks";
import { Spinner } from "@qlp/components";
import { Button } from "@qlp/ui";
import { useTranslation } from "react-i18next";

interface UserDisapproveDialogProps {
  representation?: string;
  disapproveUser?: () => void;
  isDisapprovalPending?: boolean;
  resetUser?: () => void;
}

export const useDisapproveUserDialog = ({
  representation,
  disapproveUser,
  isDisapprovalPending,
  resetUser,
}: UserDisapproveDialogProps) => {
  const { t } = useTranslation("user-management");
  const { t: tCommon } = useTranslation("common");
  const close = { current: () => {} };
  const {
    DialogFragment: disapproveUserDialog,
    openDialog: openDisapproveUserDialog,
    closeDialog: closeDisapproveUserDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t("userManagement.dialogs.disapproveUserTitle")}{" "}
        <span className="font-light">{representation}</span>?
      </div>
    ),
    description: t("userManagement.dialogs.disapproveUserDescription"),
    children: (
      <div className="flex justify-end gap-2">
        <Button
          onClick={() => {
            disapproveUser?.();
            close.current();
          }}
        >
          {tCommon("common.buttons.disapprove")}
          <Spinner show={isDisapprovalPending} />
        </Button>
        <Button variant="secondary" onClick={() => close.current()}>
          {tCommon("common.buttons.cancel")}
        </Button>
      </div>
    ),
    className: "w-[500px]",
    onToggle: resetUser,
  });
  close.current = closeDisapproveUserDialog;

  return {
    disapproveUserDialog,
    openDisapproveUserDialog,
    closeDisapproveUserDialog,
  };
};
