import React from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useApp } from "@qlp/contexts";
import { useCurriculumLessons } from "./useCurriculumLessons";

export interface UseCurriculumModuleLessonMaterialsProps {
  moduleId?: string;
  join?: string;
  enabled?: boolean;
}

export function useCurriculumModuleLessonMaterials({
  moduleId,
  join,
  enabled = true,
}: UseCurriculumModuleLessonMaterialsProps = {}) {
  const queryClient = useQueryClient();
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin"
      ? baseApi.adminCurriculumLessons
      : baseApi.curriculumLessons;

  const { lessons, isLessonsPending, refetchLessons } = useCurriculumLessons({
    moduleId,
    join,
    enabled,
  });

  const materialsQueries = useQueries({
    queries: lessons.map((lesson) => ({
      queryKey: ["curriculum-lesson-materials", lesson.id],
      queryFn: () => api.findMaterials(lesson.id),
      enabled: !!lesson.id && enabled && !isLessonsPending,
    })),
  });

  const lessonsWithMaterials = React.useMemo(
    () =>
      lessons.map((lesson, index) => ({
        ...lesson,
        materials: materialsQueries[index]?.data ?? [],
      })),
    [lessons, materialsQueries],
  );

  const isMaterialsPending =
    lessons.length > 0 && materialsQueries.some((query) => query.isPending);

  const refetchMaterials = React.useCallback(async () => {
    await Promise.all(
      lessons.map((lesson) =>
        queryClient.invalidateQueries({
          queryKey: ["curriculum-lesson-materials", lesson.id],
        }),
      ),
    );
  }, [lessons, queryClient]);

  return {
    lessons: lessonsWithMaterials,
    isLessonsPending,
    isMaterialsPending,
    isPending: isLessonsPending || isMaterialsPending,
    refetchLessons,
    refetchMaterials,
  };
}
