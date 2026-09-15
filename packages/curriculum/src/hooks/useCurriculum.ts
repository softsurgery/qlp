import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useApp } from "@qlp/contexts";

export interface UseCurriculumProps {
  id?: string;
  version?: number;
  join?: string;
  enabled?: boolean;
}

export const useCurriculum = (
  { id, version, join, enabled = true }: UseCurriculumProps = { enabled: true },
) => {
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin" ? baseApi.adminCurriculum : baseApi.curriculum;

  const {
    data: curriculumResp,
    isPending: isCurriculumPending,
    isError: isCurriculumError,
    refetch: refetchCurriculum,
  } = useQuery({
    queryKey: ["curriculum", id, version ?? "latest", join],
    queryFn: () =>
      version != null
        ? api.findByVersion(id!, version, { join })
        : api.findById(id!, { join }),
    enabled: !!id && enabled,
  });

  const curriculum = React.useMemo(() => {
    if (!curriculumResp) return null;
    return curriculumResp;
  }, [curriculumResp]);

  return {
    curriculum,
    isCurriculumPending,
    isCurriculumError,
    refetchCurriculum,
  };
};
