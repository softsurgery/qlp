import type { ServerErrorResponse } from "@qlp/api-client";

export function errorMessage(error: ServerErrorResponse, fallback: string) {
  const message = error.response?.data?.message;
  return Array.isArray(message) ? message.join(", ") : message || fallback;
}

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
