import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ArrowLeft, Eye, History } from "lucide-react";
import { Spinner } from "@qlp/components";
import { Button, Card, CardHeader, CardTitle } from "@qlp/ui";
import type {
  CurriculumResource,
  ResponseCurriculumTreeDto,
  ServerErrorResponse,
} from "@qlp/api-client";
import { ConfirmDialog } from "./ConfirmDialog";
import { CurriculumOutline } from "./CurriculumOutline";
import {
  CurriculumDetailsForm,
  ExamForm,
  LessonForm,
  MaterialForm,
  ModuleForm,
} from "./forms/EntityForms";
import { StatusBadge, VersionBadge } from "./StatusBadge";
import { VersionHistory } from "./VersionHistory";
import type { Selection } from "./types";
import { useCurriculumChrome } from "./useCurriculumChrome";
import { errorMessage } from "./utils";

interface CurriculumEditorProps {
  api: CurriculumResource;
  basePath: string;
  curriculumId: string;
}

export function CurriculumEditor({
  api,
  basePath,
  curriculumId,
}: CurriculumEditorProps) {
  const { t } = useTranslation("curriculum");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selection, setSelection] = useState<Selection>({ kind: "curriculum" });
  const [historyOpen, setHistoryOpen] = useState(false);

  const treeQuery = useQuery({
    queryKey: ["curriculum", "tree", curriculumId],
    queryFn: () => api.findTree(curriculumId),
  });

  useCurriculumChrome(
    treeQuery.data?.title || t("editor.title"),
    t("editor.subtitle"),
    [
      { title: t("title"), href: basePath },
      { title: treeQuery.data?.title || t("editor.title") },
    ],
    true,
  );

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["curriculum"] });
  const tree = treeQuery.data;

  if (treeQuery.isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (!tree) {
    return <p className="text-sm text-muted-foreground">{t("loadError")}</p>;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate(basePath)}>
            <ArrowLeft className="size-4" />
            {t("back")}
          </Button>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">{tree.title}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={tree.status} />
              <VersionBadge version={tree.version} isLatest={tree.isLatest} />
              <span className="text-xs text-muted-foreground">{tree.slug}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setHistoryOpen(true)}>
            <History className="size-4" />
            {t("history")}
          </Button>
          <Button variant="outline" onClick={() => navigate(`${basePath}/${curriculumId}`)}>
            <Eye className="size-4" />
            {t("view")}
          </Button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[20rem_minmax(0,1fr)]">
        <CurriculumOutline
          tree={tree}
          selection={selection}
          api={api}
          onSelect={setSelection}
          onChanged={invalidate}
        />
        <EditorPanel
          key={`${selection.kind}-${"id" in selection ? selection.id : "root"}`}
          tree={tree}
          selection={selection}
          api={api}
          onChanged={invalidate}
          onDeleted={(next) => setSelection(next)}
        />
      </div>

      <VersionHistory
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        queryKey={["curriculum", "versions", curriculumId]}
        load={() => api.findVersions(curriculumId)}
        onSelect={(item) => {
          setHistoryOpen(false);
          navigate(`${basePath}/${curriculumId}?version=${item.version}`);
        }}
      />
    </div>
  );
}

