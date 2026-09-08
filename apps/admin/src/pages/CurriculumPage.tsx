import { CurriculumList } from "@qlp/curriculum";
import { api } from "@/lib/api";

export default function CurriculumPage() {
  return <CurriculumList api={api.adminCurriculum} basePath="/curriculum" />;
}
