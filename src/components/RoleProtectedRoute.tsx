import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

interface RoleProtectedRouteProps {
  role: "ADMIN" | "STUDENT";
  children: ReactNode;
}

export default function RoleProtectedRoute({ role, children }: RoleProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="route-loading" role="status">Dang kiem tra phien dang nhap...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: `${location.pathname}${location.search}` }} replace />;
  }

  if (user?.role !== role) {
    return <Navigate to="/courses" replace />;
  }

  return <>{children}</>;
}