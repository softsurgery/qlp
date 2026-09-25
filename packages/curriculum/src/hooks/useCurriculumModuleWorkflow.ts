import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { useApp } from "@qlp/contexts";

export interface UseCurriculumModuleWorkflowProps {
  moduleId?: string;
  join?: string;
  enabled?: boolean;
}

export const useCurriculumModuleWorkflow = ({ moduleId, join, enabled = true }: UseCurriculumModuleWorkflowProps = { enabled: true }) => {
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin"
      ? baseApi.adminCurriculumModules
      : baseApi.curriculumModules;

  const {
    data: workflowResp,
    isPending: isWorkflowPending,
    refetch: refetchWorkflow
  } = useQuery({
    queryKey: ["curriculum", "modules", moduleId, "workflow", join],
    queryFn: () => api.workflow.findWorkflow(moduleId!, { join }),
    enabled: !!moduleId && enabled,
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
