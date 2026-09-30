import { useQuery } from "@tanstack/react-query";
import { useApp } from "@qlp/contexts";

export interface UseCurriculumLessonMaterialsProps {
  lessonId?: string;
  enabled?: boolean;
}

export const useCurriculumLessonMaterials = ({
  lessonId,
  enabled = true,
}: UseCurriculumLessonMaterialsProps = { enabled: true }) => {
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin"
      ? baseApi.adminCurriculumLessons
      : baseApi.curriculumLessons;

  const {
    data: materials,
    isPending: isMaterialsPending,
    refetch: refetchMaterials,
  } = useQuery({
    queryKey: ["curriculum-lesson-materials", lessonId],
    queryFn: () => api.findMaterials(lessonId!),
    enabled: !!lessonId && enabled,
  });

  return {
    materials: materials || [],
    isMaterialsPending,
    refetchMaterials,
  };
};
