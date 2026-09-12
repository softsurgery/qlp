import { useParams, useSearchParams } from "react-router-dom";
import { CurriculumViewer } from "@qlp/curriculum";

export default function CurriculumViewPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const versionParam = params.get("version");
  const version = versionParam ? Number(versionParam) : undefined;
  if (!id) return null;
  return (
    <CurriculumViewer
      curriculumId={id}
      version={Number.isFinite(version) ? version : undefined}
      revealAnswers
    />
  );
}
