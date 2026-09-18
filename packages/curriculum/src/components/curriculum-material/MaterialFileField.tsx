import React from "react";
import { File, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useApp } from "@qlp/contexts";
import { useUploadSrc } from "@qlp/hooks";
import { Button, Progress, cn } from "@qlp/ui";
import type { Upload as UploadModel } from "@qlp/api-client";

interface MaterialFileFieldProps {
  storageId?: number;
  storage?: UploadModel;
  disabled?: boolean;
  onUploaded: (payload: { storageId: number; filename: string }) => void;
}

export function MaterialFileField({
  storageId,
  storage,
  disabled,
  onUploaded,
}: MaterialFileFieldProps) {
  const { t } = useTranslation("curriculum");
  const { t: tCommon } = useTranslation("common");
  const { api } = useApp();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [progress, setProgress] = React.useState<number | null>(null);

  const { data: remoteSrc } = useUploadSrc(
    api.upload && storageId ? { id: storageId } : null,
    api.upload,
  );

  const uploadFile = async (file: File) => {
    if (!api.upload) return;
    setProgress(0);
    try {
      const uploads = await api.upload.uploadFiles(
        [file],
        (percent) => setProgress(percent),
        false,
      );
      const upload = uploads[0];
      if (upload) {
        onUploaded({ storageId: upload.id, filename: file.name });
      }
    } catch {
      toast.error(tCommon("errors.saveFailed", "Failed to upload file"));
    } finally {
      setProgress(null);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="flex flex-col gap-3">
      {remoteSrc ? (
        <div className="flex items-center gap-3 p-3 rounded-md border bg-muted/30">
          <File className="size-8 text-muted-foreground shrink-0" />
          <div className="flex flex-col min-w-0 flex-1">
            <a
              href={remoteSrc}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-primary hover:underline truncate"
            >
              {storage?.filename || t("downloadFile", "Download file")}
            </a>
            {storage?.size && (
              <span className="text-xs text-muted-foreground mt-0.5">
                {formatSize(storage.size)}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-md border border-dashed bg-muted/30 text-sm text-muted-foreground h-16">
          {t("noFile", "No file uploaded")}
        </div>
      )}

      {typeof progress === "number" ? (
        <div>
          <Progress value={progress} />
          <span className="mt-1 block text-xs text-muted-foreground">
            {progress}%
          </span>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          disabled={disabled}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void uploadFile(file);
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || progress !== null}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="size-4" />
          {remoteSrc
            ? t("replaceFile", "Replace file")
            : t("uploadFile", "Upload file")}
        </Button>
      </div>
    </div>
  );
}
