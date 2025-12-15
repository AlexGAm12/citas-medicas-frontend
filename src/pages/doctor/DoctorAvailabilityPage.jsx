import { useEffect, useMemo, useState } from "react";
import {
  createAvailabilityRequest,
  deleteAvailabilityRequest,
  getMyAvailabilityRequest,
  updateAvailabilityRequest,
} from "../../api/availability";

const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm text-white/70 mb-1">{label}</label>
      {children}
    </div>
  );
}

export default function DoctorAvailabilityPage() {
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [doctor, setDoctor] = useState(null);
  const [items, setItems] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [date, setDate] = useState(""); 
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("14:00");
  const [slotDuration, setSlotDuration] = useState(30);
  const [isActive, setIsActive] = useState(true);

  const title = useMemo(
    () => (editingId ? "Editar disponibilidad" : "Nueva disponibilidad"),
    [editingId]
  );

  const idOf = (o) => o?._id || o?.id;

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getMyAvailabilityRequest();
      setDoctor(res.data?.doctor || null);
      setItems(Array.isArray(res.data?.availability) ? res.data.availability : []);
    } catch (e) {
      setError(e?.response?.data?.message?.[0] || "No se pudo cargar tu disponibilidad");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setDate("");
    setStartTime("09:00");
    setEndTime("14:00");
    setSlotDuration(30);
    setIsActive(true);
  };

  const onEdit = (a) => {
    setMsg("");
    setError("");
    setEditingId(idOf(a));
    setDate(formatDate(a.date));
    setStartTime(a.startTime);
    setEndTime(a.endTime);
    setSlotDuration(Number(a.slotDuration));
    setIsActive(a.isActive !== false);
  };

  const onDelete = async (a) => {
    const id = idOf(a);
    if (!id) return;
    if (!confirm("¿Eliminar esta disponibilidad?")) return;

    try {
      await deleteAvailabilityRequest(id);
      setMsg("Disponibilidad eliminada ");
      await fetchAll();
    } catch (e) {
      setError(e?.response?.data?.message?.[0] || "Error eliminando disponibilidad");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    const doctorId = idOf(doctor);
    if (!doctorId) return setError("No se detectó tu perfil de doctor.");

    if (!date) return setError("Selecciona una fecha");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return setError("Formato de fecha inválido (YYYY-MM-DD)");

    if (!/^\d{2}:\d{2}$/.test(startTime) || !/^\d{2}:\d{2}$/.test(endTime)) {
      return setError("Formato de hora inválido. Usa HH:MM");
    }
    if (Number(slotDuration) < 5) return setError("slotDuration mínimo: 5 minutos");

    const payload = {
      doctor: doctorId,
      date, 
      startTime,
      endTime,
      slotDuration: Number(slotDuration),
      isActive,
    };

    try {
      if (editingId) {
        await updateAvailabilityRequest(editingId, payload);
        setMsg("Disponibilidad actualizada ");
      } else {
        await createAvailabilityRequest(payload);
        setMsg("Disponibilidad creada ");
      }
      resetForm();
      await fetchAll();
    } catch (e2) {
      setError(e2?.response?.data?.message?.[0] || "Error guardando disponibilidad");
    }
  };

  const grouped = useMemo(() => {
    const map = new Map();
    for (const a of items) {
      const key = formatDate(a.date) || "sin-fecha";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(a);
    }
    // ordena por hora
    for (const [k, arr] of map.entries()) {
      arr.sort((x, y) => String(x.startTime).localeCompare(String(y.startTime)));
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [items]);

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* FORM */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <p className="text-white/60 text-sm mt-1">
            Configura tus horarios por fecha para que los pacientes puedan agendar.
          </p>

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

          <form onSubmit={onSubmit} className="mt-5 space-y-3">
            <Field label="Fecha">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Hora inicio">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                />
              </Field>

              <Field label="Hora fin">
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                />
              </Field>
            </div>

            <Field label="Duración por cita (minutos)">
              <input
                type="number"
                min={5}
                value={slotDuration}
                onChange={(e) => setSlotDuration(e.target.value)}
                className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
              />
            </Field>

            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              Activo
            </label>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 rounded-2xl px-4 py-3 text-sm font-semibold text-black bg-white hover:bg-white/90 transition"
              >
                {editingId ? "Guardar cambios" : "Crear disponibilidad"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl px-4 py-3 text-sm font-semibold text-white/80 bg-white/10 hover:bg-white/15 transition ring-1 ring-white/10"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* LIST */}
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-white">Mi disponibilidad</h3>
              <p className="text-white/60 text-sm">
                {doctor?.user?.username ? `Doctor: ${doctor.user.username}` : ""}
                {doctor?.specialty?.name ? ` · ${doctor.specialty.name}` : ""}
              </p>
            </div>

            <button
              onClick={fetchAll}
              className="rounded-2xl px-4 py-2 text-sm text-white/80 bg-white/10 hover:bg-white/15 transition ring-1 ring-white/10"
            >
              Refrescar
            </button>
          </div>

          {loading ? (
            <div className="mt-6 text-white/60">Cargando...</div>
          ) : items.length === 0 ? (
            <div className="mt-6 text-white/60">Aún no tienes disponibilidad.</div>
          ) : (
            <div className="mt-6 space-y-5">
              {grouped.map(([d, arr]) => (
                <div key={d} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-white font-semibold">Fecha: {d}</p>

                  <div className="mt-3 grid sm:grid-cols-2 gap-3">
                    {arr.map((a) => (
                      <div key={idOf(a)} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-white/80 text-sm">
                          {a.startTime} - {a.endTime} · {a.slotDuration} min
                        </p>
                        <p className="text-white/50 text-xs mt-1">
                          {a.isActive === false ? "Inactivo" : "Activo"}
                        </p>

                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => onEdit(a)}
                            className="flex-1 rounded-2xl px-3 py-2 text-sm text-white bg-white/10 hover:bg-white/15 transition ring-1 ring-white/10"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => onDelete(a)}
                            className="flex-1 rounded-2xl px-3 py-2 text-sm text-red-200 bg-red-500/10 hover:bg-red-500/15 transition ring-1 ring-red-400/20"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
