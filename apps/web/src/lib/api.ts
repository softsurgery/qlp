import {
  createApiClient,
  type ResponseClientSigninDto,
  type ResponseUserDto,
} from "@qlp/api-client";
import { useAuthPersistStore } from "@qlp/hooks";

export const AUTH_USER_STORAGE_KEY = "user";
export const AUTH_USER_QUERY_KEY = ["auth", "user"] as const;

export type AuthUser = ResponseUserDto & {
  role?: { id: string; label: string };
  roleId?: string;
};

export type ClientSignInResult = ResponseClientSigninDto & {
  user?: AuthUser;
};

export function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function writeStoredUser(user: AuthUser | null) {
  if (user) localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(AUTH_USER_STORAGE_KEY);
}

export function hasRole(user: AuthUser | null | undefined, label: string) {
  return user?.role?.label?.toLowerCase() === label.toLowerCase();
}

function clearSession() {
  useAuthPersistStore.getState().logout();
  writeStoredUser(null);
}

const api = createApiClient({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  refreshPath: "/client-auth/refresh-token",
  onUnauthorized: () => {
    clearSession();
    window.location.href = "/auth";
  },
});

export const authApi = api.auth;
export { clearSession };
export default api.http;
