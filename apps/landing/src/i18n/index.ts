import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { datatableResources } from "@qlp/datatable-builder/i18n";
import { formBuilderResources } from "@qlp/form-builder/i18n";
import { uiResources } from "@qlp/ui/i18n";
import { i18nConfig } from "./config";
import translationAr from "./locales/ar/translation.json";
import translationEn from "./locales/en/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ...i18nConfig,
    interpolation: { escapeValue: false },
    resources: {
      en: {
        translation: translationEn,
        common: uiResources.en,
        datatable: datatableResources.en,
        "form-builder": formBuilderResources.en,
      },
      ar: {
        translation: translationAr,
        common: uiResources.ar,
        datatable: datatableResources.ar,
        "form-builder": formBuilderResources.ar,
      },
    },
  });

i18n.on("languageChanged", (lng) => {
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lng;
});

document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
document.documentElement.lang = i18n.language;

export default i18n;
