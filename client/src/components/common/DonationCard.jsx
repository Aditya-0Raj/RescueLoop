import { Clock3, MapPin, Package, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import Countdown from './Countdown';

export default function DonationCard({ donation }) {
  const urgent = donation.urgency === 'High';

  return (
    <article className="surface p-4 transition hover:-translate-y-0.5 hover:border-forest/20 hover:shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-forest">
            <Package size={19} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{donation.foodName}</p>
            <p className="mt-1 text-xs text-slate-400">{donation.id} · {donation.foodType}</p>
          </div>
        </div>
        <StatusBadge status={donation.status} />
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <Info icon={Package} value={`${donation.quantity} ${donation.unit}`} />
        <Info icon={MapPin} value={donation.location} />
        <Info icon={UserRound} value={donation.recipient === '—' ? 'Awaiting match' : donation.recipient} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock3 size={13} /> Safe until {donation.safeUntil}
        </div>
        <Countdown minutes={urgent ? 32 : 78} urgent={urgent} />
      </div>

      <div className="mt-4 flex justify-end">
        <Link className="text-sm font-semibold text-forest hover:underline" to={`/donor/donations/${donation.id}`}>View rescue details →</Link>
      </div>
    </article>
  );
}

function Info({ icon: Icon, value }) {
  return <span className="flex min-w-0 items-center gap-2 text-slate-600"><Icon size={14} className="shrink-0 text-sage" /><span className="truncate">{value}</span></span>;
}
