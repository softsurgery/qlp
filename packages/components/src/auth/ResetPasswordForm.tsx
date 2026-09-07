import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button, Label, cn } from "@qlp/ui";
import { PasswordField } from "@qlp/form-builder";
import { AuthFormHeader } from "./AuthFormHeader";

export interface ResetPasswordFormProps {
  className?: string;
  token: string;
  onCancel: () => void;
  onSubmit: (
    token: string,
    password: string,
  ) => Promise<{ message?: string; success?: boolean }>;
}

export function ResetPasswordForm({
  className,
  token,
  onCancel,
  onSubmit,
}: ResetPasswordFormProps) {
  const { t } = useTranslation("components");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isPending, setIsPending] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password) {
      toast.error(t("auth.passwordRequired"));
      return;
    }
    if (password !== confirmPassword) {
      toast.error(t("auth.passwordsDoNotMatch"));
      return;
    }
    if (password.length < 6) {
      toast.error(t("auth.passwordMinLength"));
      return;
    }

    setIsPending(true);
    try {
      const result = await onSubmit(token, password);
      toast.success(result.message || t("auth.reset"));
      onCancel();
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className={cn("flex w-full flex-col gap-6", className)}>
      <AuthFormHeader
        title={t("auth.resetTitle")}
        description={t("auth.resetDescription")}
      />

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="password">{t("auth.password")}</Label>
          <PasswordField
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            autoComplete="new-password"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm-password">{t("auth.confirmPassword")}</Label>
          <PasswordField
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isPending}
            autoComplete="new-password"
          />
        </div>
        {password !== confirmPassword && (
          <span className="text-xs font-medium leading-3 text-destructive">
            {t("auth.passwordMismatch")}
          </span>
        )}

        <div className="flex flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onCancel}
            disabled={isPending}
          >
            {t("auth.cancel")}
          </Button>
          <Button type="submit" className="w-full" disabled={isPending}>
            {t("auth.reset")}
          </Button>
        </div>
      </form>
    </div>
  );
}
