import { createApiClient, type ResponseUserDto } from "@qlp/api-client";
import { useAuthPersistStore } from "@qlp/hooks";

export const AUTH_USER_STORAGE_KEY = "admin_user";
export const AUTH_USER_QUERY_KEY = ["auth", "user"] as const;

export type AuthUser = ResponseUserDto & {
  role?: { id: string; label: string };
  roleId?: string;
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

export function isAdminUser(user: AuthUser | null | undefined) {
  return user?.role?.label === "Admin";
}

function clearSession() {
  useAuthPersistStore.getState().logout();
  writeStoredUser(null);
}

const client = createApiClient({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  refreshPath: "/admin/auth/refresh-token",
  onUnauthorized: () => {
    clearSession();
    window.location.href = "/login";
  },
});

export const api = client;
export const adminAuthApi = client.adminAuth;

export { clearSession };
export default client.http;
