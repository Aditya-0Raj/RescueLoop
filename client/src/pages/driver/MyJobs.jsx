import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import RouteCard from '../../components/driver/RouteCard';
import Loader from '../../components/common/Loader';
import { getDriverDashboard } from '../../services/driverService';

export default function MyJobs() {
  const [data, setData] = useState(null);
  useEffect(() => { getDriverDashboard().then(setData); }, []);
  if (!data) return <DashboardLayout role="driver" title="My Jobs"><Loader /></DashboardLayout>;
  return <DashboardLayout role="driver" title="My Jobs" subtitle="Your active rescue commitments."><div className="grid gap-4 lg:grid-cols-2">{data.jobs.map((r) => <RouteCard key={r.id} rescue={r} />)}</div></DashboardLayout>;
}
