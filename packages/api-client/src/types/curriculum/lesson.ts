import type { VersionedEntity } from "../utils/database-entity.js";
import type { ResponseUserDto } from "../user-managemnt.js";
import type { ResponseWorkflowDto } from "../utils/workflow.js";
import type { Upload } from "../upload.js";
import type { CurriculumStatus } from "./curriculum.js";

export enum MaterialType {
  Video = "video",
  Document = "document",
  Audio = "audio",
  Text = "text",
  Link = "link",
  Table = "table",
}

export interface ResponseCurriculumLessonMaterialDto extends VersionedEntity {
  lessonId: string;
  title: string;
  description?: string;
  type: MaterialType | string;
  content?: string;
  storageId?: number;
  storage?: Upload;
  sortOrder: number;
}

export interface ResponseCurriculumLessonDto extends VersionedEntity {
  moduleId: string;
  title: string;
  description?: string;
  status: CurriculumStatus | string;
  sortOrder: number;
  materials?: ResponseCurriculumLessonMaterialDto[];
  ownerId?: string;
  owner?: ResponseUserDto;
  createdById?: string;
  createdBy?: ResponseUserDto;
}

export interface ResponseCurriculumLessonWorkflowDto extends ResponseWorkflowDto {
  lesson: ResponseCurriculumLessonDto;
}

export interface CreateCurriculumLessonDto {
  title: string;
  description?: string;
  sortOrder?: number;
  status?: CurriculumStatus | string;
  createdById?: string;
}

export interface UpdateCurriculumLessonDto {
  title?: string;
  description?: string;
  sortOrder?: number;
  ownerId?: string;
  createdById?: string;
}

export interface CreateCurriculumMaterialDto {
  title: string;
  description?: string;
  type: MaterialType | string;
  content?: string;
  storageId?: number;
  sortOrder?: number;
}

export interface UpdateCurriculumMaterialDto {
  title?: string;
  description?: string;
  type?: MaterialType | string;
  content?: string;
  storageId?: number;
  sortOrder?: number;
}
