import type { VersionedEntity } from "../utils/database-entity.js";
import type { ResponseUserDto } from "../user-managemnt.js";
import type { ResponseWorkflowDto } from "../utils/workflow.js";
import type { CurriculumStatus } from "./curriculum.js";

export enum ExamQuestionType {
  MultipleChoice = "multiple_choice",
  SingleChoice = "single_choice",
  Textarea = "textarea",
  Slider = "slider",
}

export interface ExamQuestion {
  id: string;
  prompt: string;
  type: ExamQuestionType | string;
  options?: string[];
  answer?: string;
  points: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface ResponseCurriculumExamDto extends VersionedEntity {
  moduleId: string;
  title: string;
  description?: string;
  status?: CurriculumStatus | string;
  durationMinutes?: number;
  passingScore: number;
  questions: ExamQuestion[];
  sortOrder: number;
  createdById?: string;
  createdBy?: ResponseUserDto;
}

export interface ResponseCurriculumExamWorkflowDto extends ResponseWorkflowDto {
  exam: ResponseCurriculumExamDto;
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
