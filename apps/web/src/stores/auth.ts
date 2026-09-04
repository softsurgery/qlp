import { create } from "zustand";
import type { AuthUser } from "@qlp/api-client";
import { useAuthPersistStore } from "@qlp/hooks";

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  setUser: (user) => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
    set({ user });
  },
  logout: () => {
    useAuthPersistStore.getState().logout();
    localStorage.removeItem("user");
    set({ user: null });
  },
  isAuthenticated: () =>
    !!get().user && useAuthPersistStore.getState().isAuthenticated,
}));
