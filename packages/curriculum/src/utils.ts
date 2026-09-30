import type { ServerErrorResponse } from "@qlp/api-client";

export function errorMessage(error: ServerErrorResponse, fallback: string) {
  const message = error.response?.data?.message;
  return Array.isArray(message) ? message.join(", ") : message || fallback;
}
