export default function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/80 ring-1 ring-white/10">
      {children}
    </span>
  );
}
