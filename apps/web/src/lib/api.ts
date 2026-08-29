import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  },
);

export default api;

export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (data: Record<string, string>) => api.post('/auth/register', data),
};

export const curriculumApi = {
  getTracks: () => api.get('/curriculum/tracks'),
  getTrack: (slug: string) => api.get(`/curriculum/tracks/${slug}`),
  getLesson: (id: string) => api.get(`/curriculum/lessons/${id}`),
};

export const progressApi = {
  getMyProgress: (userId?: string) => api.get('/progress/me', { params: { userId } }),
  completeLesson: (lessonId: string) => api.post(`/progress/lessons/${lessonId}/complete`),
};

export const tutorApi = {
  getAll: (params?: Record<string, string>) => api.get('/tutors', { params }),
  getOne: (id: string) => api.get(`/tutors/${id}`),
  apply: (data: Record<string, unknown>) => api.post('/tutors/apply', data),
};

export const bookingApi = {
  getMine: () => api.get('/bookings/me'),
  create: (data: Record<string, string>) => api.post('/bookings', data),
  confirm: (id: string) => api.patch(`/bookings/${id}/confirm`),
  cancel: (id: string) => api.patch(`/bookings/${id}/cancel`),
  start: (id: string) => api.post(`/bookings/${id}/start`),
  complete: (id: string) => api.post(`/bookings/${id}/complete`),
};

export const chatApi = {
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (id: string) => api.get(`/chat/conversations/${id}/messages`),
  sendMessage: (id: string, content: string) => api.post(`/chat/conversations/${id}/messages`, { content }),
  createConversation: (participantId: string) => api.post('/chat/conversations', { participantId }),
};

export const profileApi = {
  getMe: () => api.get('/profiles/me'),
  updateMe: (data: Record<string, unknown>) => api.patch('/profiles/me', data),
};

export const userApi = {
  getMe: () => api.get('/users/me'),
  updateMe: (data: Record<string, unknown>) => api.patch('/users/me', data),
};

export const achievementApi = {
  getMine: () => api.get('/achievements/me'),
  getAll: () => api.get('/achievements'),
};

export const parentApi = {
  getChildren: () => api.get('/parent-links/children'),
  createChild: (data: Record<string, string>) => api.post('/parent-links/children', data),
  getChildProgress: (childId: string) => api.get(`/parent-links/children/${childId}/progress`),
};

export const adminApi = {
  getUsers: () => api.get('/admin/users'),
  setUserActive: (id: string, isActive: boolean) => api.patch(`/admin/users/${id}/active`, { isActive }),
  getPendingTutors: () => api.get('/admin/tutors/pending'),
  verifyTutor: (id: string, status: string) => api.patch(`/admin/tutors/${id}/verify`, { status }),
  getCurriculum: () => api.get('/admin/curriculum'),
};
