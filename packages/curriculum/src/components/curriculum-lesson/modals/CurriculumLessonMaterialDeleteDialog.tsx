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
  const { t: tMaterial } = useTranslation("curriculum-material");
  const close = { current: () => {} };
  const {
    DialogFragment: deleteCurriculumLessonMaterialDialog,
    openDialog: openDeleteCurriculumLessonMaterialDialog,
    closeDialog: closeDeleteCurriculumLessonMaterialDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {tMaterial("dialogs.deleteMaterial.title")}{" "}
        <span className="font-light">{representation}</span>?
      </div>
    ),
    description: tMaterial(
      "dialogs.deleteMaterial.description"
    ),
    children: (
      <div className="flex justify-end gap-2">
        <Button
          onClick={() => {
            deleteMaterial?.();
            close.current();
          }}
        >
          {tMaterial("dialogs.deleteMaterial.confirm")}
          <Spinner show={isDeletionPending} />
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            resetMaterial?.();
            close.current();
          }}
        >
          {tMaterial("dialogs.deleteMaterial.cancel")}
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
