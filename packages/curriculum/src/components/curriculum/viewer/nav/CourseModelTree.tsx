import React from "react";
import { useTranslation } from "react-i18next";
import { CurriculumStatus, ResponseCurriculumModuleDto } from "@qlp/api-client";
import { Check, ChevronDown, ClipboardList } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  cn,
} from "@qlp/ui";
import { moduleItemId, moduleOutline, outlineItemId } from "../utils";

interface ModuleTreeProps {
  className?: string;
  module: ResponseCurriculumModuleDto;
  index: number;
  selectedItemId?: string;
  openAccordionId?: string;
  onSelectItem: (
    itemId: string,
    parentLessonId?: string,
    closeNav?: boolean,
  ) => void;
}

export const ModuleTree = ({
  className,
  module,
  index,
  selectedItemId,
  openAccordionId,
  onSelectItem,
}: ModuleTreeProps) => {
  const { t } = useTranslation("curriculum");
  const outline = moduleOutline(module);
  const moduleSelected = selectedItemId === moduleItemId(module.id);
  const selectedInModule =
    moduleSelected ||
    outline.some((entry) => {
      const itemId = outlineItemId(entry);
      if (itemId === selectedItemId || itemId === openAccordionId) return true;
      return (
        entry.kind === "lesson" &&
        openAccordionId === `lesson:${entry.lesson.id}`
      );
    });
  const published =
    module.status === CurriculumStatus.Published ||
    module.status === "published";
  const [open, setOpen] = React.useState(selectedInModule);

  React.useEffect(() => {
    if (selectedInModule) setOpen(true);
  }, [selectedInModule]);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className={cn("group/collapsible rounded-md", className)}
    >
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => {
            onSelectItem(moduleItemId(module.id));
            setOpen(true);
          }}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-2 text-start text-sm font-semibold hover:bg-muted/70",
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
        <CollapsibleTrigger asChild>
          <button
            type="button"
            aria-label={
              open ? t("viewer.collapseModule") : t("viewer.expandModule")
            }
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground",
              "hover:bg-muted/70 hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <ChevronDown
              aria-hidden
              className="size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180"
            />
          </button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
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
      </CollapsibleContent>
    </Collapsible>
  );
};
