import { useDialog } from "@qlp/hooks";
import { Spinner } from "@qlp/components";
import { Button } from "@qlp/ui";
import { useTranslation } from "react-i18next";

interface UserApproveDialogProps {
  representation?: string;
  approveUser?: () => void;
  isApprovalPending?: boolean;
  resetUser?: () => void;
}

export const useApproveUserDialog = ({
  representation,
  approveUser,
  isApprovalPending,
  resetUser,
}: UserApproveDialogProps) => {
  const { t } = useTranslation("user-management");
  const { t: tCommon } = useTranslation("common");
  const close = { current: () => {} };
  const {
    DialogFragment: approveUserDialog,
    openDialog: openApproveUserDialog,
    closeDialog: closeApproveUserDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t("userManagement.dialogs.approveUserTitle")}{" "}
        <span className="font-light">{representation}</span>?
      </div>
    ),
    description: t("userManagement.dialogs.approveUserDescription"),
    children: (
      <div className="flex justify-end gap-2">
        <Button
          onClick={() => {
            approveUser?.();
            close.current();
          }}
        >
          {tCommon("common.buttons.approve")}
          <Spinner show={isApprovalPending} />
        </Button>
        <Button variant="secondary" onClick={() => close.current()}>
          {tCommon("common.buttons.cancel")}
        </Button>
      </div>
    ),
    className: "w-[500px]",
    onToggle: resetUser,
  });
  close.current = closeApproveUserDialog;

  return { approveUserDialog, openApproveUserDialog, closeApproveUserDialog };
};
