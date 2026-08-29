import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../lib/api';
import { BookOpen } from 'lucide-react';

export default function CurriculumPage() {
  const { data: tracks, isLoading } = useQuery({
    queryKey: ['admin-curriculum'],
    queryFn: () => adminApi.getCurriculum().then((r) => r.data),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Curriculum</h1>
      <div className="space-y-4">
        {tracks?.map((track: any) => (
          <div key={track.id} className="p-6 border border-border rounded-xl bg-background">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary rounded-lg">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-lg">{track.title}</h2>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      track.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {track.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{track.description}</p>
                <p className="text-xs text-primary mt-2">
                  {track.units?.length ?? 0} units ·{' '}
                  {track.units?.reduce((n: number, u: any) => n + (u.lessons?.length ?? 0), 0) ?? 0} lessons
                </p>
                {track.units?.length > 0 && (
                  <ul className="mt-4 space-y-2 border-t border-border pt-4">
                    {track.units.map((unit: any) => (
                      <li key={unit.id} className="text-sm">
                        <span className="font-medium">{unit.title}</span>
                        <span className="text-muted-foreground ml-2">
                          ({unit.lessons?.length ?? 0} lessons)
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
        {!tracks?.length && <p className="text-muted-foreground">No curriculum tracks</p>}
      </div>
    </div>
  );
}
