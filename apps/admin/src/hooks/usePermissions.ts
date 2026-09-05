import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function usePermissions() {
  const { data: permissions = [], isPending: isFetchPermissionsPending } =
    useQuery({
      queryKey: ["permissions", "all"],
      queryFn: () => api.permission.findAll(),
    });

  return { permissions, isFetchPermissionsPending };
}
