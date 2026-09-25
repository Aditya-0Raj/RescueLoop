export default function ImpactChart({ values = [] }) {
  const max = Math.max(...values, 1);
  return <div className="flex h-48 items-end gap-3">{values.map((value, i) => <div key={i} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-md bg-forest/85" style={{ height: `${Math.max(8, (value / max) * 150)}px` }} /><span className="text-[10px] text-slate-400">{i + 1}</span></div>)}</div>;
}
