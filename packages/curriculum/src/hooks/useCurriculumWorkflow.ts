import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { useApp } from "@qlp/contexts";

export interface UseCurriculumWorkflowProps {
  id?: string;
  join?: string;
  enabled?: boolean;
}

export const useCurriculumWorkflow = ({ id, join, enabled = true }: UseCurriculumWorkflowProps = { enabled: true }) => {
  const { api: baseApi, appType } = useApp();
  const api = appType === "admin" ? baseApi.adminCurriculum : baseApi.curriculum;

  const {
    data: workflowResp,
    isPending: isWorkflowPending,
    refetch: refetchWorkflow
  } = useQuery({
    queryKey: ["curriculum", id, "workflow", join],
    queryFn: () => api.workflow.findWorkflow(id!, { join }),
    enabled: !!id && enabled,
  });

  const workflow = React.useMemo(() => {
    if (!workflowResp) return null;
    return workflowResp;
  }, [workflowResp]);

  return {
    workflow,
    isWorkflowPending,
    refetchWorkflow
  };
};
