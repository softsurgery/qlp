import { i18nConfig } from "./config";
import arCommon from "./locales/common-ar.json";
import enCommon from "./locales/common-en.json";
import arLesson from "./locales/lesson-ar.json";
import enLesson from "./locales/lesson-en.json";
import arModule from "./locales/module-ar.json";
import enModule from "./locales/module-en.json";
import arMaterial from "./locales/material-ar.json";
import enMaterial from "./locales/material-en.json";

export { i18nConfig };
export const curriculumCommonResources = { en: enCommon, ar: arCommon };
export const curriculumLessonResources = { en: enLesson, ar: arLesson };
export const curriculumModuleResources = { en: enModule, ar: arModule };
export const curriculumMaterialResources = { en: enMaterial, ar: arMaterial };
