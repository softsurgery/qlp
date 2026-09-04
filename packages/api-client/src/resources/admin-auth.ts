import type { AxiosInstance } from "axios";

export function createAdminAuthResource(http: AxiosInstance) {
  return {};
}

export type AdminAuthResource = ReturnType<typeof createAdminAuthResource>;
