import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthSession } from "./hooks/useAuth";
import Layout from "./components/layout/Layout";
import AuthPage from "./pages/AuthPage";
import SignUpPage from "./pages/SignUpPage";
import CurriculumPage from "./pages/CurriculumPage";
import CurriculumEditPage from "./pages/CurriculumEditPage";
import CurriculumViewPage from "./pages/CurriculumViewPage";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isReady, isAuthed, user } = useAuthSession();
  const location = useLocation();

  if (!isReady) return null;
  if (isAuthed && user) return <>{children}</>;
  return <Navigate to="/auth" replace state={{ from: location }} />;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isReady, isAuthed, user } = useAuthSession();
  const location = useLocation();

  if (!isReady) return null;
  if (isAuthed && user) {
    const from = (location.state as { from?: { pathname?: string; search?: string } } | null)
      ?.from;
    const target = from?.pathname ? `${from.pathname}${from.search ?? ""}` : "/";
    return <Navigate to={target} replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <GuestRoute>
            <AuthPage />
          </GuestRoute>
        }
      />
      <Route
        path="/sign-up"
        element={
          <GuestRoute>
            <SignUpPage />
          </GuestRoute>
        }
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<div>Dashboard</div>} />
        <Route path="curriculum" element={<CurriculumPage />} />
        <Route path="curriculum/:id" element={<CurriculumViewPage />} />
        <Route path="curriculum/:id/edit" element={<CurriculumEditPage />} />
        <Route path="lessons/:id" element={<div>Lesson</div>} />
        <Route path="tutors" element={<div>Tutors</div>} />
        <Route path="bookings" element={<div>Bookings</div>} />
        <Route path="chat" element={<div>Chat</div>} />
        <Route path="chat/:conversationId" element={<div>Chat</div>} />
        <Route path="profile" element={<div>Chat</div>} />
        <Route path="achievements" element={<div>Achievements</div>} />
        <Route path="children" element={<div>Children</div>} />
        <Route path="video/:bookingId" element={<div>Video</div>} />
      </Route>
    </Routes>
  );
}
