import { createAxios, type CreateAxiosConfig } from "./axios.js";
import { createResources } from "./resources/index.js";

export type CreateApiClientConfig = CreateAxiosConfig;

export function createApiClient(config: CreateApiClientConfig) {
  const http = createAxios(config);
  return { http, ...createResources(http) };
}

export { createAxios } from "./axios.js";
export type { CreateAxiosConfig } from "./axios.js";
export { createResources } from "./resources/index.js";
export type { ApiResources } from "./resources/index.js";
export type { AuthResource } from "./resources/auth.js";
export type { AdminAuthResource } from "./resources/admin-auth.js";
export type { UserResource } from "./resources/users.js";
export type { RoleResource } from "./resources/roles.js";
export type { PermissionResource } from "./resources/permission.js";
export type { UploadResource } from "./resources/storage.js";
export * from "./types/index.js";
