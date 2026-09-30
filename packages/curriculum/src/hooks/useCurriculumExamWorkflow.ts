import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useApp } from "@qlp/contexts";

export interface UseCurriculumExamWorkflowProps {
  examId?: string;
  join?: string;
  enabled?: boolean;
}

export const useCurriculumExamWorkflow = ({
  examId,
  join,
  enabled = true,
}: UseCurriculumExamWorkflowProps = { enabled: true }) => {
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin"
      ? baseApi.adminCurriculumExams
      : baseApi.curriculumExams;

  const {
    data: workflowResp,
    isPending: isWorkflowPending,
    refetch: refetchWorkflow,
  } = useQuery({
    queryKey: ["curriculum", "exams", examId, "workflow", join],
    queryFn: () => api.workflow.findWorkflow(examId!, { join }),
    enabled: !!examId && enabled,
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
