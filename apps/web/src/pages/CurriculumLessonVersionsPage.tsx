import { useParams } from "react-router-dom";
import { CurriculumLessonVersionsList } from "@qlp/curriculum";

export default function CurriculumLessonVersionsPage() {
  const { curriculumId, moduleId, lessonId } = useParams();

  if (!lessonId) return null;

  return (
    <CurriculumLessonVersionsList
      lessonId={lessonId}
      moduleId={moduleId}
      curriculumId={curriculumId}
    />
  );
}
