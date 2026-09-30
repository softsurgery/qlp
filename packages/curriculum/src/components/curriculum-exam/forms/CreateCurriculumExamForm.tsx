import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Spinner } from "@qlp/components";
import { FormBuilder } from "@qlp/form-builder";
import { useApp } from "@qlp/contexts";
import { Button, Separator, cn } from "@qlp/ui";
import {
  type CreateCurriculumExamDto,
  type ServerErrorResponse,
} from "@qlp/api-client";
import { useCurriculumExamStore } from "../../../hooks/stores/useCurriculumExamStore";
import { useCreateCurriculumExamFormStructure } from "./useCreateCurriculumExamFormStructure";
import { CurriculumExamQuestionEditor } from "../../curriculum-exam-question/CurriculumExamQuestionEditor";
import { errorMessage } from "../../../utils";

export interface CreateCurriculumExamFormProps {
  className?: string;
  curriculumId: string;
  moduleId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateCurriculumExamForm({
  className,
  moduleId,
  onSuccess,
  onCancel,
}: CreateCurriculumExamFormProps) {
  const { t: tGlobal } = useTranslation("global");
  const { t: tCommon } = useTranslation("curriculum-common");
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin"
      ? baseApi.adminCurriculumExams
      : baseApi.curriculumExams;
  const queryClient = useQueryClient();

  const curriculumExamStore = useCurriculumExamStore();

  const { createCurriculumExamFormStructure } =
    useCreateCurriculumExamFormStructure({
      curriculumExamStore,
    });

  const { mutate: createMutation, isPending } = useMutation({
    mutationFn: (dto: CreateCurriculumExamDto) => api.create(moduleId, dto),
    onSuccess: () => {
      toast.success(tGlobal("commands.created"));
      void queryClient.invalidateQueries({
        queryKey: ["curriculum-exams", moduleId],
      });
      curriculumExamStore.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(errorMessage(error, tCommon("errors.saveFailed")));
    },
  });

  const handleSubmit = React.useCallback(() => {
    if (!curriculumExamStore.createDto.title?.trim()) {
      curriculumExamStore.set("createDtoErrors", {
        title: [tCommon("errors.titleRequired")],
      });
      return;
    }
    curriculumExamStore.set("createDtoErrors", {});
    createMutation(curriculumExamStore.createDto);
  }, [createMutation, curriculumExamStore, tCommon, tGlobal]);

  return (
    <div
      className={cn("flex flex-1 flex-col gap-4 overflow-hidden", className)}
    >
      <div className="flex h-full flex-1 flex-col overflow-auto gap-6 p-4">
        <FormBuilder structure={createCurriculumExamFormStructure} />
      </div>
      <div className="flex justify-end gap-2 border-t px-4 py-3 bg-background">
        <Button onClick={handleSubmit} disabled={isPending}>
          {isPending ? <Spinner size="small" /> : <Save />}
          {tGlobal("commands.save")}
        </Button>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={isPending}>
            {tGlobal("commands.cancel")}
          </Button>
        )}
      </div>
    </div>
  );
}
