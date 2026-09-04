import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthPersistStore } from "@qlp/hooks";
import { useAuthStore } from "./stores/auth";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";

function AdminRoute({ children }: { children: React.ReactNode }) {
  const isReady = useAuthPersistStore((s) => s.isReady);
  const isAuthed = useAuthPersistStore((s) => s.isAuthenticated);
  const isAdmin = useAuthStore((s) => s.isAdmin());

  if (!isReady) return null;
  if (!isAuthed) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
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
