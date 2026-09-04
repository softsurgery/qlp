import type { AxiosInstance } from "axios";

export function createAuthResource(http: AxiosInstance) {
  return {
    login: (email: string, password: string) =>
      http.post("/auth/login", { email, password }),
    register: (data: Record<string, string>) =>
      http.post("/auth/register", data),
  };
}

export type AuthResource = ReturnType<typeof createAuthResource>;
