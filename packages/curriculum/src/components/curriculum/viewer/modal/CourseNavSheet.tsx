import { useTranslation } from "react-i18next";
import { type ResponseCurriculumModuleDto } from "@qlp/api-client";
import { cn, useSheet, useRTL } from "@qlp/ui";
import { CourseNav } from "../nav/CourseNav";

interface CourseNavSheetProps {
  className?: string;
  title: string;
  description?: string;
  modules: ResponseCurriculumModuleDto[];
  selectedItemId?: string;
  openAccordionId?: string;
  onSelectItem: (
    itemId?: string,
    parentLessonId?: string,
    closeNav?: boolean,
  ) => void;
}

export const useCourseNavSheet = ({
  className,
  title,
  description,
  modules,
  selectedItemId,
  openAccordionId,
  onSelectItem,
}: CourseNavSheetProps) => {
  const { t: tCommon } = useTranslation("curriculum-common");
  const { isRTL } = useRTL();
  const close = { current: () => {} };
  const {
    SheetFragment: courseNavSheet,
    openSheet: openCourseNavSheet,
    closeSheet: closeCourseNavSheet,
  } = useSheet({
    title: tCommon("viewer.courseMaterial"),
    headerClassName: "sr-only",
    showCloseButton: false,
    side: isRTL ? "right" : "left",

    className: cn("w-[70vw] max-w-none p-0 sm:max-w-none", className),
    children: (
      <CourseNav
        className="h-full"
        title={title}
        description={description}
        modules={modules}
        selectedItemId={selectedItemId}
        openAccordionId={openAccordionId}
        onSelectItem={(itemId, parentLessonId, closeNav = true) => {
          onSelectItem(itemId, parentLessonId, closeNav);
          if (closeNav) close.current();
        }}
        onClose={() => close.current()}
      />
    ),
  });
  close.current = closeCourseNavSheet;

  return { courseNavSheet, openCourseNavSheet, closeCourseNavSheet };
};
