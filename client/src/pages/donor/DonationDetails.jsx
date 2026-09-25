import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, MapPin, Package, ShieldCheck, Truck } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useEffect, useState } from 'react';
import { getDonationById } from '../../services/donationService';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';
import PrimaryPlan from '../../components/rescue/PrimaryPlan';
import BackupPlan from '../../components/rescue/BackupPlan';
import RescueTimeline from '../../components/rescue/RescueTimeline';

export default function DonationDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  useEffect(() => { getDonationById(id).then(setData); }, [id]);
  if (!data) return <DashboardLayout role="donor" title="Donation Details"><Loader /></DashboardLayout>;
  const rescue = data.rescue;
  const events = (data.events || []).map((event) => ({ time: formatEventTime(event.createdAt || event.time), text: event.message || event.text }));
  const primary = rescue?.primary || {};
  const backup = rescue?.backup || {};
  return (
    <DashboardLayout role="donor" title="Donation Details" subtitle={data.id}>
      <Link to="/donor/donations" className="text-sm font-semibold text-slate-500"><ArrowLeft className="mr-1 inline" size={14}/>Back</Link>
      <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <section className="space-y-5">
          <div className="surface p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="eyebrow dark">Food lot</p><h1 className="mt-2 text-2xl font-semibold">{data.foodName}</h1><p className="mt-1 text-sm text-slate-400">{data.quantity} {data.unit} · {data.donor}</p></div><StatusBadge status={data.status}/></div><div className="mt-6 grid gap-3 sm:grid-cols-3"><Info icon={Package} label="Quantity" value={`${data.quantity} ${data.unit}`} /><Info icon={MapPin} label="Pickup" value={data.location || data.donor} /><Info icon={ShieldCheck} label="Safe until" value={formatTime(data.safeUntil)} /></div></div>
          {rescue ? <><PrimaryPlan recipient={primary.recipient?.organizationName || rescue.recipient || 'Pending'} driver={primary.driver?.user?.name || rescue.driver || 'Pending'} eta={getMinutes(rescue.estimatedPickupAt)} buffer={getBuffer(rescue)} /><BackupPlan recipient={backup.recipient?.organizationName || rescue.backupRecipient || 'Pending'} driver={backup.driver?.user?.name || rescue.backupDriver || 'Pending'} eta={getMinutes(rescue.estimatedPickupAt)} buffer={getBuffer(rescue)} /></> : <div className="surface p-6 text-sm text-slate-500">The rescue plan is still being prepared.</div>}
        </section>
        <aside className="surface p-6"><div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-forest"/><p className="font-semibold">Rescue activity</p></div><div className="mt-6"><RescueTimeline events={events} /></div><div className="mt-7 rounded-xl bg-stone-50 p-4"><p className="flex items-center gap-2 text-sm font-semibold"><Truck size={15}/>Verified handoff</p><p className="mt-1 text-xs leading-5 text-slate-500">Pickup and delivery verification will be attached to this record once completed.</p></div></aside>
      </div>
    </DashboardLayout>
  );
}
function Info({ icon: Icon, label, value }) { return <div className="rounded-lg bg-stone-50 p-3"><Icon size={15} className="text-sage"/><p className="mt-2 text-xs text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>; }
function formatTime(value) { if (!value) return '—'; return new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); }
function formatEventTime(value) { if (!value) return '—'; return new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); }
function getMinutes(value) { if (!value) return '—'; return Math.max(1, Math.ceil((new Date(value) - Date.now()) / 60000)); }
function getBuffer(rescue) { if (!rescue?.donation?.safeUntil || !rescue?.estimatedDeliveryAt) return rescue?.safetyBuffer || 0; return Math.max(0, Math.floor((new Date(rescue.donation.safeUntil) - new Date(rescue.estimatedDeliveryAt)) / 60000)); }
