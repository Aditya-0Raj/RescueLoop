import { useEffect, useState } from 'react';
import { BarChart3, CalendarDays, CheckCircle2, Clock3, PackageCheck, ShieldCheck, TrendingUp } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MetricCard from '../../components/common/MetricCard';
import ImpactChart from '../../components/impact/ImpactChart';
import ImpactStories from '../../components/impact/ImpactStories';
import RescueHistoryTable from '../../components/impact/RescueHistoryTable';
import { useAuth } from '../../context/AuthContext';
import { getImpactSummary } from '../../services/impactService';
import Loader from '../../components/common/Loader';

export default function ImpactDashboard() {
  const [data, setData] = useState(null);
  const { user } = useAuth();
  useEffect(() => { getImpactSummary().then(setData); }, []);
  if (!data) return <DashboardLayout role={user?.role || 'operations'} title="Our Impact"><Loader /></DashboardLayout>;

  return (
    <DashboardLayout role={user?.role || 'operations'} title="Our Impact" subtitle="Measure food that was actually rescued and delivered.">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="eyebrow">Impact ledger</p><h2 className="page-title mt-2">Every completed rescue counts.</h2><p className="muted mt-2">Last 30 days across the RescueLoop network.</p></div><button className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold"><CalendarDays className="mr-2 inline" size={15} /> Last 30 days</button></div>

      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <MetricCard label="Food rescued" value={`${data.rescuedKg} kg`} icon={PackageCheck} />
        <MetricCard label="Est. meals" value={data.estimatedMeals.toLocaleString()} icon={TrendingUp} />
        <MetricCard label="On-time delivery" value={`${data.onTimeRate}%`} icon={Clock3} />
        <MetricCard label="Completed rescues" value={data.completedRescues} icon={CheckCircle2} />
        <MetricCard label="Backup saves" value={data.backupSaves} icon={ShieldCheck} accent="amber" />
        <MetricCard label="Success rate" value={`${data.successRate}%`} icon={BarChart3} />
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-[1.12fr_.88fr]">
        <div className="surface p-6">
          <div className="flex items-center justify-between gap-3"><div><h3 className="font-semibold">Food rescued over time</h3><p className="muted mt-1">Daily rescue volume</p></div><span className="text-sm font-semibold text-forest">{data.rescuedKg || 0} kg</span></div>
          <div className="mt-8"><ImpactChart values={data.trend} /></div>
        </div>
        <div className="surface p-6">
          <div className="flex items-center gap-2"><ShieldCheck size={17} className="text-forest" /><h3 className="font-semibold">What the ledger proves</h3></div>
          <div className="mt-5 space-y-4">
            <Ledger title="Food actually delivered" text="Impact is based on completed handoffs, not merely posted donations." />
            <Ledger title="Failure recovery" text="Backup saves show how often the network recovered an at-risk rescue." />
            <Ledger title="Deadline reliability" text="On-time delivery measures whether the operational window was protected." />
          </div>
        </div>
      </div>

      <div className="mt-7"><ImpactStories data={data} /></div>
      <div className="mt-7"><div className="mb-3 flex items-end justify-between"><div><h3 className="font-semibold">Recent rescues</h3><p className="muted mt-1">Verified records from completed food lots.</p></div></div><RescueHistoryTable rows={(data.records || []).map((record) => ({ ...record.donation, id: record.donation?.publicId || record.donation?._id, donor: record.donation?.donor?.name, status: 'Delivered' }))} /></div>
    </DashboardLayout>
  );
}

function Ledger({ title, text }) { return <div className="rounded-xl bg-stone-50 p-4"><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div>; }
