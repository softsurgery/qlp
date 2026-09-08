import { useParams } from "react-router-dom";
import { CurriculumEditor } from "@qlp/curriculum";
import { api } from "@/lib/api";

export default function CurriculumEditPage() {
  const { id } = useParams();
  if (!id) return null;
  return <CurriculumEditor api={api.adminCurriculum} basePath="/curriculum" curriculumId={id} />;
}
