import { useParams } from "react-router-dom";
import { UserUpdateForm } from "@/components/user-management/users/forms/UserUpdateForm";

export default function UserEditPage() {
  const { userId } = useParams();
  return <UserUpdateForm userId={userId} />;
}
