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

export default function AdminDashboard() {
  return (
    <DashboardShell title="Panel de Administración">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

        <Card
          title="Especialidades"
          desc="Crear, editar y eliminar especialidades médicas."
          to="/admin/specialties"
        />

        <Card
          title="Doctores"
          desc="Administrar doctores y asignar especialidades."
          to="/admin/doctors"
        />

        <Card
          title="Pacientes"
          desc="Listado y control de pacientes registrados."
          to="/admin/patients"
        />

        <Card
          title="Disponibilidad"
          desc="Configurar horarios de atención para cualquier doctor."
          to="/admin/availability"
        />

        <Card
          title="Citas"
          desc="Ver y administrar todas las citas del sistema."
          to="/admin/appointments"
        />

        <Card
          title="Reportes"
          desc="Generar reportes por rango, doctor o paciente."
          to="/admin/reportes"
        />

      </div>
    </DashboardShell>
  );
}