function EditorPanel({
  tree,
  selection,
  api,
  onChanged,
  onDeleted,
}: {
  tree: ResponseCurriculumTreeDto;
  selection: Selection;
  api: CurriculumResource;
  onChanged: () => Promise<unknown>;
  onDeleted: (selection: Selection) => void;
}) {
  const { t } = useTranslation("curriculum");
  const selected = useMemo(() => findSelection(tree, selection), [tree, selection]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const saveCurriculum = useMutation({
    mutationFn: (values: { title: string; slug: string; description: string; status: string }) =>
      api.update(tree.id, values),
    onSuccess: async (item) => {
      toast.success(t("updated", { version: item.version }));
      await onChanged();
    },
    onError: (error: ServerErrorResponse) => toast.error(errorMessage(error, t("saveError"))),
  });

  const saveModule = useMutation({
    mutationFn: (values: { title: string; description: string; sortOrder?: number }) =>
      api.updateModule(selected.module!.id, values),
    onSuccess: async (item) => {
      toast.success(t("updated", { version: item.version }));
      await onChanged();
    },
    onError: (error: ServerErrorResponse) => toast.error(errorMessage(error, t("saveError"))),
  });

  const saveLesson = useMutation({
    mutationFn: (values: { title: string; description: string; sortOrder?: number }) =>
      api.updateLesson(selected.lesson!.id, values),
    onSuccess: async (item) => {
      toast.success(t("updated", { version: item.version }));
      await onChanged();
    },
    onError: (error: ServerErrorResponse) => toast.error(errorMessage(error, t("saveError"))),
  });

  const saveMaterial = useMutation({
    mutationFn: (values: {
      title: string;
      description: string;
      type: string;
      content: string;
      sortOrder?: number;
    }) => api.updateMaterial(selected.material!.id, values),
    onSuccess: async (item) => {
      toast.success(t("updated", { version: item.version }));
      await onChanged();
    },
    onError: (error: ServerErrorResponse) => toast.error(errorMessage(error, t("saveError"))),
  });

  const saveExam = useMutation({
    mutationFn: (values: Parameters<typeof api.updateExam>[1]) =>
      api.updateExam(selected.exam!.id, values),
    onSuccess: async (item) => {
      toast.success(t("updated", { version: item.version }));
      await onChanged();
    },
    onError: (error: ServerErrorResponse) => toast.error(errorMessage(error, t("saveError"))),
  });

  const addLesson = useMutation({
    mutationFn: () => api.createLesson(selected.module!.id, { title: t("editor.newLesson") }),
    onSuccess: onChanged,
  });
  const addExam = useMutation({
    mutationFn: () => api.createExam(selected.module!.id, { title: t("editor.newExam") }),
    onSuccess: onChanged,
  });
  const addMaterial = useMutation({
    mutationFn: () =>
      api.createMaterial(selected.lesson!.id, { title: t("editor.newMaterial"), type: "text" }),
    onSuccess: onChanged,
  });

  const remove = useMutation({
    mutationFn: async () => {
      if (selection.kind === "module") return api.removeModule(selection.id);
      if (selection.kind === "lesson") return api.removeLesson(selection.id);
      if (selection.kind === "material") return api.removeMaterial(selection.id);
      if (selection.kind === "exam") return api.removeExam(selection.id);
      return null;
    },
    onSuccess: async () => {
      toast.success(t("deleted"));
      setConfirmDelete(false);
      await onChanged();
      if (selection.kind === "module") onDeleted({ kind: "curriculum" });
      if (selection.kind === "lesson" && selected.module) {
        onDeleted({ kind: "module", id: selected.module.id });
      }
      if (selection.kind === "material" && selected.lesson) {
        onDeleted({ kind: "lesson", id: selected.lesson.id });
      }
      if (selection.kind === "exam" && selected.module) {
        onDeleted({ kind: "module", id: selected.module.id });
      }
    },
    onError: (error: ServerErrorResponse) => toast.error(errorMessage(error, t("deleteError"))),
  });

  const pending =
    saveCurriculum.isPending ||
    saveModule.isPending ||
    saveLesson.isPending ||
    saveMaterial.isPending ||
    saveExam.isPending;

  let form = (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("editor.selectHint")}</CardTitle>
      </CardHeader>
    </Card>
  );

  if (selection.kind === "curriculum") {
    form = (
      <CurriculumDetailsForm
        tree={tree}
        pending={pending}
        onSave={(values) => saveCurriculum.mutate(values)}
      />
    );
  } else if (selection.kind === "module" && selected.module) {
    form = (
      <ModuleForm
        module={selected.module}
        pending={pending}
        onSave={(values) => saveModule.mutate(values)}
        onDelete={() => setConfirmDelete(true)}
        onAddLesson={() => addLesson.mutate()}
        onAddExam={() => addExam.mutate()}
      />
    );
  } else if (selection.kind === "lesson" && selected.lesson) {
    form = (
      <LessonForm
        lesson={selected.lesson}
        pending={pending}
        onSave={(values) => saveLesson.mutate(values)}
        onDelete={() => setConfirmDelete(true)}
        onAddMaterial={() => addMaterial.mutate()}
      />
    );
  } else if (selection.kind === "material" && selected.material) {
    form = (
      <MaterialForm
        material={selected.material}
        pending={pending}
        onSave={(values) => saveMaterial.mutate(values)}
        onDelete={() => setConfirmDelete(true)}
      />
    );
  } else if (selection.kind === "exam" && selected.exam) {
    form = (
      <ExamForm
        exam={selected.exam}
        pending={pending}
        onSave={(values) => saveExam.mutate(values)}
        onDelete={() => setConfirmDelete(true)}
      />
    );
  }

  return (
    <>
      {form}
      <ConfirmDialog
        open={confirmDelete}
        title={t("confirmDeleteTitle")}
        description={t("confirmDelete")}
        pending={remove.isPending}
        onOpenChange={setConfirmDelete}
        onConfirm={() => remove.mutate()}
      />
    </>
  );
}

function findSelection(tree: ResponseCurriculumTreeDto, selection: Selection) {
  if (selection.kind === "curriculum") return {};
  for (const module of tree.modules) {
    if (selection.kind === "module" && module.id === selection.id) return { module };
    for (const lesson of module.lessons ?? []) {
      if (selection.kind === "lesson" && lesson.id === selection.id) return { module, lesson };
      for (const material of lesson.materials ?? []) {
        if (selection.kind === "material" && material.id === selection.id) {
          return { module, lesson, material };
        }
      }
    }
    for (const exam of module.exams ?? []) {
      if (selection.kind === "exam" && exam.id === selection.id) return { module, exam };
    }
  }
  return {};
}
