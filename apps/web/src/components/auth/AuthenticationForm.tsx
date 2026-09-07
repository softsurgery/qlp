import { useState, type FormEvent, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button, Input, Label, cn } from "@qlp/ui";
import { PasswordField } from "@qlp/form-builder";
import { AuthFormHeader } from "@qlp/components";
import { loginSchema } from "../../types/validations/auth.validation";
import { useSignIn } from "../../hooks/useAuth";
import { ServerErrorResponse } from "@qlp/api-client";

interface AuthenticationFormProps {
  className?: string;
  onForgotPassword: () => void;
  onSignUp: () => void;
}

export function AuthenticationForm({
  className,
  onForgotPassword,
  onSignUp,
}: AuthenticationFormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const signIn = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { success: isFormValid } = loginSchema.safeParse({ email, password });

  const handleSignIn = () => {
    signIn.mutate(
      { email, password },
      {
        onSuccess: () => {
          toast.success(t("auth.welcomeBack"));
          navigate("/");
        },
        onError: (error: ServerErrorResponse) => {
          toast.error(error?.response?.data?.message);
        },
      },
    );
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !signIn.isPending && isFormValid) {
      handleSignIn();
    }
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!signIn.isPending && isFormValid) {
      handleSignIn();
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <AuthFormHeader
        title={t("auth.loginTitle")}
        description={t("auth.loginDescription")}
      />

      <form onSubmit={handleFormSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={signIn.isPending}
            autoComplete="email"
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">{t("auth.password")}</Label>
            <button
              type="button"
              className="ms-auto text-sm underline-offset-4 hover:underline"
              onClick={onForgotPassword}
            >
              {t("auth.forgotPassword")}
            </button>
          </div>
          <PasswordField
            id="password"
            placeholder="•••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={signIn.isPending}
            autoComplete="current-password"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={signIn.isPending || !isFormValid}
        >
          {t("auth.login")}
        </Button>
      </form>

      <div className="text-center text-sm">
        {t("auth.noAccount")}{" "}
        <button
          type="button"
          className="underline underline-offset-4"
          onClick={onSignUp}
        >
          {t("auth.register")}
        </button>
      </div>
    </div>
  );
}
