import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/auth';
import { cn } from '../lib/utils';
import {
  BookOpen, Users, Calendar, MessageCircle, User, Trophy,
  LayoutDashboard, Shield, Baby, LogOut, Globe,
} from 'lucide-react';

export default function Layout() {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const links = [
    { to: '/', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/curriculum', icon: BookOpen, label: t('nav.curriculum') },
    { to: '/tutors', icon: Users, label: t('nav.tutors') },
    { to: '/bookings', icon: Calendar, label: t('nav.bookings') },
    { to: '/chat', icon: MessageCircle, label: t('nav.chat') },
    { to: '/achievements', icon: Trophy, label: t('nav.achievements') },
    { to: '/profile', icon: User, label: t('nav.profile') },
  ];

  if (user?.role === 'parent') {
    links.push({ to: '/children', icon: Baby, label: t('nav.children') });
  }
  if (user?.role === 'admin') {
    links.push({ to: '/admin', icon: Shield, label: t('nav.admin') });
  }

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-primary text-primary-foreground flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold">{t('appName')}</h1>
          <p className="text-sm opacity-80">{t('tagline')}</p>
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
          <button
            onClick={toggleLang}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm hover:bg-white/10"
          >
            <Globe className="w-4 h-4" />
            {i18n.language === 'ar' ? 'English' : 'العربية'}
          </button>
          <div className="px-3 py-2 text-sm opacity-80">
            {user?.firstName} {user?.lastName}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm hover:bg-white/10"
          >
            <LogOut className="w-4 h-4" />
            {t('nav.logout')}
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
