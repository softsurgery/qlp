import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "@qlp/contexts";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Save, Repeat2, Loader2 } from "lucide-react";
import { FormBuilder } from "@qlp/form-builder";
import { useBreadcrumb, useUI } from "@qlp/contexts";
import { Button, Label } from "@qlp/ui";
import {
  type UpdateCurriculumDto,
  type ServerErrorResponse,
} from "@qlp/api-client";
import { useCurriculumStore } from "../../../hooks/stores/useCurriculumStore";
import { useUpdateCurriculumFormStructure } from "./useUpdateCurriculumFormStructure";
import { errorMessage } from "../../../utils";
import { CurriculumFormLayout } from "../../CurriculumFormLayout";
import { CurriculumMetaHeader } from "../CurriculumMetaHeader";
import { CurriculumModules } from "../../curriculum-module/CurriculumModules";
import { useTutors } from "@qlp/hooks";

interface UpdateCurriculumFormProps {
  className?: string;
  curriculumId: string;
  appType?: "admin" | "web";
  onSuccess?: () => void;
}

export function UpdateCurriculumForm({
  className,
  curriculumId,
  appType: appTypeProp,
  onSuccess,
}: UpdateCurriculumFormProps) {
  const { t: tCommon } = useTranslation("common");
  const navigate = useNavigate();
  const { api: baseApi, appType: contextAppType } = useApp();
  const appType = appTypeProp || contextAppType;
  const api =
    appType === "admin" ? baseApi.adminCurriculum : baseApi.curriculum;
  const uploadApi = baseApi.upload;
  const { t } = useTranslation("curriculum");
  const queryClient = useQueryClient();

  const { tutorOptions: ownerOptions } = useTutors({
    enabled: appType === "admin",
  });

  const {
    data: workflowData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["curriculum", curriculumId, "workflow"],
    queryFn: () =>
      api.workflow.findWorkflow(curriculumId, { join: "owner,createdBy" }),
  });

  const curriculum = workflowData?.curriculum;

  const curriculumStore = useCurriculumStore();
  const resetStore = useCurriculumStore((state) => state.reset);

  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setEnableMainOverflow, clearEnableMainOverflow } = useUI();

  // Populate store
  React.useEffect(() => {
    if (curriculum) {
      curriculumStore.set("response", curriculum);
      curriculumStore.set("updateDto", {
        title: curriculum.title,
        slug: curriculum.slug,
        description: curriculum.description,
        status: curriculum.status,
        ownerId: curriculum.owner?.id || curriculum.ownerId,
      });
    }
  }, [curriculum]);

  React.useEffect(() => {
    if (setRoutes && curriculum) {
      setRoutes([
        { title: t("title"), href: "/curriculum" },
        { title: curriculum.title || t("updateTitle") },
      ]);
    }
    if (setEnableMainOverflow) setEnableMainOverflow(true);
  }, [curriculum, setEnableMainOverflow, setRoutes, t]);

  React.useEffect(() => {
    return () => {
      if (clearRoutes) clearRoutes();
      if (clearEnableMainOverflow) clearEnableMainOverflow();
      resetStore();
    };
  }, [clearEnableMainOverflow, clearRoutes, resetStore]);

  const { updateCurriculumFormStructure } = useUpdateCurriculumFormStructure({
    curriculumStore,
    appType,
    ownerOptions,
  });

  const { mutate: updateMutation, isPending } = useMutation({
    mutationFn: (dto: UpdateCurriculumDto) => {
      if (!curriculum) throw new Error("Curriculum not loaded");
      return api.update(curriculum.id, dto);
    },
    onSuccess: (updated) => {
      toast.success(t("updated"));
      void queryClient.invalidateQueries({ queryKey: ["curriculum"] });
      void queryClient.invalidateQueries({
        queryKey: ["curriculum", curriculumId],
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(errorMessage(error, t("saveError")));
    },
  });

  const { mutate: executeWorkflowMutation, isPending: isExecutingWorkflow } =
    useMutation({
      mutationFn: (dto: { event: string }) =>
        api.workflow.executeWorkflow(curriculumId, dto),
      onSuccess: () => {
        toast.success(
          tCommon("workflowExecuted", "Action executed successfully"),
        );
        void queryClient.invalidateQueries({ queryKey: ["curriculum"] });
        void queryClient.invalidateQueries({
          queryKey: ["curriculum", curriculumId],
        });
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(
          errorMessage(error, tCommon("workflowError", "Action failed")),
        );
      },
    });

  const handleSubmit = React.useCallback(() => {
    if (!curriculumStore.updateDto.title?.trim()) {
      curriculumStore.set("updateDtoErrors", {
        title: [t("errors.titleRequired")],
      });
      return;
    }
    curriculumStore.set("updateDtoErrors", {});
    updateMutation(curriculumStore.updateDto);
  }, [updateMutation, curriculumStore, t]);

  const mainContent = (
    <div className="flex flex-col gap-8">
      <FormBuilder structure={updateCurriculumFormStructure} />
      <CurriculumModules curriculumId={curriculumId} />
    </div>
  );

  const sidebarContent = curriculum ? (
    <>
      <CurriculumMetaHeader
        curriculum={{
          ...curriculum,
          owner: appType === "admin" ? undefined : curriculum.owner,
          createdAt: appType !== "admin" ? undefined : curriculum.createdAt,
        }}
        extraRows={[
          {
            label: t("versions"),
            value: (
              <span
                className="cursor-pointer text-primary hover:underline font-semibold"
                onClick={() => navigate(`/curriculum/${curriculumId}/versions`)}
              >
                {curriculum?.version != null ? curriculum?.version : "-"}
              </span>
            ),
          },
        ]}
        uploadApi={uploadApi}
      />
      <div className="flex flex-col gap-2 w-full">
        <Label className="text-xs font-bold text-muted-foreground">
          {tCommon("commands.actions")}
        </Label>
        <Button
          type="button"
          size="sm"
          onClick={handleSubmit}
          disabled={isPending || (workflowData && !workflowData.isUpdatable)}
        >
          <Save className="h-4 w-4" />
          <span>{tCommon("commands.save")}</span>
        </Button>
        {workflowData?.nextSteps?.map((step) => (
          <Button
            key={step.label}
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => executeWorkflowMutation({ event: step.label })}
            disabled={isPending || isExecutingWorkflow}
          >
            {step.label}
          </Button>
        ))}
        <Button
          type="button"
          size="sm"
          variant={"ghost"}
          onClick={resetStore}
          disabled={isPending}
        >
          <Repeat2 className="h-4 w-4" />
          <span>{tCommon("commands.reset")}</span>
        </Button>
      </div>
    </>
  ) : null;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !curriculum) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-destructive">Failed to load curriculum</p>
      </div>
    );
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
