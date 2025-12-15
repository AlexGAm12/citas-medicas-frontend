import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="p-6">Cargando sesión...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}
