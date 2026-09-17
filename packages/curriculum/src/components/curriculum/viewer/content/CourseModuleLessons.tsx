import { useTranslation } from "react-i18next";
import { ClipboardList } from "lucide-react";
import { type ResponseCurriculumModuleDto } from "@qlp/api-client";
import { HtmlContent } from "@qlp/components";
import { cn } from "@qlp/ui";
import { hasRichText, moduleOutline, outlineItemId } from "../utils";
import { CourseOutlineRow } from "./CourseOutlineRow";

interface CourseModuleLessonsProps {
  className?: string;
  module: ResponseCurriculumModuleDto;
  onSelectItem: (itemId: string, lessonId?: string) => void;
}

export const CourseModuleLessons = ({
  className,
  module,
  onSelectItem,
}: CourseModuleLessonsProps) => {
  const { t } = useTranslation("curriculum");
  const outline = moduleOutline(module);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {module.title}
        </h1>
        {hasRichText(module.description) ? (
          <HtmlContent html={module.description} className="mt-3" />
        ) : (
          <p className="mt-1 text-sm text-muted-foreground">
            {t("viewer.selectLesson")}
          </p>
        )}
      </div>
      {outline.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t("viewer.emptyModule")}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {outline.map((entry) => {
            const itemId = outlineItemId(entry);
            if (entry.kind === "exam") {
              return (
                <li key={itemId}>
                  <CourseOutlineRow
                    title={entry.exam.title}
                    meta={t("editor.exam")}
                    icon={<ClipboardList className="size-4" />}
                    onClick={() => onSelectItem(itemId)}
                  />
                </li>
              );
            }
            return (
              <li key={itemId}>
                <CourseOutlineRow
                  title={entry.lesson.title}
                  meta={t("editor.lesson")}
                  onClick={() => onSelectItem(itemId)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
