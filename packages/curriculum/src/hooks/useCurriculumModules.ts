import { useCurriculum } from "./useCurriculum";

export interface UseCurriculumModulesProps {
  id?: string;
  join?: string;
  enabled?: boolean;
}

export const useCurriculumModules = ({ id, join, enabled = true }: UseCurriculumModulesProps = { enabled: true }) => {
  const { curriculum, isCurriculumPending, refetchCurriculum } = useCurriculum({ id, join, enabled });

  return {
    modules: curriculum?.modules || [],
    isModulesPending: isCurriculumPending,
    refetchModules: refetchCurriculum
  };
};
