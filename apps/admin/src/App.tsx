import { Routes, Route, Navigate } from "react-router-dom";
import { useIsAdminSession } from "./hooks/useAuth";
import Layout from "./components/layout/Layout";
import LoginPage from "./pages/LoginPage";

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isReady, isAuthed, isAdmin } = useIsAdminSession();

  if (!isReady) return null;
  if (!isAuthed || !isAdmin) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isReady, isAuthed, isAdmin } = useIsAdminSession();

  if (!isReady) return null;
  if (isAuthed && isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/"
        element={
          <AdminRoute>
            <Layout />
          </AdminRoute>
        }
      >
        <Route index element={<div>Dashboard</div>} />
        <Route path="users" element={<div>Users</div>} />
        <Route path="tutors" element={<div>Tutors</div>} />
        <Route path="curriculum" element={<div>Curriculum</div>} />
      </Route>
    </Routes>
  );
}
