import React from "react";
import { useDialog } from "@qlp/ui";
import { Spinner } from "@qlp/components";
import { Button } from "@qlp/ui";
import { useTranslation } from "react-i18next";

interface CurriculumDeleteDialogProps {
  curriculumTitle?: string;
  deleteCurriculum?: () => void;
  isDeletePending?: boolean;
}

export const useCurriculumDeleteDialog = ({
  curriculumTitle,
  deleteCurriculum,
  isDeletePending,
}: CurriculumDeleteDialogProps) => {
  const { t } = useTranslation("curriculum");
  const { t: tCommon } = useTranslation("common");
  const close = { current: () => {} };
  const {
    DialogFragment: deleteCurriculumDialog,
    openDialog: openDeleteCurriculumDialog,
    closeDialog: closeDeleteCurriculumDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t("confirmDeleteTitle")}{" "}
        <span className="font-light">{curriculumTitle}</span>
      </div>
    ),
    description: t("confirmDeleteCurriculum"),
    children: (
      <div className="flex justify-end gap-2">
        <Button
          variant="destructive"
          onClick={() => {
            deleteCurriculum?.();
            close.current();
          }}
        >
          {tCommon("common.buttons.delete")}
          <Spinner show={isDeletePending} />
        </Button>
        <Button variant="secondary" onClick={() => close.current()}>
          {tCommon("common.buttons.cancel")}
        </Button>
      </div>
    ),
    className: "w-[500px]",
  });
  close.current = closeDeleteCurriculumDialog;

  return {
    deleteCurriculumDialog,
    openDeleteCurriculumDialog,
    closeDeleteCurriculumDialog,
  };
};
