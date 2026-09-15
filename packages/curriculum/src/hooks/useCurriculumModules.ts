import { useQuery } from "@tanstack/react-query";
import { useApp } from "@qlp/contexts";

export interface UseCurriculumModulesProps {
  id?: string;
  join?: string;
  enabled?: boolean;
}

export const useCurriculumModules = (
  { id, join, enabled = true }: UseCurriculumModulesProps = { enabled: true },
) => {
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin"
      ? baseApi.adminCurriculumModules
      : baseApi.curriculumModules;

  const {
    data: modules,
    isPending: isModulesPending,
    refetch: refetchModules,
  } = useQuery({
    queryKey: ["curriculum-modules", id, join],
    queryFn: () => api.findByCurriculum(id!, { join }),
    enabled: !!id && enabled,
  });

  return {
    modules: modules || [],
    isModulesPending,
    refetchModules,
  };
};
