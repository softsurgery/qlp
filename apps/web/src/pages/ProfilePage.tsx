import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { profileApi } from '../lib/api';
import { useAuthStore } from '../stores/auth';

export default function ProfilePage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.getMe().then((r) => r.data),
  });

  const [form, setForm] = useState({
    displayName: '',
    bio: '',
    preferredLanguage: 'en',
    timezone: 'UTC',
    learnerLevel: 'beginner',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        preferredLanguage: profile.preferredLanguage || 'en',
        timezone: profile.timezone || 'UTC',
        learnerLevel: profile.learnerLevel || 'beginner',
      });
    }
  }, [profile]);

  const saveMutation = useMutation({
    mutationFn: () => profileApi.updateMe(form),
    onSuccess: () => {
      toast.success('Profile updated');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('profile.title')}</h1>
      <div className="max-w-lg space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">
            {user?.firstName?.[0]}
          </div>
          <div>
            <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <span className="text-xs px-2 py-1 bg-secondary rounded capitalize">{user?.role}</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">{t('profile.displayName')}</label>
          <input
            className="w-full border border-border rounded-lg px-3 py-2 text-sm mt-1"
            defaultValue={profile?.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">{t('profile.bio')}</label>
          <textarea
            className="w-full border border-border rounded-lg px-3 py-2 text-sm mt-1"
            rows={3}
            defaultValue={profile?.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">{t('profile.language')}</label>
          <select
            className="w-full border border-border rounded-lg px-3 py-2 text-sm mt-1"
            defaultValue={profile?.preferredLanguage || 'en'}
            onChange={(e) => setForm({ ...form, preferredLanguage: e.target.value })}
          >
            <option value="en">English</option>
            <option value="ar">Arabic</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">{t('profile.level')}</label>
          <select
            className="w-full border border-border rounded-lg px-3 py-2 text-sm mt-1"
            defaultValue={profile?.learnerLevel || 'beginner'}
            onChange={(e) => setForm({ ...form, learnerLevel: e.target.value })}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
        >
          {t('profile.save')}
        </button>
      </div>
    </div>
  );
}
