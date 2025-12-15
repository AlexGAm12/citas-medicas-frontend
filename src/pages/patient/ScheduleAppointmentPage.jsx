import { useEffect, useMemo, useState } from "react";
import { getSpecialtiesRequest } from "../../api/specialties";
import { getDoctorsRequest } from "../../api/doctors";
import { api } from "../../api/axios";
import {
  createAppointmentRequest,
  getAvailableSlotsRequest,
} from "../../api/appointments";

export default function ScheduleAppointmentPage() {
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [specialtyId, setSpecialtyId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");

  const [patientId, setPatientId] = useState("");

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const idOf = (o) => o?._id || o?.id;

  useEffect(() => {
    (async () => {
      try {
        const [sRes, dRes] = await Promise.all([
          getSpecialtiesRequest(),
          getDoctorsRequest(),
        ]);
        setSpecialties(Array.isArray(sRes.data) ? sRes.data : []);
        setDoctors(Array.isArray(dRes.data) ? dRes.data : []);
      } catch {
        setError("No se pudieron cargar especialidades/doctores");
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const me = await api.get("/patients/me");
        const pid = idOf(me.data);
        if (pid) setPatientId(pid);
      } catch {}
    })();
  }, []);

  const doctorsFiltered = useMemo(() => {
    if (!specialtyId) return doctors;
    return doctors.filter((d) => idOf(d.specialty) === specialtyId);
  }, [doctors, specialtyId]);

  const onSearchSlots = async () => {
    setMsg("");
    setError("");
    setSelectedSlot(null);
    setSlots([]);

    if (!doctorId) return setError("Selecciona un doctor");
    if (!date) return setError("Selecciona una fecha");

    try {
      setLoading(true);
      const res = await getAvailableSlotsRequest({ doctorId, date });

      const list = Array.isArray(res.data?.slots) ? res.data.slots : [];
      setSlots(list);

      if (list.length === 0) setMsg("No hay citas disponibles para esa fecha.");
    } catch (e) {
      setError(e?.response?.data?.message?.[0] || "No se pudieron cargar citas");
    } finally {
      setLoading(false);
    }
  };

  const onCreate = async () => {
    setMsg("");
    setError("");

    if (!patientId) return setError("No se detectó tu perfil de paciente (patientId).");
    if (!doctorId) return setError("Selecciona un doctor");
    if (!date) return setError("Selecciona una fecha");
    if (!selectedSlot) return setError("Selecciona una cita");

    try {
      setLoading(true);

      await createAppointmentRequest({
        doctor: doctorId,
        patient: patientId,
        specialty: specialtyId || undefined,
        date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        reason: reason || undefined,
      });

      setMsg("Cita creada ");
      setReason("");
      setSelectedSlot(null);
      await onSearchSlots();
    } catch (e) {
      setError(e?.response?.data?.message?.[0] || "No se pudo crear la cita");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-4xl">
      <h2 className="text-2xl font-semibold text-white">Agendar Cita</h2>
      <p className="text-white/60 text-sm mt-1">
        Selecciona especialidad, doctor y una cita disponible.
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

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white">Datos</h3>

          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm text-white/70 mb-1">Especialidad</label>
              <select
                value={specialtyId}
                onChange={(e) => setSpecialtyId(e.target.value)}
                className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white"
              >
                <option value="">Todas</option>
                {specialties.map((s) => (
                  <option key={idOf(s)} value={idOf(s)} className="bg-zinc-900">
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1">Doctor</label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white"
              >
                <option value="">Selecciona</option>
                {doctorsFiltered.map((d) => (
                  <option key={idOf(d)} value={idOf(d)} className="bg-zinc-900">
                    {d.user?.username} · {d.specialty?.name || "—"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1">Motivo (opcional)</label>
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white"
                placeholder=""
              />
            </div>

            <button
              onClick={onSearchSlots}
              disabled={loading}
              className="w-full rounded-2xl px-4 py-3 text-sm font-semibold text-black bg-white hover:bg-white/90 transition"
            >
              {loading ? "Buscando..." : "Buscar citas disponibles"}
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
          <h3 className="text-lg font-semibold text-white">Citas disponibles</h3>
          <p className="text-white/60 text-sm mt-1">
            Selecciona uno para crear tu cita.
          </p>

          {slots.length === 0 ? (
            <p className="mt-6 text-white/60">Aún no hay citas para mostrar.</p>
          ) : (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {slots.map((s, idx) => {
                const active =
                  selectedSlot?.startTime === s.startTime &&
                  selectedSlot?.endTime === s.endTime;

                return (
                  <button
                    key={`${s.startTime}-${s.endTime}-${idx}`}
                    onClick={() => setSelectedSlot(s)}
                    className={`rounded-2xl px-3 py-3 text-sm ring-1 transition
                      ${active
                        ? "bg-white text-black ring-white"
                        : "bg-white/10 text-white/80 ring-white/10 hover:bg-white/15"
                      }`}
                  >
                    {s.startTime} - {s.endTime}
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={onCreate}
            disabled={loading || !selectedSlot}
            className={`mt-6 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition
              ${selectedSlot
                ? "bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/25 ring-1 ring-emerald-400/20"
                : "bg-white/10 text-white/40 cursor-not-allowed ring-1 ring-white/10"
              }`}
          >
            {loading ? "Creando..." : "Crear cita"}
          </button>
        </div>
      </div>
    </div>
  );
}
