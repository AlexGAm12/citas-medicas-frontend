import { useEffect, useMemo, useState } from "react";
import {
  createDoctorRequest,
  deleteDoctorRequest,
  getDoctorsRequest,
  updateDoctorRequest,
} from "../../api/doctors";
import { getSpecialtiesRequest } from "../../api/specialties";
import { getUsersRequest } from "../../api/users";

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm text-white/70 mb-1">{label}</label>
      {children}
    </div>
  );
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [userId, setUserId] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [consultRoom, setConsultRoom] = useState("");

  const title = useMemo(
    () => (editingId ? "Editar doctor" : "Nuevo doctor"),
    [editingId]
  );

  const idOf = (o) => o?._id || o?.id;

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");

      const [dRes, sRes, uRes] = await Promise.all([
        getDoctorsRequest(),
        getSpecialtiesRequest(),
        getUsersRequest(),
      ]);

      setDoctors(dRes.data || []);
      setSpecialties(sRes.data || []);
      setUsers(uRes.data || []);

      if (!specialtyId && sRes.data?.length) {
        setSpecialtyId(idOf(sRes.data[0]));
      }
    } catch (e) {
      setError("Error cargando datos");
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
    setBio("");
    setConsultRoom("");
  };

  const onEdit = (doc) => {
    setEditingId(idOf(doc));
    setUserId(idOf(doc.user));
    setSpecialtyId(idOf(doc.specialty));
    setPhone(doc.phone || "");
    setBio(doc.bio || "");
    setConsultRoom(doc.consultRoom || "");
  };

  const onDelete = async (doc) => {
    if (!confirm("¿Eliminar doctor?")) return;
    await deleteDoctorRequest(idOf(doc));
    setMsg("Doctor eliminado ");
    fetchAll();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (!userId) return setError("Debes seleccionar un usuario");
    if (!specialtyId) return setError("Debes seleccionar una especialidad");

    const payload = {
      user: userId,
      specialty: specialtyId,
      phone,
      bio,
      consultRoom,
    };

    try {
      if (editingId) {
        await updateDoctorRequest(editingId, payload);
        setMsg("Doctor actualizado ");
      } else {
        await createDoctorRequest(payload);
        setMsg("Doctor creado ");
      }
      resetForm();
      fetchAll();
    } catch (e) {
      setError(e?.response?.data?.message?.[0] || "Error guardando doctor");
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

            <Field label="Especialidad">
              <select
                value={specialtyId}
                onChange={(e) => setSpecialtyId(e.target.value)}
                className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-white"
              >
                {specialties.map((s) => (
                  <option key={idOf(s)} value={idOf(s)}>
                    {s.name}
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

            <Field label="Consultorio">
              <input
                value={consultRoom}
                onChange={(e) => setConsultRoom(e.target.value)}
                className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-white"
              />
            </Field>

            <Field label="Biografía">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-white"
              />
            </Field>

            <button className="w-full rounded-xl bg-white text-black py-2 font-semibold">
              {editingId ? "Guardar cambios" : "Crear doctor"}
            </button>
          </form>
        </div>

        {/* LIST */}
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-black/20 p-6">
          <h3 className="text-xl font-semibold text-white">Doctores</h3>

          {loading ? (
            <p className="text-white/60 mt-4">Cargando...</p>
          ) : (
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              {doctors.map((d) => (
                <div key={idOf(d)} className="rounded-xl bg-white/5 p-4">
                  <p className="text-white font-semibold">
                    {d.user?.username}
                  </p>
                  <p className="text-white/60 text-sm">
                    {d.specialty?.name}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => onEdit(d)}
                      className="px-3 py-1 bg-white/10 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(d)}
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
