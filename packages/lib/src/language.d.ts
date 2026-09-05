import type { Locale as DateFnsLocale } from "date-fns";
export type LocaleCode = string;
export declare const SUPPORTED_LOCALES: string[];
export declare const getLocaleFromEnv: () => string;
export declare const getDateFnsLocale: (localeCode?: LocaleCode) => DateFnsLocale;
