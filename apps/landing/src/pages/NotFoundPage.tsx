import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@qlp/ui";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute end-5 top-5 sm:end-8 sm:top-8">
        <LanguageSwitcher className="text-foreground" />
      </div>
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-semibold text-foreground">
          404
        </h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          {t("notFound.title")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("notFound.description")}
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link to="/">{t("notFound.goHome")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
