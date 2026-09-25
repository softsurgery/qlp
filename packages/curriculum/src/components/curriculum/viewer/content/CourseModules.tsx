import { ResponseCurriculumModuleDto } from "@qlp/api-client";
import { useTranslation } from "react-i18next";
import { cn } from "@qlp/ui";
import { moduleItemId, moduleOutline, sortByOrder } from "../utils";
import { CourseOutlineRow } from "./CourseOutlineRow";

interface CourseModulesProps {
  className?: string;
  title: string;
  modules: ResponseCurriculumModuleDto[];
  onSelectItem: (itemId: string, lessonId?: string) => void;
}

export const CourseModules = ({
  className,
  title,
  modules,
  onSelectItem,
}: CourseModulesProps) => {
  const { t: tCommon } = useTranslation("curriculum-common");
  const ordered = sortByOrder(modules);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {tCommon("viewer.selectModule")}
        </p>
      </div>
      {ordered.length === 0 ? (
        <p className="text-sm text-muted-foreground">{tCommon("viewer.noModules")}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {ordered.map((module, index) => {
            const outline = moduleOutline(module);
            const lessonCount = outline.filter(
              (entry) => entry.kind === "lesson",
            ).length;
            const examCount = outline.filter(
              (entry) => entry.kind === "exam",
            ).length;
            const meta =
              outline.length === 0
                ? tCommon("viewer.emptyModule")
                : [
                    lessonCount
                      ? tCommon("viewer.lessons", { count: lessonCount })
                      : null,
                    examCount ? tCommon("viewer.exams", { count: examCount }) : null,
                  ]
                    .filter(Boolean)
                    .join(" • ");
            return (
              <li key={module.id}>
                <CourseOutlineRow
                  title={module.title}
                  meta={meta}
                  index={index + 1}
                  onClick={() => onSelectItem(moduleItemId(module.id))}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
