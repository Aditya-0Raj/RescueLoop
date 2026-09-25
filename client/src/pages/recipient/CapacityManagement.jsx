import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import FoodPreference from '../../components/recipient/FoodPreference';
import Loader from '../../components/common/Loader';
import { getRecipientDashboard, updateCapacity } from '../../services/recipientService';

export default function CapacityManagement() {
  const [profile, setProfile] = useState(null);
  const [capacity, setCapacity] = useState(0);
  const [accepting, setAccepting] = useState(false);
  const [acceptedFoodTypes, setAcceptedFoodTypes] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getRecipientDashboard().then(({ profile: current }) => {
      setProfile(current);
      setCapacity(Number(current.capacityNow || 0));
      setAccepting(Boolean(current.accepting));
      setAcceptedFoodTypes(current.acceptedFoodTypes || []);
    }).catch(() => setMessage('Unable to load your receiving profile.'));
  }, []);

  async function handleSave() {
    try {
      const updated = await updateCapacity({
        capacityNow: Math.max(0, capacity),
        accepting,
        acceptedFoodTypes,
        storageAvailable: profile?.storage ? profile.storage.split(' + ').filter(Boolean) : [],
      });
      setProfile(updated);
      setCapacity(Number(updated.capacityNow || capacity));
      setAccepting(Boolean(updated.accepting));
      setAcceptedFoodTypes(updated.acceptedFoodTypes || acceptedFoodTypes);
      setMessage('Receiving capacity updated.');
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Unable to update receiving capacity.');
    }
  }

  if (!profile) return <DashboardLayout role="recipient" title="Capacity Management"><Loader /></DashboardLayout>;

  return (
    <DashboardLayout role="recipient" title="Capacity Management" subtitle="Manage what your team can safely receive right now.">
      <div className="surface mx-auto max-w-3xl p-6">
        <p className="eyebrow">Receiving profile</p>
        <h1 className="mt-2 text-2xl font-semibold">{profile.name}</h1>
        <p className="mt-1 text-sm text-slate-500">Live capacity affects which food lots the matching engine can offer your team.</p>

        <div className="mt-6">
          <label className="text-sm font-medium">Capacity now
            <input type="number" min="0" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="field mt-1.5" />
          </label>
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium">Accepted food types</p>
          <div className="mt-2"><FoodPreference selected={acceptedFoodTypes} /></div>
          <p className="mt-2 text-xs text-slate-400">Food preferences are retained from the current recipient profile in this MVP.</p>
        </div>

        <label className="mt-6 flex items-center gap-3 text-sm">
          <input type="checkbox" checked={accepting} onChange={(e) => setAccepting(e.target.checked)} />
          <span>Currently accepting donations</span>
        </label>

        <div className="mt-6 rounded-xl bg-stone-50 p-4 text-sm text-slate-600">
          Open until <span className="font-semibold text-ink">{profile.openUntil}</span> · Storage <span className="font-semibold text-ink">{profile.storage || 'Not specified'}</span>
        </div>

        <Button className="mt-7" onClick={handleSave}>Save changes</Button>
      </div>
      <Toast message={message} />
    </DashboardLayout>
  );
}
