import type { VersionedEntity } from "../utils/database-entity.js";
import type { ResponseUserDto } from "../user-managemnt.js";
import type { ResponseWorkflowDto } from "../utils/workflow.js";
import type { ResponseCurriculumModuleDto } from "./module.js";

export enum CurriculumStatus {
  Draft = "draft",
  Published = "published",
  Archived = "archived",
}

export interface ResponseCurriculumDto extends VersionedEntity {
  slug: string;
  title: string;
  description?: string;
  status: CurriculumStatus | string;
  ownerId?: string;
  owner?: ResponseUserDto;
  createdById?: string;
  createdBy?: ResponseUserDto;
  modules?: ResponseCurriculumModuleDto[];
}

export interface ResponseCurriculumWorkflowDto extends ResponseWorkflowDto {
  curriculum: ResponseCurriculumDto;
}

export interface ExecuteCurriculumWorkflowDto {
  event: string;
}

export interface CreateCurriculumDto {
  title: string;
  slug?: string;
  description?: string;
  status?: CurriculumStatus | string;
  ownerId?: string;
  createdById?: string;
}

export interface UpdateCurriculumDto {
  title?: string;
  slug?: string;
  description?: string;
  status?: CurriculumStatus | string;
  ownerId?: string;
  createdById?: string;
}
