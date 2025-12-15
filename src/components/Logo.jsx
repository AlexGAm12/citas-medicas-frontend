export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-9 w-9 rounded-xl bg-white/10 ring-1 ring-white/10 grid place-items-center">
        <span className="text-lg">🩺</span>
      </div>
      <div className="leading-tight">
        <p className="text-white font-semibold tracking-tight">Citas Médicas</p>
        <p className="text-white/60 text-xs">Sistema de agenda clínica</p>
      </div>
    </div>
  );
}
