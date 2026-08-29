import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '../lib/api';
import { Check, X } from 'lucide-react';

export default function TutorsPage() {
  const queryClient = useQueryClient();

  const { data: pendingTutors, isLoading } = useQuery({
    queryKey: ['admin-pending-tutors'],
    queryFn: () => adminApi.getPendingTutors().then((r) => r.data),
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminApi.verifyTutor(id, status),
    onSuccess: () => {
      toast.success('Tutor status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-pending-tutors'] });
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Tutor Verification</h1>
      <p className="text-muted-foreground mb-6">Review and approve tutor applications</p>
      <div className="space-y-3">
        {pendingTutors?.map((tutor: any) => (
          <div
            key={tutor.id}
            className="p-4 border border-border rounded-xl bg-background flex justify-between items-center gap-4"
          >
            <div>
              <p className="font-medium">
                {tutor.user?.firstName} {tutor.user?.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{tutor.user?.email}</p>
              <p className="text-sm mt-1">{tutor.bio || 'No bio provided'}</p>
              {tutor.qualifications && (
                <p className="text-xs text-muted-foreground mt-1">{tutor.qualifications}</p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => verifyMutation.mutate({ id: tutor.id, status: 'verified' })}
                className="p-2 bg-primary text-primary-foreground rounded-lg"
                title="Verify"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => verifyMutation.mutate({ id: tutor.id, status: 'rejected' })}
                className="p-2 border border-border rounded-lg"
                title="Reject"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {!pendingTutors?.length && (
          <p className="text-muted-foreground text-sm">No pending tutor applications</p>
        )}
      </div>
    </div>
  );
}
