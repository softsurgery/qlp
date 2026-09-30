import { ExamQuestionType } from '../enums/exam-question-type.enum';

export interface ExamQuestion {
  id: string;
  prompt: string;
  type: ExamQuestionType;
  options?: string[];
  answer?: string;
  points: number;
  min?: number;
  max?: number;
  step?: number;
}
