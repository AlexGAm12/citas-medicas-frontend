import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";
import Badge from "./Badge";

function NavButton({ to, children }) {
  return (
    <Link
      to={to}
      className="rounded-xl px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition ring-1 ring-white/10"
    >
      {children}
    </Link>
  );
}

function ConfirmLogoutModal({ open, onCancel, onConfirm, loading }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onCancel}
        className="absolute inset-0 bg-black/60"
      />

      {/* Modal */}
      <div className="relative w-[92%] max-w-sm rounded-2xl border border-white/10 bg-zinc-900/90 backdrop-blur p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-500/15 ring-1 ring-yellow-500/20">
            <span className="text-yellow-300 text-lg">⚠️</span>
          </div>

          <div className="flex-1">
            <h3 className="text-white font-semibold">Confirmar salida</h3>
            <p className="mt-1 text-sm text-white/70">
              ¿Estás seguro que deseas cerrar sesion?
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white/80 bg-red-500/10 hover:bg-red-500/15 transition ring-1 ring-red-400/20 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-black bg-emerald-400 hover:bg-emerald-300 transition disabled:opacity-50"
          >
            {loading ? "Saliendo..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const { isAuthenticated, user, signout } = useAuth();
  const navigate = useNavigate();

  const [openLogout, setOpenLogout] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  const roleLabel = user?.role ? `Rol: ${user.role}` : null;

  const getMainMenuPath = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "doctor") return "/doctor";
    return "/patient";
  };

  const handleLogoutConfirm = async () => {
    try {
      setLoadingLogout(true);
      await signout();
      setOpenLogout(false);
      navigate("/login");
    } finally {
      setLoadingLogout(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40">
        <div className="backdrop-blur bg-black/20 border-b border-white/10">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/" className="hover:opacity-90 transition">
              <Logo />
            </Link>

            <div className="flex items-center gap-2">
              {!isAuthenticated ? (
                <>
                  <NavButton to="/login">Iniciar sesión</NavButton>

                  <Link
                    to="/register"
                    className="rounded-xl px-3 py-2 text-sm font-medium text-black bg-white hover:bg-white/90 transition"
                  >
                    Crear cuenta
                  </Link>
                </>
              ) : (
                <>
                  <NavButton to={getMainMenuPath()}>Menú principal</NavButton>

                  <Badge>{user?.username}</Badge>
                  <Badge>{roleLabel}</Badge>

                  <button
                    type="button"
                    onClick={() => setOpenLogout(true)}
                    className="rounded-xl px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition ring-1 ring-white/10"
                  >
                    Salir
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modal confirmación */}
      <ConfirmLogoutModal
        open={openLogout}
        loading={loadingLogout}
        onCancel={() => setOpenLogout(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}
