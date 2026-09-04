import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthUser, useLogout } from '../hooks/useAuth';
import { cn } from '@qlp/ui';
import { LayoutDashboard, Users, GraduationCap, BookOpen, LogOut, Shield } from 'lucide-react';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/users', icon: Users, label: 'Users' },
  { to: '/tutors', icon: GraduationCap, label: 'Tutor Verification' },
  { to: '/curriculum', icon: BookOpen, label: 'Curriculum' },
];

export default function Layout() {
  const { data: user } = useAuthUser();
  const logout = useLogout();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-primary text-primary-foreground flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <h1 className="text-xl font-bold">QLP Admin</h1>
          </div>
          <p className="text-sm opacity-80 mt-1">Platform management</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                  isActive ? 'bg-white/20' : 'hover:bg-white/10',
                )
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <div className="px-3 py-2 text-sm opacity-80">
            {user?.firstName} {user?.lastName}
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm hover:bg-white/10"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
