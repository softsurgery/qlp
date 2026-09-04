import { createApiClient } from '@qlp/api-client';
import { useAuthPersistStore } from '@qlp/hooks';

const api = createApiClient({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  refreshPath: '/client-auth/refresh-token',
  onUnauthorized: () => {
    useAuthPersistStore.getState().logout();
    window.location.href = '/auth';
  },
});

export const authApi = api.auth;
export const curriculumApi = api.curriculum;
export const progressApi = api.progress;
export const tutorApi = api.tutors;
export const bookingApi = api.bookings;
export const chatApi = api.chat;
export const profileApi = api.profiles;
export const userApi = api.users;
export const achievementApi = api.achievements;
export const parentApi = api.parent;

export default api.http;
