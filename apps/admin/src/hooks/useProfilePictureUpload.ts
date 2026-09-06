import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { ServerErrorResponse, Upload } from "@qlp/api-client";
import { api } from "@/lib/api";
import type { UserStore } from "@/hooks/stores/useUserStore";

interface UseProfilePictureUploadProps {
  userStore: UserStore;
  mode: "create" | "update";
}

export function useProfilePictureUpload({
  userStore,
  mode,
}: UseProfilePictureUploadProps) {
  const { t } = useTranslation("user-management");

  return useMutation({
    mutationFn: ({
      files,
      onProgress,
    }: {
      files: File[];
      onProgress: (progress: number) => void;
    }) => api.upload.uploadFiles(files, onProgress, true),
    onSuccess: (uploads: Upload[]) => {
      const upload = uploads[0];
      if (!upload) return;
      userStore.set("picture", upload);
      userStore.set("progress", 100);
      if (mode === "create") {
        userStore.setNested("createDto.pictureId", upload.id);
        userStore.setNested("createDtoErrors.pictureId", []);
      } else {
        userStore.setNested("updateDto.pictureId", upload.id);
        userStore.setNested("updateDtoErrors.pictureId", []);
      }
    },
    onError: (error: ServerErrorResponse) => {
      userStore.set("progress", 0);
      toast.error(
        error.response?.data?.message || t("userManagement.errors.generalError"),
      );
    },
  });
}

export function resolveUploadImageUrl(image: {
  slug?: string;
  id?: number;
}) {
  if (image.slug) return api.upload.getUploadBySlug(image.slug);
  if (image.id) return api.upload.getUploadById(image.id);
  return "";
}
