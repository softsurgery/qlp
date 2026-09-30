import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useRoles() {
  const { data: roles = [], isPending: isFetchRolesPending } = useQuery({
    queryKey: ["roles", "all"],
    queryFn: () => api.role.findAll(),
  });

  return { roles, isFetchRolesPending };
}
