import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { componentsResources } from "@qlp/components/i18n";
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
        components: componentsResources.en,
      },
      ar: {
        translation: translationAr,
        common: uiResources.ar,
        components: componentsResources.ar,
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
