import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { adminApi } from '../lib/api';
import { Check, X } from 'lucide-react';

export default function AdminPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi.getUsers().then((r) => r.data),
  });

  const { data: pendingTutors } = useQuery({
    queryKey: ['admin-pending-tutors'],
    queryFn: () => adminApi.getPendingTutors().then((r) => r.data),
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminApi.verifyTutor(id, status),
    onSuccess: () => {
      toast.success('Tutor status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-pending-tutors'] });
      queryClient.invalidateQueries({ queryKey: ['tutors'] });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => adminApi.setUserActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('admin.title')}</h1>

      <section className="mb-8">
        <h2 className="font-semibold mb-4">{t('admin.tutors')}</h2>
        <div className="space-y-3">
          {pendingTutors?.map((tutor: any) => (
            <div key={tutor.id} className="p-4 border border-border rounded-xl flex justify-between items-center">
              <div>
                <p className="font-medium">{tutor.user?.firstName} {tutor.user?.lastName}</p>
                <p className="text-sm text-muted-foreground">{tutor.bio}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => verifyMutation.mutate({ id: tutor.id, status: 'verified' })}
                  className="p-2 bg-primary text-primary-foreground rounded-lg"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => verifyMutation.mutate({ id: tutor.id, status: 'rejected' })}
                  className="p-2 border border-border rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {!pendingTutors?.length && <p className="text-muted-foreground text-sm">No pending tutors</p>}
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-4">{t('admin.users')}</h2>
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="text-start p-3">Name</th>
                <th className="text-start p-3">Email</th>
                <th className="text-start p-3">Role</th>
                <th className="text-start p-3">Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users?.map((user: any) => (
                <tr key={user.id}>
                  <td className="p-3">{user.firstName} {user.lastName}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleActiveMutation.mutate({ id: user.id, isActive: !user.isActive })}
                      className={`text-xs px-2 py-1 rounded ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
