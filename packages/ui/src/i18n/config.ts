export const supportedLngs = ["en", "ar"] as const;

export type SupportedLng = (typeof supportedLngs)[number];

export const i18nConfig = {
  defaultLng: "en",
  fallbackLng: "en",
  supportedLngs,
  namespace: "common",
} as const;
