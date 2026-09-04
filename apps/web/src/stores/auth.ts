import { create } from 'zustand';
import { useAuthPersistStore } from '@qlp/hooks';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string;
  isChild?: boolean;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  setUser: (user) => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
    set({ user });
  },
  logout: () => {
    useAuthPersistStore.getState().logout();
    localStorage.removeItem('user');
    set({ user: null });
  },
  isAuthenticated: () => !!get().user && useAuthPersistStore.getState().isAuthenticated,
}));
