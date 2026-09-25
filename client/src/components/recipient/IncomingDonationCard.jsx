import { Clock3, MapPin, Package } from 'lucide-react';
import Countdown from '../common/Countdown';
import Button from '../common/Button';

export default function IncomingDonationCard({ donation, onAccept, onDecline = () => {} }) {
  return (
    <article className="surface p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-forest"><Package size={19} /></div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{donation.foodName}</p>
              <p className="mt-1 text-xs text-slate-400">From {donation.donor} · Posted {donation.postedAt}</p>
            </div>
            <Countdown minutes={38} urgent />
          </div>

          <div className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-3">
            <span className="flex items-center gap-1.5"><Package size={13} /> {donation.quantity} {donation.unit}</span>
            <span className="flex items-center gap-1.5"><MapPin size={13} /> {donation.location}</span>
            <span className="flex items-center gap-1.5"><Clock3 size={13} /> Safe until {donation.safeUntil}</span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">Fits current profile</span>
            <div className="flex gap-2">
              <Button onClick={() => onAccept?.(donation)}>Accept</Button>
              <Button variant="secondary" onClick={() => onDecline?.(donation)}>Decline</Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
