import type { VersionedEntity } from "./utils/database-entity.js";
import type { ResponseUserDto } from "./user-managemnt.js";

export enum CurriculumStatus {
  Draft = "draft",
  Published = "published",
  Archived = "archived",
}

export enum MaterialType {
  Video = "video",
  Document = "document",
  Audio = "audio",
  Text = "text",
  Link = "link",
}

export enum ExamQuestionType {
  MultipleChoice = "multiple_choice",
  TrueFalse = "true_false",
  ShortAnswer = "short_answer",
}

export interface ExamQuestion {
  id: string;
  prompt: string;
  type: ExamQuestionType | string;
  options?: string[];
  answer?: string;
  points: number;
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
}

export interface ResponseCurriculumLessonMaterialDto extends VersionedEntity {
  lessonId: string;
  title: string;
  description?: string;
  type: MaterialType | string;
  content?: string;
  storageId?: number;
  sortOrder: number;
}

export interface ResponseCurriculumLessonDto extends VersionedEntity {
  moduleId: string;
  title: string;
  description?: string;
  sortOrder: number;
  materials?: ResponseCurriculumLessonMaterialDto[];
  ownerId?: string;
  owner?: ResponseUserDto;
  createdById?: string;
  createdBy?: ResponseUserDto;
}

export interface ResponseCurriculumExamDto extends VersionedEntity {
  moduleId: string;
  title: string;
  description?: string;
  durationMinutes?: number;
  passingScore: number;
  questions: ExamQuestion[];
  sortOrder: number;
  createdById?: string;
  createdBy?: ResponseUserDto;
}

export interface ResponseCurriculumModuleDto extends VersionedEntity {
  curriculumId: string;
  title: string;
  description?: string;
  sortOrder: number;
  lessons?: ResponseCurriculumLessonDto[];
  exams?: ResponseCurriculumExamDto[];
  ownerId?: string;
  owner?: ResponseUserDto;
  createdById?: string;
  createdBy?: ResponseUserDto;
}

export interface ResponseCurriculumTreeDto extends ResponseCurriculumDto {
  modules: ResponseCurriculumModuleDto[];
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

export interface CreateCurriculumModuleDto {
  title: string;
  description?: string;
  sortOrder?: number;
  ownerId?: string;
  createdById?: string;
}

export interface UpdateCurriculumModuleDto {
  title?: string;
  description?: string;
  sortOrder?: number;
  ownerId?: string;
  createdById?: string;
}

export interface CreateCurriculumLessonDto {
  title: string;
  description?: string;
  sortOrder?: number;
  ownerId?: string;
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

export interface CreateCurriculumExamDto {
  title: string;
  description?: string;
  durationMinutes?: number;
  passingScore?: number;
  questions?: ExamQuestion[];
  sortOrder?: number;
  createdById?: string;
}

export interface UpdateCurriculumExamDto {
  title?: string;
  description?: string;
  durationMinutes?: number;
  passingScore?: number;
  questions?: ExamQuestion[];
  sortOrder?: number;
  createdById?: string;
}
