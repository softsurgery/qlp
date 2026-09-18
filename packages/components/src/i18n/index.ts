import ar from "./locales/ar.json";
import en from "./locales/en.json";
import globalAr from "./locales/global-ar.json";
import globalEn from "./locales/global-en.json";

export { i18nConfig, resolveSupportedLng } from "./config";
export type { SupportedLng } from "./config";
export { excelEditorResources } from "../shared/excel-editor/i18n";

export const componentsResources = { en, ar };
export const componentsGlobalResources = { en: globalEn, ar: globalAr };
