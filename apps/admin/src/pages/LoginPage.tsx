import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@qlp/ui";
import { useForgotPassword, useSignIn } from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const signIn = useSignIn();
  const forgot = useForgotPassword();
  const [forgotPassword, setForgotPassword] = useState(false);
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });

  const loading = signIn.isPending || forgot.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (forgotPassword) {
      forgot.mutate(
        { usernameOrEmail: form.usernameOrEmail },
        {
          onSuccess: (res) => {
            toast.success(
              res.success
                ? `Reset email sent to ${res.email}`
                : "Unable to send reset email",
            );
            if (res.success) setForgotPassword(false);
          },
          onError: () => toast.error("Unable to send reset email"),
        },
      );
      return;
    }

    signIn.mutate(
      {
        usernameOrEmail: form.usernameOrEmail,
        password: form.password,
      },
      {
        onSuccess: () => {
          toast.success("Welcome back");
          navigate("/");
        },
        onError: (error) => {
          toast.error(
            error instanceof Error && error.message === "Admin access only"
              ? "Admin access only"
              : "Invalid credentials",
          );
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <Card>
        <CardHeader>
          <CardTitle>QLP Admin</CardTitle>
          <CardDescription>
            {forgotPassword
              ? "Enter your username or email to reset your password"
              : "Sign in with an administrator account"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Username or email"
            value={form.usernameOrEmail}
            onChange={(e) =>
              setForm({ ...form, usernameOrEmail: e.target.value })
            }
            required
          />
          {!forgotPassword && (
            <Input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? forgotPassword
                ? "Sending..."
                : "Signing in..."
              : forgotPassword
                ? "Send reset email"
                : "Sign in"}
          </Button>
        </form>
        <p className="text-center text-sm mt-4">
          <Button
            variant="link"
            onClick={() => setForgotPassword(!forgotPassword)}
          >
            {forgotPassword ? "Back to sign in" : "Forgot password?"}
          </Button>
        </p>
      </Card>
    </div>
  );
}
