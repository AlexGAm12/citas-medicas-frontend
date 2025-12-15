import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  const getStartLink = () => {
    if (!isAuthenticated) return "/login";
    if (user?.role === "admin") return "/admin";
    if (user?.role === "doctor") return "/doctor";
    return "/patient";
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Agenda tus citas médicas{" "}
            <span className="text-white/60">rápido y seguro</span>
          </h1>

          <p className="mt-4 text-white/70 leading-relaxed">
            Administra doctores, especialidades, disponibilidad y citas. Acceso por roles (Admin / Doctor / Paciente).
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={getStartLink()}
              className="rounded-2xl px-5 py-3 text-sm font-semibold text-black bg-white hover:bg-white/90 transition"
            >
              Empezar ahora
            </Link>

            {!isAuthenticated && (
              <Link
                to="/register"
                className="rounded-2xl px-5 py-3 text-sm font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/15 transition ring-1 ring-white/10"
              >
                Crear cuenta
              </Link>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <Card title="Especialidades" desc="Catálogo y control por admin." />
            <Card title="Doctores" desc="Gestión + disponibilidad." />
            <Card title="Citas" desc="Agenda, cancela y consulta." />
            <Card title="Reportes" desc="Rangos por doctor/paciente." />
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, desc }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <h3 className="text-white font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-white/70">{desc}</p>
    </div>
  );
}
