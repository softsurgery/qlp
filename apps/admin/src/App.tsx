import { Routes, Route, Navigate } from "react-router-dom";
import { useIsAdminSession } from "./hooks/useAuth";
import Layout from "./components/layout/Layout";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";
import UserCreatePage from "./pages/UserCreatePage";
import UserEditPage from "./pages/UserEditPage";
import RolesPage from "./pages/RolesPage";

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
        <Route path="user-management">
          <Route path="users" element={<UsersPage />} />
          <Route path="users/new" element={<UserCreatePage />} />
          <Route path="users/:userId/edit" element={<UserEditPage />} />
          <Route path="roles" element={<RolesPage />} />
        </Route>
        <Route path="tutors" element={<div>Tutors</div>} />
        <Route path="curriculum" element={<div>Curriculum</div>} />
      </Route>
    </Routes>
  );
}
