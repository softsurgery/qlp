import { useTranslation } from "react-i18next";
import {
  BookOpen,
  ClipboardList,
  FileText,
  Plus,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  cn,
} from "@qlp/ui";
import type { CurriculumResource, ResponseCurriculumTreeDto } from "@qlp/api-client";
import { useMutation } from "@tanstack/react-query";
import type { ReactNode } from "react";
import type { Selection } from "./types";

interface CurriculumOutlineProps {
  tree: ResponseCurriculumTreeDto;
  selection: Selection;
  api: CurriculumResource;
  onSelect: (selection: Selection) => void;
  onChanged: () => Promise<unknown>;
}

export function CurriculumOutline({
  tree,
  selection,
  api,
  onSelect,
  onChanged,
}: CurriculumOutlineProps) {
  const { t } = useTranslation("curriculum");

  const addModule = useMutation({
    mutationFn: () => api.createModule(tree.id, { title: t("editor.newModule") }),
    onSuccess: async (module) => {
      await onChanged();
      onSelect({ kind: "module", id: module.id });
    },
  });

  const addLesson = useMutation({
    mutationFn: (moduleId: string) =>
      api.createLesson(moduleId, { title: t("editor.newLesson") }),
    onSuccess: async (lesson) => {
      await onChanged();
      onSelect({ kind: "lesson", id: lesson.id });
    },
  });

  const addExam = useMutation({
    mutationFn: (moduleId: string) =>
      api.createExam(moduleId, { title: t("editor.newExam") }),
    onSuccess: async (exam) => {
      await onChanged();
      onSelect({ kind: "exam", id: exam.id });
    },
  });

  const addMaterial = useMutation({
    mutationFn: (lessonId: string) =>
      api.createMaterial(lessonId, { title: t("editor.newMaterial"), type: "text" }),
    onSuccess: async (material) => {
      await onChanged();
      onSelect({ kind: "material", id: material.id });
    },
  });

  return (
    <Card className="flex min-h-0 flex-col overflow-hidden">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-sm">{t("editor.outline")}</CardTitle>
          <p className="text-xs text-muted-foreground">
            {t("viewer.modules", { count: tree.modules.length })}
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => addModule.mutate()}>
          <Plus className="size-4" />
          {t("editor.addModule")}
        </Button>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-auto">
        <button
          type="button"
          className={itemClass(selection.kind === "curriculum")}
          onClick={() => onSelect({ kind: "curriculum" })}
        >
          {tree.title}
        </button>

        {tree.modules.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed p-4 text-center">
            <p className="text-sm font-medium">{t("editor.emptyOutline")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("editor.emptyOutlineHint")}</p>
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {tree.modules.map((module, moduleIndex) => (
              <Collapsible key={module.id} defaultOpen>
                <div className="rounded-lg border">
                  <div className="flex items-center gap-1 p-1">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon-sm" className="shrink-0">
                        <span className="text-[10px] text-muted-foreground">{moduleIndex + 1}</span>
                      </Button>
                    </CollapsibleTrigger>
                    <button
                      type="button"
                      className={itemClass(
                        selection.kind === "module" && selection.id === module.id,
                        "flex-1",
                      )}
                      onClick={() => onSelect({ kind: "module", id: module.id })}
                    >
                      {module.title}
                    </button>
                  </div>
                  <CollapsibleContent className="space-y-3 border-t px-2 py-2">
                    <Section
                      label={t("editor.lessons")}
                      onAdd={() => addLesson.mutate(module.id)}
                      addLabel={t("editor.addLesson")}
                    >
                      {(module.lessons ?? []).length === 0 && (
                        <p className="px-2 text-xs text-muted-foreground">{t("viewer.noLessons")}</p>
                      )}
                      {(module.lessons ?? []).map((lesson) => (
                        <div key={lesson.id} className="space-y-1">
                          <button
                            type="button"
                            className={itemClass(
                              selection.kind === "lesson" && selection.id === lesson.id,
                              "text-xs",
                            )}
                            onClick={() => onSelect({ kind: "lesson", id: lesson.id })}
                          >
                            <BookOpen className="size-3 shrink-0" />
                            <span className="truncate">{lesson.title}</span>
                          </button>
                          <div className="space-y-1 ps-4">
                            {(lesson.materials ?? []).map((material) => (
                              <button
                                key={material.id}
                                type="button"
                                className={itemClass(
                                  selection.kind === "material" && selection.id === material.id,
                                  "text-xs",
                                )}
                                onClick={() => onSelect({ kind: "material", id: material.id })}
                              >
                                <FileText className="size-3 shrink-0" />
                                <span className="truncate">{material.title}</span>
                              </button>
                            ))}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 w-full justify-start text-xs text-muted-foreground"
                              onClick={() => addMaterial.mutate(lesson.id)}
                            >
                              <Plus className="size-3" />
                              {t("editor.addMaterial")}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </Section>
                    <Section
                      label={t("editor.exams")}
                      onAdd={() => addExam.mutate(module.id)}
                      addLabel={t("editor.addExam")}
                    >
                      {(module.exams ?? []).length === 0 && (
                        <p className="px-2 text-xs text-muted-foreground">{t("viewer.noExams")}</p>
                      )}
                      {(module.exams ?? []).map((exam) => (
                        <button
                          key={exam.id}
                          type="button"
                          className={itemClass(
                            selection.kind === "exam" && selection.id === exam.id,
                            "text-xs",
                          )}
                          onClick={() => onSelect({ kind: "exam", id: exam.id })}
                        >
                          <ClipboardList className="size-3 shrink-0" />
                          <span className="truncate">{exam.title}</span>
                        </button>
                      ))}
                    </Section>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Section({
  label,
  addLabel,
  onAdd,
  children,
}: {
  label: string;
  addLabel: string;
  onAdd: () => void;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between px-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <Button type="button" variant="ghost" size="icon-sm" onClick={onAdd}>
          <Plus className="size-3" />
          <span className="sr-only">{addLabel}</span>
        </Button>
      </div>
      {children}
    </div>
  );
}

function itemClass(active: boolean, extra?: string) {
  return cn(
    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-start text-sm hover:bg-accent",
    active && "bg-accent font-medium",
    extra,
  );
}
