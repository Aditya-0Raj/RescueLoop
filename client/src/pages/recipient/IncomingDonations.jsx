import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import IncomingDonationCard from '../../components/recipient/IncomingDonationCard';
import Loader from '../../components/common/Loader';
import { getRecipientDashboard, acceptDonation, declineDonation } from '../../services/recipientService';
import Toast from '../../components/common/Toast';

export default function IncomingDonations() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState('');
  useEffect(() => { getRecipientDashboard().then(setData); }, []);
  if (!data) return <DashboardLayout role="recipient" title="Incoming Donations"><Loader /></DashboardLayout>;
  return (
    <DashboardLayout role="recipient" title="Incoming Donations" subtitle="Only food that fits your live receiving profile should appear here.">
      <div className="space-y-3">{data.incoming.map((donation) => <IncomingDonationCard key={donation.id} donation={donation} onAccept={async () => { await acceptDonation(donation.id); setMessage(`${donation.foodName} accepted.`); }} onDecline={async () => { await declineDonation(donation.id); setMessage(`${donation.foodName} declined.`); }} />)}</div>
      <Toast message={message} />
    </DashboardLayout>
  );
}
