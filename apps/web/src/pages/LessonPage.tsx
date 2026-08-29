import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { curriculumApi, progressApi } from '../lib/api';
import { CheckCircle } from 'lucide-react';

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => curriculumApi.getLesson(id!).then((r) => r.data),
    enabled: !!id,
  });

  const completeMutation = useMutation({
    mutationFn: () => progressApi.completeLesson(id!),
    onSuccess: () => {
      toast.success('Lesson completed!');
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Link to={`/curriculum/${lesson?.unit?.track?.slug}`} className="text-sm text-primary hover:underline mb-4 inline-block">
        ← Back to track
      </Link>
      <h1 className="text-2xl font-bold mb-2">{lesson?.title}</h1>
      <p className="text-muted-foreground mb-6">{lesson?.description}</p>

      <div className="p-6 bg-background border border-border rounded-xl mb-6">
        <div className="prose max-w-none whitespace-pre-wrap">{lesson?.content}</div>
      </div>

      <button
        onClick={() => completeMutation.mutate()}
        disabled={completeMutation.isPending}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
      >
        <CheckCircle className="w-4 h-4" />
        {t('curriculum.complete')}
      </button>
    </div>
  );
}
