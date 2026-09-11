import { api } from "@/lib/api";
import { CurriculumCreator } from "@qlp/curriculum";
import { useAuthUser } from "@/hooks/content/useAuth";

export default function CurriculumCreatePage() {
  const { data: user } = useAuthUser();

  return <CurriculumCreator api={api.adminCurriculum} uploadApi={api.upload} basePath="/curriculum" user={user} />;
}

