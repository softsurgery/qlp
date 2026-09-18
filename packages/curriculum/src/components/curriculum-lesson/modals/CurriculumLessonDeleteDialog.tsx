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
  const { t: tLesson } = useTranslation("curriculum-lesson");
  const close = { current: () => {} };
  const {
    DialogFragment: deleteCurriculumLessonDialog,
    openDialog: openDeleteCurriculumLessonDialog,
    closeDialog: closeDeleteCurriculumLessonDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {tLesson("dialogs.deleteLesson.title")}{" "}
        <span className="font-light">{representation}</span>?
      </div>
    ),
    description: tLesson(
      "dialogs.deleteLesson.description"
    ),
    children: (
      <div className="flex justify-end gap-2">
        <Button
          onClick={() => {
            deleteLesson?.();
            close.current();
          }}
        >
          {tLesson("dialogs.deleteLesson.confirm")}
          <Spinner show={isDeletionPending} />
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            resetLesson?.();
            close.current();
          }}
        >
          {tLesson("dialogs.deleteLesson.cancel")}
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
