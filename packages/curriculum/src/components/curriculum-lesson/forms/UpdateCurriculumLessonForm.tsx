import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Save, Repeat2, Eye } from "lucide-react";
import { FormBuilder } from "@qlp/form-builder";
import { useApp, useBreadcrumb, useUI } from "@qlp/contexts";
import { Button, Label, Separator } from "@qlp/ui";
import { ActionGrid, Spinner } from "@qlp/components";
import {
  useCurriculum,
  useCurriculumModules,
  useCurriculumLesson,
  useCurriculumLessonWorkflow,
} from "../../../hooks";
import {
  type UpdateCurriculumLessonDto,
  type ServerErrorResponse,
} from "@qlp/api-client";
import { useCurriculumLessonStore } from "../../../hooks/stores/useCurriculumLessonStore";
import { useUpdateCurriculumLessonFormStructure } from "./useUpdateCurriculumLessonFormStructure";
import { errorMessage } from "../../../utils";
import { CurriculumFormLayout } from "../../CurriculumFormLayout";
import { CurriculumMetaHeader } from "../../curriculum/CurriculumMetaHeader";
import { CurriculumLessonMaterials } from "../../curriculum-material/CurriculumLessonMaterials";
import { useCurriculumPreviewDialog } from "../../curriculum/modals/useCurriculumPreviewDialog";
import { useNavigate } from "react-router-dom";

export interface UpdateCurriculumLessonFormProps {
  className?: string;
  curriculumId: string;
  moduleId: string;
  lessonId: string;
  onSuccess?: () => void;
}

