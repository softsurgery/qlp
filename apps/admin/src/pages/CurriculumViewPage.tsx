import { useParams, useSearchParams } from "react-router-dom";
import { CurriculumViewer } from "@qlp/curriculum";
import { api } from "@/lib/api";

export default function CurriculumViewPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const versionParam = params.get("version");
  const version = versionParam ? Number(versionParam) : undefined;
  if (!id) return null;
  return (
    <CurriculumViewer
      api={api.adminCurriculum}
      basePath="/curriculum"
      curriculumId={id}
      version={Number.isFinite(version) ? version : undefined}
      revealAnswers
    />
  );
}
