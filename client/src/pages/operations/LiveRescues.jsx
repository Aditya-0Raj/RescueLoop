import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock3, MapPin, Truck } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import Countdown from '../../components/common/Countdown';
import Loader from '../../components/common/Loader';
import { getActiveRescues } from '../../services/rescueService';

export default function LiveRescues() {
  const [rows, setRows] = useState(null);
  useEffect(() => { getActiveRescues().then(setRows); }, []);
  if (!rows) return <DashboardLayout role="operations" title="All Rescues"><Loader /></DashboardLayout>;
  return (
    <DashboardLayout role="operations" title="All Rescues" subtitle="Active rescue plans from the orchestration engine.">
      <div className="grid gap-4 lg:grid-cols-2">
        {rows.map((r) => (
          <article key={r.id} className="surface p-5">
            <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold">{r.foodName} · {r.quantity} {r.unit}</p><p className="mt-1 text-xs text-slate-400">{r.id}</p></div><StatusBadge status={r.status} /></div>
            <div className="mt-4 grid gap-2 text-xs text-slate-500"><span className="flex items-center gap-2"><MapPin size={13} /> {r.donor} → {r.recipient}</span><span className="flex items-center gap-2"><Truck size={13} /> Driver: {r.driver}</span><span className="flex items-center gap-2"><Clock3 size={13} /> Safe until {formatTime(r.safeUntil)}</span></div>
            <div className="mt-5 flex items-center justify-between border-t border-line pt-4"><Countdown minutes={Math.max(1, r.eta || 30)} urgent /><Link to={`/operations/rescue/${r.id}`} className="text-sm font-semibold text-forest">Open rescue →</Link></div>
          </article>
        ))}
      </div>
    </DashboardLayout>
  );
}
function formatTime(value) { if (!value) return '—'; return new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); }
