import {
  Check,
  ClipboardList,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  CurriculumStatus,
  type ResponseCurriculumModuleDto,
} from "@qlp/api-client";
import { HtmlContent } from "@qlp/components";
import { cn } from "@qlp/ui";
import {
  moduleItemId,
  moduleOutline,
  outlineItemId,
  sortByOrder,
} from "./utils";

interface CourseNavProps {
  title: string;
  description?: string;
  modules: ResponseCurriculumModuleDto[];
  selectedItemId?: string;
  openAccordionId?: string;
  onSelectItem: (itemId: string, parentLessonId?: string, closeNav?: boolean) => void;
}

export function CourseNav({
  title,
  description,
  modules,
  selectedItemId,
  openAccordionId,
  onSelectItem,
}: CourseNavProps) {
  const { t } = useTranslation("curriculum");
  const ordered = sortByOrder(modules);

  return (
    <div className="flex h-full min-h-0 flex-col">
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
}

function ModuleTree({
  module,
  index,
  selectedItemId,
  openAccordionId,
  onSelectItem,
}: {
  module: ResponseCurriculumModuleDto;
  index: number;
  selectedItemId?: string;
  openAccordionId?: string;
  onSelectItem: (itemId: string, parentLessonId?: string, closeNav?: boolean) => void;
}) {
  const { t } = useTranslation("curriculum");
  const outline = moduleOutline(module);
  const moduleSelected = selectedItemId === moduleItemId(module.id);
  const selectedInModule =
    moduleSelected ||
    outline.some((entry) => {
      const itemId = outlineItemId(entry);
      if (itemId === selectedItemId || itemId === openAccordionId) return true;
      return (
        entry.kind === "lesson" && openAccordionId === `lesson:${entry.lesson.id}`
      );
    });
  const published =
    module.status === CurriculumStatus.Published ||
    module.status === "published";

  return (
    <div className="rounded-md">
      <button
        type="button"
        onClick={() => onSelectItem(moduleItemId(module.id))}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-2 text-start text-sm font-semibold hover:bg-muted/70",
          moduleSelected && "bg-primary/10",
        )}
      >
        <span
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold",
            published
              ? "border-primary bg-primary text-primary-foreground"
              : selectedInModule
                ? "border-primary text-primary"
                : "border-muted-foreground/40 text-muted-foreground",
          )}
          aria-hidden
        >
          {published ? <Check className="size-3" /> : index + 1}
        </span>
        <span className="min-w-0 flex-1 truncate">{module.title}</span>
      </button>
      {outline.length === 0 ? (
        <p className="py-2 ps-9 text-xs text-muted-foreground">
          {t("viewer.emptyModule")}
        </p>
      ) : (
        <ul className="ms-3 flex flex-col border-s border-border/70">
          {outline.map((entry) => {
            const itemId = outlineItemId(entry);
            if (entry.kind === "lesson") {
              const selected =
                selectedItemId === itemId ||
                (openAccordionId === itemId &&
                  selectedItemId?.startsWith("material:"));
              return (
                <li key={itemId}>
                  <button
                    type="button"
                    onClick={() => onSelectItem(itemId)}
                    className={cn(
                      "flex w-full items-center rounded-md px-3 py-2 text-start text-sm hover:bg-muted/70",
                      selected && "bg-primary/10 font-medium",
                    )}
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {entry.lesson.title}
                    </span>
                  </button>
                </li>
              );
            }
            return (
              <li key={itemId}>
                <button
                  type="button"
                  onClick={() => onSelectItem(itemId)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-start text-sm hover:bg-muted/70",
                    selectedItemId === itemId && "bg-primary/10 font-medium",
                  )}
                >
                  <ClipboardList className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate">
                    {entry.exam.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
