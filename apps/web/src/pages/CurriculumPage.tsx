import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { curriculumApi } from '../lib/api';
import { BookOpen } from 'lucide-react';

export default function CurriculumPage() {
  const { t } = useTranslation();
  const { data: tracks, isLoading } = useQuery({
    queryKey: ['tracks'],
    queryFn: () => curriculumApi.getTracks().then((r) => r.data),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('curriculum.title')}</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {tracks?.map((track: any) => (
          <Link
            key={track.id}
            to={`/curriculum/${track.slug}`}
            className="p-6 bg-background border border-border rounded-xl hover:border-primary transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary rounded-lg">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">{track.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{track.description}</p>
                <p className="text-xs text-primary mt-2">
                  {track.units?.length || 0} {t('curriculum.units')}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
