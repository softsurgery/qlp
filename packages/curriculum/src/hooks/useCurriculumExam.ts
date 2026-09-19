import { useCurriculumExams } from "./useCurriculumExams";

export interface UseCurriculumExamProps {
  moduleId?: string;
  examId?: string;
  join?: string;
  enabled?: boolean;
}

export const useCurriculumExam = (
  { moduleId, examId, join, enabled = true }: UseCurriculumExamProps = {
    enabled: true,
  },
) => {
  const { exams, isExamsPending, refetchExams } = useCurriculumExams({
    moduleId,
    join,
    enabled: !!moduleId && enabled,
  });

  const exam = exams.find((item) => item.id === examId) ?? null;

  return {
    exam,
    isExamPending: isExamsPending,
    refetchExam: refetchExams,
  };
};
