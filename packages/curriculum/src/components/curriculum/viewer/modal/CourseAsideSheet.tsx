import { useTranslation } from "react-i18next";
import {
  type ResponseCurriculumDto,
  type ResponseCurriculumModuleDto,
} from "@qlp/api-client";
import { cn, useSheet } from "@qlp/ui";
import { CourseAside } from "../aside/CourseAside";

interface CourseAsideSheetProps {
  className?: string;
  curriculum: ResponseCurriculumDto;
  modules: ResponseCurriculumModuleDto[];
}

export const useCourseAsideSheet = ({
  className,
  curriculum,
  modules,
}: CourseAsideSheetProps) => {
  const { t } = useTranslation("curriculum");
  const close = { current: () => {} };
  const {
    SheetFragment: courseAsideSheet,
    openSheet: openCourseAsideSheet,
    closeSheet: closeCourseAsideSheet,
  } = useSheet({
    title: t("viewer.overview"),
    headerClassName: "sr-only",
    showCloseButton: false,
    className: cn("w-[70vw] max-w-none p-0 sm:max-w-none", className),
    children: (
      <CourseAside
        className="h-full"
        curriculum={curriculum}
        modules={modules}
        onClose={() => close.current()}
      />
    ),
  });
  close.current = closeCourseAsideSheet;

  return { courseAsideSheet, openCourseAsideSheet, closeCourseAsideSheet };
};
