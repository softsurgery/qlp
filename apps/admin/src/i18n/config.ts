export const supportedLngs = ["en", "ar"] as const;

export type SupportedLng = (typeof supportedLngs)[number];

export const i18nConfig = {
  fallbackLng: "en",
  supportedLngs,
  defaultNS: "common",
  ns: ["common", "components", "user-management", "role"],
  interpolation: { escapeValue: false },
  detection: {
    order: ["localStorage", "navigator"] as string[],
    caches: ["localStorage"] as string[],
  },
};
