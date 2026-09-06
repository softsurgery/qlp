import {
  cn,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qlp/ui";
import { useTranslation } from "react-i18next";
import { i18nConfig, resolveSupportedLng } from "./i18n/config";

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const { i18n, t } = useTranslation(i18nConfig.namespace);
  const currentLanguage = resolveSupportedLng(
    i18n.resolvedLanguage ?? i18n.language,
  );

  const handleLanguageChange = (nextLanguage: string) => {
    void i18n.changeLanguage(resolveSupportedLng(nextLanguage));
  };

  return (
    <div className={cn("w-full", className)}>
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("selectLanguage")} />
        </SelectTrigger>
        <SelectContent>
          {i18nConfig.supportedLngs.map((lng) => (
            <SelectItem key={lng} value={lng}>
              {t(`languages.${lng}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
