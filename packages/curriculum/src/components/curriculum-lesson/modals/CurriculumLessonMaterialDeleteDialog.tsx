import { useDialog } from "@qlp/ui";
import { Spinner } from "@qlp/components";
import { Button } from "@qlp/ui";
import { useTranslation } from "react-i18next";

interface CurriculumLessonMaterialDeleteDialogProps {
  representation?: string;
  deleteMaterial?: () => void;
  isDeletionPending?: boolean;
  resetMaterial?: () => void;
}

export const useCurriculumLessonMaterialDeleteDialog = ({
  representation,
  deleteMaterial,
  isDeletionPending,
  resetMaterial,
}: CurriculumLessonMaterialDeleteDialogProps) => {
  const { t } = useTranslation("curriculum");
  const close = { current: () => {} };
  const {
    DialogFragment: deleteCurriculumLessonMaterialDialog,
    openDialog: openDeleteCurriculumLessonMaterialDialog,
    closeDialog: closeDeleteCurriculumLessonMaterialDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t("dialogs.deleteMaterial.title", "Delete material")}{" "}
        <span className="font-light">{representation}</span>?
      </div>
    ),
    description: t(
      "dialogs.deleteMaterial.description",
      "Previous versions are kept. This removes the latest version of this material.",
    ),
    children: (
      <div className="flex justify-end gap-2">
        <Button
          onClick={() => {
            deleteMaterial?.();
            close.current();
          }}
        >
          {t("dialogs.deleteMaterial.confirm", "Delete")}
          <Spinner show={isDeletionPending} />
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            resetMaterial?.();
            close.current();
          }}
        >
          {t("dialogs.deleteMaterial.cancel", "Cancel")}
        </Button>
      </div>
    ),
    className: "w-[500px]",
    onToggle: resetMaterial,
  });
  close.current = closeDeleteCurriculumLessonMaterialDialog;

  return {
    deleteCurriculumLessonMaterialDialog,
    openDeleteCurriculumLessonMaterialDialog,
    closeDeleteCurriculumLessonMaterialDialog,
  };
};
