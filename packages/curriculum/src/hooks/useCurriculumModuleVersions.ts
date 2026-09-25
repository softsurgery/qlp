import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { useApp } from "@qlp/contexts";

export interface UseCurriculumModuleVersionsProps {
  moduleId?: string;
  join?: string;
  enabled?: boolean;
}

export const useCurriculumModuleVersions = ({ moduleId, join, enabled = true }: UseCurriculumModuleVersionsProps = { enabled: true }) => {
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin"
      ? baseApi.adminCurriculumModules
      : baseApi.curriculumModules;

  const {
    data: versionsResp,
    isPending: isVersionsPending,
    refetch: refetchVersions
  } = useQuery({
    queryKey: ["curriculum", "modules", moduleId, "versions", join],
    queryFn: () => api.findVersions(moduleId!, { join }),
    enabled: !!moduleId && enabled,
  });

  const versions = React.useMemo(() => {
    if (!versionsResp) return [];
    return versionsResp;
  }, [versionsResp]);

  return {
    versions,
    isVersionsPending,
    refetchVersions
  };
};
