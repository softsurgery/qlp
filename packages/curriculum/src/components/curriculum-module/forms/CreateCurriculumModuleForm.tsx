import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Spinner } from "@qlp/components";
import { FormBuilder } from "@qlp/form-builder";
import { useApp } from "@qlp/contexts";
import { Button, cn } from "@qlp/ui";
import {
  type CreateCurriculumModuleDto,
  type ServerErrorResponse,
} from "@qlp/api-client";
import { useCurriculumModuleStore } from "../../../hooks/stores/useCurriculumModuleStore";
import { useCreateCurriculumModuleFormStructure } from "./useCreateCurriculumModuleFormStructure";
import { errorMessage } from "../../../utils";

export interface CreateCurriculumModuleFormProps {
  className?: string;
  curriculumId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateCurriculumModuleForm({
  className,
  curriculumId,
  onSuccess,
  onCancel,
}: CreateCurriculumModuleFormProps) {
  const { t: tGlobal } = useTranslation("global");
    const { t: tCommon } = useTranslation("curriculum-common");
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin"
      ? baseApi.adminCurriculumModules
      : baseApi.curriculumModules;
  const queryClient = useQueryClient();

  const curriculumModuleStore = useCurriculumModuleStore();

  const { createCurriculumModuleFormStructure } =
    useCreateCurriculumModuleFormStructure({
      curriculumModuleStore,
    });

  const { mutate: createMutation, isPending } = useMutation({
    mutationFn: (dto: CreateCurriculumModuleDto) =>
      api.create(curriculumId, dto),
    onSuccess: () => {
      toast.success(tGlobal("commands.created"));
      void queryClient.invalidateQueries({
        queryKey: ["curriculum-modules", curriculumId],
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
        title: [tCommon("errors.titleRequired")],
      });
      return;
    }
    curriculumModuleStore.set("createDtoErrors", {});
    createMutation(curriculumModuleStore.createDto);
  }, [createMutation, curriculumModuleStore, tCommon, tGlobal]);

  return (
    <div
      className={cn("flex flex-1 flex-col gap-2 overflow-hidden", className)}
    >
      <FormBuilder
        className="mx-auto flex h-full flex-1 flex-col overflow-auto"
        structure={createCurriculumModuleFormStructure}
      />
      <div className="flex justify-end gap-2 border-t px-4 py-3">
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
