import { MeetingsManager } from "@qlp/meetings";
import { api } from "@/lib/api";
import { useAuthUser } from "@/hooks/content/useAuth";

export default function MeetingsPage() {
  const { data: user } = useAuthUser();
  if (!user?.id) return null;

  return (
    <MeetingsManager
      className="min-h-0 flex-1"
      api={api.meetings}
      userApi={api.user}
      currentUserId={user.id}
      joinBasePath={`${import.meta.env.VITE_WEB_APP_URL ?? "http://localhost:5173"}/video`}
      isAdmin
    />
  );
}
