import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, CheckCircle2, Clock3, MapPin, ShieldCheck, TriangleAlert } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import TrackingMap from '../../components/tracking/TrackingMap';
import TrackingStatus from '../../components/tracking/TrackingStatus';
import RouteInfo from '../../components/tracking/RouteInfo';
import OTPInput from '../../components/tracking/OTPInput';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { getRescue } from '../../services/rescueService';
import { generateDeliveryOtp, generatePickupOtp, verifyPickup, verifyDelivery } from '../../services/trackingService';
import Loader from '../../components/common/Loader';
import Toast from '../../components/common/Toast';
import { useEffect } from 'react';

export default function TrackingPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('Secured');
  const [pickupOtp, setPickupOtp] = useState('');
  const [deliveryOtp, setDeliveryOtp] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [demoPickupCode, setDemoPickupCode] = useState('');
  const [demoDeliveryCode, setDemoDeliveryCode] = useState('');

  useEffect(() => {
    let mounted = true;
    getRescue(id).then((rescue) => {
      if (!mounted) return;
      setData(rescue);
      setStatus(rescue.status || 'Secured');
    });
    return () => { mounted = false; };
  }, [id]);

  const pickupComplete = status === 'Picked Up' || status === 'Delivered';
  const deliveryComplete = status === 'Delivered';

  const currentLabel = useMemo(() => {
    if (status === 'Delivered') return 'Completed safely';
    if (status === 'Picked Up') return 'Driver is en route';
    return 'Driver is ready for pickup';
  }, [status]);

  const handleVerify = async (kind) => {
    const value = kind === 'pickup' ? pickupOtp : deliveryOtp;
    if (value.length !== 4) {
      setMessage('Enter all 4 OTP digits.');
      return;
    }
    if (kind === 'pickup' && pickupComplete) {
      setMessage('Pickup has already been verified.');
      return;
    }
    if (kind === 'delivery' && !pickupComplete) {
      setMessage('Verify pickup before delivery.');
      return;
    }

    setBusy(true);
    try {
      const result = kind === 'pickup' ? await verifyPickup(id, value) : await verifyDelivery(id, value);
      setStatus(result.status);
      setMessage(kind === 'pickup' ? 'Pickup verified.' : 'Delivery verified successfully.');
      if (kind === 'pickup') setPickupOtp('');
      else setDeliveryOtp('');
    } finally {
      setBusy(false);
    }
  };

  if (!data) return <DashboardLayout role={user?.role || 'operations'} title="Live Tracking"><Loader /></DashboardLayout>;

  return (
    <DashboardLayout role={user?.role || 'operations'} title="Current Rescue" subtitle={`Rescue ${data.id}`} live>
      <div className="mb-4"><Link to={user?.role === 'operations' ? '/operations' : `/${user?.role || 'donor'}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-ink"><ArrowLeft size={14} /> Back to operations</Link></div>
      <div className="grid gap-6 xl:grid-cols-[1.16fr_.84fr]">
        <section className="space-y-5">
          <div className="surface overflow-hidden p-4"><TrackingMap rescue={data} /></div>
          <div className="surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="eyebrow">Live tracking</p><h2 className="mt-2 text-xl font-semibold">{data.foodName} · {data.quantity} {data.unit}</h2><p className="mt-1 text-sm text-slate-500">{data.donor} → {data.recipient}</p></div><StatusBadge status={status} /></div>
            <div className="mt-6"><TrackingStatus current={status} /></div>
            <div className="mt-6"><RouteInfo rescue={data} /></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Mini label="Current state" value={currentLabel} icon={CheckCircle2} />
            <Mini label="Safe until" value={data.safeUntil} icon={Clock3} />
            <Mini label="Safety buffer" value={`${data.safetyBuffer} min`} icon={ShieldCheck} good />
          </div>
        </section>

        <aside className="space-y-5">
          <div className={`surface p-5 ${pickupComplete ? 'border-emerald-100' : ''}`}>
            <div className="flex items-start gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-forest"><MapPin size={17} /></div><div><p className="eyebrow">Step 1</p><h3 className="mt-1 text-base font-semibold">Verify pickup</h3><p className="mt-1 text-xs leading-5 text-slate-500">Ask the donor for the 4-digit code when the driver reaches the restaurant.</p></div></div>
            <div className="mt-5"><OTPInput value={pickupOtp} onChange={setPickupOtp} /></div>
            <Button className="mt-4 w-full" disabled={pickupComplete || busy} onClick={() => handleVerify('pickup')}>{pickupComplete ? 'Pickup verified ✓' : 'Confirm pickup'}</Button>
          </div>

          <div className={`surface p-5 ${!pickupComplete ? 'opacity-70' : ''}`}>
            <div className="flex items-start gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-terracotta"><ShieldCheck size={17} /></div><div><p className="eyebrow">Step 2</p><h3 className="mt-1 text-base font-semibold">Verify delivery</h3><p className="mt-1 text-xs leading-5 text-slate-500">Use the recipient's code only after pickup has been confirmed.</p></div></div>
            <div className="mt-5"><OTPInput value={deliveryOtp} onChange={setDeliveryOtp} /></div>
            <Button className="mt-4 w-full" disabled={!pickupComplete || deliveryComplete || busy} onClick={() => handleVerify('delivery')}>{deliveryComplete ? 'Delivery verified ✓' : 'Confirm delivery'}</Button>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4"><div className="flex gap-3"><TriangleAlert className="shrink-0 text-terracotta" size={18} /><div><p className="text-sm font-semibold">Safety window</p><p className="mt-1 text-xs leading-5 text-slate-500">The rescue closes only after a verified recipient handoff. Never treat a pickup click as completed delivery.</p></div></div></div>
          {user?.role !== 'driver' && <div className="surface border-dashed p-5"><div className="flex items-start justify-between gap-3"><div><p className="eyebrow dark">Demo controls</p><h3 className="mt-1 text-base font-semibold">Reveal handoff codes</h3><p className="mt-1 text-xs leading-5 text-slate-500">In production these codes would appear on the donor and recipient screens. They are exposed here so the hackathon demo can complete end-to-end.</p></div><ShieldCheck size={18} className="text-forest" /></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><button type="button" onClick={async () => setDemoPickupCode((await generatePickupOtp(id)).otp)} className="rounded-xl border border-line bg-white px-3 py-2.5 text-left text-xs font-semibold">Generate pickup OTP{demoPickupCode && <span className="mt-1 block font-mono text-lg tracking-[.3em] text-forest">{demoPickupCode}</span>}</button><button type="button" disabled={!pickupComplete} onClick={async () => setDemoDeliveryCode((await generateDeliveryOtp(id)).otp)} className="rounded-xl border border-line bg-white px-3 py-2.5 text-left text-xs font-semibold disabled:opacity-40">Generate delivery OTP{demoDeliveryCode && <span className="mt-1 block font-mono text-lg tracking-[.3em] text-forest">{demoDeliveryCode}</span>}</button></div></div>}
        </aside>
      </div>
      <Toast message={message} />
    </DashboardLayout>
  );
}

function Mini({ label, value, icon: Icon, good }) { return <div className="surface p-4"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.14em] text-slate-400"><Icon size={13} className={good ? 'text-forest' : 'text-sage'} /> {label}</div><p className="mt-2 text-sm font-semibold">{value}</p></div>; }
