import StatusBadge from '../common/StatusBadge';
export default function DonationStatus({ status = 'Posted' }) { return <div className="flex items-center gap-3"><StatusBadge status={status} /><span className="text-xs text-slate-400">RescueLoop workflow</span></div>; }
