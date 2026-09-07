export const supportedLngs = ["en", "ar"] as const;

export type SupportedLng = (typeof supportedLngs)[number];

export const i18nConfig = {
  fallbackLng: "en",
  supportedLngs,
  defaultNS: "translation",
  ns: ["translation", "common", "datatable", "form-builder"],
  interpolation: { escapeValue: false },
  detection: {
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
  },
} as const;

export function resolveSupportedLng(lng?: string): SupportedLng {
  const base = lng?.split("-")[0];
  return supportedLngs.includes(base as SupportedLng)
    ? (base as SupportedLng)
    : i18nConfig.fallbackLng;
}
