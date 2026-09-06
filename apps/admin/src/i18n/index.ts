import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { componentsResources } from "@qlp/components/i18n";
import { datatableResources } from "@qlp/datatable-builder/i18n";
import { formBuilderResources } from "@qlp/form-builder/i18n";
import { mergeLocaleResources, uiResources } from "@qlp/ui/i18n";
import { i18nConfig } from "./config";
import roleAr from "./locales/ar/role.json";
import userManagementAr from "./locales/ar/user-management.json";
import roleEn from "./locales/en/role.json";
import userManagementEn from "./locales/en/user-management.json";

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ...i18nConfig,
    interpolation: { escapeValue: false },
    resources: {
      en: {
        common: mergeLocaleResources(
          uiResources.en,
          datatableResources.en,
          formBuilderResources.en,
        ),
        components: componentsResources.en,
        "user-management": userManagementEn,
        role: roleEn,
      },
      ar: {
        common: mergeLocaleResources(
          uiResources.ar,
          datatableResources.ar,
          formBuilderResources.ar,
        ),
        components: componentsResources.ar,
        "user-management": userManagementAr,
        role: roleAr,
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
