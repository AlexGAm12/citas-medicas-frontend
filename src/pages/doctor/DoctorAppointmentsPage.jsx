import { useEffect, useState } from "react";
import {
  getMyDoctorAppointmentsRequest,
  updateAppointmentStatusRequest,
} from "../../api/appointments";

const STATUS_COLORS = {
  pendiente: "bg-yellow-500/20 text-yellow-300",
  confirmada: "bg-emerald-500/20 text-emerald-300",
  cancelada: "bg-red-500/20 text-red-300",
  finalizada: "bg-blue-500/20 text-blue-300",
};

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("es-MX");
};

const formatTime = (a) => {
  const start = a?.startTime;
  const end = a?.endTime;
  if (start && end) return `${start} - ${end}`;
  if (start) return start;
  if (a?.time) return a.time;
  return "—";
};

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const idOf = (o) => o?._id || o?.id;

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getMyDoctorAppointmentsRequest();
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError(e?.response?.data?.message?.[0] || "No se pudieron cargar las citas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const changeStatus = async (appointmentId, status) => {
    try {
      setMsg("");
      setError("");
      await updateAppointmentStatusRequest(appointmentId, status);
      setMsg("Estado de la cita actualizado ");
      fetchAppointments();
    } catch (e) {
      setError(e?.response?.data?.message?.[0] || "Error al cambiar el estado");
    }
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <h2 className="text-2xl font-semibold text-white">Mis Citas</h2>
      <p className="text-white/60 text-sm mt-1">Consulta y administra tus citas médicas.</p>

      {msg && (
        <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-emerald-200 text-sm">
          {msg}
        </div>
      )}
      {error && (
        <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-red-200 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-white/60">Cargando citas...</p>
      ) : appointments.length === 0 ? (
        <p className="mt-6 text-white/60">No tienes citas asignadas.</p>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.map((a) => (
            <div
              key={idOf(a)}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <p className="text-white font-semibold">
                Paciente: {a.patient?.user?.username || "—"}
              </p>
              <p className="text-white/60 text-sm mt-1">
                Fecha: {formatDate(a.date)} · Hora: {formatTime(a)}
              </p>

              <span
                className={`inline-block mt-3 px-3 py-1 text-xs rounded-full ${
                  STATUS_COLORS[a.status] || "bg-white/10 text-white/70"
                }`}
              >
                {a.status}
              </span>

              <div className="mt-4 space-y-2">
                {a.status === "pendiente" && (
                  <>
                    <button
                      onClick={() => changeStatus(idOf(a), "confirmada")}
                      className="w-full rounded-xl bg-emerald-500/20 text-emerald-200 py-2 text-sm"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => changeStatus(idOf(a), "cancelada")}
                      className="w-full rounded-xl bg-red-500/20 text-red-200 py-2 text-sm"
                    >
                      Cancelar
                    </button>
                  </>
                )}

                {a.status === "confirmada" && (
                  <button
                    onClick={() => changeStatus(idOf(a), "finalizada")}
                    className="w-full rounded-xl bg-blue-500/20 text-blue-200 py-2 text-sm"
                  >
                    Marcar como finalizada
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
