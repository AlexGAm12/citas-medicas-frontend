import { useEffect, useMemo, useState } from "react";
import {
  createSpecialtyRequest,
  deleteSpecialtyRequest,
  getSpecialtiesRequest,
  updateSpecialtyRequest,
} from "../../api/specialties";

export default function SpecialtiesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // form
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const title = useMemo(() => (editingId ? "Editar especialidad" : "Nueva especialidad"), [editingId]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getSpecialtiesRequest();
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError(e?.response?.data?.message?.[0] || "No se pudieron cargar las especialidades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const resetForm = () => {
    setName("");
    setEditingId(null);
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setMsg("");
    setError("");

    const trimmed = name.trim();
    if (!trimmed) {
      setError("El nombre es requerido");
      return;
    }

    try {
      if (editingId) {
        await updateSpecialtyRequest(editingId, { name: trimmed });
        setMsg("Especialidad actualizada ");
      } else {
        await createSpecialtyRequest({ name: trimmed });
        setMsg("Especialidad creada ");
      }
      resetForm();
      await fetchAll();
    } catch (e) {
      setError(e?.response?.data?.message?.[0] || "Error guardando especialidad");
    }
  };

  const onEdit = (sp) => {
    setEditingId(sp._id || sp.id);
    setName(sp.name || "");
    setMsg("");
    setError("");
  };

  const onDelete = async (sp) => {
    const id = sp._id || sp.id;
    setMsg("");
    setError("");

    if (!id) return;

    if (!confirm(`¿Eliminar la especialidad "${sp.name}"?`)) return;

    try {
      await deleteSpecialtyRequest(id);
      setMsg("Especialidad eliminada ");
      await fetchAll();
    } catch (e) {
      setError(e?.response?.data?.message?.[0] || "Error eliminando especialidad");
    }
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* FORM */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <p className="text-white/60 text-sm mt-1">Administra el catálogo de especialidades.</p>

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
            <div>
              <label className="block text-sm text-white/70 mb-1">Nombre</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=""
                className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-2xl px-4 py-3 text-sm font-semibold text-black bg-white hover:bg-white/90 transition"
              >
                {editingId ? "Guardar cambios" : "Crear"}
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
            <h3 className="text-xl font-semibold text-white">Especialidades</h3>
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
            <div className="mt-6 text-white/60">No hay especialidades aún.</div>
          ) : (
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {items.map((sp) => {
                const id = sp._id || sp.id;
                return (
                  <div key={id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-white font-semibold">{sp.name}</p>
                    <p className="text-white/50 text-xs mt-1">ID: {id}</p>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => onEdit(sp)}
                        className="flex-1 rounded-2xl px-3 py-2 text-sm text-white bg-white/10 hover:bg-white/15 transition ring-1 ring-white/10"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(sp)}
                        className="flex-1 rounded-2xl px-3 py-2 text-sm text-red-200 bg-red-500/10 hover:bg-red-500/15 transition ring-1 ring-red-400/20"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
