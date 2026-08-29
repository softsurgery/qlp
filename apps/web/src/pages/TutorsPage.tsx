import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { tutorApi, bookingApi } from '../lib/api';
import { Star, Calendar } from 'lucide-react';

export default function TutorsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  const [bookingForm, setBookingForm] = useState({ startTime: '', endTime: '', notes: '' });

  const { data: tutors, isLoading } = useQuery({
    queryKey: ['tutors'],
    queryFn: () => tutorApi.getAll().then((r) => r.data),
  });

  const bookMutation = useMutation({
    mutationFn: (data: Record<string, string>) => bookingApi.create(data),
    onSuccess: () => {
      toast.success('Booking requested!');
      setSelectedTutor(null);
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: () => toast.error('Booking failed'),
  });

  const handleBook = () => {
    if (!selectedTutor) return;
    bookMutation.mutate({
      tutorId: selectedTutor.id,
      startTime: new Date(bookingForm.startTime).toISOString(),
      endTime: new Date(bookingForm.endTime).toISOString(),
      notes: bookingForm.notes,
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('tutors.title')}</h1>

      {tutors?.length === 0 && (
        <p className="text-muted-foreground">No verified tutors yet. Check back soon!</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tutors?.map((tutor: any) => (
          <div key={tutor.id} className="p-6 border border-border rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center font-bold text-primary">
                {tutor.displayName?.[0]}
              </div>
              <div>
                <h3 className="font-semibold">{tutor.displayName}</h3>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {tutor.rating || 'New'}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{tutor.bio}</p>
            <div className="flex flex-wrap gap-1 mb-4">
              {tutor.languages?.map((l: string) => (
                <span key={l} className="text-xs px-2 py-1 bg-secondary rounded">{l}</span>
              ))}
            </div>
            <button
              onClick={() => setSelectedTutor(tutor)}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
            >
              {t('tutors.book')}
            </button>
          </div>
        ))}
      </div>

      {selectedTutor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-xl w-full max-w-md mx-4">
            <h3 className="font-semibold mb-4">{t('tutors.book')} — {selectedTutor.displayName}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Start Time</label>
                <input
                  type="datetime-local"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm mt-1"
                  value={bookingForm.startTime}
                  onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">End Time</label>
                <input
                  type="datetime-local"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm mt-1"
                  value={bookingForm.endTime}
                  onChange={(e) => setBookingForm({ ...bookingForm, endTime: e.target.value })}
                />
              </div>
              <textarea
                className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                placeholder="Notes (optional)"
                value={bookingForm.notes}
                onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setSelectedTutor(null)} className="flex-1 py-2 border border-border rounded-lg">
                Cancel
              </button>
              <button
                onClick={handleBook}
                disabled={!bookingForm.startTime || !bookingForm.endTime || bookMutation.isPending}
                className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
              >
                <Calendar className="w-4 h-4 inline mr-1" />
                Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
