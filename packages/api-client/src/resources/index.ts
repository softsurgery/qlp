import type { AxiosInstance } from "axios";
import { createAdminAuthResource } from "./admin-auth.js";
import { createAuthResource } from "./auth.js";

export function createResources(http: AxiosInstance) {
  return {
    auth: createAuthResource(http),
    adminAuth: createAdminAuthResource(http),
  };
}

export type ApiResources = ReturnType<typeof createResources>;
