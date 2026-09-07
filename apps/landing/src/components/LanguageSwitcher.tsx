import { useTranslation } from "react-i18next";
import { cn } from "@qlp/ui";
import { resolveSupportedLng, supportedLngs } from "@/i18n/config";

type LanguageSwitcherProps = {
  className?: string;
};

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const currentLanguage = resolveSupportedLng(
    i18n.resolvedLanguage ?? i18n.language,
  );

  return (
    <div
      className={cn("flex items-center gap-1.5 text-xs font-semibold", className)}
      role="group"
      aria-label={t("language.select")}
    >
      {supportedLngs.map((lng, index) => (
        <span key={lng} className="flex items-center gap-1.5">
          {index > 0 && (
            <span className="text-current/35" aria-hidden="true">
              /
            </span>
          )}
          <button
            type="button"
            onClick={() => void i18n.changeLanguage(lng)}
            className={cn(
              "rounded-sm tracking-[0.14em] transition-colors focus-ring rtl:tracking-normal",
              currentLanguage === lng
                ? "text-brand-gold"
                : "text-current/70 hover:text-current",
            )}
            aria-pressed={currentLanguage === lng}
            aria-label={lng === "en" ? "English" : "العربية"}
            lang={lng}
          >
            {t(`language.${lng}`)}
          </button>
        </span>
      ))}
    </div>
  );
}
