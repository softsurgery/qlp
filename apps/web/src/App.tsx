import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthSession } from "./hooks/useAuth";
import Layout from "./components/layout/Layout";
import AuthPage from "./pages/AuthPage";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isReady, isAuthed, user } = useAuthSession();

  if (!isReady) return null;
  return isAuthed && user ? <>{children}</> : <Navigate to="/auth" replace />;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isReady, isAuthed, user } = useAuthSession();

  if (!isReady) return null;
  if (isAuthed && user) return <Navigate to="/" replace />;
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
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<div>Dashboard</div>} />
        <Route path="curriculum" element={<div>Curriculum</div>} />
        <Route path="curriculum/:slug" element={<div>Track</div>} />
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
