import { useTranslation } from "react-i18next";
import { dateLocaleFor } from "../lib/calendar";

/** date-fns locale matching the UI language, so day and month names follow it (EN / AR). */
export function useDateLocale() {
  const { i18n } = useTranslation("meetings");
  return dateLocaleFor(i18n.language);
}
