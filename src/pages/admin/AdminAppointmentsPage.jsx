import { useEffect, useMemo, useState } from "react";
import {
  getAllAppointmentsRequest,
  updateAppointmentStatusRequest,
} from "../../api/appointments";

const STATUS_OPTIONS = ["pendiente", "confirmada", "cancelada", "finalizada"];

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
  return d.toISOString().slice(0, 10);
};

const formatTime = (a) => {
  const start = a?.startTime;
  const end = a?.endTime;
  if (start && end) return `${start} - ${end}`;
  if (start) return start;
  if (a?.time) return a.time;
  return "—";
};

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const idOf = (o) => o?._id || o?.id;

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllAppointmentsRequest();
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError(e?.response?.data?.message?.[0] || "No se pudieron cargar las citas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const changeStatus = async (appointmentId, newStatus) => {
    try {
      setMsg("");
      setError("");
      await updateAppointmentStatusRequest(appointmentId, newStatus);
      setMsg("Estado actualizado");
      await fetchAll();
    } catch (e) {
      setError(e?.response?.data?.message?.[0] || "Error al cambiar estado");
    }
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();

    return appointments.filter((a) => {
      if (status !== "all" && a.status !== status) return false;
      if (!term) return true;

      const patientName =
        a.patient?.user?.username ||
        a.patient?.user?.email ||
        a.patient?.name ||
        "";
      const doctorName =
        a.doctor?.user?.username ||
        a.doctor?.user?.email ||
        a.doctor?.name ||
        "";
      const specialtyName = a.doctor?.specialty?.name || a.specialty?.name || "";
      const date = formatDate(a.date);
      const time = formatTime(a);

      const hay = `${patientName} ${doctorName} ${specialtyName} ${date} ${time}`.toLowerCase();
      return hay.includes(term);
    });
  }, [appointments, q, status]);

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Citas (Admin)</h2>
          <p className="text-white/60 text-sm mt-1">
            Ver todas las citas y cambiar sus estados.
          </p>
        </div>

        <button
          onClick={fetchAll}
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

      <div className="mt-6 grid md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <label className="block text-sm text-white/70 mb-1">Buscar</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder=""
            className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-1">Estado</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="all" className="bg-zinc-900">Todos</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="bg-zinc-900">
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="mt-6 text-white/60">Cargando citas...</p>
      ) : filtered.length === 0 ? (
        <p className="mt-6 text-white/60">No hay citas con esos filtros.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-3xl border border-white/10 bg-black/20">
          <table className="min-w-full text-sm">
            <thead className="text-white/70">
              <tr className="border-b border-white/10">
                <th className="text-left p-4">Paciente</th>
                <th className="text-left p-4">Doctor</th>
                <th className="text-left p-4">Especialidad</th>
                <th className="text-left p-4">Fecha</th>
                <th className="text-left p-4">Hora</th>
                <th className="text-left p-4">Estado</th>
                <th className="text-left p-4">Acciones</th>
              </tr>
            </thead>

            <tbody className="text-white/80">
              {filtered.map((a) => {
                const id = idOf(a);

                const patient =
                  a.patient?.user?.username ||
                  a.patient?.user?.email ||
                  "—";
                const doctor =
                  a.doctor?.user?.username ||
                  a.doctor?.user?.email ||
                  "—";
                const spec =
                  a.doctor?.specialty?.name ||
                  a.specialty?.name ||
                  "—";

                return (
                  <tr
                    key={id}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="p-4">{patient}</td>
                    <td className="p-4">{doctor}</td>
                    <td className="p-4">{spec}</td>
                    <td className="p-4 whitespace-nowrap">{formatDate(a.date)}</td>
                    <td className="p-4 whitespace-nowrap">{formatTime(a)}</td>
                    <td className="p-4">
                      <Badge status={a.status} />
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {STATUS_OPTIONS.map((s) => (
                          <button
                            key={s}
                            disabled={a.status === s}
                            onClick={() => changeStatus(id, s)}
                            className={`rounded-xl px-3 py-2 text-xs ring-1 ring-white/10 transition
                              ${
                                a.status === s
                                  ? "bg-white/10 text-white/40 cursor-not-allowed"
                                  : "bg-white/10 hover:bg-white/15 text-white/80"
                              }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
