export default function MetricCard({ label, value, helper = '', icon: Icon, accent = 'forest' }) {
  const accents = { forest: 'bg-emerald-50 text-forest', amber: 'bg-orange-50 text-terracotta', neutral: 'bg-stone-100 text-slate-600' };
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">{value}</p>
          {helper && <p className="mt-1 text-xs text-slate-400">{helper}</p>}
        </div>
        {Icon && <div className={`rounded-lg p-2.5 ${accents[accent]}`}><Icon size={19} /></div>}
      </div>
    </div>
  );
}
