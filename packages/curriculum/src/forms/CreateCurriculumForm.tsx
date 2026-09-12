import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Repeat2, Save } from "lucide-react";
import { FormBuilder } from "@qlp/form-builder";
import { useBreadcrumb, useUI, useApp } from "@qlp/contexts";
import { Button, Separator, Label } from "@qlp/ui";
import { CurriculumMetaHeader } from "../components/CurriculumMetaHeader";
import {
  type CreateCurriculumDto,
  type ServerErrorResponse,
  type ResponseUserDto,
} from "@qlp/api-client";
import { useCurriculumStore } from "../hooks/stores/useCurriculumStore";
import { useCreateCurriculumFormStructure } from "./useCreateCurriculumFormStructure";
import { errorMessage } from "../utils";
import { CurriculumFormLayout } from "../components/CurriculumFormLayout";

export interface CreateCurriculumFormProps {
  className?: string;
  user?: ResponseUserDto | null;
  appType?: "admin" | "web";
  onSuccess?: () => void;
}

export function CreateCurriculumForm({
  className,
  user,
  appType: appTypeProp,
  onSuccess,
}: CreateCurriculumFormProps) {
  const navigate = useNavigate();
  const { t: tCommon } = useTranslation("common");
  const { api: baseApi, appType: contextAppType } = useApp();
  const appType = appTypeProp || contextAppType;
  const api =
    appType === "admin" ? baseApi.adminCurriculum : baseApi.curriculum;
  const uploadApi = baseApi.upload;
  const { t } = useTranslation("curriculum");
  const queryClient = useQueryClient();

  const userApi = baseApi.user;
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => userApi?.findAll(),
    enabled: appType === "admin" && !!userApi,
  });

  const ownerOptions =
    users?.map((u) => ({
      label:
        u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.username,
      value: u.id,
    })) || [];

  const curriculumStore = useCurriculumStore();
  const resetStore = useCurriculumStore((state) => state.reset);

  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setEnableMainOverflow, clearEnableMainOverflow } = useUI();

  React.useEffect(() => {
    if (setRoutes) {
      setRoutes([
        { title: t("title"), href: "/curriculum" },
        { title: t("createTitle") },
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
  ]);

  const { createCurriculumFormStructure } = useCreateCurriculumFormStructure({
    curriculumStore,
    appType,
    ownerOptions,
  });

  const { mutate: createMutation, isPending } = useMutation({
    mutationFn: (dto: CreateCurriculumDto) => api.create(dto),
    onSuccess: (curriculum) => {
      toast.success(t("created"));
      void queryClient.invalidateQueries({ queryKey: ["curriculum"] });
      curriculumStore.reset();
      if (onSuccess) onSuccess();
      else navigate(`/curriculum/${curriculum.id}/edit`);
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(errorMessage(error, t("saveError")));
    },
  });

  const handleReset = React.useCallback(
    () => curriculumStore.reset(),
    [curriculumStore],
  );

  const handleSubmit = React.useCallback(() => {
    if (!curriculumStore.createDto.title.trim()) {
      curriculumStore.set("createDtoErrors", {
        title: [t("errors.titleRequired")],
      });
      return;
    }
    curriculumStore.set("createDtoErrors", {});
    createMutation(curriculumStore.createDto);
  }, [createMutation, curriculumStore, t]);

  const mainContent = (
    <div className="flex flex-col">
      <FormBuilder structure={createCurriculumFormStructure} />
    </div>
  );

  const sidebarContent = (
    <>
      <CurriculumMetaHeader
        curriculum={{
          status: curriculumStore.createDto.status || "draft",
          owner: appType === "admin" ? undefined : (user ?? undefined),
          createdBy: user ?? undefined,
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
          onClick={handleReset}
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
