import { useDialog } from "@qlp/ui";
import { Spinner } from "@qlp/components";
import { Button } from "@qlp/ui";
import { useTranslation } from "react-i18next";

interface CurriculumExamDeleteDialogProps {
  representation?: string;
  deleteExam?: () => void;
  isDeletionPending?: boolean;
  resetExam?: () => void;
}

export const useCurriculumExamDeleteDialog = ({
  representation,
  deleteExam,
  isDeletionPending,
  resetExam,
}: CurriculumExamDeleteDialogProps) => {
  const { t: tCommon } = useTranslation("curriculum-common");
  const { t: tGlobal } = useTranslation("global");
  const close = { current: () => {} };
  const {
    DialogFragment: deleteCurriculumExamDialog,
    openDialog: openDeleteCurriculumExamDialog,
    closeDialog: closeDeleteCurriculumExamDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {tCommon("dialogs.deleteExam.title", { defaultValue: "Delete Exam" })}{" "}
        <span className="font-light">{representation}</span>?
      </div>
    ),
    description: tCommon(
      "dialogs.deleteExam.description",
      { defaultValue: "Are you sure you want to delete this exam? This action cannot be undone." }
    ),
    children: (
      <div className="flex justify-end gap-2">
        <Button
          onClick={() => {
            deleteExam?.();
            close.current();
          }}
        >
          {tGlobal("commands.delete")}
          <Spinner show={isDeletionPending} />
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            resetExam?.();
            close.current();
          }}
        >
          {tGlobal("commands.cancel")}
        </Button>
      </div>
    ),
    className: "w-[500px]",
    onToggle: resetExam,
  });
  close.current = closeDeleteCurriculumExamDialog;

  return {
    deleteCurriculumExamDialog,
    openDeleteCurriculumExamDialog,
    closeDeleteCurriculumExamDialog,
  };
};
