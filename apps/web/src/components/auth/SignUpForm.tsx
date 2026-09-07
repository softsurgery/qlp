import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button, Input, Label, cn } from "@qlp/ui";
import { PasswordField } from "@qlp/form-builder";
import { AuthFormHeader } from "@qlp/components";
import { signUpSchema } from "../../types/validations/auth.validation";
import { useSignUp } from "../../hooks/useAuth";
import { ServerErrorResponse } from "@qlp/api-client";

interface SignUpFormProps {
  className?: string;
  onLogin: () => void;
}

export function SignUpForm({ className, onLogin }: SignUpFormProps) {
  const { t } = useTranslation();
  const signUp = useSignUp();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { success: isFormValid } = signUpSchema.safeParse(form);

  const updateField = (field: keyof typeof form) => (value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isFormValid || signUp.isPending) return;

    signUp.mutate(
      {
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: form.email,
        password: form.password,
      },
      {
        onSuccess: () => {
          toast.success(t("auth.accountCreated"));
          onLogin();
        },
        onError: (error: ServerErrorResponse) => {
          toast.error(error?.response?.data?.message);
        },
      },
    );
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <AuthFormHeader
        title={t("auth.signUpTitle")}
        description={t("auth.signUpDescription")}
      />

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label htmlFor="firstName">{t("auth.firstName")}</Label>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={(e) => updateField("firstName")(e.target.value)}
              disabled={signUp.isPending}
              autoComplete="given-name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">{t("auth.lastName")}</Label>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={(e) => updateField("lastName")(e.target.value)}
              disabled={signUp.isPending}
              autoComplete="family-name"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="username">{t("auth.username")}</Label>
          <Input
            id="username"
            value={form.username}
            onChange={(e) => updateField("username")(e.target.value)}
            disabled={signUp.isPending}
            autoComplete="username"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email")(e.target.value)}
            disabled={signUp.isPending}
            autoComplete="email"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">{t("auth.password")}</Label>
          <PasswordField
            id="password"
            placeholder="•••••••"
            value={form.password}
            onChange={(e) => updateField("password")(e.target.value)}
            disabled={signUp.isPending}
            autoComplete="new-password"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
          <PasswordField
            id="confirmPassword"
            placeholder="•••••••"
            value={form.confirmPassword}
            onChange={(e) => updateField("confirmPassword")(e.target.value)}
            disabled={signUp.isPending}
            autoComplete="new-password"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={signUp.isPending || !isFormValid}
        >
          {t("auth.register")}
        </Button>
      </form>

      <div className="text-center text-sm">
        {t("auth.hasAccount")}{" "}
        <button
          type="button"
          className="underline underline-offset-4"
          onClick={onLogin}
        >
          {t("auth.login")}
        </button>
      </div>
    </div>
  );
}
