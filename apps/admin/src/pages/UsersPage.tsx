import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '../lib/api';

export default function UsersPage() {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi.getUsers().then((r) => r.data),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminApi.setUserActive(id, isActive),
    onSuccess: () => {
      toast.success('User updated');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <div className="border border-border rounded-xl overflow-hidden bg-background">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="text-start p-3">Name</th>
              <th className="text-start p-3">Email</th>
              <th className="text-start p-3">Role</th>
              <th className="text-start p-3">Status</th>
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
                    className={`text-xs px-2 py-1 rounded ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
