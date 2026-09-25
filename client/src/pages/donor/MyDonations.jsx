import { useDonations } from '../../hooks/useDonations';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DonationCard from '../../components/common/DonationCard';
import Loader from '../../components/common/Loader';
export default function MyDonations() { const { data, loading } = useDonations(); return <DashboardLayout role="donor" title="My Donations" subtitle="Every food lot and its rescue history in one place."><div className="space-y-3">{loading ? <Loader /> : data.map((donation) => <DonationCard key={donation.id} donation={donation} />)}</div></DashboardLayout>; }
