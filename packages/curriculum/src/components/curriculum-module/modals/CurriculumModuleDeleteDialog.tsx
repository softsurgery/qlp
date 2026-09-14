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
  const { t } = useTranslation("curriculum");
  const close = { current: () => {} };
  const {
    DialogFragment: deleteCurriculumModuleDialog,
    openDialog: openDeleteCurriculumModuleDialog,
    closeDialog: closeDeleteCurriculumModuleDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t("dialogs.deleteModule.title", "Delete module")}{" "}
        <span className="font-light">{representation}</span>?
      </div>
    ),
    description: t(
      "dialogs.deleteModule.description",
      "Previous versions are kept. This removes the latest version of the module and its lessons.",
    ),
    children: (
      <div className="flex justify-end gap-2">
        <Button
          onClick={() => {
            deleteModule?.();
            close.current();
          }}
        >
          {t("dialogs.deleteModule.confirm", "Delete")}
          <Spinner show={isDeletionPending} />
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            resetModule?.();
            close.current();
          }}
        >
          {t("dialogs.deleteModule.cancel", "Cancel")}
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
