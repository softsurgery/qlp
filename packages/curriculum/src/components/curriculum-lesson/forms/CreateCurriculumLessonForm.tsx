import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { FormBuilder } from "@qlp/form-builder";
import { useApp } from "@qlp/contexts";
import { Button, cn } from "@qlp/ui";
import {
  type CreateCurriculumLessonDto,
  type ServerErrorResponse,
} from "@qlp/api-client";
import { useCurriculumLessonStore } from "../../../hooks/stores/useCurriculumLessonStore";
import { useCreateCurriculumLessonFormStructure } from "./useCreateCurriculumLessonFormStructure";
import { errorMessage } from "../../../utils";

export interface CreateCurriculumLessonFormProps {
  className?: string;
  curriculumId: string;
  moduleId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateCurriculumLessonForm({
  className,
  moduleId,
  onSuccess,
  onCancel,
}: CreateCurriculumLessonFormProps) {
  const { t: tCommon } = useTranslation("common");
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin"
      ? baseApi.adminCurriculumLessons
      : baseApi.curriculumLessons;
  const { t } = useTranslation("curriculum");
  const queryClient = useQueryClient();

  const curriculumLessonStore = useCurriculumLessonStore();

  const { createCurriculumLessonFormStructure } =
    useCreateCurriculumLessonFormStructure({
      curriculumLessonStore,
    });

  const { mutate: createMutation, isPending } = useMutation({
    mutationFn: (dto: CreateCurriculumLessonDto) => api.create(moduleId, dto),
    onSuccess: () => {
      toast.success(tCommon("commands.created", "Created successfully"));
      void queryClient.invalidateQueries({
        queryKey: ["curriculum-lessons", moduleId],
      });
      curriculumLessonStore.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(errorMessage(error, tCommon("errors.saveFailed")));
    },
  });

  const handleSubmit = React.useCallback(() => {
    if (!curriculumLessonStore.createDto.title?.trim()) {
      curriculumLessonStore.set("createDtoErrors", {
        title: [t("errors.titleRequired", "Title is required")],
      });
      return;
    }
    curriculumLessonStore.set("createDtoErrors", {});
    createMutation(curriculumLessonStore.createDto);
  }, [createMutation, curriculumLessonStore, t]);

  return (
    <div
      className={cn("flex flex-1 flex-col gap-2 overflow-hidden", className)}
    >
      <FormBuilder
        className="mx-auto flex h-full flex-1 flex-col overflow-auto"
        structure={createCurriculumLessonFormStructure}
      />
      <div className="flex justify-end gap-2 border-t px-4 py-3">
        <Button onClick={handleSubmit} disabled={isPending}>
          <Save />
          {tCommon("commands.save")}
        </Button>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={isPending}>
            {tCommon("commands.cancel")}
          </Button>
        )}
      </div>
    </div>
  );
}
