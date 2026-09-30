import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useApp } from "@qlp/contexts";

export interface UseCurriculumLessonVersionsProps {
  lessonId?: string;
  join?: string;
  enabled?: boolean;
}

export const useCurriculumLessonVersions = ({
  lessonId,
  join,
  enabled = true,
}: UseCurriculumLessonVersionsProps = { enabled: true }) => {
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin"
      ? baseApi.adminCurriculumLessons
      : baseApi.curriculumLessons;

  const {
    data: versionsResp,
    isPending: isVersionsPending,
    refetch: refetchVersions,
  } = useQuery({
    queryKey: ["curriculum", "lessons", lessonId, "versions", join],
    queryFn: () => api.findVersions(lessonId!, { join }),
    enabled: !!lessonId && enabled,
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
