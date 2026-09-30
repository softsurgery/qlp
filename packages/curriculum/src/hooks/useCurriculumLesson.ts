import { useCurriculumLessons } from "./useCurriculumLessons";

export interface UseCurriculumLessonProps {
  moduleId?: string;
  lessonId?: string;
  join?: string;
  enabled?: boolean;
}

export const useCurriculumLesson = ({
  moduleId,
  lessonId,
  join,
  enabled = true,
}: UseCurriculumLessonProps = { enabled: true }) => {
  const { lessons, isLessonsPending, refetchLessons } = useCurriculumLessons({
    moduleId,
    join,
    enabled: !!moduleId && enabled,
  });

  const lesson = lessons.find((item) => item.id === lessonId) ?? null;

  return {
    lesson,
    isLessonPending: isLessonsPending,
    refetchLesson: refetchLessons,
  };
};
