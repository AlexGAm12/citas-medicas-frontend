import { useEffect, useMemo, useState } from "react";
import { getMyAppointmentsRequest } from "../../api/appointments";

const HISTORY_STATUSES = new Set(["atendida", "cancelada", "no_show"]);

const STATUS_BADGE = {
  atendida: "bg-blue-500/20 text-blue-200",
  cancelada: "bg-red-500/20 text-red-200",
  no_show: "bg-zinc-500/20 text-zinc-200",
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

export default function PatientHistoryPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  const idOf = (o) => o?._id || o?.id;

  const fetchMine = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getMyAppointmentsRequest();
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError(e?.response?.data?.message?.[0] || "No se pudo cargar tu historial");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMine();
  }, []);

  const history = useMemo(() => {
    const term = q.trim().toLowerCase();

    return appointments
      .filter((a) => HISTORY_STATUSES.has(a.status))
      .filter((a) => {
        if (!term) return true;

        const doctor =
          a.doctor?.user?.username ||
          a.doctor?.user?.email ||
          "";
        const spec = a.doctor?.specialty?.name || "";
        const date = a.date || "";
        const time = a.startTime || a.time || "";
        const hay = `${doctor} ${spec} ${date} ${time} ${a.status}`.toLowerCase();

        return hay.includes(term);
      })
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  }, [appointments, q]);

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Historial</h2>
          <p className="text-white/60 text-sm mt-1">
            Citas atendidas, canceladas o no asistidas.
          </p>
        </div>

        <button
          onClick={fetchMine}
          className="rounded-2xl px-4 py-2 text-sm text-white/80 bg-white/10 hover:bg-white/15 transition ring-1 ring-white/10 w-fit"
        >
          Refrescar
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="mt-6">
        <label className="block text-sm text-white/70 mb-1">Buscar</label>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder=""
          className="w-full max-w-xl rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
        />
      </div>

      {loading ? (
        <p className="mt-6 text-white/60">Cargando...</p>
      ) : history.length === 0 ? (
        <p className="mt-6 text-white/60">Aún no tienes historial.</p>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map((a) => (
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
                    {a.date || "—"} ·{" "}
                    {(a.startTime && a.endTime)
                      ? `${a.startTime} - ${a.endTime}`
                      : (a.time || "—")}
                  </p>
                </div>
                <Badge status={a.status} />
              </div>

              {a.reason && (
                <p className="mt-3 text-sm text-white/60">
                  Motivo: {a.reason}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
