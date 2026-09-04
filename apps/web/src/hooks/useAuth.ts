import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthPersistStore } from "@qlp/hooks";
import type {
  RequestClientSignInDto,
  RequestClientSignUpDto,
} from "@qlp/api-client";
import {
  AUTH_USER_QUERY_KEY,
  authApi,
  clearSession,
  readStoredUser,
  writeStoredUser,
  type AuthUser,
  type ClientSignInResult,
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
    mutationFn: async (dto: RequestClientSignInDto) => {
      const data = (await authApi.signIn(dto)) as ClientSignInResult;
      if (!data.user) {
        clearSession();
        throw new Error("No user returned");
      }
      writeStoredUser(data.user);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_USER_QUERY_KEY, data.user as AuthUser);
    },
  });
}

export function useSignUp() {
  return useMutation({
    mutationFn: async (dto: RequestClientSignUpDto) => {
      const result = await authApi.signUp(dto);
      try {
        await authApi.sendVerifyEmail(dto.email);
      } catch {
        // Account is created even if the verification email fails to send.
      }
      return result;
    },
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

export function useAuthSession() {
  const isReady = useAuthPersistStore((s) => s.isReady);
  const isAuthed = useAuthPersistStore((s) => s.isAuthenticated);
  const { data: user } = useAuthUser();
  return { isReady, isAuthed, user };
}
