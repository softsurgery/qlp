import { i18nConfig } from "./config";
import ar from "./locales/ar.json";
import en from "./locales/en.json";

export { i18nConfig };

export const uiResources = { en, ar };

export function mergeLocaleResources(
  ...sources: Array<Record<string, unknown>>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      const current = result[key];
      if (isRecord(current) && isRecord(value)) {
        result[key] = mergeLocaleResources(current, value);
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
