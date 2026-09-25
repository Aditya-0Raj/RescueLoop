import { ArrowUpRight, Clock3, Package, Route } from 'lucide-react';
import Button from '../common/Button';
import Countdown from '../common/Countdown';

export default function RescueJobCard({ rescue, onAccept }) {
  return (
    <article className="surface p-5 transition hover:-translate-y-0.5 hover:border-forest/20 hover:shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-forest"><TruckIcon /></div>
          <div>
            <p className="text-sm font-semibold">{rescue.foodName}</p>
            <p className="mt-1 text-xs text-slate-400">Rescue {rescue.id}</p>
          </div>
        </div>
        <Countdown minutes={24} urgent />
      </div>

      <div className="mt-5 rounded-xl bg-[#fbfaf7] p-3">
        <div className="flex gap-3">
          <div className="flex flex-col items-center pt-1"><span className="h-2.5 w-2.5 rounded-full bg-forest" /><span className="my-1 h-8 border-l border-dashed border-slate-300" /><span className="h-2.5 w-2.5 rounded-full bg-terracotta" /></div>
          <div className="flex-1 space-y-4">
            <div><p className="text-[10px] uppercase tracking-[.14em] text-slate-400">Pickup</p><p className="mt-1 text-sm font-semibold">{rescue.donor}</p><p className="mt-0.5 text-xs text-slate-500">MG Road</p></div>
            <div><p className="text-[10px] uppercase tracking-[.14em] text-slate-400">Drop</p><p className="mt-1 text-sm font-semibold">{rescue.recipient}</p><p className="mt-0.5 text-xs text-slate-500">Indiranagar</p></div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <Meta icon={Package} value={`${rescue.quantity} ${rescue.unit}`} />
        <Meta icon={Clock3} value={`Arrive ${rescue.pickupDeadline}`} />
        <Meta icon={Route} value={`${rescue.eta} min`} />
      </div>

      <Button className="mt-5 w-full" onClick={() => onAccept?.(rescue)}>Accept rescue job</Button>
    </article>
  );
}

function Meta({ icon: Icon, value }) {
  return <span className="flex items-center gap-1.5 rounded-lg bg-stone-50 px-2.5 py-2 text-slate-600"><Icon size={13} className="text-sage" />{value}</span>;
}

function TruckIcon() { return <ArrowUpRight size={19} />; }
