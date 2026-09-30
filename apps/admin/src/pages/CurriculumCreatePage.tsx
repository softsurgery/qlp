import { CreateCurriculumForm } from "@qlp/curriculum";
import { useAuthUser } from "@/hooks/content/useAuth";

export default function CurriculumCreatePage() {
  const { data: user } = useAuthUser();

  return <CreateCurriculumForm user={user} />;
}
