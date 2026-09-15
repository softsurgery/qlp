import { Check, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CurriculumStatus, type ResponseCurriculumModuleDto } from "@qlp/api-client";
import { HtmlContent } from "@qlp/components";
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  cn,
} from "@qlp/ui";
import { sortByOrder } from "./utils";

interface CourseNavProps {
  title: string;
  description?: string;
  modules: ResponseCurriculumModuleDto[];
  selectedModuleId?: string;
  onSelectModule: (moduleId: string) => void;
}

export function CourseNav({
  title,
  description,
  modules,
  selectedModuleId,
  onSelectModule,
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
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-semibold hover:bg-muted/70"
            >
              {t("viewer.courseMaterial")}
              <ChevronDown className="size-4 text-muted-foreground transition-transform [[data-state=open]_&]:rotate-180" />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {ordered.length === 0 ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">
                {t("viewer.noModules")}
              </p>
            ) : (
              <nav className="flex flex-col gap-0.5 pt-1" aria-label={t("viewer.courseMaterial")}>
                {ordered.map((module, index) => {
                  const selected = module.id === selectedModuleId;
                  const published =
                    module.status === CurriculumStatus.Published ||
                    module.status === "published";
                  return (
                    <Button
                      key={module.id}
                      type="button"
                      variant="ghost"
                      onClick={() => onSelectModule(module.id)}
                      className={cn(
                        "h-auto justify-start gap-3 rounded-md px-2 py-2 text-start font-normal",
                        selected && "bg-primary/10 hover:bg-primary/15",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold",
                          published
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : selected
                              ? "border-primary text-primary"
                              : "border-muted-foreground/40 text-muted-foreground",
                        )}
                        aria-hidden
                      >
                        {published ? <Check className="size-3" /> : index + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm">
                        {module.title}
                      </span>
                    </Button>
                  );
                })}
              </nav>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
