import { ArrowRight, Clock3, Navigation, ShieldCheck, UserRound } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function RescuePlanCard({ title = 'Primary Plan', recipient, driver, eta, buffer, selected = false, backup = false, distance = '2.4 km' }) {
  return (
    <div className={`rounded-2xl border p-4 ${selected ? 'border-forest/25 bg-emerald-50/55' : 'border-line bg-white'}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-full ${backup ? 'bg-stone-100 text-slate-500' : 'bg-white text-forest ring-1 ring-forest/10'}`}>
            {backup ? <Navigation size={16} /> : <ShieldCheck size={16} />}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.15em] text-slate-400">{title}</p>
            <p className="mt-0.5 text-sm font-semibold">{recipient}</p>
          </div>
        </div>
        <StatusBadge status={backup ? 'Posted' : 'Secured'} />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-4">
        <Mini label="Driver" value={driver} icon={UserRound} />
        <Mini label="ETA" value={`${eta} min`} icon={Clock3} />
        <Mini label="Safety buffer" value={`${buffer} min`} icon={ShieldCheck} />
        <Mini label="Distance" value={distance} icon={Navigation} />
      </div>

      {selected && <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-forest"><Clock3 size={14} /> Highest deadline viability <ArrowRight size={13} /></div>}
    </div>
  );
}

function Mini({ label, value, icon: Icon }) {
  return <div className="rounded-lg bg-stone-50 p-2.5"><div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[.12em] text-slate-400"><Icon size={12} /> {label}</div><p className="mt-1 truncate text-xs font-semibold text-slate-700">{value}</p></div>;
}
