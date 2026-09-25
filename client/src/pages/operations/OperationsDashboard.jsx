import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock3, MapPin, RefreshCcw, ShieldCheck, Truck } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MetricCard from '../../components/common/MetricCard';
import PrimaryPlan from '../../components/rescue/PrimaryPlan';
import BackupPlan from '../../components/rescue/BackupPlan';
import MatchReason from '../../components/rescue/MatchReason';
import RescueTimeline from '../../components/rescue/RescueTimeline';
import FailoverPanel from '../../components/rescue/FailoverPanel';
import { getActiveRescues, simulateDriverFailure } from '../../services/rescueService';
import Toast from '../../components/common/Toast';
import Loader from '../../components/common/Loader';

export default function OperationsDashboard() {
  const [rescue, setRescue] = useState(null);
  const [reRouting, setReRouting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { getActiveRescues().then((rows) => setRescue(rows[0] || null)); }, []);

  const runFailover = async () => {
    if (!rescue || reRouting) return;
    setReRouting(true);
    try {
      const updated = await simulateDriverFailure(rescue.id);
      setRescue({ ...rescue, ...updated, status: 'Secured', driver: rescue.backupDriver, recipient: rescue.backupRecipient });
      setMessage('Backup rescue plan activated successfully.');
    } finally { setReRouting(false); }
  };

  if (!rescue) return <DashboardLayout role="operations" title="Live Operations"><Loader /></DashboardLayout>;

  return (
    <DashboardLayout role="operations" title="Live Operations" subtitle="RescueLoop control center · the current rescue path in one view" live>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Current rescue" value={rescue.id} helper="One selected rescue" icon={MapPin} />
        <MetricCard label="Primary path" value={rescue.driver || 'Pending'} helper={rescue.recipient || 'Recipient pending'} icon={Truck} />
        <MetricCard label="Safety buffer" value={`${rescue.safetyBuffer || 0} min`} helper="Before safe-until" icon={ShieldCheck} accent="amber" />
        <MetricCard label="Backup ready" value={rescue.backupDriver ? 'YES' : 'NO'} helper="Prepared fallback path" icon={RefreshCcw} />
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-[1.14fr_.86fr]">
        <section className="space-y-5">
          <div className="surface overflow-hidden">
            <div className="border-b border-line bg-[#fbf8f2] px-5 py-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow dark">Active rescue</p><h2 className="mt-1 text-xl font-semibold">{rescue.foodName} · {rescue.quantity} {rescue.unit}</h2><p className="mt-1 text-xs text-slate-500">{rescue.donor} → {rescue.recipient}</p></div><div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600" /> Live rescue</div></div></div>
            <div className="grid gap-2 p-5 sm:grid-cols-4"><Info label="Safe until" value={formatTime(rescue.safeUntil)} /><Info label="Current ETA" value={`${rescue.eta || '—'} min`} /><Info label="Safety buffer" value={`${rescue.safetyBuffer || '—'} min`} tone="good" /><Info label="Plan state" value={rescue.status} /></div>
          </div>

          <PrimaryPlan recipient={rescue.recipient} driver={rescue.driver} eta={rescue.eta || 18} buffer={rescue.safetyBuffer || 52} />
          <BackupPlan recipient={rescue.backupRecipient} driver={rescue.backupDriver} eta={rescue.backupEta ?? "—"} buffer={rescue.backupBuffer ?? "—"} />
          <FailoverPanel onSimulate={runFailover} reRouting={reRouting} />
        </section>

        <aside className="space-y-5">
          <div className="surface p-5"><div className="flex items-center gap-2"><CheckCircle2 size={17} className="text-forest" /><h2 className="font-semibold">Why this plan?</h2></div><p className="mt-1 text-xs text-slate-400">Hard constraints first. Ranking second. No black-box decision.</p><div className="mt-5"><MatchReason rescue={rescue} /></div></div>
          <div className="surface p-5"><div className="flex items-center gap-2"><Clock3 size={17} className="text-sage" /><h2 className="font-semibold">Rescue timeline</h2></div><div className="mt-5"><RescueTimeline events={rescue.events || []} /></div></div>
          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4"><div className="flex gap-3"><AlertTriangle className="shrink-0 text-terracotta" size={18} /><div><p className="text-sm font-semibold">Operator note</p><p className="mt-1 text-xs leading-5 text-slate-500">A nearby NGO is not enough. The plan must also have capacity, a committed driver and enough deadline slack.</p></div></div></div>
        </aside>
      </div>
      <Toast message={message} />
    </DashboardLayout>
  );
}

function Info({ label, value, tone }) { return <div className="rounded-xl bg-stone-50 p-3"><p className="text-[10px] uppercase tracking-[.12em] text-slate-400">{label}</p><p className={`mt-1 text-sm font-semibold ${tone === 'good' ? 'text-forest' : 'text-ink'}`}>{value}</p></div>; }
function formatTime(value) { if (!value) return '—'; return new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); }
