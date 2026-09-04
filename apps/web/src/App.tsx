import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthPersistStore } from "@qlp/hooks";
import { useAuthStore } from "./stores/auth";
import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isReady = useAuthPersistStore((s) => s.isReady);
  const isAuthed = useAuthPersistStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  if (!isReady) return null;
  return isAuthed && user ? <>{children}</> : <Navigate to="/auth" />;
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
