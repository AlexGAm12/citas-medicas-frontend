import { useEffect, useMemo, useState } from "react";
import {
  createPatientRequest,
  deletePatientRequest,
  getPatientsRequest,
  updatePatientRequest,
} from "../../api/patients";
import { getUsersRequest } from "../../api/users";

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm text-white/70 mb-1">{label}</label>
      {children}
    </div>
  );
}

const formatDateForUI = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("es-MX"); // 10/05/2000
};

const formatDateForInput = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    // por si ya viene "YYYY-MM-DD"
    return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
  }
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
};

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // form
  const [editingId, setEditingId] = useState(null);
  const [userId, setUserId] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [allergies, setAllergies] = useState("");
  const [notes, setNotes] = useState("");

  const title = useMemo(
    () => (editingId ? "Editar paciente" : "Nuevo paciente"),
    [editingId]
  );

  const idOf = (o) => o?._id || o?.id;

  const fetchAll = async () => {
    try {
      setLoading(true);
      setMsg("");
      setError("");

      const [pRes, uRes] = await Promise.all([getPatientsRequest(), getUsersRequest()]);

      setPatients(Array.isArray(pRes.data) ? pRes.data : []);
      setUsers(Array.isArray(uRes.data) ? uRes.data : []);
    } catch (e) {
      setError(e?.response?.data?.message?.[0] || "Error cargando pacientes/usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setUserId("");
    setPhone("");
    setDateOfBirth("");
    setGender("");
    setAllergies("");
    setNotes("");
  };

  const onEdit = (p) => {
    setMsg("");
    setError("");
    setEditingId(idOf(p));
    setUserId(idOf(p.user));
    setPhone(p.phone || "");
    setDateOfBirth(formatDateForInput(p.dateOfBirth)); 
    setGender(p.gender || "");
    setAllergies(p.allergies || "");
    setNotes(p.notes || "");
  };

  const onDelete = async (p) => {
    const id = idOf(p);
    if (!id) return;
    if (!confirm("¿Eliminar paciente?")) return;

    try {
      setMsg("");
      setError("");
      await deletePatientRequest(id);
      setMsg("Paciente eliminado ");
      await fetchAll();
    } catch (e) {
      setError(e?.response?.data?.message?.[0] || "Error eliminando paciente");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (!userId) return setError("Debes seleccionar un usuario");

    const payload = {
      user: userId,
      phone: phone || undefined,
      dateOfBirth: dateOfBirth || undefined,
      gender: gender || undefined,
      allergies: allergies || undefined,
      notes: notes || undefined,
    };

    try {
      if (editingId) {
        await updatePatientRequest(editingId, payload);
        setMsg("Paciente actualizado ");
      } else {
        await createPatientRequest(payload);
        setMsg("Paciente creado ");
      }
      resetForm();
      await fetchAll();
    } catch (e2) {
      setError(e2?.response?.data?.message?.[0] || "Error guardando paciente");
    }
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* FORM */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white">{title}</h2>

          {msg && <p className="mt-3 text-emerald-300">{msg}</p>}
          {error && <p className="mt-3 text-red-300">{error}</p>}

          <form onSubmit={onSubmit} className="mt-5 space-y-3">
            <Field label="Usuario">
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-white"
              >
                <option value="">Selecciona usuario</option>
                {users.map((u) => (
                  <option key={idOf(u)} value={idOf(u)}>
                    {u.username} ({u.email})
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Teléfono">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-white"
              />
            </Field>

            <Field label="Fecha de nacimiento">
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-white"
              />
            </Field>

            <Field label="Género">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-white"
              >
                <option value="">Selecciona</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </Field>

            <Field label="Alergias">
              <input
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-white"
              />
            </Field>

            <Field label="Notas">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-white"
              />
            </Field>

            <div className="flex gap-2">
              <button className="flex-1 rounded-xl bg-white text-black py-2 font-semibold">
                {editingId ? "Guardar cambios" : "Crear paciente"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl bg-white/10 text-white py-2 px-4 font-semibold"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* LIST */}
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-black/20 p-6">
          <h3 className="text-xl font-semibold text-white">Pacientes</h3>

          {loading ? (
            <p className="text-white/60 mt-4">Cargando...</p>
          ) : (
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              {patients.map((p) => (
                <div key={idOf(p)} className="rounded-xl bg-white/5 p-4">
                  <p className="text-white font-semibold">{p.user?.username}</p>

                  <p className="text-white/60 text-sm">
                    {p.gender || "—"} · {formatDateForUI(p.dateOfBirth)}
                  </p>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => onEdit(p)}
                      className="px-3 py-1 bg-white/10 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(p)}
                      className="px-3 py-1 bg-red-500/20 text-red-300 rounded"
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
