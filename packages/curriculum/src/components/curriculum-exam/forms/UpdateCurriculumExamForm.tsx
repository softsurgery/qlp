import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Save, Repeat2, Eye } from "lucide-react";
import { FormBuilder } from "@qlp/form-builder";
import { useApp, useBreadcrumb, useUI } from "@qlp/contexts";
import { Label, Separator } from "@qlp/ui";
import { ActionGrid, Spinner } from "@qlp/components";
import {
  useCurriculum,
  useCurriculumModules,
  useCurriculumExam,
  useCurriculumExamWorkflow,
} from "../../../hooks";
import {
  type UpdateCurriculumExamDto,
  type ServerErrorResponse,
} from "@qlp/api-client";
import { useCurriculumExamStore } from "../../../hooks/stores/useCurriculumExamStore";
import { useUpdateCurriculumExamFormStructure } from "./useUpdateCurriculumExamFormStructure";
import { CurriculumExamQuestionEditor } from "../../curriculum-exam-question/CurriculumExamQuestionEditor";
import { errorMessage } from "../../../utils";
import { CurriculumFormLayout } from "../../CurriculumFormLayout";
import { CurriculumMetaHeader } from "../../curriculum/CurriculumMetaHeader";
import { useCurriculumPreviewDialog } from "../../curriculum/modals/useCurriculumPreviewDialog";
import { useNavigate } from "react-router-dom";

export interface UpdateCurriculumExamFormProps {
  className?: string;
  curriculumId: string;
  moduleId: string;
  examId: string;
  onSuccess?: () => void;
}

export function UpdateCurriculumExamForm({
  className,
  curriculumId,
  moduleId,
  examId,
  onSuccess,
}: UpdateCurriculumExamFormProps) {
  const { t: tGlobal } = useTranslation("global");
  const { t: tCommon } = useTranslation("curriculum-common");
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin"
      ? baseApi.adminCurriculumExams
      : baseApi.curriculumExams;
  const queryClient = useQueryClient();

  const { curriculum } = useCurriculum({ id: curriculumId });
  const { modules } = useCurriculumModules({ id: curriculumId });
  const { exam, isExamPending } = useCurriculumExam({
    moduleId,
    examId,
    join: "createdBy",
  });
  const { workflow: workflowData, isWorkflowPending: isWorkflowLoading } =
    useCurriculumExamWorkflow({ examId });
  const curriculumExamStore = useCurriculumExamStore();
  const resetStore = useCurriculumExamStore((state) => state.reset);
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setEnableMainOverflow, clearEnableMainOverflow } = useUI();
  const navigate = useNavigate();

  const { previewDialog, openPreviewDialog } = useCurriculumPreviewDialog({
    curriculumId,
    previewItem: `exam:${examId}`,
    previewUrl: `/curriculum/${curriculumId}?item=exam:${examId}`,
  });

  const isLoading = isExamPending || isWorkflowLoading;
  const module = modules.find((item) => item.id === moduleId);

  React.useEffect(() => {
    if (exam) {
      curriculumExamStore.set("updateDto", {
        title: exam.title,
        description: exam.description,
        durationMinutes: exam.durationMinutes,
        passingScore: exam.passingScore,
        questions: exam.questions || [],
      });
    }
  }, [exam]);

  React.useEffect(() => {
    if (setRoutes && exam && module && curriculum) {
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
        { title: exam.title },
      ]);
    }
    if (setEnableMainOverflow) setEnableMainOverflow(true);
  }, [
    curriculum,
    curriculumId,
    exam,
    module,
    setEnableMainOverflow,
    setRoutes,
    tCommon,
    tGlobal,
  ]);

  React.useEffect(() => {
    return () => {
      if (clearRoutes) clearRoutes();
      if (clearEnableMainOverflow) clearEnableMainOverflow();
      resetStore();
    };
  }, [clearEnableMainOverflow, clearRoutes, resetStore]);

  const { updateCurriculumExamFormStructure } =
    useUpdateCurriculumExamFormStructure({
      curriculumExamStore,
    });

  const { mutate: updateMutation, isPending } = useMutation({
    mutationFn: (dto: UpdateCurriculumExamDto) => {
      if (!exam) throw new Error("Exam not found");
      return api.update(exam.id, dto);
    },
    onSuccess: () => {
      toast.success(tGlobal("commands.saved"));
      void queryClient.invalidateQueries({
        queryKey: ["curriculum-exams", moduleId],
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(errorMessage(error, tCommon("errors.saveFailed")));
    },
  });

  const { mutate: executeWorkflow, isPending: isWorkflowPending } = useMutation(
    {
      mutationFn: (event: string) =>
        api.workflow.executeWorkflow(examId, { event }),
      onSuccess: () => {
        toast.success(tGlobal("commands.saved"));
        void queryClient.invalidateQueries({
          queryKey: ["curriculum", "exams", examId, "workflow"],
        });
        void queryClient.invalidateQueries({
          queryKey: ["curriculum-exams", moduleId],
        });
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(errorMessage(error, tCommon("errors.saveFailed")));
      },
    },
  );

  const handleSubmit = React.useCallback(() => {
    if (!curriculumExamStore.updateDto.title?.trim()) {
      curriculumExamStore.set("updateDtoErrors", {
        title: [tCommon("errors.titleRequired")],
      });
      return;
    }
    curriculumExamStore.set("updateDtoErrors", {});
    updateMutation(curriculumExamStore.updateDto);
  }, [updateMutation, curriculumExamStore, tCommon, tGlobal]);

  const mainContent = (
    <div className="flex flex-col gap-8">
      <FormBuilder structure={updateCurriculumExamFormStructure} />
      <Separator />
      <CurriculumExamQuestionEditor
        questions={curriculumExamStore.updateDto.questions || []}
        onChange={(questions) =>
          curriculumExamStore.setNested("updateDto.questions", questions)
        }
        disabled={!!(isPending || (workflowData && !workflowData.isUpdatable))}
      />
    </div>
  );

  const sidebarContent = (
    <>
      {exam && (
        <CurriculumMetaHeader
          curriculum={{
            ...exam,
            status: exam.status || workflowData?.status,
            owner: undefined,
            createdAt: appType !== "admin" ? undefined : exam.createdAt,
            createdBy: exam.createdBy,
          }}
          extraRows={[
            {
              label: tGlobal("versions"),
              value: (
                <span
                  className="cursor-pointer text-primary hover:underline font-semibold"
                  onClick={() =>
                    navigate(
                      `/curriculum/${curriculumId}/modules/${moduleId}/exams/${examId}/versions`,
                    )
                  }
                >
                  {exam?.version != null ? exam?.version : "-"}
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
              onClick: () => {
                if (exam) {
                  curriculumExamStore.set("updateDto", {
                    title: exam.title,
                    description: exam.description,
                    durationMinutes: exam.durationMinutes,
                    passingScore: exam.passingScore,
                    questions: exam.questions || [],
                  });
                }
              },
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

  if (!exam) {
    return <div className="p-4 text-destructive">Exam not found</div>;
  }

  return (
    <CurriculumFormLayout
      className={className}
      main={mainContent}
      sidebar={sidebarContent}
    />
  );
}
