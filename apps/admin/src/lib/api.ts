import { createApiClient } from "@qlp/api-client";
import { useAuthPersistStore } from "@qlp/hooks";

const api = createApiClient({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  refreshPath: "/admin/auth/refresh-token",
  onUnauthorized: () => {
    useAuthPersistStore.getState().logout();
    window.location.href = "/login";
  },
});

export const adminAuthApi = api.adminAuth;

export default api.http;
