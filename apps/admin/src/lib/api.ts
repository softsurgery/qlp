import axios from 'axios';

const TOKEN_KEY = 'admin_access_token';
const REFRESH_KEY = 'admin_refresh_token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;

export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
};

export const adminApi = {
  getUsers: () => api.get('/admin/users'),
  setUserActive: (id: string, isActive: boolean) => api.patch(`/admin/users/${id}/active`, { isActive }),
  getPendingTutors: () => api.get('/admin/tutors/pending'),
  verifyTutor: (id: string, status: string) => api.patch(`/admin/tutors/${id}/verify`, { status }),
  getCurriculum: () => api.get('/admin/curriculum'),
};

export { TOKEN_KEY, REFRESH_KEY };
