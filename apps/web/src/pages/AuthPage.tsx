import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAuthPersistStore } from '@qlp/hooks';
import { authApi } from '../lib/api';
import { useAuthStore } from '../stores/auth';

export default function AuthPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'student',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = isLogin
        ? await authApi.login(form.email, form.password)
        : await authApi.register(form);
      useAuthPersistStore.getState().setTokens(res.data.access_token, res.data.refresh_token);
      setUser(res.data.user);
      toast.success(isLogin ? 'Welcome back!' : 'Account created!');
      navigate('/');
    } catch {
      toast.error('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="w-full max-w-md p-8 bg-background rounded-xl shadow-lg border border-border">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">{t('appName')}</h1>
          <p className="text-muted-foreground mt-1">{t('tagline')}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="border border-border rounded-lg px-3 py-2 text-sm"
                  placeholder={t('auth.firstName')}
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  required
                />
                <input
                  className="border border-border rounded-lg px-3 py-2 text-sm"
                  placeholder={t('auth.lastName')}
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  required
                />
              </div>
              <select
                className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="student">{t('auth.student')}</option>
                <option value="parent">{t('auth.parent')}</option>
                <option value="tutor">{t('auth.tutor')}</option>
              </select>
            </>
          )}
          <input
            type="email"
            className="w-full border border-border rounded-lg px-3 py-2 text-sm"
            placeholder={t('auth.email')}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            className="w-full border border-border rounded-lg px-3 py-2 text-sm"
            placeholder={t('auth.password')}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={8}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? '...' : isLogin ? t('auth.login') : t('auth.register')}
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-medium hover:underline"
          >
            {isLogin ? t('auth.register') : t('auth.login')}
          </button>
        </p>
      </div>
    </div>
  );
}
