import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button, Input, Label, cn } from "@qlp/ui";
import { AuthFormHeader } from "./AuthFormHeader";
import React from "react";

export interface ForgotPasswordFormProps {
  className?: string;
  onCancel: () => void;
  onSubmit: (usernameOrEmail: string) => Promise<{
    email?: string;
    success?: boolean;
    message?: string;
  }>;
}

export function ForgotPasswordForm({
  className,
  onCancel,
  onSubmit,
}: ForgotPasswordFormProps) {
  const { t } = useTranslation("components");
  const [usernameOrEmail, setUsernameOrEmail] = React.useState("");
  const [isPending, setIsPending] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!usernameOrEmail.trim()) {
      toast.error(t("auth.identifierRequired"));
      return;
    }

    setIsPending(true);
    try {
      const result = await onSubmit(usernameOrEmail.trim());
      if (result.success === false) {
        toast.error(result.message || t("auth.identifierRequired"));
        return;
      }
      toast.success(
        result.message ||
          (result.email
            ? t("auth.resetEmailSent", { email: result.email })
            : t("auth.sendResetLink")),
      );
      onCancel();
    } catch (error: any) {
      toast.error(error?.message);
      setUsernameOrEmail("");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className={cn("flex w-full flex-col gap-6", className)}>
      <AuthFormHeader
        title={t("auth.forgotTitle")}
        description={t("auth.forgotDescription")}
      />

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">{t("auth.emailOrUsername")}</Label>
          <Input
            id="email"
            type="text"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            disabled={isPending}
          />
        </div>

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
            {isPending ? t("auth.sending") : t("auth.sendResetLink")}
          </Button>
        </div>
      </form>
    </div>
  );
}
