import { useTranslation } from "react-i18next";
import { type ResponseCurriculumModuleDto } from "@qlp/api-client";
import { HtmlContent } from "@qlp/components";
import { cn } from "@qlp/ui";
import { sortByOrder } from "../utils";
import { ModuleTree } from "./CourseModelTree";

interface CourseNavProps {
  className?: string;
  title: string;
  description?: string;
  modules: ResponseCurriculumModuleDto[];
  selectedItemId?: string;
  openAccordionId?: string;
  onSelectItem: (
    itemId: string,
    parentLessonId?: string,
    closeNav?: boolean,
  ) => void;
}

export const CourseNav = ({
  className,
  title,
  description,
  modules,
  selectedItemId,
  openAccordionId,
  onSelectItem,
}: CourseNavProps) => {
  const { t } = useTranslation("curriculum");
  const ordered = sortByOrder(modules);

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <div className="border-b px-4 py-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("viewer.title")}
        </p>
        <h2 className="mt-1 text-lg font-semibold leading-snug">{title}</h2>
        <HtmlContent html={description} className="mt-2 line-clamp-3 text-xs" />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("viewer.courseMaterial")}
        </p>
        {ordered.length === 0 ? (
          <p className="px-2 py-3 text-sm text-muted-foreground">
            {t("viewer.noModules")}
          </p>
        ) : (
          <nav
            className="flex flex-col gap-1"
            aria-label={t("viewer.courseMaterial")}
          >
            {ordered.map((module, index) => (
              <ModuleTree
                key={module.id}
                module={module}
                index={index}
                selectedItemId={selectedItemId}
                openAccordionId={openAccordionId}
                onSelectItem={onSelectItem}
              />
            ))}
          </nav>
        )}
      </div>
    </div>
  );
};
