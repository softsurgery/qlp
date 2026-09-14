import { useParams, useNavigate } from "react-router-dom";
import { UpdateCurriculumModuleForm } from "@qlp/curriculum";

export default function CurriculumModuleEditPage() {
  const { id: curriculumId, moduleId } = useParams();
  const navigate = useNavigate();

  if (!curriculumId || !moduleId) return null;

  return (
    <UpdateCurriculumModuleForm
      className="p-6 h-full"
      curriculumId={curriculumId}
      moduleId={moduleId}
      onSuccess={() => navigate(`/curriculum/${curriculumId}/edit`)}
    />
  );
}
