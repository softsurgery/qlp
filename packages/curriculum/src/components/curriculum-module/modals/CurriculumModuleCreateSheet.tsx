import { Layers } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSheet } from "@qlp/ui";
import { CreateCurriculumModuleForm } from "../forms/CreateCurriculumModuleForm";
import { useCurriculumModuleStore } from "../../../hooks/stores/useCurriculumModuleStore";

interface CurriculumModuleCreateSheetProps {
  curriculumId: string;
}

export const useCurriculumModuleCreateSheet = ({
  curriculumId,
}: CurriculumModuleCreateSheetProps) => {
  const { t: tModule } = useTranslation("curriculum-module");
  const reset = useCurriculumModuleStore((state) => state.reset);
  const close = { current: () => {} };
  const {
    SheetFragment: createCurriculumModuleSheet,
    openSheet: openCreateCurriculumModuleSheet,
    closeSheet: closeCreateCurriculumModuleSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Layers />
        {tModule("sheet.createModule.title")}
      </div>
    ),
    description: tModule(
      "sheet.createModule.description"
    ),
    children: (
      <CreateCurriculumModuleForm
        className="px-4"
        curriculumId={curriculumId}
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
  close.current = closeCreateCurriculumModuleSheet;

  return {
    createCurriculumModuleSheet,
    openCreateCurriculumModuleSheet,
    closeCreateCurriculumModuleSheet,
  };
};
