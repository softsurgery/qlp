export const supportedLngs = ["en", "ar"] as const;

export type SupportedLng = (typeof supportedLngs)[number];

export const i18nConfig = {
  lng: "en",
  fallbackLng: "en",
  supportedLngs,
  defaultNS: "common",
  ns: ["common", "user-management", "role"],
  interpolation: { escapeValue: false },
} as const;
