import { useTranslation } from "react-i18next";

export function useRTL(explicitDir?: "ltr" | "rtl") {
  const { i18n } = useTranslation();
  const docDir =
    typeof document !== "undefined"
      ? (document.documentElement.dir as "ltr" | "rtl")
      : undefined;

  const dir: "ltr" | "rtl" =
    explicitDir ??
    (i18n?.dir ? (i18n.dir() as "ltr" | "rtl") : undefined) ??
    docDir ??
    "ltr";

  const isRTL = dir === "rtl";

  return { dir, isRTL };
}
