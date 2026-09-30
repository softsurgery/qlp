// Admin
import adminAuthEn from "./locales/en/admin-auth.json";
import adminRoleEn from "./locales/en/admin-role.json";
import adminUserManagementEn from "./locales/en/admin-user-management.json";
import adminAuthAr from "./locales/ar/admin-auth.json";
import adminRoleAr from "./locales/ar/admin-role.json";
import adminUserManagementAr from "./locales/ar/admin-user-management.json";

// Web & Landing
import webEn from "./locales/en/web.json";
import webAr from "./locales/ar/web.json";
import landingEn from "./locales/en/landing.json";
import landingAr from "./locales/ar/landing.json";

// UI
import uiEn from "./locales/en/ui.json";
import uiAr from "./locales/ar/ui.json";

// Datatable
import datatableEn from "./locales/en/datatable.json";
import datatableAr from "./locales/ar/datatable.json";

// Form Builder
import formBuilderEn from "./locales/en/form-builder.json";
import formBuilderAr from "./locales/ar/form-builder.json";

// Components
import componentsEn from "./locales/en/components.json";
import componentsAr from "./locales/ar/components.json";
import globalEn from "./locales/en/global.json";
import globalAr from "./locales/ar/global.json";
import excelEditorEn from "./locales/en/excel-editor.json";
import excelEditorAr from "./locales/ar/excel-editor.json";

// Curriculum
import curriculumCommonEn from "./locales/en/curriculum-common.json";
import curriculumCommonAr from "./locales/ar/curriculum-common.json";
import curriculumLessonEn from "./locales/en/curriculum-lesson.json";
import curriculumLessonAr from "./locales/ar/curriculum-lesson.json";
import curriculumModuleEn from "./locales/en/curriculum-module.json";
import curriculumModuleAr from "./locales/ar/curriculum-module.json";
import curriculumMaterialEn from "./locales/en/curriculum-material.json";
import curriculumMaterialAr from "./locales/ar/curriculum-material.json";

export const supportedLngs = ["en", "ar"] as const;
export type SupportedLng = (typeof supportedLngs)[number];

export const resolveSupportedLng = (lng: string): SupportedLng =>
  supportedLngs.includes(lng as SupportedLng) ? (lng as SupportedLng) : "en";

export const i18nConfig = {
  supportedLngs,
  fallbackLng: "en",
};

export const resources = {
  en: {
    "admin-auth": adminAuthEn,
    "admin-role": adminRoleEn,
    "admin-user-management": adminUserManagementEn,
    web: webEn,
    landing: landingEn,
    common: uiEn,
    datatable: datatableEn,
    "form-builder": formBuilderEn,
    components: componentsEn,
    global: globalEn,
    "excel-editor": excelEditorEn,
    "curriculum-common": curriculumCommonEn,
    "curriculum-lesson": curriculumLessonEn,
    "curriculum-module": curriculumModuleEn,
    "curriculum-material": curriculumMaterialEn,
  },
  ar: {
    "admin-auth": adminAuthAr,
    "admin-role": adminRoleAr,
    "admin-user-management": adminUserManagementAr,
    web: webAr,
    landing: landingAr,
    common: uiAr,
    datatable: datatableAr,
    "form-builder": formBuilderAr,
    components: componentsAr,
    global: globalAr,
    "excel-editor": excelEditorAr,
    "curriculum-common": curriculumCommonAr,
    "curriculum-lesson": curriculumLessonAr,
    "curriculum-module": curriculumModuleAr,
    "curriculum-material": curriculumMaterialAr,
  },
};