export function UpdateCurriculumLessonForm({
  className,
  curriculumId,
  moduleId,
  lessonId,
  onSuccess,
}: UpdateCurriculumLessonFormProps) {
  const { t: tGlobal } = useTranslation("global");
    const { t: tCommon } = useTranslation("curriculum-common");
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin"
      ? baseApi.adminCurriculumLessons
      : baseApi.curriculumLessons;
  const queryClient = useQueryClient();

  const { curriculum } = useCurriculum({ id: curriculumId });
  const { modules } = useCurriculumModules({ id: curriculumId });
  const { lesson, isLessonPending } = useCurriculumLesson({
    moduleId,
    lessonId,
    join: "createdBy",
  });
  const { workflow: workflowData, isWorkflowPending: isWorkflowLoading } =
    useCurriculumLessonWorkflow({ lessonId });
  const curriculumLessonStore = useCurriculumLessonStore();
  const resetStore = useCurriculumLessonStore((state) => state.reset);
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setEnableMainOverflow, clearEnableMainOverflow } = useUI();
  const navigate = useNavigate();

  const { previewDialog, openPreviewDialog } = useCurriculumPreviewDialog({
    curriculumId,
    previewItem: `lesson:${lessonId}`,
    previewUrl: `/curriculum/${curriculumId}?item=lesson:${lessonId}`,
  });

  const isLoading = isLessonPending || isWorkflowLoading;

  const module = modules.find((item) => item.id === moduleId);

  React.useEffect(() => {
    if (lesson) {
      curriculumLessonStore.set("updateDto", {
        title: lesson.title,
        description: lesson.description,
      });
    }
  }, [lesson]);

  React.useEffect(() => {
    if (setRoutes && lesson && module && curriculum) {
      setRoutes([
        { title: tCommon("title"), href: "/curriculum" },
        {
          title: curriculum.title,
          href: `/curriculum/${curriculumId}/edit`,
        },
        {
          title: module.title,
          href: `/curriculum/${curriculumId}/modules/${moduleId}/edit`,
        },
        { title: lesson.title },
      ]);
    }
    if (setEnableMainOverflow) setEnableMainOverflow(true);
  }, [
    curriculum,
    curriculumId,
    lesson,
    module,
    moduleId,
    setEnableMainOverflow,
    setRoutes,
          tCommon,
          tGlobal
    ]);

  React.useEffect(() => {
    return () => {
      if (clearRoutes) clearRoutes();
      if (clearEnableMainOverflow) clearEnableMainOverflow();
      resetStore();
    };
  }, [clearEnableMainOverflow, clearRoutes, resetStore]);

  const { updateCurriculumLessonFormStructure } =
    useUpdateCurriculumLessonFormStructure({
      curriculumLessonStore,
    });

  const { mutate: updateMutation, isPending } = useMutation({
    mutationFn: (dto: UpdateCurriculumLessonDto) => {
      if (!lesson) throw new Error("Lesson not found");
      return api.update(lesson.id, dto);
    },
    onSuccess: () => {
      toast.success(tGlobal("commands.saved"));
      void queryClient.invalidateQueries({
        queryKey: ["curriculum-lessons", moduleId],
      });
      resetStore();
      if (onSuccess) onSuccess();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(errorMessage(error, tCommon("errors.saveFailed")));
    },
  });

  const { mutate: executeWorkflow, isPending: isWorkflowPending } = useMutation(
    {
      mutationFn: (event: string) =>
        api.workflow.executeWorkflow(lessonId, { event }),
      onSuccess: () => {
        toast.success(tGlobal("commands.saved"));
        void queryClient.invalidateQueries({
          queryKey: ["curriculum", "lessons", lessonId, "workflow"],
        });
        void queryClient.invalidateQueries({
          queryKey: ["curriculum-lessons", moduleId],
        });
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(errorMessage(error, tCommon("errors.saveFailed")));
      },
    },
  );

  const handleSubmit = React.useCallback(() => {
    if (!curriculumLessonStore.updateDto.title?.trim()) {
      curriculumLessonStore.set("updateDtoErrors", {
        title: [tCommon("errors.titleRequired")],
      });
      return;
    }
    curriculumLessonStore.set("updateDtoErrors", {});
    updateMutation(curriculumLessonStore.updateDto);
  }, [updateMutation, curriculumLessonStore, tCommon, tGlobal]);

  const mainContent = (
    <div className="flex flex-col gap-8">
      <FormBuilder structure={updateCurriculumLessonFormStructure} />
      <Separator />
      <CurriculumLessonMaterials
        lessonId={lessonId}
        moduleId={moduleId}
        disabled={!!(workflowData && !workflowData.isUpdatable)}
      />
    </div>
  );

  const sidebarContent = (
    <>
      {lesson && (
        <CurriculumMetaHeader
          curriculum={{
            ...lesson,
            status: lesson.status || workflowData?.status,
            owner: undefined,
            createdAt: appType !== "admin" ? undefined : lesson.createdAt,
            createdBy: lesson.createdBy,
          }}
          extraRows={[
            {
              label: tGlobal("versions"),
              value: (
                <span
                  className="cursor-pointer text-primary hover:underline font-semibold"
                  onClick={() =>
                    navigate(
                      `/curriculum/${curriculumId}/modules/${moduleId}/lessons/${lessonId}/versions`,
                    )
                  }
                >
                  {lesson?.version != null ? lesson?.version : "-"}
                </span>
              ),
            },
          ]}
          uploadApi={baseApi.upload}
        />
      )}

      <div className="flex flex-col gap-2 w-full">
        <Label className="text-xs font-bold text-muted-foreground">
          {tGlobal("commands.actions")}
        </Label>
        <ActionGrid
          actions={[
            {
              label: tGlobal("commands.preview") as string,
              icon: <Eye />,
              onClick: openPreviewDialog,
            },
            {
              label: tGlobal("commands.save") as string,
              icon: isPending ? <Spinner size="small" /> : <Save />,
              onClick: handleSubmit,
              disabled: !!(
                isPending ||
                isLoading ||
                (workflowData && !workflowData.isUpdatable)
              ),
            },
            ...(workflowData?.nextSteps?.map((step) => ({
              label: step.label,
              icon: isWorkflowPending ? <Spinner size="small" /> : undefined,
              onClick: () => executeWorkflow(step.label),
              disabled: isPending || isWorkflowPending,
            })) || []),
            {
              label: tGlobal("commands.reset") as string,
              icon: <Repeat2 />,
              onClick: resetStore,
              disabled: isPending,
            },
          ]}
        />
      </div>

      {previewDialog}
    </>
  );

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Spinner size="medium" />
      </div>
    );
  }

  if (!lesson) {
    return <div className="p-4 text-destructive">Lesson not found</div>;
  }

  return (
    <CurriculumFormLayout
      className={className}
      main={mainContent}
      sidebar={sidebarContent}
    />
  );
}
