import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { datatableResources } from "@qlp/datatable-builder/i18n";
import { formBuilderResources } from "@qlp/form-builder/i18n";
import { mergeLocaleResources, uiResources } from "@qlp/ui/i18n";
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
        common: mergeLocaleResources(
          uiResources.en,
          datatableResources.en,
          formBuilderResources.en,
        ),
      },
      ar: {
        translation: translationAr,
        common: mergeLocaleResources(
          uiResources.ar,
          datatableResources.ar,
          formBuilderResources.ar,
        ),
      },
    },
  });

i18n.on("languageChanged", (lng) => {
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lng;
});

if (i18n.language === "ar") {
  document.documentElement.dir = "rtl";
}

export default i18n;
