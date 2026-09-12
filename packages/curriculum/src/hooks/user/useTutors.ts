import { useQuery } from "@tanstack/react-query";
import { useApp } from "@qlp/contexts";
import { mapToSelectOptions } from "@qlp/form-builder";
import { identifyUser } from "@qlp/lib";
import React from "react";

export interface useTutorsProps {
  enabled?: boolean;
}

export const useTutors = ({ enabled = true }: useTutorsProps = {}) => {
  const { api, appType } = useApp();
  const userApi = appType === "admin" ? api.adminCurriculum : api.curriculum; // wait, no! userApi is api.user!

  // let's correct this inside the file
  const actualUserApi = api.user;

  const {
    data: usersResp,
    isPending: isTutorsPending,
    refetch: refetchTutors,
  } = useQuery({
    queryKey: ["users", "tutors"],
    queryFn: () => actualUserApi?.findAll(),
    enabled: enabled && !!actualUserApi,
  });

  const tutors = React.useMemo(() => {
    if (!usersResp) return [];
    return usersResp.filter((u) => u.role?.label === "Tutor");
  }, [usersResp]);

  const tutorOptions = React.useMemo(() => {
    return mapToSelectOptions({
      data: tutors,
      labelKey: "id",
      valueKey: "id",
      labelKeyTransformer: (_, u) => identifyUser(u) as string,
    });
  }, [tutors]);

  return {
    tutors,
    tutorOptions,
    isTutorsPending,
    refetchTutors,
  };
};
