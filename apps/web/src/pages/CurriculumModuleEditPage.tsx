import { useParams } from "react-router-dom";
import { UpdateCurriculumModuleForm } from "@qlp/curriculum";

export default function CurriculumModuleEditPage() {
  const { id: curriculumId, moduleId } = useParams();

  if (!curriculumId || !moduleId) return null;

  return (
    <UpdateCurriculumModuleForm
      className="p-6 h-full"
      curriculumId={curriculumId}
      moduleId={moduleId}
    />
  );
}
