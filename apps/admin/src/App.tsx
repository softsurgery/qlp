import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@qlp/contexts";
import { api } from "@/lib/api";
import { useIsAdminSession } from "./hooks/content/useAuth";
import Layout from "./components/layout/Layout";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";
import UserCreatePage from "./pages/UserCreatePage";
import UserEditPage from "./pages/UserEditPage";
import RolesPage from "./pages/RolesPage";
import CurriculumPage from "./pages/CurriculumPage";
import CurriculumCreatePage from "./pages/CurriculumCreatePage";
import CurriculumEditPage from "./pages/CurriculumEditPage";
import CurriculumViewPage from "./pages/CurriculumViewPage";

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
    <AppProvider value={{ appType: "admin", api }}>
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
          <Route path="curriculum" element={<CurriculumPage />} />
          <Route path="curriculum/new" element={<CurriculumCreatePage />} />
          <Route path="curriculum/:id" element={<CurriculumViewPage />} />
          <Route path="curriculum/:id/edit" element={<CurriculumEditPage />} />
        </Route>
      </Routes>
    </AppProvider>
  );
}
