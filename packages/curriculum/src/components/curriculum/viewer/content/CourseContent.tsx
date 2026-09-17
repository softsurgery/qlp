import { Loader2 } from "lucide-react";
import {
  type ResponseCurriculumExamDto,
  type ResponseCurriculumLessonDto,
  type ResponseCurriculumLessonMaterialDto,
  type ResponseCurriculumModuleDto,
} from "@qlp/api-client";
import { useLocalStorage } from "@qlp/hooks";
import { cn } from "@qlp/ui";
import { CourseExamMaterials } from "./CourseContentExamMaterial";
import { CourseLessonMaterials } from "./CourseLessonMaterials";
import { CourseMaterialBlock } from "./CourseMaterialBlock";
import { CourseModuleLessons } from "./CourseModuleLessons";
import { CourseModules } from "./CourseModules";
import {
  CONTENT_WIDTHS,
  CourseContentWidthSwitch,
  isContentWidth,
  type ContentWidth,
} from "./CourseContentWidthSwitch";

const CONTENT_WIDTH_STORAGE_KEY = "qlp.curriculum.viewer.contentWidth";

interface CourseContentProps {
  className?: string;
  curriculumTitle: string;
  modules: ResponseCurriculumModuleDto[];
  lesson?: ResponseCurriculumLessonDto;
  material?: ResponseCurriculumLessonMaterialDto;
  exam?: ResponseCurriculumExamDto;
  module?: ResponseCurriculumModuleDto;
  isMaterialsPending?: boolean;
  revealAnswers?: boolean;
  onSelectItem: (itemId: string, lessonId?: string) => void;
}

export const CourseContent = ({
  className,
  curriculumTitle,
  modules,
  lesson,
  material,
  exam,
  module,
  isMaterialsPending,
  revealAnswers,
  onSelectItem,
}: CourseContentProps) => {
  const [storedWidth, setStoredWidth] = useLocalStorage<ContentWidth>(
    CONTENT_WIDTH_STORAGE_KEY,
    "narrow",
  );
  const contentWidth = isContentWidth(storedWidth) ? storedWidth : "narrow";
  const widthClass =
    CONTENT_WIDTHS.find((option) => option.id === contentWidth)?.className ??
    "mx-auto w-full max-w-3xl";

  return (
    <div className={cn("w-full", className)}>
      {material || exam || lesson ? (
        <div className="sticky top-5 right-0 flex justify-end px-4 pt-4 sm:px-8">
          <CourseContentWidthSwitch
            value={contentWidth}
            onChange={setStoredWidth}
          />
        </div>
      ) : null}
      <div
        className={cn(
          widthClass,
          "px-4 pb-10 pt-4 transition-[max-width] duration-200 sm:px-8",
        )}
      >
        {isMaterialsPending && !material && !lesson ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : material ? (
          <CourseMaterialBlock material={material} />
        ) : exam ? (
          <CourseExamMaterials exam={exam} revealAnswers={revealAnswers} />
        ) : lesson ? (
          <CourseLessonMaterials
            lesson={lesson}
            isPending={isMaterialsPending}
          />
        ) : module ? (
          <CourseModuleLessons module={module} onSelectItem={onSelectItem} />
        ) : (
          <CourseModules
            title={curriculumTitle}
            modules={modules}
            onSelectItem={onSelectItem}
          />
        )}
      </div>
    </div>
  );
};
