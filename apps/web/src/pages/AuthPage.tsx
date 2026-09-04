import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button, Input } from "@qlp/ui";
import { Card, CardDescription, CardHeader, CardTitle } from "@qlp/components";
import { useSignIn, useSignUp } from "../hooks/useAuth";

export default function AuthPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const signIn = useSignIn();
  const signUp = useSignUp();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    firstName: "",
    lastName: "",
  });

  const loading = signIn.isPending || signUp.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      signIn.mutate(
        { email: form.email, password: form.password },
        {
          onSuccess: () => {
            toast.success("Welcome back!");
            navigate("/");
          },
          onError: () => toast.error("Authentication failed"),
        },
      );
      return;
    }

    signUp.mutate(
      {
        email: form.email,
        password: form.password,
        username: form.username,
        firstName: form.firstName,
        lastName: form.lastName,
      },
      {
        onSuccess: () => {
          toast.success(t("auth.accountCreated"));
          setIsLogin(true);
        },
        onError: () => toast.error("Authentication failed"),
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <Card>
        <CardHeader>
          <CardTitle>{t("appName")}</CardTitle>
          <CardDescription>{t("tagline")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder={t("auth.firstName")}
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  minLength={3}
                  maxLength={50}
                  required
                />
                <Input
                  placeholder={t("auth.lastName")}
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  minLength={3}
                  maxLength={50}
                  required
                />
              </div>
              <Input
                placeholder={t("auth.username")}
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                minLength={3}
                maxLength={50}
              />
            </>
          )}
          <Input
            type="email"
            placeholder={t("auth.email")}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            type="password"
            placeholder={t("auth.password")}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={6}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "..." : isLogin ? t("auth.login") : t("auth.register")}
          </Button>
        </form>
        <p className="text-center text-sm mt-4">
          {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}{" "}
          <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? t("auth.register") : t("auth.login")}
          </Button>
        </p>
      </Card>
    </div>
  );
}
