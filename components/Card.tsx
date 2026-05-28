export function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-6 shadow-2xl shadow-cyan-950/20">{title && <h2 className="mb-4 text-xl font-bold text-cyan-300">{title}</h2>}{children}</section>;
}
