import { createApiClient } from '@qlp/api-client';
import { useAuthPersistStore } from '@qlp/hooks';

const api = createApiClient({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  refreshPath: '/auth/refresh-token',
  onUnauthorized: () => {
    useAuthPersistStore.getState().logout();
    window.location.href = '/login';
  },
});

export const authApi = api.auth;
export const adminApi = api.admin;

export default api.http;
