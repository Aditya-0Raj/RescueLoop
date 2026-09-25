import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import RescueJobCard from '../../components/driver/RescueJobCard';
import Loader from '../../components/common/Loader';
import Toast from '../../components/common/Toast';
import { getDriverDashboard, acceptJob } from '../../services/driverService';

export default function AvailableJobs() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState('');
  useEffect(() => { getDriverDashboard().then(setData); }, []);
  if (!data) return <DashboardLayout role="driver" title="Available Jobs"><Loader /></DashboardLayout>;
  return (
    <DashboardLayout role="driver" title="Available Jobs" subtitle="Rescues currently open for on-duty volunteers.">
      <div className="grid gap-4 md:grid-cols-2">{data.jobs.map((job) => <RescueJobCard key={job.id} rescue={job} onAccept={async () => { await acceptJob(job.id); setMessage('Job accepted. Rescue secured.'); }} />)}</div>
      <Toast message={message} />
    </DashboardLayout>
  );
}
