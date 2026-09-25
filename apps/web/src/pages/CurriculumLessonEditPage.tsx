import { useParams } from "react-router-dom";
import { UpdateCurriculumLessonForm } from "@qlp/curriculum";

export default function CurriculumLessonEditPage() {
  const { id: curriculumId, moduleId, lessonId } = useParams();

  if (!curriculumId || !moduleId || !lessonId) return null;

  return (
    <UpdateCurriculumLessonForm
      className="p-6 h-full"
      curriculumId={curriculumId}
      moduleId={moduleId}
      lessonId={lessonId}
    />
  );
}
