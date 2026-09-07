import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button, Input, Label, cn } from "@qlp/ui";
import { PasswordField } from "@qlp/form-builder";
import { AuthFormHeader } from "@qlp/components";
import { loginSchema } from "@/types/validations/auth.validation";
import { useSignIn } from "@/hooks/content/useAuth";
import React from "react";

interface AuthenticationFormProps {
  className?: string;
  onForgotPassword: () => void;
}

export function AuthenticationForm({
  className,
  onForgotPassword,
}: AuthenticationFormProps) {
  const { t } = useTranslation("auth");
  const { t: tAuth } = useTranslation("components");
  const navigate = useNavigate();
  const signIn = useSignIn();
  const [usernameOrEmail, setUsernameOrEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { success: isFormValid } = loginSchema.safeParse({
    usernameOrEmail,
    password,
  });

  const handleSignIn = () => {
    signIn.mutate(
      { usernameOrEmail, password },
      {
        onSuccess: () => {
          toast.success(tAuth("auth.welcomeBack"));
          navigate("/");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !signIn.isPending && isFormValid) {
      handleSignIn();
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!signIn.isPending && isFormValid) {
      handleSignIn();
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <AuthFormHeader
        title={tAuth("auth.loginTitle")}
        description={t("loginDescription")}
      />

      <form onSubmit={handleFormSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">{tAuth("auth.emailOrUsername")}</Label>
          <Input
            id="email"
            type="text"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={signIn.isPending}
            autoComplete="username"
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">{tAuth("auth.password")}</Label>
            <button
              type="button"
              className="ms-auto text-sm underline-offset-4 hover:underline"
              onClick={onForgotPassword}
            >
              {tAuth("auth.forgotPassword")}
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
          {tAuth("auth.login")}
        </Button>
      </form>
    </div>
  );
}
