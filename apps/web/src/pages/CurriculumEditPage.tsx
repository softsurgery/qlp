import { useParams } from "react-router-dom";
import { CurriculumEditor } from "@qlp/curriculum";
import { api } from "@/lib/api";

export default function CurriculumEditPage() {
  const { id } = useParams();
  if (!id) return null;
  return <CurriculumEditor api={api.curriculum} uploadApi={api.upload} basePath="/curriculum" curriculumId={id} />;
}
