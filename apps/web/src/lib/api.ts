import { createApiClient } from "@qlp/api-client";
import { useAuthPersistStore } from "@qlp/hooks";

const api = createApiClient({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  refreshPath: "/client-auth/refresh-token",
  onUnauthorized: () => {
    useAuthPersistStore.getState().logout();
    window.location.href = "/auth";
  },
});

export const authApi = api.auth;

export default api.http;
