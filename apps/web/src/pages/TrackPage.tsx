import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { curriculumApi } from '../lib/api';
import { ChevronRight } from 'lucide-react';

export default function TrackPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { data: track, isLoading } = useQuery({
    queryKey: ['track', slug],
    queryFn: () => curriculumApi.getTrack(slug!).then((r) => r.data),
    enabled: !!slug,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{track?.title}</h1>
      <p className="text-muted-foreground mb-8">{track?.description}</p>

      <div className="space-y-6">
        {track?.units?.map((unit: any) => (
          <div key={unit.id} className="border border-border rounded-xl overflow-hidden">
            <div className="p-4 bg-secondary font-semibold">{unit.title}</div>
            <div className="divide-y divide-border">
              {unit.lessons?.map((lesson: any) => (
                <Link
                  key={lesson.id}
                  to={`/lessons/${lesson.id}`}
                  className="flex items-center justify-between p-4 hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium">{lesson.title}</p>
                    <p className="text-sm text-muted-foreground">{lesson.durationMinutes} min</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
