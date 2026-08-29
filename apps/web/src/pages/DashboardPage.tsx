import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { progressApi, bookingApi, achievementApi } from '../lib/api';
import { useAuthStore } from '../stores/auth';
import { BookOpen, Users, Trophy, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  const { data: progress } = useQuery({
    queryKey: ['progress'],
    queryFn: () => progressApi.getMyProgress().then((r) => r.data),
  });

  const { data: bookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => bookingApi.getMine().then((r) => r.data),
  });

  const { data: achievements } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => achievementApi.getMine().then((r) => r.data),
  });

  const upcoming = bookings?.filter((b: any) =>
    ['requested', 'confirmed'].includes(b.status) && new Date(b.startTime) > new Date(),
  ).slice(0, 3);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">
        {t('dashboard.welcome')}, {user?.firstName}!
      </h1>
      <p className="text-muted-foreground mb-8">{t('tagline')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-secondary rounded-xl border border-border">
          <BookOpen className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold">{progress?.completedCount || 0}</p>
          <p className="text-sm text-muted-foreground">{t('curriculum.lessons')} {t('curriculum.completed')}</p>
        </div>
        <div className="p-4 bg-secondary rounded-xl border border-border">
          <Calendar className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold">{upcoming?.length || 0}</p>
          <p className="text-sm text-muted-foreground">{t('dashboard.upcoming')}</p>
        </div>
        <div className="p-4 bg-secondary rounded-xl border border-border">
          <Trophy className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold">{achievements?.earned?.length || 0}</p>
          <p className="text-sm text-muted-foreground">{t('achievements.earned')}</p>
        </div>
        <div className="p-4 bg-secondary rounded-xl border border-border">
          <Users className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold">{achievements?.streak?.currentStreak || 0}</p>
          <p className="text-sm text-muted-foreground">{t('achievements.streak')}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-background rounded-xl border border-border">
          <h2 className="font-semibold mb-4">{t('dashboard.upcoming')}</h2>
          {upcoming?.length ? (
            <ul className="space-y-3">
              {upcoming.map((b: any) => (
                <li key={b.id} className="flex justify-between items-center text-sm">
                  <span>{new Date(b.startTime).toLocaleString()}</span>
                  <span className="px-2 py-1 bg-secondary rounded text-xs">{b.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No upcoming sessions</p>
          )}
        </div>

        <div className="p-6 bg-background rounded-xl border border-border">
          <h2 className="font-semibold mb-4">{t('dashboard.recentAchievements')}</h2>
          {achievements?.earned?.length ? (
            <ul className="space-y-2">
              {achievements.earned.slice(0, 5).map((a: any) => (
                <li key={a.id} className="flex items-center gap-2 text-sm">
                  <Trophy className="w-4 h-4 text-primary" />
                  {a.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Complete lessons to earn badges!</p>
          )}
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <Link to="/curriculum" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium">
          {t('dashboard.startLearning')}
        </Link>
        <Link to="/tutors" className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-secondary">
          {t('dashboard.findTutor')}
        </Link>
      </div>
    </div>
  );
}
