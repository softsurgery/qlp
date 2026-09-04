import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthPersistStore } from "@qlp/hooks";
import {
  AUTH_USER_QUERY_KEY,
  adminAuthApi,
  clearSession,
  isAdminUser,
  readStoredUser,
  writeStoredUser,
  type AuthUser,
} from "../lib/api";

export function useAuthUser() {
  return useQuery({
    queryKey: AUTH_USER_QUERY_KEY,
    queryFn: async () => readStoredUser(),
    initialData: readStoredUser,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: { usernameOrEmail: string; password: string }) => {
      const data = await adminAuthApi.signIn(dto);
      if (!isAdminUser(data.user)) {
        clearSession();
        throw new Error("Admin access only");
      }
      writeStoredUser(data.user as AuthUser);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_USER_QUERY_KEY, data.user);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: adminAuthApi.forgotPassword,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    clearSession();
    queryClient.setQueryData(AUTH_USER_QUERY_KEY, null);
    queryClient.removeQueries({ queryKey: AUTH_USER_QUERY_KEY });
  };
}

export function useIsAdminSession() {
  const isReady = useAuthPersistStore((s) => s.isReady);
  const isAuthed = useAuthPersistStore((s) => s.isAuthenticated);
  const { data: user } = useAuthUser();
  return {
    isReady,
    isAuthed,
    user,
    isAdmin: isAdminUser(user),
  };
}
