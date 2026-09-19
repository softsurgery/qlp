import { useQuery } from "@tanstack/react-query";
import { useApp } from "@qlp/contexts";

export interface UseCurriculumExamsProps {
  curriculumId?: string;
  moduleId?: string;
  join?: string;
  enabled?: boolean;
}

export const useCurriculumExams = (
  { moduleId, join, enabled = true }: UseCurriculumExamsProps = {
    enabled: true,
  },
) => {
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin"
      ? baseApi.adminCurriculumExams
      : baseApi.curriculumExams;

  const {
    data: exams,
    isPending: isExamsPending,
    refetch: refetchExams,
  } = useQuery({
    queryKey: ["curriculum-exams", moduleId, join],
    queryFn: () => api.findByModule(moduleId!, { join }),
    enabled: !!moduleId && enabled,
  });

  return {
    exams: exams || [],
    isExamsPending,
    refetchExams,
  };
};
