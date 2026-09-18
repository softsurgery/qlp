import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { componentsResources, excelEditorResources, componentsGlobalResources } from "@qlp/components/i18n";
import { datatableResources } from "@qlp/datatable-builder/i18n";
import { formBuilderResources } from "@qlp/form-builder/i18n";
import { uiResources } from "@qlp/ui/i18n";
import { 
  curriculumCommonResources,
  curriculumLessonResources,
  curriculumModuleResources,
  curriculumMaterialResources 
} from "@qlp/curriculum/i18n";
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
        components: componentsResources.en,
        "excel-editor": excelEditorResources.en,
        "curriculum-common": curriculumCommonResources.en,
        "curriculum-lesson": curriculumLessonResources.en,
        "curriculum-module": curriculumModuleResources.en,
        "curriculum-material": curriculumMaterialResources.en,
        global: componentsGlobalResources.en,
      },
      ar: {
        translation: translationAr,
        common: uiResources.ar,
        datatable: datatableResources.ar,
        "form-builder": formBuilderResources.ar,
        components: componentsResources.ar,
        "excel-editor": excelEditorResources.ar,
        "curriculum-common": curriculumCommonResources.ar,
        "curriculum-lesson": curriculumLessonResources.ar,
        "curriculum-module": curriculumModuleResources.ar,
        "curriculum-material": curriculumMaterialResources.ar,
        global: componentsGlobalResources.ar,
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
