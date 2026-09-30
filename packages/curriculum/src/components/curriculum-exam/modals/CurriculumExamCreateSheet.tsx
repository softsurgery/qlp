import { ClipboardList } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSheet } from "@qlp/ui";
import { CreateCurriculumExamForm } from "../forms/CreateCurriculumExamForm";
import { useCurriculumExamStore } from "../../../hooks/stores/useCurriculumExamStore";

interface CurriculumExamCreateSheetProps {
  curriculumId: string;
  moduleId: string;
}

export const useCurriculumExamCreateSheet = ({
  curriculumId,
  moduleId,
}: CurriculumExamCreateSheetProps) => {
  const { t: tCommon } = useTranslation("curriculum-common");
  const reset = useCurriculumExamStore((state) => state.reset);
  const close = { current: () => {} };
  const {
    SheetFragment: createCurriculumExamSheet,
    openSheet: openCreateCurriculumExamSheet,
    closeSheet: closeCreateCurriculumExamSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <ClipboardList />
        {tCommon("sheet.createExam.title", { defaultValue: "Create Exam" })}
      </div>
    ),
    description: tCommon("sheet.createExam.description", {
      defaultValue: "Add a new exam to this module with custom questions.",
    }),
    children: (
      <CreateCurriculumExamForm
        className="px-4"
        curriculumId={curriculumId}
        moduleId={moduleId}
        onSuccess={() => close.current()}
        onCancel={() => {
          close.current();
          reset();
        }}
      />
    ),
    className: "min-w-[60vw] flex flex-col flex-1 overflow-hidden",
    onToggle: reset,
  });
  close.current = closeCreateCurriculumExamSheet;

  return {
    createCurriculumExamSheet,
    openCreateCurriculumExamSheet,
    closeCreateCurriculumExamSheet,
  };
};
