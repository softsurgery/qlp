import { useQuery } from "@tanstack/react-query";
import { useApp } from "@qlp/contexts";

export interface UseCurriculumLessonsProps {
  curriculumId?: string;
  moduleId?: string;
  join?: string;
  enabled?: boolean;
}

export const useCurriculumLessons = (
  { moduleId, join, enabled = true }: UseCurriculumLessonsProps = {
    enabled: true,
  },
) => {
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin"
      ? baseApi.adminCurriculumLessons
      : baseApi.curriculumLessons;

  const {
    data: lessons,
    isPending: isLessonsPending,
    refetch: refetchLessons,
  } = useQuery({
    queryKey: ["curriculum-lessons", moduleId, join],
    queryFn: () => api.findByModule(moduleId!, { join }),
    enabled: !!moduleId && enabled,
  });

  return {
    lessons: lessons || [],
    isLessonsPending,
    refetchLessons,
  };
};
