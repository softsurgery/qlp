import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { componentsResources } from "@qlp/components/i18n";
import { datatableResources } from "@qlp/datatable-builder/i18n";
import { formBuilderResources } from "@qlp/form-builder/i18n";
import { uiResources } from "@qlp/ui/i18n";
import { curriculumResources } from "@qlp/curriculum/i18n";
import { i18nConfig } from "./config";
import authAr from "./locales/ar/auth.json";
import roleAr from "./locales/ar/role.json";
import userManagementAr from "./locales/ar/user-management.json";
import authEn from "./locales/en/auth.json";
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
        common: uiResources.en,
        datatable: datatableResources.en,
        "form-builder": formBuilderResources.en,
        components: componentsResources.en,
        curriculum: curriculumResources.en,
        "user-management": userManagementEn,
        role: roleEn,
        auth: authEn,
      },
      ar: {
        common: uiResources.ar,
        datatable: datatableResources.ar,
        "form-builder": formBuilderResources.ar,
        components: componentsResources.ar,
        curriculum: curriculumResources.ar,
        "user-management": userManagementAr,
        role: roleAr,
        auth: authAr,
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
