import { useParams } from "react-router-dom";
import { UpdateCurriculumForm } from "@qlp/curriculum";

export default function CurriculumEditPage() {
  const { id } = useParams();
  if (!id) return null;
  return <UpdateCurriculumForm curriculumId={id} />;
}
