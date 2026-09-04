import { create } from 'zustand';
import { useAuthPersistStore } from '@qlp/hooks';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: JSON.parse(localStorage.getItem('admin_user') || 'null'),
  setUser: (user) => {
    if (user) localStorage.setItem('admin_user', JSON.stringify(user));
    else localStorage.removeItem('admin_user');
    set({ user });
  },
  logout: () => {
    useAuthPersistStore.getState().logout();
    localStorage.removeItem('admin_user');
    set({ user: null });
  },
  isAuthenticated: () => !!get().user && useAuthPersistStore.getState().isAuthenticated,
  isAdmin: () => get().user?.role === 'admin',
}));
