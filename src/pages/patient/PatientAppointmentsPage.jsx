import { useEffect, useState } from "react";
import {
  getMyAppointmentsRequest,
  updateAppointmentStatusRequest,
} from "../../api/appointments";

const STATUS_BADGE = {
  pendiente: "bg-yellow-500/20 text-yellow-300",
  confirmada: "bg-emerald-500/20 text-emerald-300",
  cancelada: "bg-red-500/20 text-red-300",
  finalizada: "bg-blue-500/20 text-blue-300",
};

function Badge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs rounded-full ${
        STATUS_BADGE[status] || "bg-white/10 text-white/70"
      }`}
    >
      {status || "—"}
    </span>
  );
}

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

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const idOf = (o) => o?._id || o?.id;

  const fetchMine = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getMyAppointmentsRequest();
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError(e?.response?.data?.message?.[0] || "No se pudieron cargar tus citas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMine();
  }, []);

  const cancelAppointment = async (appointmentId) => {
    if (!confirm("¿Cancelar esta cita?")) return;
    try {
      setMsg("");
      setError("");
      await updateAppointmentStatusRequest(appointmentId, "cancelada");
      setMsg("Cita cancelada ");
      await fetchMine();
    } catch (e) {
      setError(e?.response?.data?.message?.[0] || "No se pudo cancelar la cita");
    }
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Mis Citas</h2>
          <p className="text-white/60 text-sm mt-1">
            Consulta el estado de tus citas y cancela cuando sea necesario.
          </p>
        </div>

        <button
          onClick={fetchMine}
          className="rounded-2xl px-4 py-2 text-sm text-white/80 bg-white/10 hover:bg-white/15 transition ring-1 ring-white/10 w-fit"
        >
          Refrescar
        </button>
      </div>

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
        <p className="mt-6 text-white/60">Cargando...</p>
      ) : appointments.length === 0 ? (
        <p className="mt-6 text-white/60">Aún no tienes citas.</p>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.map((a) => {
            const canCancel = a.status === "pendiente" || a.status === "confirmada";

            return (
              <div
                key={idOf(a)}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-white font-semibold">
                      {a.doctor?.user?.username || "Doctor"} ·{" "}
                      {a.doctor?.specialty?.name || "—"}
                    </p>
                    <p className="text-white/60 text-sm mt-1">
                      {formatDate(a.date)} · {formatTime(a)}
                    </p>
                  </div>
                  <Badge status={a.status} />
                </div>

                {a.notes && (
                  <p className="mt-3 text-sm text-white/60">
                    Notas: {a.notes}
                  </p>
                )}

                <div className="mt-4">
                  <button
                    disabled={!canCancel}
                    onClick={() => cancelAppointment(idOf(a))}
                    className={`w-full rounded-2xl px-4 py-2 text-sm ring-1 transition
                      ${
                        canCancel
                          ? "bg-red-500/10 text-red-200 ring-red-400/20 hover:bg-red-500/15"
                          : "bg-white/10 text-white/40 ring-white/10 cursor-not-allowed"
                      }`}
                  >
                    Cancelar cita
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
