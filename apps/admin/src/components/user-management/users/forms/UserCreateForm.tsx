import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Repeat2, Save } from "lucide-react";
import { FormBuilder, mapToSelectOptions } from "@qlp/form-builder";
import { useBreadcrumb, useFooter, useIntro, useUI } from "@qlp/contexts";
import { Button } from "@qlp/ui";
import { Spinner } from "@qlp/components";
import type { CreateUserDto, ServerErrorResponse } from "@qlp/api-client";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { useRoles } from "@/hooks/useRoles";
import { useCreateUserFormStructure } from "./useCreateUserFormStructure";
import { createUserSchema } from "@/types/validations/user.validation";
import { useProfilePictureUpload } from "@/hooks/useProfilePictureUpload";

interface UserCreateFormProps {
  className?: string;
  onSuccess?: () => void;
}

export const UserCreateForm = ({ className, onSuccess }: UserCreateFormProps) => {
  const navigate = useNavigate();
  const { t: tCommon } = useTranslation("common");
  const { t: tUser } = useTranslation("user-management");
  const userStore = useUserStore();
  const resetUser = useUserStore((state) => state.reset);
  const { roles, isFetchRolesPending } = useRoles();
  const { setContent } = useFooter();
  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setEnableMainOverflow, clearEnableMainOverflow } = useUI();

  React.useEffect(() => {
    setIntro?.(
      tUser("userManagement.sheet.createUserTitle"),
      tUser("userManagement.sheet.createUserDescription"),
    );
    setRoutes?.([
      { title: tUser("userManagement.nav.title"), href: "/user-management/users" },
      { title: tUser("userManagement.nav.users"), href: "/user-management/users" },
      { title: tUser("userManagement.sheet.createUserTitle") },
    ]);
    setEnableMainOverflow?.(true);
    return () => {
      clearIntro?.();
      clearRoutes?.();
      clearEnableMainOverflow?.();
      resetUser();
    };
  }, [
    clearEnableMainOverflow,
    clearIntro,
    clearRoutes,
    resetUser,
    setEnableMainOverflow,
    setIntro,
    setRoutes,
    tUser,
  ]);

  const {
    mutate: uploadProfilePicture,
    isPending: isProfilePictureUploadPending,
  } = useProfilePictureUpload({ userStore, mode: "create" });

  const { userCreateFormStructure } = useCreateUserFormStructure({
    userStore,
    roles: mapToSelectOptions({
      data: isFetchRolesPending ? [] : roles,
      labelKey: "label",
      valueKey: "id",
    }),
    uploadProfilePicture,
    isProfilePictureUploadPending,
  });

  const { mutate: createMutation, isPending } = useMutation({
    mutationFn: (user: CreateUserDto) => api.user.create(user),
    onSuccess: () => {
      toast.success(tUser("userManagement.messages.userCreatedSuccess"));
      userStore.reset();
      if (onSuccess) onSuccess();
      else navigate("/user-management/users");
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(
        error.response?.data?.message || tUser("userManagement.errors.generalError"),
      );
    },
  });

  const handleReset = React.useCallback(() => userStore.reset(), [userStore]);

  const handleSubmit = React.useCallback(() => {
    const userResult = createUserSchema.safeParse({
      ...userStore.createDto,
      confirmPassword: userStore.confirmPassword,
    });
    if (!userResult.success) {
      userStore.set("createDtoErrors", userResult.error.flatten().fieldErrors);
      return;
    }
    userStore.set("createDtoErrors", {});
    createMutation(userStore.createDto);
  }, [createMutation, userStore]);

  React.useEffect(() => {
    setContent?.(
      <div className="flex items-center justify-end gap-2 px-4 py-2">
        <Button
          variant="secondary"
          onClick={handleReset}
          disabled={isPending || isProfilePictureUploadPending}
        >
          <Repeat2 /> {tCommon("commands.reset")}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isPending || isProfilePictureUploadPending}
        >
          <Save /> {tCommon("commands.save")}
        </Button>
      </div>,
    );
    return () => setContent?.(null);
  }, [
    handleReset,
    handleSubmit,
    isPending,
    isProfilePictureUploadPending,
    setContent,
    tCommon,
  ]);

  return (
    <div className={cn("flex flex-col flex-1 gap-2", className)}>
      {isFetchRolesPending ? (
        <Spinner />
      ) : (
        <div className="my-4 flex flex-1 flex-col">
          <FormBuilder structure={userCreateFormStructure} />
        </div>
      )}
    </div>
  );
};
