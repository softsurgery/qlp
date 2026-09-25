import { useParams } from "react-router-dom";
import { CurriculumExamVersionsList } from "@qlp/curriculum";

export default function CurriculumExamVersionsPage() {
  const { curriculumId, moduleId, examId } = useParams();

  if (!examId) return null;

  return (
    <CurriculumExamVersionsList
      examId={examId}
      moduleId={moduleId}
      curriculumId={curriculumId}
    />
  );
}
