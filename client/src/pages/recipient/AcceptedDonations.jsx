import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import { getAcceptedDonations } from '../../services/recipientService';

export default function AcceptedDonations() {
  const [rows, setRows] = useState(null);
  useEffect(() => { getAcceptedDonations().then(setRows); }, []);
  if (!rows) return <DashboardLayout role="recipient" title="Accepted Donations"><Loader /></DashboardLayout>;
  return <DashboardLayout role="recipient" title="Accepted Donations" subtitle="Donations your organization has committed to receive."><div className="overflow-hidden rounded-xl border border-line bg-white"><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-stone-50 text-xs uppercase tracking-wide text-slate-400"><tr><th className="px-4 py-3">Food</th><th className="px-4 py-3">Donor</th><th className="px-4 py-3">Quantity</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y divide-line">{rows.map((row) => <tr key={row.id}><td className="px-4 py-4 font-medium">{row.foodName}</td><td className="px-4 py-4 text-slate-500">{row.donor || '—'}</td><td className="px-4 py-4 text-slate-500">{row.quantity} {row.unit}</td><td className="px-4 py-4"><StatusBadge status={row.status || 'Recipient Confirmed'}/></td></tr>)}</tbody></table></div></div></DashboardLayout>;
}
