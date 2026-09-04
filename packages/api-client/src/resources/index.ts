import type { AxiosInstance } from "axios";
import { createAuthResource } from "./auth.js";

export function createResources(http: AxiosInstance) {
  return {
    auth: createAuthResource(http),
  };
}

export type ApiResources = ReturnType<typeof createResources>;
