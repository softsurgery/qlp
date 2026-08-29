import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { achievementApi } from '../lib/api';
import { Trophy, Flame } from 'lucide-react';

export default function AchievementsPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => achievementApi.getMine().then((r) => r.data),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('achievements.title')}</h1>

      <div className="p-4 bg-secondary rounded-xl border border-border mb-8 flex items-center gap-4">
        <Flame className="w-8 h-8 text-orange-500" />
        <div>
          <p className="text-2xl font-bold">{data?.streak?.currentStreak || 0} {t('achievements.days')}</p>
          <p className="text-sm text-muted-foreground">{t('achievements.streak')}</p>
        </div>
      </div>

      <h2 className="font-semibold mb-4">{t('achievements.earned')}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {data?.earned?.map((a: any) => (
          <div key={a.id} className="p-4 border border-primary/30 bg-primary/5 rounded-xl text-center">
            <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-medium text-sm">{a.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
          </div>
        ))}
        {!data?.earned?.length && <p className="text-muted-foreground col-span-full">No achievements yet</p>}
      </div>

      <h2 className="font-semibold mb-4">{t('achievements.available')}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.available?.map((a: any) => (
          <div key={a.id} className="p-4 border border-border rounded-xl text-center opacity-60">
            <Trophy className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="font-medium text-sm">{a.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
