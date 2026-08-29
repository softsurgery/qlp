import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/auth';
import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import CurriculumPage from './pages/CurriculumPage';
import TrackPage from './pages/TrackPage';
import LessonPage from './pages/LessonPage';
import TutorsPage from './pages/TutorsPage';
import BookingsPage from './pages/BookingsPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import AchievementsPage from './pages/AchievementsPage';
import ChildrenPage from './pages/ChildrenPage';
import AdminPage from './pages/AdminPage';
import VideoCallPage from './pages/VideoCallPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuth = useAuthStore((s) => s.isAuthenticated());
  return isAuth ? <>{children}</> : <Navigate to="/auth" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="curriculum" element={<CurriculumPage />} />
        <Route path="curriculum/:slug" element={<TrackPage />} />
        <Route path="lessons/:id" element={<LessonPage />} />
        <Route path="tutors" element={<TutorsPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="chat/:conversationId" element={<ChatPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="achievements" element={<AchievementsPage />} />
        <Route path="children" element={<ChildrenPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="video/:bookingId" element={<VideoCallPage />} />
      </Route>
    </Routes>
  );
}
