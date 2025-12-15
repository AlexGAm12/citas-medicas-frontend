import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Card({ title, desc, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition p-6 w-full shadow-lg"
    >
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-white/60">{desc}</p>
    </button>
  );
}

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-white">Panel del Paciente</h1>
        <p className="mt-2 text-white/60 text-sm">
          Usuario: {user?.username || "—"} · Rol: {user?.role || "—"}
        </p>
      </div>

      {/* 2 tarjetas grandes como el diseño (en desktop quedan lado a lado) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          title="Agendar cita"
          desc="Busca doctor por especialidad y agenda una cita."
          onClick={() => navigate("/patient/schedule")}
        />

        <Card
          title="Mis citas"
          desc="Consulta, cancela y revisa el estado de tus citas."
          onClick={() => navigate("/patient/appointments")}
        />
      </div>
    </div>
  );
}
