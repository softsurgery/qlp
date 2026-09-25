import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useApp } from "@qlp/contexts";

export interface UseCurriculumExamVersionsProps {
  examId?: string;
  join?: string;
  enabled?: boolean;
}

export const useCurriculumExamVersions = ({
  examId,
  join,
  enabled = true,
}: UseCurriculumExamVersionsProps = { enabled: true }) => {
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin"
      ? baseApi.adminCurriculumExams
      : baseApi.curriculumExams;

  const {
    data: versionsResp,
    isPending: isVersionsPending,
    refetch: refetchVersions,
  } = useQuery({
    queryKey: ["curriculum", "exams", examId, "versions", join],
    queryFn: () => api.findVersions(examId!, { join }),
    enabled: !!examId && enabled,
  });

  const versions = React.useMemo(() => {
    if (!versionsResp) return [];
    return versionsResp;
  }, [versionsResp]);

  return {
    versions,
    isVersionsPending,
    refetchVersions,
  };
};
