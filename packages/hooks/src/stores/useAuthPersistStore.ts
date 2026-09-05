import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AuthPersistData {
  accessToken: string;
  refreshToken: string;
  isAuthenticated: boolean;
}

export interface AuthPersistStore extends AuthPersistData {
  isReady: boolean;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  setAuthenticated: (isAuth: boolean) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  logout: () => void;
}

const initialAuth: AuthPersistData = {
  accessToken: "",
  refreshToken: "",
  isAuthenticated: false,
};

export const useAuthPersistStore = create<AuthPersistStore>()(
  persist(
    (set) => ({
      ...initialAuth,
      isReady: false,

      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      setAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),
      setTokens: (accessToken, refreshToken) =>
        set({
          accessToken,
          ...(refreshToken !== undefined ? { refreshToken } : {}),
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          ...initialAuth,
          isReady: true,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

useAuthPersistStore.persist.onFinishHydration(() => {
  useAuthPersistStore.setState({ isReady: true });
});

if (useAuthPersistStore.persist.hasHydrated()) {
  useAuthPersistStore.setState({ isReady: true });
}
