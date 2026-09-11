import React from "react";
import { type CurriculumResource } from "@qlp/api-client";
import { useQuery } from "@tanstack/react-query";
import { UpdateCurriculumForm } from "./forms/UpdateCurriculumForm";
import { Loader2 } from "lucide-react";
import { type UploadSrcApi } from "@qlp/hooks";

interface CurriculumEditorProps {
  api: CurriculumResource;
  uploadApi?: UploadSrcApi;
  basePath: string;
  curriculumId: string;
}

export function CurriculumEditor({
  api,
  uploadApi,
  basePath,
  curriculumId,
}: CurriculumEditorProps) {
  const {
    data: curriculum,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["curriculum", curriculumId],
    queryFn: () => api.findById(curriculumId),
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !curriculum) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-destructive">Failed to load curriculum</p>
      </div>
    );
  }

  return (
    <UpdateCurriculumForm
      api={api}
      uploadApi={uploadApi}
      basePath={basePath}
      curriculum={curriculum}
    />
  );
}
