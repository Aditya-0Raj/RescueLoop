import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import RescueHistoryTable from '../../components/impact/RescueHistoryTable';
import Loader from '../../components/common/Loader';
import { getDriverHistory } from '../../services/driverService';

export default function DriverHistory() {
  const [rows, setRows] = useState(null);
  useEffect(() => { getDriverHistory().then(setRows); }, []);
  if (!rows) return <DashboardLayout role="driver" title="Driver History"><Loader /></DashboardLayout>;
  return <DashboardLayout role="driver" title="Driver History" subtitle="Completed rescue assignments and verification records."><RescueHistoryTable rows={rows} /></DashboardLayout>;
}
