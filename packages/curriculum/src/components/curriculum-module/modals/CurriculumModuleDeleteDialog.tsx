import { useDialog } from "@qlp/ui";
import { Spinner } from "@qlp/components";
import { Button } from "@qlp/ui";
import { useTranslation } from "react-i18next";

interface CurriculumModuleDeleteDialogProps {
  representation?: string;
  deleteModule?: () => void;
  isDeletionPending?: boolean;
  resetModule?: () => void;
}

export const useCurriculumModuleDeleteDialog = ({
  representation,
  deleteModule,
  isDeletionPending,
  resetModule,
}: CurriculumModuleDeleteDialogProps) => {
  const { t: tModule } = useTranslation("curriculum-module");
  const close = { current: () => {} };
  const {
    DialogFragment: deleteCurriculumModuleDialog,
    openDialog: openDeleteCurriculumModuleDialog,
    closeDialog: closeDeleteCurriculumModuleDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {tModule("dialogs.deleteModule.title")}{" "}
        <span className="font-light">{representation}</span>?
      </div>
    ),
    description: tModule(
      "dialogs.deleteModule.description"
    ),
    children: (
      <div className="flex justify-end gap-2">
        <Button
          onClick={() => {
            deleteModule?.();
            close.current();
          }}
        >
          {tModule("dialogs.deleteModule.confirm")}
          <Spinner show={isDeletionPending} />
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            resetModule?.();
            close.current();
          }}
        >
          {tModule("dialogs.deleteModule.cancel")}
        </Button>
      </div>
    ),
    className: "w-[500px]",
    onToggle: resetModule,
  });
  close.current = closeDeleteCurriculumModuleDialog;

  return {
    deleteCurriculumModuleDialog,
    openDeleteCurriculumModuleDialog,
    closeDeleteCurriculumModuleDialog,
  };
};
