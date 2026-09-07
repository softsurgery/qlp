import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@qlp/components";
import { ModeToggle } from "@qlp/ui";
import { SignUpLayout } from "../components/auth/SignUpLayout";
import { SignUpForm } from "../components/auth/SignUpForm";

export default function SignUpPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <SignUpLayout
      brandName={t("appName")}
      brandIcon={<BookOpen className="size-4" />}
      title={t("auth.signUpTitle")}
      description={t("auth.signUpDescription")}
      toolbar={
        <>
          <div className="w-[140px]">
            <LanguageSwitcher />
          </div>
          <ModeToggle />
        </>
      }
    >
      <SignUpForm onLogin={() => navigate("/auth")} />
    </SignUpLayout>
  );
}
