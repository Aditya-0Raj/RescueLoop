import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, ShieldCheck, Truck } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useRescue } from '../../hooks/useRescue';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';
import PrimaryPlan from '../../components/rescue/PrimaryPlan';
import BackupPlan from '../../components/rescue/BackupPlan';
import RescueTimeline from '../../components/rescue/RescueTimeline';

export default function RescueDetails() {
  const { id } = useParams();
  const { data, loading } = useRescue(id);
  if (loading) return <DashboardLayout role="operations" title="Rescue Details"><Loader /></DashboardLayout>;

  return (
    <DashboardLayout role="operations" title="Rescue Details" subtitle={data.id}>
      <Link to="/operations/live" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-ink"><ArrowLeft size={14} /> Back to rescues</Link>
      <div className="mt-5 grid gap-6 xl:grid-cols-[1.14fr_.86fr]">
        <section className="space-y-5">
          <div className="surface p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="eyebrow">Rescue job</p><h2 className="mt-2 text-2xl font-semibold">{data.foodName}</h2><p className="mt-1 text-sm text-slate-500">{data.quantity} {data.unit} · {data.donor} → {data.recipient}</p></div><StatusBadge status={data.status} /></div><div className="mt-6 grid gap-3 sm:grid-cols-3"><Info icon={MapPin} label="Pickup" value={data.donor} /><Info icon={Truck} label="Driver" value={data.driver} /><Info icon={ShieldCheck} label="Safe until" value={data.safeUntil} /></div></div>
          <PrimaryPlan recipient={data.recipient} driver={data.driver} eta={data.eta} buffer={data.safetyBuffer} />
          <BackupPlan recipient={data.backupRecipient} driver={data.backupDriver} eta={data.backupEta ?? "—"} buffer={data.backupBuffer ?? "—"} />
        </section>
        <aside className="surface p-6"><h3 className="font-semibold">Event log</h3><div className="mt-5"><RescueTimeline events={data.events} /></div></aside>
      </div>
    </DashboardLayout>
  );
}
function Info({ icon: Icon, label, value }) { return <div className="rounded-xl bg-stone-50 p-3"><Icon size={15} className="text-sage" /><p className="mt-2 text-xs text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>; }
