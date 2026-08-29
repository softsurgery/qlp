import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { bookingApi } from '../lib/api';
import { useAuthStore } from '../stores/auth';
import { Video, Check, X } from 'lucide-react';

export default function BookingsPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => bookingApi.getMine().then((r) => r.data),
  });

  const confirmMutation = useMutation({
    mutationFn: (id: string) => bookingApi.confirm(id),
    onSuccess: () => { toast.success('Booking confirmed'); queryClient.invalidateQueries({ queryKey: ['bookings'] }); },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => bookingApi.cancel(id),
    onSuccess: () => { toast.success('Booking cancelled'); queryClient.invalidateQueries({ queryKey: ['bookings'] }); },
  });

  const startMutation = useMutation({
    mutationFn: (id: string) => bookingApi.start(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      if (res.data.videoRoomUrl) window.open(res.data.videoRoomUrl, '_blank');
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => bookingApi.complete(id),
    onSuccess: () => {
      toast.success('Session completed!');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('bookings.title')}</h1>
      <div className="space-y-4">
        {bookings?.map((booking: any) => (
          <div key={booking.id} className="p-4 border border-border rounded-xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-medium">{new Date(booking.startTime).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                {user?.role === 'tutor'
                  ? `${booking.student?.firstName} ${booking.student?.lastName}`
                  : `${booking.tutor?.user?.firstName} ${booking.tutor?.user?.lastName}`}
              </p>
              <span className="inline-block mt-1 text-xs px-2 py-1 bg-secondary rounded">{booking.status}</span>
            </div>
            <div className="flex gap-2">
              {user?.role === 'tutor' && booking.status === 'requested' && (
                <button onClick={() => confirmMutation.mutate(booking.id)} className="p-2 bg-primary text-primary-foreground rounded-lg">
                  <Check className="w-4 h-4" />
                </button>
              )}
              {['requested', 'confirmed'].includes(booking.status) && (
                <button onClick={() => cancelMutation.mutate(booking.id)} className="p-2 border border-border rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              )}
              {booking.status === 'confirmed' && (
                <button
                  onClick={() => startMutation.mutate(booking.id)}
                  className="flex items-center gap-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm"
                >
                  <Video className="w-4 h-4" />
                  {t('bookings.join')}
                </button>
              )}
              {booking.status === 'in_progress' && (
                <>
                  <Link to={`/video/${booking.id}`} className="flex items-center gap-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm">
                    <Video className="w-4 h-4" />
                    {t('bookings.join')}
                  </Link>
                  <button
                    onClick={() => completeMutation.mutate(booking.id)}
                    className="px-3 py-2 border border-border rounded-lg text-sm"
                  >
                    {t('bookings.complete')}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {!bookings?.length && <p className="text-muted-foreground">No bookings yet</p>}
      </div>
    </div>
  );
}
