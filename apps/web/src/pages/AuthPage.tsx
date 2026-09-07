import { BookOpen } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
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
import { authApi } from "../lib/api";

export default function AuthPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { screen, token, goTo } = useAuthScreen();

  if (screen === "sign-up") {
    return <Navigate to="/sign-up" replace />;
  }

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
          onSignUp={() => navigate("/sign-up")}
        />
      )}
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
