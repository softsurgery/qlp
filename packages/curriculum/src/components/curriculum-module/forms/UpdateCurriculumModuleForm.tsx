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
  useCurriculumModuleWorkflow,
} from "../../../hooks";
import {
  type UpdateCurriculumModuleDto,
  type ServerErrorResponse,
} from "@qlp/api-client";
import { useCurriculumModuleStore } from "../../../hooks/stores/useCurriculumModuleStore";
import { useUpdateCurriculumModuleFormStructure } from "./useUpdateCurriculumModuleFormStructure";
import { errorMessage } from "../../../utils";
import { CurriculumFormLayout } from "../../CurriculumFormLayout";
import { CurriculumMetaHeader } from "../../curriculum/CurriculumMetaHeader";
import { CurriculumLessons } from "../../curriculum-lesson/CurriculumLessons";
import { CurriculumExams } from "../../curriculum-exam/CurriculumExams";
import { useCurriculumPreviewDialog } from "../../curriculum/modals/useCurriculumPreviewDialog";
import { useNavigate } from "react-router-dom";

export interface UpdateCurriculumModuleFormProps {
  className?: string;
  curriculumId: string;
  moduleId: string;
  onSuccess?: () => void;
}

export function UpdateCurriculumModuleForm({
  className,
  curriculumId,
  moduleId,
  onSuccess,
}: UpdateCurriculumModuleFormProps) {
  const { t: tGlobal } = useTranslation("global");
  const { t: tCommon } = useTranslation("curriculum-common");
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin"
      ? baseApi.adminCurriculumModules
      : baseApi.curriculumModules;
  const queryClient = useQueryClient();

  const { curriculum } = useCurriculum({ id: curriculumId });
  const { modules, isModulesPending } = useCurriculumModules({
    id: curriculumId,
    join: "owner,createdBy",
  });
  const { workflow: workflowData, isWorkflowPending: isWorkflowLoading } =
    useCurriculumModuleWorkflow({ moduleId });
  const curriculumModuleStore = useCurriculumModuleStore();
  const resetStore = useCurriculumModuleStore((state) => state.reset);
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setEnableMainOverflow, clearEnableMainOverflow } = useUI();
  const navigate = useNavigate();

  const { previewDialog, openPreviewDialog } = useCurriculumPreviewDialog({
    curriculumId,
    previewItem: `module:${moduleId}`,
    previewUrl: `/curriculum/${curriculumId}?item=module:${moduleId}`,
  });

  const isLoading = isModulesPending || isWorkflowLoading;

  const module = modules.find((m) => m.id === moduleId);

  React.useEffect(() => {
    if (module) {
      curriculumModuleStore.set("updateDto", {
        title: module.title,
        description: module.description,
      });
    }
  }, [module]);

  React.useEffect(() => {
    if (setRoutes && module && curriculum) {
      setRoutes([
        { title: tCommon("title"), href: "/curriculum" },
        {
          title: curriculum.title,
          href: `/curriculum/${curriculumId}/edit`,
        },
        { title: module.title },
      ]);
    }
    if (setEnableMainOverflow) setEnableMainOverflow(true);
  }, [
    curriculum,
    curriculumId,
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

  const { updateCurriculumModuleFormStructure } =
    useUpdateCurriculumModuleFormStructure({
      curriculumModuleStore,
    });

  const { mutate: updateMutation, isPending } = useMutation({
    mutationFn: (dto: UpdateCurriculumModuleDto) => {
      if (!module) throw new Error("Module not found");
      return api.update(module.id, dto);
    },
    onSuccess: () => {
      toast.success(tGlobal("commands.saved"));
      void queryClient.invalidateQueries({
        queryKey: ["curriculum-modules", curriculumId],
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
        api.workflow.executeWorkflow(moduleId, { event }),
      onSuccess: () => {
        toast.success(tGlobal("commands.saved"));
        void queryClient.invalidateQueries({
          queryKey: ["curriculum", "modules", moduleId, "workflow"],
        });
        void queryClient.invalidateQueries({
          queryKey: ["curriculum-modules", curriculumId],
        });
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(errorMessage(error, tCommon("errors.saveFailed")));
      },
    },
  );

  const handleSubmit = React.useCallback(() => {
    if (!curriculumModuleStore.updateDto.title?.trim()) {
      curriculumModuleStore.set("updateDtoErrors", {
        title: [tCommon("errors.titleRequired")],
      });
      return;
    }
    curriculumModuleStore.set("updateDtoErrors", {});
    updateMutation(curriculumModuleStore.updateDto);
  }, [updateMutation, curriculumModuleStore, tCommon, tGlobal]);

  const mainContent = (
    <div className="flex flex-col gap-8">
      <FormBuilder structure={updateCurriculumModuleFormStructure} />
      <Separator />
      <CurriculumLessons curriculumId={curriculumId} moduleId={moduleId} />
      <Separator />
      <CurriculumExams curriculumId={curriculumId} moduleId={moduleId} />
    </div>
  );

  const sidebarContent = (
    <>
      {module && (
        <CurriculumMetaHeader
          curriculum={{
            ...module,
            status: module.status || workflowData?.status,
            owner: appType === "admin" ? undefined : module.owner,
            createdAt: appType !== "admin" ? undefined : module.createdAt,
            createdBy: module.createdBy,
          }}
          extraRows={[
            {
              label: tGlobal("versions"),
              value: (
                <span
                  className="cursor-pointer text-primary hover:underline font-semibold"
                  onClick={() =>
                    navigate(
                      `/curriculum/${curriculumId}/modules/${moduleId}/versions`,
                    )
                  }
                >
                  {module?.version != null ? module?.version : "-"}
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

  if (!module) {
    return <div className="p-4 text-destructive">Module not found</div>;
  }

  return (
    <CurriculumFormLayout
      className={className}
      main={mainContent}
      sidebar={sidebarContent}
    />
  );
}
