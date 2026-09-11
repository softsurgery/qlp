import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Save, Repeat2 } from "lucide-react";
import { FormBuilder } from "@qlp/form-builder";
import { useBreadcrumb, useUI } from "@qlp/contexts";
import { Button, Separator, Label } from "@qlp/ui";
import {
  type CurriculumResource,
  type UpdateCurriculumDto,
  type ResponseCurriculumDto,
  type ServerErrorResponse,
} from "@qlp/api-client";
import { type UploadSrcApi } from "@qlp/hooks";
import { useCurriculumStore } from "../hooks/stores/useCurriculumStore";
import { useUpdateCurriculumFormStructure } from "./useUpdateCurriculumFormStructure";
import { errorMessage } from "../utils";
import { CurriculumFormLayout } from "../components/CurriculumFormLayout";
import { CurriculumMetaHeader } from "../components/CurriculumMetaHeader";

interface UpdateCurriculumFormProps {
  className?: string;
  api: CurriculumResource;
  uploadApi?: UploadSrcApi;
  basePath: string;
  curriculum: ResponseCurriculumDto;
  onSuccess?: () => void;
}

export function UpdateCurriculumForm({
  className,
  api,
  uploadApi,
  basePath,
  curriculum,
  onSuccess,
}: UpdateCurriculumFormProps) {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("curriculum");
  const queryClient = useQueryClient();

  const curriculumStore = useCurriculumStore();
  const resetStore = useCurriculumStore((state) => state.reset);

  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setEnableMainOverflow, clearEnableMainOverflow } = useUI();

  // Populate store
  React.useEffect(() => {
    curriculumStore.set("response", curriculum);
    curriculumStore.set("updateDto", {
      title: curriculum.title,
      slug: curriculum.slug,
      description: curriculum.description,
      status: curriculum.status,
    });
  }, [curriculum]); // intentional single initialization dependency when curriculum loads

  React.useEffect(() => {
    if (setRoutes) {
      setRoutes([
        { title: t("title"), href: basePath },
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
    basePath,
    curriculum.title,
  ]);

  const { updateCurriculumFormStructure } = useUpdateCurriculumFormStructure({
    curriculumStore,
  });

  const { mutate: updateMutation, isPending } = useMutation({
    mutationFn: (dto: UpdateCurriculumDto) => api.update(curriculum.id, dto),
    onSuccess: (updated) => {
      toast.success(t("updated"));
      void queryClient.invalidateQueries({ queryKey: ["curriculum"] });
      void queryClient.invalidateQueries({ queryKey: ["curriculum", curriculum.id] });
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

  const sidebarContent = (
    <>
      <CurriculumMetaHeader
        status={t(`status.${curriculum.status}`)}
        user={curriculum.owner}
        createdAt={curriculum.createdAt}
        updatedAt={curriculum.updatedAt}
        uploadApi={uploadApi}
      />
      <Separator />
      <div className="flex flex-col gap-2 w-full">
        <Label className="text-xs font-bold text-muted-foreground">{tCommon("commands.actions", "Actions")}</Label>
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
  );

  return (
    <CurriculumFormLayout
      className={className}
      main={mainContent}
      sidebar={sidebarContent}
      sidebarTitle={tCommon("commands.actions", "Actions")}
    />
  );
}
