import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthPersistStore } from "@qlp/hooks";
import { useAuthStore } from "../stores/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (forgotPassword) {
        const res = await authApi.forgotPassword({
          usernameOrEmail: form.usernameOrEmail,
        });
        toast.success(
          res.data.success
            ? `Reset email sent to ${res.data.email}`
            : "Unable to send reset email",
        );
        if (res.data.success) setForgotPassword(false);
        return;
      }

      const res = await authApi.signIn({
        usernameOrEmail: form.usernameOrEmail,
        password: form.password,
      });
      if (!isAdminUser(res.data.user)) {
        toast.error("Admin access only");
        return;
      }
      useAuthPersistStore
        .getState()
        .setTokens(res.data.access_token, res.data.refresh_token);
      setUser(res.data.user ?? null);
      toast.success("Welcome back");
      navigate("/");
    } catch {
      toast.error(
        forgotPassword ? "Unable to send reset email" : "Invalid credentials",
      );
    } finally {
      setLoading(false);
    }
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
