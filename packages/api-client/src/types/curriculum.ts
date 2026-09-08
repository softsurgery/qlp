import type { DatabaseEntity } from "./utils/database-entity.js";

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

export interface VersionedEntity extends DatabaseEntity {
  id: string;
  version: number;
  isLatest: boolean;
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
}

export interface ResponseCurriculumExamDto extends VersionedEntity {
  moduleId: string;
  title: string;
  description?: string;
  durationMinutes?: number;
  passingScore: number;
  questions: ExamQuestion[];
  sortOrder: number;
}

export interface ResponseCurriculumModuleDto extends VersionedEntity {
  curriculumId: string;
  title: string;
  description?: string;
  sortOrder: number;
  lessons?: ResponseCurriculumLessonDto[];
  exams?: ResponseCurriculumExamDto[];
}

export interface ResponseCurriculumTreeDto extends ResponseCurriculumDto {
  modules: ResponseCurriculumModuleDto[];
}

export interface CreateCurriculumDto {
  title: string;
  slug?: string;
  description?: string;
  status?: CurriculumStatus | string;
}

export interface UpdateCurriculumDto {
  title?: string;
  slug?: string;
  description?: string;
  status?: CurriculumStatus | string;
}

export interface CreateCurriculumModuleDto {
  title: string;
  description?: string;
  sortOrder?: number;
}

export interface UpdateCurriculumModuleDto {
  title?: string;
  description?: string;
  sortOrder?: number;
}

export interface CreateCurriculumLessonDto {
  title: string;
  description?: string;
  sortOrder?: number;
}

export interface UpdateCurriculumLessonDto {
  title?: string;
  description?: string;
  sortOrder?: number;
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
}

export interface UpdateCurriculumExamDto {
  title?: string;
  description?: string;
  durationMinutes?: number;
  passingScore?: number;
  questions?: ExamQuestion[];
  sortOrder?: number;
}
