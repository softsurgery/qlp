import { useDialog } from "@qlp/hooks";
import { Spinner } from "@qlp/components";
import { Button } from "@qlp/ui";
import { useTranslation } from "react-i18next";

interface UserDeactivateDialogProps {
  userFullname?: string;
  deactivateUser?: () => void;
  isDeactivationPending?: boolean;
  resetUser?: () => void;
}

export const useDeactivateUserDialog = ({
  userFullname,
  deactivateUser,
  isDeactivationPending,
  resetUser,
}: UserDeactivateDialogProps) => {
  const { t } = useTranslation("user-management");
  const { t: tCommon } = useTranslation("common");
  const close = { current: () => {} };
  const {
    DialogFragment: deactivateUserDialog,
    openDialog: openDeactivateUserDialog,
    closeDialog: closeDeactivateUserDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t("userManagement.dialogs.deactivateUserTitle")}{" "}
        <span className="font-light">{userFullname}</span>?
      </div>
    ),
    description: t("userManagement.dialogs.deactivateUserDescription"),
    children: (
      <div className="flex justify-end gap-2">
        <Button
          onClick={() => {
            deactivateUser?.();
            close.current();
          }}
        >
          {tCommon("common.buttons.deactivate")}
          <Spinner show={isDeactivationPending} />
        </Button>
        <Button variant="secondary" onClick={() => close.current()}>
          {tCommon("common.buttons.cancel")}
        </Button>
      </div>
    ),
    className: "w-[500px]",
    onToggle: resetUser,
  });
  close.current = closeDeactivateUserDialog;

  return {
    deactivateUserDialog,
    openDeactivateUserDialog,
    closeDeactivateUserDialog,
  };
};
