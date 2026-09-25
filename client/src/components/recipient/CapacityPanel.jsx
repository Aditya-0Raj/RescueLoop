import { Clock3, Pencil, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';

export default function CapacityPanel({ profile, onSave }) {
  return (
    <div className="surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Live receiving capacity</p>
          <div className="mt-2 flex items-end gap-2">
            <p className="text-3xl font-semibold tracking-tight">{profile.capacityNow} kg</p>
            <span className="pb-1 text-xs text-slate-400">available now</span>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${profile.accepting ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-slate-500'}`}>{profile.accepting ? 'Currently accepting' : 'Not accepting'}</span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-[#fbfaf7] p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><Clock3 size={14} className="text-forest" /> Open until</div>
          <p className="mt-2 text-sm font-semibold">{profile.openUntil}</p>
        </div>
        <div className="rounded-xl bg-[#fbfaf7] p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><ShieldCheck size={14} className="text-forest" /> Storage</div>
          <p className="mt-2 text-sm font-semibold">{profile.storage}</p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold text-slate-500">Accepted food types</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {profile.acceptedFoodTypes.map((type) => <span key={type} className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{type}</span>)}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
        <p className="text-xs text-slate-400">Keep this number accurate. It affects matching.</p>
        <Button onClick={onSave}><Pencil size={14} className="mr-1.5 inline" />Update</Button>
      </div>
    </div>
  );
}
