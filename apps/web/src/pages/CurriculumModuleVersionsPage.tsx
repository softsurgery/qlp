import { useParams } from "react-router-dom";
import { CurriculumModuleVersionsList } from "@qlp/curriculum";

export default function CurriculumModuleVersionsPage() {
  const { curriculumId, moduleId } = useParams();

  if (!moduleId) return null;

  return (
    <CurriculumModuleVersionsList
      moduleId={moduleId}
      curriculumId={curriculumId!}
    />
  );
}
