import { useDialog } from "@qlp/hooks";
import { Spinner } from "@qlp/components";
import { Button } from "@qlp/ui";

interface RoleDuplicateDialogProps {
  representation?: string;
  duplicateRole?: () => void;
  isDuplicationPending?: boolean;
  resetRole?: () => void;
}

export const useRoleDuplicateDialog = ({
  representation,
  duplicateRole,
  isDuplicationPending,
  resetRole,
}: RoleDuplicateDialogProps) => {
  const close = { current: () => {} };
  const {
    DialogFragment: duplicateRoleDialog,
    openDialog: openDuplicateRoleDialog,
    closeDialog: closeDuplicateRoleDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        Duplicate role <span className="font-light">{representation}</span>?
      </div>
    ),
    description: "This will copy the role and its permissions.",
    children: (
      <div className="flex justify-end gap-2">
        <Button
          onClick={() => {
            duplicateRole?.();
            close.current();
          }}
        >
          Confirm
          <Spinner show={isDuplicationPending} />
        </Button>
        <Button variant="secondary" onClick={() => close.current()}>
          Cancel
        </Button>
      </div>
    ),
    className: "w-[500px]",
    onToggle: resetRole,
  });
  close.current = closeDuplicateRoleDialog;

  return {
    duplicateRoleDialog,
    openDuplicateRoleDialog,
    closeDuplicateRoleDialog,
  };
};
