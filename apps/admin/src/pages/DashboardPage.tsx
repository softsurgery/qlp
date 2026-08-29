import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { adminApi } from '../lib/api';
import { Users, GraduationCap, BookOpen } from 'lucide-react';

export default function DashboardPage() {
  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi.getUsers().then((r) => r.data),
  });

  const { data: pendingTutors } = useQuery({
    queryKey: ['admin-pending-tutors'],
    queryFn: () => adminApi.getPendingTutors().then((r) => r.data),
  });

  const { data: curriculum } = useQuery({
    queryKey: ['admin-curriculum'],
    queryFn: () => adminApi.getCurriculum().then((r) => r.data),
  });

  const stats = [
    { label: 'Total users', value: users?.length ?? '—', icon: Users, to: '/users' },
    { label: 'Pending tutors', value: pendingTutors?.length ?? '—', icon: GraduationCap, to: '/tutors' },
    { label: 'Curriculum tracks', value: curriculum?.length ?? '—', icon: BookOpen, to: '/curriculum' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Platform overview and quick links</p>
      <div className="grid md:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, to }) => (
          <Link
            key={to}
            to={to}
            className="p-6 bg-background border border-border rounded-xl hover:border-primary transition-colors"
          >
            <Icon className="w-5 h-5 text-primary mb-3" />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
