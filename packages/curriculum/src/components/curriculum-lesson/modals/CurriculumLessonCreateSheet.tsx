import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSheet } from "@qlp/ui";
import { CreateCurriculumLessonForm } from "../forms/CreateCurriculumLessonForm";
import { useCurriculumLessonStore } from "../../../hooks/stores/useCurriculumLessonStore";

interface CurriculumLessonCreateSheetProps {
  curriculumId: string;
  moduleId: string;
}

export const useCurriculumLessonCreateSheet = ({
  curriculumId,
  moduleId,
}: CurriculumLessonCreateSheetProps) => {
  const { t: tLesson } = useTranslation("curriculum-lesson");
  const reset = useCurriculumLessonStore((state) => state.reset);
  const close = { current: () => {} };
  const {
    SheetFragment: createCurriculumLessonSheet,
    openSheet: openCreateCurriculumLessonSheet,
    closeSheet: closeCreateCurriculumLessonSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <BookOpen />
        {tLesson("sheet.createLesson.title")}
      </div>
    ),
    description: tLesson(
      "sheet.createLesson.description"
    ),
    children: (
      <CreateCurriculumLessonForm
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
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: reset,
  });
  close.current = closeCreateCurriculumLessonSheet;

  return {
    createCurriculumLessonSheet,
    openCreateCurriculumLessonSheet,
    closeCreateCurriculumLessonSheet,
  };
};
