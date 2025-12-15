import { Link } from "react-router-dom";
import DashboardShell from "./DashboardShell";

function Card({ title, desc, to }) {
  return (
    <Link
      to={to}
      className="group rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition shadow-lg"
    >
      <h3 className="text-lg font-semibold text-white group-hover:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-white/60">
        {desc}
      </p>
    </Link>
  );
}

export default function DoctorDashboard() {
  return (
    <DashboardShell title="Panel del Doctor">
      <div className="grid sm:grid-cols-2 gap-5">
        <Card
          title="Disponibilidad"
          desc="Configura tus horarios de atención."
          to="/doctor/availability"
        />

        <Card
          title="Mis citas"
          desc="Consulta, confirma, cancela o finaliza tus citas."
          to="/doctor/appointments"
        />
      </div>
    </DashboardShell>
  );
}
