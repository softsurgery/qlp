import { create } from 'zustand';
import { isAdminUser, type AuthUser } from '@qlp/api-client';
import { useAuthPersistStore } from '@qlp/hooks';

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
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
  isAdmin: () => isAdminUser(get().user),
}));
