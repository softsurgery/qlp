import type { VersionedEntity } from "../utils/database-entity.js";
import type { ResponseUserDto } from "../user-managemnt.js";
import type { ResponseWorkflowDto } from "../utils/workflow.js";
import type { CurriculumStatus } from "./curriculum.js";
import type { ResponseCurriculumLessonDto } from "./lesson.js";
import type { ResponseCurriculumExamDto } from "./exam.js";

export interface ResponseCurriculumModuleDto extends VersionedEntity {
  curriculumId: string;
  title: string;
  description?: string;
  status: CurriculumStatus | string;
  sortOrder: number;
  lessons?: ResponseCurriculumLessonDto[];
  exams?: ResponseCurriculumExamDto[];
  ownerId?: string;
  owner?: ResponseUserDto;
  createdById?: string;
  createdBy?: ResponseUserDto;
}

export interface ResponseCurriculumModuleWorkflowDto extends ResponseWorkflowDto {
  module: ResponseCurriculumModuleDto;
}

export interface CreateCurriculumModuleDto {
  title: string;
  description?: string;
  sortOrder?: number;
  status?: CurriculumStatus | string;
  ownerId?: string;
}

export interface UpdateCurriculumModuleDto {
  title?: string;
  description?: string;
  sortOrder?: number;
  ownerId?: string;
}
