import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useApp } from "@qlp/contexts";

export interface UseCurriculumLessonWorkflowProps {
  lessonId?: string;
  join?: string;
  enabled?: boolean;
}

export const useCurriculumLessonWorkflow = ({
  lessonId,
  join,
  enabled = true,
}: UseCurriculumLessonWorkflowProps = { enabled: true }) => {
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin"
      ? baseApi.adminCurriculumLessons
      : baseApi.curriculumLessons;

  const {
    data: workflowResp,
    isPending: isWorkflowPending,
    refetch: refetchWorkflow,
  } = useQuery({
    queryKey: ["curriculum", "lessons", lessonId, "workflow", join],
    queryFn: () => api.workflow.findWorkflow(lessonId!, { join }),
    enabled: !!lessonId && enabled,
  });

  const workflow = React.useMemo(() => {
    if (!workflowResp) return null;
    return workflowResp;
  }, [workflowResp]);

  return {
    workflow,
    isWorkflowPending,
    refetchWorkflow,
  };
};
