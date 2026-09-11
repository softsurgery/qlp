import React from "react";
import { type CurriculumResource, type ResponseUserDto } from "@qlp/api-client";
import { CreateCurriculumForm } from "./forms/CreateCurriculumForm";
import { type UploadSrcApi } from "@qlp/hooks";

interface CurriculumCreatorProps {
  api: CurriculumResource;
  uploadApi?: UploadSrcApi;
  basePath: string;
  user?: ResponseUserDto | null;
}

export function CurriculumCreator({ api, uploadApi, basePath, user }: CurriculumCreatorProps) {
  return <CreateCurriculumForm api={api} uploadApi={uploadApi} basePath={basePath} user={user} />;
}
