import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Save, X } from "lucide-react";
import { FormBuilder } from "@qlp/form-builder";
import { useApp } from "@qlp/contexts";
import { Button } from "@qlp/ui";
import {
  type CreateCurriculumModuleDto,
  type ServerErrorResponse,
} from "@qlp/api-client";
import { useCurriculumModuleStore } from "../../../hooks/stores/useCurriculumModuleStore";
import { useCreateCurriculumModuleFormStructure } from "./useCreateCurriculumModuleFormStructure";
import { errorMessage } from "../../../utils";

export interface CreateCurriculumModuleFormProps {
  curriculumId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateCurriculumModuleForm({
  curriculumId,
  onSuccess,
  onCancel,
}: CreateCurriculumModuleFormProps) {
  const { t: tCommon } = useTranslation("common");
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin" ? baseApi.adminCurriculum : baseApi.curriculum;
  const { t } = useTranslation("curriculum");
  const queryClient = useQueryClient();

  const curriculumModuleStore = useCurriculumModuleStore();

  React.useEffect(() => {
    return () => {
      curriculumModuleStore.reset();
    };
  }, []);

  const { createCurriculumModuleFormStructure } =
    useCreateCurriculumModuleFormStructure({
      curriculumModuleStore,
    });

  const { mutate: createMutation, isPending } = useMutation({
    mutationFn: (dto: CreateCurriculumModuleDto) =>
      api.createModule(curriculumId, dto),
    onSuccess: () => {
      toast.success(tCommon("commands.created", "Created successfully"));
      void queryClient.invalidateQueries({
        queryKey: ["curriculum", curriculumId, "tree"],
      });
      curriculumModuleStore.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(errorMessage(error, tCommon("errors.saveFailed")));
    },
  });

  const handleSubmit = React.useCallback(() => {
    if (!curriculumModuleStore.createDto.title?.trim()) {
      curriculumModuleStore.set("createDtoErrors", {
        title: [t("errors.titleRequired", "Title is required")],
      });
      return;
    }
    curriculumModuleStore.set("createDtoErrors", {});
    createMutation(curriculumModuleStore.createDto);
  }, [createMutation, curriculumModuleStore, t]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pr-2 pb-6">
        <FormBuilder structure={createCurriculumModuleFormStructure} />
      </div>
      <div className="pt-4 border-t flex flex-col gap-2 mt-auto bg-background">
        <Button
          type="button"
          size="lg"
          className="rounded-xl w-full"
          onClick={handleSubmit}
          disabled={isPending}
        >
          <Save className="mr-2 h-4 w-4" />
          <span>{tCommon("commands.save", "Save")}</span>
        </Button>
        {onCancel && (
          <Button
            type="button"
            size="lg"
            variant="ghost"
            className="rounded-xl w-full"
            onClick={onCancel}
            disabled={isPending}
          >
            <X className="mr-2 h-4 w-4" />
            <span>{tCommon("commands.cancel", "Cancel")}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
