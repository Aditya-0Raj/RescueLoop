import { useState } from 'react';
import { Clock3, PackageCheck, SlidersHorizontal, UsersRound } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MetricCard from '../../components/common/MetricCard';
import CapacityPanel from '../../components/recipient/CapacityPanel';
import IncomingDonationCard from '../../components/recipient/IncomingDonationCard';
import { useRecipient } from '../../hooks/useRecipient';
import { acceptDonation, declineDonation, updateCapacity, getAcceptedDonations } from '../../services/recipientService';
import Loader from '../../components/common/Loader';
import Toast from '../../components/common/Toast';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Link } from 'react-router-dom';

export default function RecipientDashboard() {
  const { data, error, loading, refresh } = useRecipient();
  const [profile, setProfile] = useState(null);
  const [accepted, setAccepted] = useState([]);
  const [message, setMessage] = useState('');

  if (loading) return <DashboardLayout role="recipient" title="Dashboard"><Loader /></DashboardLayout>;
  if (error || !data) return <DashboardLayout role="recipient" title="Dashboard"><ErrorMessage message={error || 'Recipient dashboard data is unavailable.'} /></DashboardLayout>;
  const current = profile || data.profile;

  async function handleAccept(donation) {
    try {
      await acceptDonation(donation.id);
      await refresh();
      const acceptedData = await getAcceptedDonations();
      setAccepted(acceptedData);
      setMessage(`${donation.foodName} accepted. Recipient commitment saved.`);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Unable to accept this donation.');
    }
  }

  async function handleDecline(donation) {
    try {
      await declineDonation(donation.id);
      await refresh();
      setMessage(`${donation.foodName} declined.`);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Unable to decline this donation.');
    }
  }

  return (
    <DashboardLayout role="recipient" title="Dashboard" subtitle={`${current.name} · Receiving workspace`}>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div><p className="eyebrow">Recipient operations</p><h2 className="page-title mt-2">Receiving dashboard</h2><p className="muted mt-2">Keep your live capacity accurate so the engine sends food you can actually use.</p></div>
        <Link to="/recipient/capacity"><Button variant="secondary"><SlidersHorizontal size={15} className="mr-2 inline" />Manage capacity</Button></Link>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Currently accepting" value={current.accepting ? 'ON' : 'OFF'} helper="Status visible to matching engine" icon={PackageCheck} />
        <MetricCard label="Available capacity" value={`${current.capacityNow} kg`} helper="Accept now" icon={UsersRound} />
        <MetricCard label="Accepted food types" value={current.acceptedFoodTypes.length} helper="Current profile" icon={PackageCheck} />
        <MetricCard label="Open until" value={current.openUntil} helper="Receiving window" icon={Clock3} accent="amber" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[.76fr_1.24fr]">
        <CapacityPanel profile={current} onSave={async () => {
          const nextCapacity = Math.max(0, Number(current.capacityNow || 0) - 5);
          const updated = await updateCapacity({ capacityNow: nextCapacity, accepting: current.accepting, acceptedFoodTypes: current.acceptedFoodTypes });
          setProfile(updated);
          await refresh();
          setMessage('Receiving capacity updated.');
        }} />

        <section>
          <div className="flex items-end justify-between gap-3"><div><h3 className="font-semibold">Incoming donations</h3><p className="muted mt-1">Primary matches that fit your current profile.</p></div><span className="rounded-full bg-forest px-2.5 py-1 text-[11px] font-semibold text-white">{data.incoming.length} waiting</span></div>
          <div className="mt-4 space-y-3">
            {data.incoming.length === 0 ? <div className="surface p-5 text-sm text-slate-500">No active donations are waiting for your organization.</div> : data.incoming.map((donation) => (
              <IncomingDonationCard key={donation.id} donation={donation} onAccept={handleAccept} onDecline={handleDecline} />
            ))}
          </div>

          {accepted.length > 0 && (
            <div className="mt-8">
              <div><h3 className="font-semibold">My accepted pickups</h3><p className="muted mt-1">Recipient commitments saved by RescueLoop.</p></div>
              <div className="mt-4 space-y-3">
                {accepted.map((donation) => (
                  <article key={donation.id} className="surface flex items-center justify-between gap-4 p-4">
                    <div><p className="text-sm font-semibold">{donation.foodName}</p><p className="mt-1 text-xs text-slate-500">{donation.quantity} {donation.unit} · {donation.status}</p></div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">Recipient confirmed</span>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
      <Toast message={message} />
    </DashboardLayout>
  );
}
