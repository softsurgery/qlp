import { useDialog } from "@qlp/hooks";
import { Spinner } from "@qlp/components";
import { Button } from "@qlp/ui";
import { useTranslation } from "react-i18next";

interface UserActivateDialogProps {
  userFullname?: string;
  activateUser?: () => void;
  isActivationPending?: boolean;
  resetUser?: () => void;
}

export const useActivateUserDialog = ({
  userFullname,
  activateUser,
  isActivationPending,
  resetUser,
}: UserActivateDialogProps) => {
  const { t } = useTranslation("user-management");
  const { t: tCommon } = useTranslation("common");
  const close = { current: () => {} };
  const {
    DialogFragment: activateUserDialog,
    openDialog: openActivateUserDialog,
    closeDialog: closeActivateUserDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t("userManagement.dialogs.activateUserTitle")}{" "}
        <span className="font-light">{userFullname}</span>?
      </div>
    ),
    description: t("userManagement.dialogs.activateUserDescription"),
    children: (
      <div className="flex justify-end gap-2">
        <Button
          onClick={() => {
            activateUser?.();
            close.current();
          }}
        >
          {tCommon("common.buttons.activate")}
          <Spinner show={isActivationPending} />
        </Button>
        <Button variant="secondary" onClick={() => close.current()}>
          {tCommon("common.buttons.cancel")}
        </Button>
      </div>
    ),
    className: "w-[500px]",
    onToggle: resetUser,
  });
  close.current = closeActivateUserDialog;

  return { activateUserDialog, openActivateUserDialog, closeActivateUserDialog };
};
