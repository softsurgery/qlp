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
