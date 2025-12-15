import { useEffect, useMemo, useState } from "react";
import { getDoctorsRequest } from "../../api/doctors";
import {
  createAvailabilityRequest,
  deleteAvailabilityRequest,
  getAvailabilityByDoctorRequest,
  updateAvailabilityRequest,
} from "../../api/availability";

/* =========================
   Helpers
========================= */

const DAYS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const toYMD = (value) => {
  if (!value) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

const weekdayFromYMD = (ymd) => {
  if (!ymd) return "";
  const [y, m, d] = ymd.split("-").map(Number);
  const date = new Date(y, m - 1, d); // LOCAL
  return DAYS[date.getDay()];
};

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm text-white/70 mb-1">{label}</label>
      {children}
    </div>
  );
}

/* =========================
   Component
========================= */

export default function DoctorAvailabilityAdminPage() {
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [availability, setAvailability] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("14:00");
  const [slotDuration, setSlotDuration] = useState(30);
  const [isActive, setIsActive] = useState(true);

  const idOf = (o) => o?._id || o?.id;

  const selectedDoctor = useMemo(
    () => doctors.find((d) => idOf(d) === doctorId),
    [doctors, doctorId]
  );

  const resetForm = () => {
    setEditingId(null);
    setDate("");
    setStartTime("09:00");
    setEndTime("14:00");
    setSlotDuration(30);
    setIsActive(true);
  };

  /* =========================
     Load data
  ========================= */

  const loadDoctors = async () => {
    const res = await getDoctorsRequest();
    const list = Array.isArray(res.data) ? res.data : [];
    setDoctors(list);
    if (!doctorId && list.length) setDoctorId(idOf(list[0]));
  };

  const loadAvailability = async (docId) => {
    if (!docId) return setAvailability([]);
    const res = await getAvailabilityByDoctorRequest(docId);
    setAvailability(Array.isArray(res.data?.availability) ? res.data.availability : []);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await loadDoctors();
      } catch {
        setError("No se pudieron cargar los doctores");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    loadAvailability(doctorId);
  }, [doctorId]);

  /* =========================
     Actions
  ========================= */

  const onEdit = (a) => {
    setEditingId(idOf(a));
    setDate(toYMD(a.date));
    setStartTime(a.startTime);
    setEndTime(a.endTime);
    setSlotDuration(Number(a.slotDuration));
    setIsActive(a.isActive !== false);
  };

  const onDelete = async (a) => {
    if (!confirm("¿Eliminar esta disponibilidad?")) return;
    await deleteAvailabilityRequest(idOf(a));
    setMsg("Disponibilidad eliminada");
    loadAvailability(doctorId);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (!doctorId) return setError("Selecciona un doctor");
    if (!date) return setError("Selecciona una fecha");

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
        setMsg("Disponibilidad actualizada");
      } else {
        await createAvailabilityRequest(payload);
        setMsg("Disponibilidad creada");
      }
      resetForm();
      loadAvailability(doctorId);
    } catch (e) {
      setError(e?.response?.data?.message?.[0] || "Error guardando disponibilidad");
    }
  };

  /* =========================
     Render
  ========================= */

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* FORM */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white">
            Disponibilidad por Doctor (Admin)
          </h2>

          {msg && (
            <div className="mt-4 rounded-2xl bg-emerald-500/10 p-3 text-emerald-200 text-sm">
              {msg}
            </div>
          )}
          {error && (
            <div className="mt-4 rounded-2xl bg-red-500/10 p-3 text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="mt-5 space-y-3">
            <Field label="Doctor">
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white"
              >
                {doctors.map((d) => (
                  <option key={idOf(d)} value={idOf(d)} className="bg-zinc-900">
                    {d.user?.username} · {d.specialty?.name || "Sin especialidad"}
                  </option>
                ))}
              </select>
            </Field>

            <form onSubmit={onSubmit} className="space-y-3">
              <Field label="Fecha">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white"
                />
              </Field>

              <Field label="Día (automático)">
                <input
                  readOnly
                  value={date ? weekdayFromYMD(date) : ""}
                  placeholder="Selecciona una fecha"
                  className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white/80"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Hora inicio">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white"
                  />
                </Field>

                <Field label="Hora fin">
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white"
                  />
                </Field>
              </div>

              <Field label="Duración por cita (minutos)">
                <input
                  type="number"
                  min={5}
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(e.target.value)}
                  className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white"
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
                  className="flex-1 rounded-2xl px-4 py-3 text-sm font-semibold text-black bg-white"
                >
                  {editingId ? "Guardar cambios" : "Crear disponibilidad"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-2xl px-4 py-3 text-sm text-white/80 bg-white/10"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* LIST */}
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-black/20 p-6">
          <h3 className="text-xl font-semibold text-white">Disponibilidad</h3>

          {availability.length === 0 ? (
            <p className="mt-6 text-white/60">Este doctor aún no tiene disponibilidad.</p>
          ) : (
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {availability.map((a) => (
                <div key={idOf(a)} className="rounded-2xl bg-white/5 p-5">
                  <p className="text-white/80 text-sm">
                    Día: {weekdayFromYMD(toYMD(a.date))}
                  </p>
                  <p className="text-white/50 text-xs mt-1">
                    Fecha: {toYMD(a.date)}
                  </p>
                  <p className="text-white/80 text-sm mt-1">
                    {a.startTime} - {a.endTime} · {a.slotDuration} min
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => onEdit(a)}
                      className="flex-1 rounded-2xl px-3 py-2 text-sm bg-white/10 text-white"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(a)}
                      className="flex-1 rounded-2xl px-3 py-2 text-sm bg-red-500/10 text-red-200"
                    >
                      Eliminar
                    </button>
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
