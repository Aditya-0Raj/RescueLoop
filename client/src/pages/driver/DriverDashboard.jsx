import { useState } from 'react';
import { Clock3, MapPin, ShieldCheck, Truck } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MetricCard from '../../components/common/MetricCard';
import DriverStatus from '../../components/driver/DriverStatus';
import RescueJobCard from '../../components/driver/RescueJobCard';
import { useDriver } from '../../hooks/useDriver';
import { toggleDuty, acceptJob } from '../../services/driverService';
import Loader from '../../components/common/Loader';
import Toast from '../../components/common/Toast';
import { Link } from 'react-router-dom';

export default function DriverDashboard() {
  const { data, loading, setData } = useDriver();
  const [message, setMessage] = useState('');
  if (loading) return <DashboardLayout role="driver" title="Dashboard"><Loader /></DashboardLayout>;

  const first = data.driver.name.split(' ')[0];

  return (
    <DashboardLayout role="driver" title="Dashboard" subtitle={`Volunteer driver · ${data.driver.location}`} >
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="eyebrow">Driver workspace</p><h2 className="page-title mt-2">Hi, {first}.</h2><p className="muted mt-2">Accept only rescues that fit your route, vehicle and deadline.</p></div><span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">{data.driver.vehicle} · {data.driver.capacity} kg capacity</span></div>

      <div className="mt-7 grid gap-4 md:grid-cols-3"><MetricCard label="Open rescues" value={data.jobs.length} helper="Currently offered to you" icon={Truck} /><MetricCard label="Reliability" value={`${data.driver.reliability}%`} helper="Accepted job history" icon={ShieldCheck} /><MetricCard label="Current zone" value={data.driver.location} helper="Location shared for dispatch" icon={MapPin} /></div>

      <div className="mt-7"><DriverStatus onDuty={data.driver.onDuty} onToggle={async () => { const next = !data.driver.onDuty; const updated = await toggleDuty(data.driver.id, next); setData({ ...data, driver: { ...data.driver, ...updated } }); setMessage(next ? 'You are now on duty.' : 'You are now off duty.'); }} /></div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.18fr_.82fr]">
        <section><div className="flex items-end justify-between gap-3"><div><h3 className="font-semibold">Available rescue jobs</h3><p className="muted mt-1">Jobs currently compatible with your availability.</p></div><Link to="/driver/jobs" className="text-sm font-semibold text-forest">View all →</Link></div><div className="mt-4 grid gap-4 md:grid-cols-2">{data.jobs.slice(0, 2).map((job) => <RescueJobCard key={job.id} rescue={job} onAccept={async () => { await acceptJob(job.id); setMessage('Job accepted. Rescue secured.'); }} />)}</div></section>
        <aside className="surface p-5"><p className="eyebrow">Driver checklist</p><div className="mt-4 space-y-4"><Check icon={Clock3} title="Deadline first" text="Check the pickup deadline before accepting." /><Check icon={MapPin} title="Follow the job packet" text="Pickup, recipient and route are already defined." /><Check icon={ShieldCheck} title="Verify the handoff" text="Use OTP at pickup and delivery." /></div></aside>
      </div>
      <Toast message={message} />
    </DashboardLayout>
  );
}

function Check({ icon: Icon, title, text }) { return <div className="flex gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-forest"><Icon size={15} /></div><div><p className="text-sm font-semibold">{title}</p><p className="mt-0.5 text-xs leading-5 text-slate-500">{text}</p></div></div>; }
