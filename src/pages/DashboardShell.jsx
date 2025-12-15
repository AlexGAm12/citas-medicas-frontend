import { useAuth } from "../context/AuthContext";

export default function DashboardShell({ title, children }) {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex flex-col gap-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="mt-1 text-white/60 text-sm">
            Usuario: <span className="text-white">{user?.username}</span> · Rol:{" "}
            <span className="text-white">{user?.role}</span>
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
