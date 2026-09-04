import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
      <div className="w-full max-w-md p-8 bg-background rounded-xl shadow-lg border border-border">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">QLP Admin</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {forgotPassword
              ? "Enter your username or email to reset your password"
              : "Sign in with an administrator account"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border border-border rounded-lg px-3 py-2 text-sm"
            placeholder="Username or email"
            value={form.usernameOrEmail}
            onChange={(e) =>
              setForm({ ...form, usernameOrEmail: e.target.value })
            }
            required
          />
          {!forgotPassword && (
            <input
              type="password"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading
              ? forgotPassword
                ? "Sending..."
                : "Signing in..."
              : forgotPassword
                ? "Send reset email"
                : "Sign in"}
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          <button
            onClick={() => setForgotPassword(!forgotPassword)}
            className="text-primary font-medium hover:underline"
          >
            {forgotPassword ? "Back to sign in" : "Forgot password?"}
          </button>
        </p>
      </div>
    </div>
  );
}
