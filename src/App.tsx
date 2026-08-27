import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import AdminCoursesPage from "./pages/AdminCoursesPage";
import { useAuth } from "./contexts/useAuth";
import CoursesPage from "./pages/CoursesPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import RegistrationsPage from "./pages/RegistrationsPage";

function HomeRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="route-loading" role="status">Dang kiem tra phien dang nhap...</div>;
  }

  return <Navigate to={isAuthenticated ? "/courses" : "/login"} replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<AppLayout />}>
        <Route path="/courses" element={<CoursesPage />} />
      </Route>

      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/registrations" element={<RegistrationsPage />} />
      </Route>

      <Route element={<RoleProtectedRoute role="ADMIN"><AppLayout /></RoleProtectedRoute>}>
        <Route path="/admin/courses" element={<AdminCoursesPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
