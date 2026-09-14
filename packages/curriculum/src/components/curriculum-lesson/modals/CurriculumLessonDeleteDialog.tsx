import { useDialog } from "@qlp/ui";
import { Spinner } from "@qlp/components";
import { Button } from "@qlp/ui";
import { useTranslation } from "react-i18next";

interface CurriculumLessonDeleteDialogProps {
  representation?: string;
  deleteLesson?: () => void;
  isDeletionPending?: boolean;
  resetLesson?: () => void;
}

export const useCurriculumLessonDeleteDialog = ({
  representation,
  deleteLesson,
  isDeletionPending,
  resetLesson,
}: CurriculumLessonDeleteDialogProps) => {
  const { t } = useTranslation("curriculum");
  const close = { current: () => {} };
  const {
    DialogFragment: deleteCurriculumLessonDialog,
    openDialog: openDeleteCurriculumLessonDialog,
    closeDialog: closeDeleteCurriculumLessonDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t("dialogs.deleteLesson.title", "Delete lesson")}{" "}
        <span className="font-light">{representation}</span>?
      </div>
    ),
    description: t(
      "dialogs.deleteLesson.description",
      "Previous versions are kept. This removes the latest version of the lesson.",
    ),
    children: (
      <div className="flex justify-end gap-2">
        <Button
          onClick={() => {
            deleteLesson?.();
            close.current();
          }}
        >
          {t("dialogs.deleteLesson.confirm", "Delete")}
          <Spinner show={isDeletionPending} />
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            resetLesson?.();
            close.current();
          }}
        >
          {t("dialogs.deleteLesson.cancel", "Cancel")}
        </Button>
      </div>
    ),
    className: "w-[500px]",
    onToggle: resetLesson,
  });
  close.current = closeDeleteCurriculumLessonDialog;

  return {
    deleteCurriculumLessonDialog,
    openDeleteCurriculumLessonDialog,
    closeDeleteCurriculumLessonDialog,
  };
};
