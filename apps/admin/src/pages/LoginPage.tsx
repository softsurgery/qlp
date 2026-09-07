import { Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  AuthenticationLayout,
  ForgotPasswordForm,
  LanguageSwitcher,
  ResetPasswordForm,
  useAuthScreen,
} from "@qlp/components";
import { ModeToggle } from "@qlp/ui";
import { AuthenticationForm } from "@/components/auth/AuthenticationForm";
import { adminAuthApi } from "@/lib/api";

export default function LoginPage() {
  const { t } = useTranslation("auth");
  const { screen, token, goTo } = useAuthScreen();

  return (
    <AuthenticationLayout
      brandName={t("brand")}
      brandIcon={<Shield className="size-4" />}
      imageAlt={t("brand")}
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
        <AuthenticationForm onForgotPassword={() => goTo("forgot-password")} />
      )}
      {screen === "forgot-password" && (
        <ForgotPasswordForm
          labels={{
            title: t("forgotTitle"),
            description: t("forgotDescription"),
            emailOrUsername: t("emailOrUsername"),
            cancel: t("cancel"),
            sendResetLink: t("sendResetLink"),
            sending: t("sending"),
            identifierRequired: t("identifierRequired"),
            resetEmailSent: (email) => t("resetEmailSent", { email }),
          }}
          onCancel={() => goTo("login")}
          onSubmit={(usernameOrEmail) =>
            adminAuthApi.forgotPassword({ usernameOrEmail })
          }
        />
      )}
      {screen === "reset-password" && token && (
        <ResetPasswordForm
          labels={{
            title: t("resetTitle"),
            description: t("resetDescription"),
            password: t("password"),
            confirmPassword: t("confirmPassword"),
            passwordMismatch: t("passwordMismatch"),
            passwordRequired: t("passwordRequired"),
            passwordsDoNotMatch: t("passwordsDoNotMatch"),
            passwordMinLength: t("passwordMinLength"),
            cancel: t("cancel"),
            reset: t("reset"),
          }}
          token={token}
          onCancel={() => goTo("login")}
          onSubmit={(resetToken, password) =>
            adminAuthApi.resetPassword({ token: resetToken, password })
          }
        />
      )}
    </AuthenticationLayout>
  );
}
