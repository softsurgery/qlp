import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  AuthenticationLayout,
  ForgotPasswordForm,
  LanguageSwitcher,
  ResetPasswordForm,
  useAuthScreen,
} from "@qlp/components";
import { ModeToggle } from "@qlp/ui";
import { AuthenticationForm } from "../components/auth/AuthenticationForm";
import { SignUpForm } from "../components/auth/SignUpForm";
import { authApi } from "../lib/api";

export default function AuthPage() {
  const { t } = useTranslation();
  const { screen, token, goTo } = useAuthScreen();

  return (
    <AuthenticationLayout
      brandName={t("appName")}
      brandIcon={<BookOpen className="size-4" />}
      imageAlt={t("tagline")}
      toolbar={
        <>
          <div className="w-[140px]">
            <LanguageSwitcher />
          </div>
          <ModeToggle />
        </>
      }
    >
      {screen === "login" && (
        <AuthenticationForm
          onForgotPassword={() => goTo("forgot-password")}
          onSignUp={() => goTo("sign-up")}
        />
      )}
      {screen === "sign-up" && <SignUpForm onLogin={() => goTo("login")} />}
      {screen === "forgot-password" && (
        <ForgotPasswordForm
          onCancel={() => goTo("login")}
          onSubmit={(usernameOrEmail) =>
            authApi.forgotPassword({ usernameOrEmail })
          }
        />
      )}
      {screen === "reset-password" && token && (
        <ResetPasswordForm
          token={token}
          onCancel={() => goTo("login")}
          onSubmit={(resetToken, password) =>
            authApi.resetPassword({ token: resetToken, password })
          }
        />
      )}
    </AuthenticationLayout>
  );
}
