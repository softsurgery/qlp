import React from "react";
import { useApp } from "@qlp/contexts";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Save, Repeat2, Loader2 } from "lucide-react";
import { FormBuilder } from "@qlp/form-builder";
import { useBreadcrumb, useUI } from "@qlp/contexts";
import { Button, Separator, Label } from "@qlp/ui";
import {
  type UpdateCurriculumDto,
  type ServerErrorResponse,
} from "@qlp/api-client";
import { useCurriculumStore } from "../hooks/stores/useCurriculumStore";
import { useUpdateCurriculumFormStructure } from "./useUpdateCurriculumFormStructure";
import { errorMessage } from "../utils";
import { CurriculumFormLayout } from "../components/CurriculumFormLayout";
import { CurriculumMetaHeader } from "../components/CurriculumMetaHeader";
import { useTutors } from "../hooks/user/useTutors";

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
    data: curriculum,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["curriculum", curriculumId],
    queryFn: () => api.findById(curriculumId),
  });

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
      });
    }
  }, [curriculum]); // intentional single initialization dependency when curriculum loads

  React.useEffect(() => {
    if (setRoutes && curriculum) {
      setRoutes([
        { title: t("title"), href: "/curriculum" },
        { title: curriculum.title || t("updateTitle") },
      ]);
    }
    if (setEnableMainOverflow) setEnableMainOverflow(true);
    return () => {
      if (clearRoutes) clearRoutes();
      if (clearEnableMainOverflow) clearEnableMainOverflow();
      resetStore();
    };
  }, [
    clearEnableMainOverflow,
    clearRoutes,
    resetStore,
    setEnableMainOverflow,
    setRoutes,
    t,
    curriculum?.title,
  ]);

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
    <div className="flex flex-col">
      <FormBuilder structure={updateCurriculumFormStructure} />
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
        uploadApi={uploadApi}
      />
      <Separator />
      <div className="flex flex-col gap-2 w-full">
        <Label className="text-xs font-bold text-muted-foreground">
          {tCommon("commands.actions", "Actions")}
        </Label>
        <Button
          type="button"
          size="lg"
          className="rounded-xl w-full"
          variant={"outline"}
          onClick={handleSubmit}
          disabled={isPending}
        >
          <Save className="mr-2 h-4 w-4" />
          <span>{tCommon("commands.save", "Save")}</span>
        </Button>
        <Button
          type="button"
          size="lg"
          className="rounded-xl w-full"
          variant={"ghost"}
          onClick={resetStore}
          disabled={isPending}
        >
          <Repeat2 className="mr-2 h-4 w-4" />
          <span>{tCommon("commands.reset", "Reset")}</span>
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
