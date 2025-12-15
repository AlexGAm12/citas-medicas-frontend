import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ allow }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <div className="p-6">Cargando sesión...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const role = user?.role;

  if (!role || !allow.includes(role)) {
    const home =
      role === "admin" ? "/admin" : role === "doctor" ? "/doctor" : "/patient";
    return <Navigate to={home} replace />;
  }

  return <Outlet />;
}
