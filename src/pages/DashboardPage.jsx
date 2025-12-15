import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div className="p-6 text-white">
      <h2 className="text-3xl font-bold">Bienvenido, {user?.username}</h2>
      <p className="mt-2 text-zinc-300">Rol: {user?.role}</p>
    </div>
  );
}
