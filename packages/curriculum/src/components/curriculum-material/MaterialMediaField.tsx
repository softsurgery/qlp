import React from "react";
import { Mic, Square, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useApp } from "@qlp/contexts";
import { useUploadSrc } from "@qlp/hooks";
import { Button, Progress, Video, cn } from "@qlp/ui";

interface MaterialMediaFieldProps {
  kind: "video" | "audio";
  storageId?: number;
  disabled?: boolean;
  onUploaded: (payload: { storageId: number; filename: string }) => void;
}

function pickRecorderMimeType() {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  return candidates.find((type) => window.MediaRecorder?.isTypeSupported?.(type));
}

export function MaterialMediaField({
  kind,
  storageId,
  disabled,
  onUploaded,
}: MaterialMediaFieldProps) {
  const { t: tMaterial } = useTranslation("curriculum-material");
  const { t: tCommon } = useTranslation("curriculum-common");
  const { api } = useApp();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const recorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const streamRef = React.useRef<MediaStream | null>(null);
  const [progress, setProgress] = React.useState<number | null>(null);
  const [recording, setRecording] = React.useState(false);
  const [localPreview, setLocalPreview] = React.useState<string | null>(null);

  const { data: remoteSrc } = useUploadSrc(
    api.upload && storageId ? { id: storageId } : null,
    api.upload,
  );
  const previewSrc = localPreview || remoteSrc;

  React.useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      recorderRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const uploadFile = async (file: File) => {
    if (!api.upload) return;
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return objectUrl;
    });
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
      toast.error(tCommon("errors.saveFailed"));
    } finally {
      setProgress(null);
    }
  };

  const stopRecording = React.useCallback(() => {
    recorderRef.current?.stop();
    setRecording(false);
  }, []);

  const startRecording = async () => {
    if (disabled || !navigator.mediaDevices?.getUserMedia) {
      toast.error(tMaterial("recordingError"));
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = pickRecorderMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const type = recorder.mimeType || "audio/webm";
        const extension = type.includes("mp4") ? "m4a" : "webm";
        const blob = new Blob(chunksRef.current, { type });
        const file = new File([blob], `recording-${Date.now()}.${extension}`, {
          type,
        });
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        recorderRef.current = null;
        void uploadFile(file);
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      toast.error(tMaterial("recordingError"));
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {previewSrc ? (
        kind === "video" ? (
          <Video src={previewSrc} className="w-full rounded-md" />
        ) : (
          <audio src={previewSrc} controls className="w-full" />
        )
      ) : (
        <div
          className={cn(
            "flex items-center justify-center rounded-md border border-dashed bg-muted/30 text-sm text-muted-foreground",
            kind === "video" ? "h-40" : "h-16",
          )}
        >
          {kind === "video"
            ? tMaterial("noVideo")
            : tMaterial("noAudio")}
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
          accept={kind === "video" ? "video/*" : "audio/*"}
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
          {kind === "video"
            ? previewSrc
              ? tMaterial("replaceVideo")
              : tMaterial("uploadVideo")
            : previewSrc
              ? tMaterial("replaceAudio")
              : tMaterial("uploadAudio")}
        </Button>
        {kind === "audio" ? (
          <Button
            type="button"
            variant={recording ? "destructive" : "outline"}
            size="sm"
            disabled={disabled || progress !== null}
            onClick={() => (recording ? stopRecording() : void startRecording())}
          >
            {recording ? <Square className="size-4" /> : <Mic className="size-4" />}
            {recording
              ? tMaterial("stopRecording")
              : tMaterial("startRecording")}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
