import { useEffect, useMemo, useState } from "react";
import axios from "../../api/axios";

const toYMD = (d) => d.toISOString().slice(0, 10);

export default function ReportsPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    const today = new Date();
    const seven = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    setFrom(toYMD(seven));
    setTo(toYMD(today));
  }, []);

  const canFetch = useMemo(() => {
    return /^\d{4}-\d{2}-\d{2}$/.test(from) && /^\d{4}-\d{2}-\d{2}$/.test(to);
  }, [from, to]);

  const fetchReports = async () => {
    if (!canFetch) return;
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`/reports?from=${from}&to=${to}`);
      setData(res.data);
    } catch (e) {
      const m =
        e?.response?.data?.message?.[0] ||
        e?.response?.data?.message ||
        "No se pudieron cargar reportes";
      setError(String(m));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canFetch) fetchReports();
  }, [canFetch]);

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reportes</h1>
          <p className="text-white/60 text-sm mt-1">
            Citas por estatus, doctor, especialidad y por día.
          </p>
        </div>

        <button
          onClick={fetchReports}
          disabled={!canFetch || loading}
          className="rounded-2xl px-4 py-2 text-sm text-white/80 bg-white/10 hover:bg-white/15 transition ring-1 ring-white/10 disabled:opacity-50"
        >
          Refrescar
        </button>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-6">
        <div className="grid lg:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm text-white/70 mb-1">Desde</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">Hasta</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>

          <button
            onClick={fetchReports}
            disabled={!canFetch || loading}
            className="rounded-2xl px-4 py-3 text-sm font-semibold text-black bg-white hover:bg-white/90 transition disabled:opacity-50"
          >
            Aplicar filtros
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-red-200 text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <Box title="Resumen por estatus">
          {loading ? (
            <Muted>Cargando...</Muted>
          ) : !data?.byStatus?.length ? (
            <Muted>Sin datos</Muted>
          ) : (
            <ul className="space-y-2">
              {data.byStatus.map((x) => (
                <li
                  key={x._id || "status"}
                  className="flex justify-between text-white/80 text-sm"
                >
                  <span>{x._id}</span>
                  <span className="text-white">{x.total}</span>
                </li>
              ))}
            </ul>
          )}
        </Box>

        <Box title="Citas por día">
          {loading ? (
            <Muted>Cargando...</Muted>
          ) : !data?.byDay?.length ? (
            <Muted>Sin datos</Muted>
          ) : (
            <ul className="space-y-2">
              {data.byDay.map((x) => (
                <li
                  key={x._id || "day"}
                  className="flex justify-between text-white/80 text-sm"
                >
                  <span>{x._id}</span>
                  <span className="text-white">{x.total}</span>
                </li>
              ))}
            </ul>
          )}
        </Box>

        <Box title="Citas por doctor">
          {loading ? (
            <Muted>Cargando...</Muted>
          ) : !data?.byDoctor?.length ? (
            <Muted>Sin datos</Muted>
          ) : (
            <ul className="space-y-2">
              {data.byDoctor.map((x) => (
                <li
                  key={x._id || x.name || "doctor"}
                  className="flex justify-between text-white/80 text-sm"
                >
                  <span>{x.name || "Doctor"}</span>
                  <span className="text-white">{x.total}</span>
                </li>
              ))}
            </ul>
          )}
        </Box>

        <Box title="Citas por especialidad">
          {loading ? (
            <Muted>Cargando...</Muted>
          ) : !data?.bySpecialty?.length ? (
            <Muted>Sin datos</Muted>
          ) : (
            <ul className="space-y-2">
              {data.bySpecialty.map((x) => (
                <li
                  key={x._id || x.name || "specialty"}
                  className="flex justify-between text-white/80 text-sm"
                >
                  <span>{x.name || "Sin especialidad"}</span>
                  <span className="text-white">{x.total}</span>
                </li>
              ))}
            </ul>
          )}
        </Box>
      </div>
    </div>
  );
}

function Box({ title, children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Muted({ children }) {
  return <div className="text-white/60 text-sm">{children}</div>;
}
