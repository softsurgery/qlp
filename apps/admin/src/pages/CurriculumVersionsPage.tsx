import { useParams } from "react-router-dom";
import { CurriculumVersionsList } from "@qlp/curriculum";

export default function CurriculumVersionsPage() {
  const { id } = useParams();
  if (!id) return null;
  return <CurriculumVersionsList curriculumId={id} />;
}
