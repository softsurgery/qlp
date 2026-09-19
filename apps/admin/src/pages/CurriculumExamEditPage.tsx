import { useParams } from "react-router-dom";
import { UpdateCurriculumExamForm } from "@qlp/curriculum";

export default function CurriculumExamEditPage() {
  const { id: curriculumId, moduleId, examId } = useParams();

  if (!curriculumId || !moduleId || !examId) return null;

  return (
    <UpdateCurriculumExamForm
      className="p-6 h-full"
      curriculumId={curriculumId}
      moduleId={moduleId}
      examId={examId}
    />
  );
}
