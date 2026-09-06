import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Repeat2, Save } from "lucide-react";
import { FormBuilder, mapToSelectOptions } from "@qlp/form-builder";
import { useBreadcrumb, useFooter, useIntro, useUI } from "@qlp/contexts";
import { Button } from "@qlp/ui";
import { Spinner } from "@qlp/components";
import type { ServerErrorResponse, UpdateUserDto } from "@qlp/api-client";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { useRoles } from "@/hooks/useRoles";
import { useUpdateUserFormStructure } from "./useUpdateUserFormStructure";
import { updateUserSchema } from "@/types/validations/user.validation";

interface UserUpdateFormProps {
  userId?: string;
  className?: string;
  onSuccess?: () => void;
}

export const UserUpdateForm = ({
  userId,
  className,
  onSuccess,
}: UserUpdateFormProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t: tCommon } = useTranslation("common");
  const { t: tUser } = useTranslation("user-management");
  const userStore = useUserStore();
  const resetUser = useUserStore((state) => state.reset);
  const setUser = useUserStore((state) => state.set);
  const { roles, isFetchRolesPending } = useRoles();
  const { setContent } = useFooter();
  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setEnableMainOverflow, clearEnableMainOverflow } = useUI();

  React.useEffect(() => {
    setIntro?.(
      tUser("userManagement.sheet.updateUserTitle"),
      tUser("userManagement.sheet.updateUserDescription"),
    );
    setRoutes?.([
      { title: tUser("userManagement.nav.title"), href: "/user-management/users" },
      { title: tUser("userManagement.nav.users"), href: "/user-management/users" },
      { title: tUser("userManagement.sheet.updateUserTitle") },
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

  const { data: fetchedUser, isPending: isFetchUserPending } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => api.user.findById(userId, "role"),
    enabled: Boolean(userId),
  });

  React.useEffect(() => {
    if (!fetchedUser) return;
    setUser("response", fetchedUser);
    setUser<UpdateUserDto>("updateDto", {
      firstName: fetchedUser.firstName,
      lastName: fetchedUser.lastName,
      dateOfBirth: fetchedUser.dateOfBirth,
      isActive: fetchedUser.isActive,
      isApproved: fetchedUser.isApproved,
      username: fetchedUser.username,
      email: fetchedUser.email,
      password: "",
      roleId: fetchedUser.roleId,
      pictureId: fetchedUser.pictureId,
    });
  }, [fetchedUser, setUser]);

  const { userUpdateFormStructure } = useUpdateUserFormStructure({
    userStore,
    roles: mapToSelectOptions({
      data: isFetchRolesPending ? [] : roles,
      labelKey: "label",
      valueKey: "id",
    }),
  });

  const { mutate: updateMutation, isPending } = useMutation({
    mutationFn: (data: { id?: string; user: UpdateUserDto }) =>
      api.user.update(data.id, data.user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(tUser("userManagement.messages.userUpdatedSuccess"));
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

  const handleReset = React.useCallback(() => {
    if (!fetchedUser) {
      userStore.reset();
      return;
    }
    userStore.set("updateDtoErrors", {});
    userStore.set("confirmPassword", "");
    userStore.set("setManualPassword", false);
    userStore.set("response", fetchedUser);
    userStore.set<UpdateUserDto>("updateDto", {
      firstName: fetchedUser.firstName,
      lastName: fetchedUser.lastName,
      dateOfBirth: fetchedUser.dateOfBirth,
      isActive: fetchedUser.isActive,
      isApproved: fetchedUser.isApproved,
      username: fetchedUser.username,
      email: fetchedUser.email,
      password: "",
      roleId: fetchedUser.roleId,
      pictureId: fetchedUser.pictureId,
    });
  }, [fetchedUser, userStore]);

  const handleSubmit = React.useCallback(() => {
    const userResult = updateUserSchema(userStore.setManualPassword).safeParse({
      ...userStore.updateDto,
      confirmPassword: userStore.confirmPassword,
    });
    if (!userResult.success) {
      userStore.set("updateDtoErrors", userResult.error.flatten().fieldErrors);
      toast.error(
        `Validation failed: ${Object.keys(userResult.error.flatten().fieldErrors).join(", ")}`,
      );
      return;
    }
    userStore.set("updateDtoErrors", {});
    const payload = { ...userStore.updateDto };
    if (!userStore.setManualPassword) delete payload.password;
    updateMutation({ id: userId || userStore.response?.id, user: payload });
  }, [updateMutation, userId, userStore]);

  React.useEffect(() => {
    setContent?.(
      <div className="flex items-center justify-end gap-2 px-4 py-2">
        <Button variant="secondary" onClick={handleReset} disabled={isPending}>
          <Repeat2 /> {tCommon("commands.reset")}
        </Button>
        <Button onClick={handleSubmit} disabled={isPending}>
          <Save /> {tCommon("commands.save")}
        </Button>
      </div>,
    );
    return () => setContent?.(null);
  }, [handleReset, handleSubmit, isPending, setContent, tCommon]);

  return (
    <div className={cn("flex flex-col flex-1 gap-2", className)}>
      {isFetchRolesPending || isFetchUserPending ? (
        <Spinner />
      ) : (
        <div className="my-4 flex flex-1 flex-col">
          <FormBuilder structure={userUpdateFormStructure} />
        </div>
      )}
    </div>
  );
};
