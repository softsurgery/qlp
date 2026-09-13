import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Save, X } from "lucide-react";
import { FormBuilder } from "@qlp/form-builder";
import { useApp, useBreadcrumb, useUI } from "@qlp/contexts";
import { Button, Label, Separator } from "@qlp/ui";
import { useCurriculum, useCurriculumModuleWorkflow } from "../../../hooks";
import {
  type UpdateCurriculumModuleDto,
  type ServerErrorResponse,
  type ResponseCurriculumModuleDto,
} from "@qlp/api-client";
import { useCurriculumModuleStore } from "../../../hooks/stores/useCurriculumModuleStore";
import { useUpdateCurriculumModuleFormStructure } from "./useUpdateCurriculumModuleFormStructure";
import { errorMessage } from "../../../utils";
import { CurriculumFormLayout } from "../../CurriculumFormLayout";
import { CurriculumMetaHeader } from "../../curriculum/CurriculumMetaHeader";
import { useNavigate } from "react-router-dom";

export interface UpdateCurriculumModuleFormProps {
  className?: string;
  curriculumId: string;
  moduleId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UpdateCurriculumModuleForm({
  className,
  curriculumId,
  moduleId,
  onSuccess,
  onCancel,
}: UpdateCurriculumModuleFormProps) {
  const { t: tCommon } = useTranslation("common");
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin" ? baseApi.adminCurriculum : baseApi.curriculum;
  const { t } = useTranslation("curriculum");
  const queryClient = useQueryClient();

  const { curriculum: treeData, isCurriculumPending: isTreeLoading } =
    useCurriculum({ id: curriculumId, join: "owner,createdBy" });
  const { workflow: workflowData, isWorkflowPending: isWorkflowLoading } =
    useCurriculumModuleWorkflow({ moduleId, join: "owner,createdBy" });
  const curriculumModuleStore = useCurriculumModuleStore();
  const resetStore = useCurriculumModuleStore((state) => state.reset);
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setEnableMainOverflow, clearEnableMainOverflow } = useUI();
  const navigate = useNavigate();

  const isLoading = isTreeLoading || isWorkflowLoading;

  const module = treeData?.modules?.find(
    (m: ResponseCurriculumModuleDto) => m.id === moduleId,
  );

  React.useEffect(() => {
    if (module) {
      curriculumModuleStore.set("updateDto", {
        title: module.title,
        description: module.description,
      });
    }
  }, [module]);

  React.useEffect(() => {
    if (setRoutes && module && treeData) {
      setRoutes([
        { title: t("title", "Curriculum"), href: "/curriculum" },
        { title: treeData.title, href: `/curriculum/${curriculumId}/edit` },
        { title: module.title || t("editModule", "Edit Module") },
      ]);
    }
    if (setEnableMainOverflow) setEnableMainOverflow(true);
    return () => {
      if (clearRoutes) clearRoutes();
      if (clearEnableMainOverflow) clearEnableMainOverflow();
      resetStore();
    };
  }, [module, treeData]);

  const { updateCurriculumModuleFormStructure } =
    useUpdateCurriculumModuleFormStructure({
      curriculumModuleStore,
    });

  const { mutate: updateMutation, isPending } = useMutation({
    mutationFn: (dto: UpdateCurriculumModuleDto) => {
      if (!module) throw new Error("Module not found");
      return api.updateModule(module.id, dto);
    },
    onSuccess: () => {
      toast.success(tCommon("commands.saved", "Saved successfully"));
      void queryClient.invalidateQueries({
        queryKey: ["curriculum", curriculumId, "tree"],
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
        api.executeModuleWorkflow(moduleId, { event }),
      onSuccess: () => {
        toast.success(tCommon("commands.saved", "Saved successfully"));
        void queryClient.invalidateQueries({
          queryKey: ["curriculum", "modules", moduleId, "workflow"],
        });
        void queryClient.invalidateQueries({
          queryKey: ["curriculum", curriculumId, "tree"],
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
        title: [t("errors.titleRequired", "Title is required")],
      });
      return;
    }
    curriculumModuleStore.set("updateDtoErrors", {});
    updateMutation(curriculumModuleStore.updateDto);
  }, [updateMutation, curriculumModuleStore, t]);

  const mainContent = (
    <div className="flex flex-col gap-8">
      <FormBuilder structure={updateCurriculumModuleFormStructure} />
    </div>
  );

  const sidebarContent = (
    <>
      {workflowData && (
        <>
          <CurriculumMetaHeader
            curriculum={{
              ...workflowData.module,
              owner:
                appType === "admin" ? undefined : workflowData.module.owner,
              createdAt:
                appType !== "admin"
                  ? undefined
                  : (workflowData.module as any).createdAt,
              createdBy: workflowData.module.createdBy,
            }}
            extraRows={[
              {
                label: t("versions"),
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
          <Separator />
        </>
      )}

      <div className="flex flex-col gap-2 w-full">
        <Label className="text-xs font-bold text-muted-foreground">
          {tCommon("commands.actions", "Actions")}
        </Label>
        <Button
          type="button"
          size="sm"
          className="rounded-xl w-full"
          variant={"outline"}
          onClick={handleSubmit}
          disabled={
            !!(
              isPending ||
              isLoading ||
              (workflowData && !workflowData.isUpdatable)
            )
          }
        >
          <Save className="mr-2 h-4 w-4" />
          <span>{tCommon("commands.save", "Save")}</span>
        </Button>
        {workflowData?.nextSteps?.map((step: any) => (
          <Button
            key={step.label}
            type="button"
            size="sm"
            variant="outline"
            className="rounded-xl w-full"
            onClick={() => executeWorkflow(step.label)}
            disabled={isPending || isWorkflowPending}
          >
            {step.label}
          </Button>
        ))}
        {onCancel && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="rounded-xl w-full text-destructive hover:bg-destructive/10"
            onClick={onCancel}
            disabled={isPending}
          >
            <X className="mr-2 h-4 w-4" />
            <span>{tCommon("commands.cancel", "Cancel")}</span>
          </Button>
        )}
      </div>
    </>
  );

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!module) {
    return <div className="p-4 text-destructive">Module not found</div>;
  }

  return (
    <CurriculumFormLayout
      className={className}
      main={mainContent}
      sidebar={sidebarContent}
      sidebarTitle={tCommon("commands.actions", "Actions")}
    />
  );
}
