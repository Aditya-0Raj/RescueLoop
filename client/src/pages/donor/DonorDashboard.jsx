import { Link } from 'react-router-dom';
import { Clock3, FileCheck2, Package, Plus, ShieldCheck, TrendingUp } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MetricCard from '../../components/common/MetricCard';
import Button from '../../components/common/Button';
import DonationCard from '../../components/common/DonationCard';
import { useDonations } from '../../hooks/useDonations';
import Loader from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';

export default function DonorDashboard() {
  const { data, loading } = useDonations();
  const { user } = useAuth();

  return (
    <DashboardLayout role="donor" title="Dashboard" subtitle="The Spice House · Verified restaurant account">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Donor workspace</p>
          <h2 className="page-title mt-2">Good evening, {user?.name || 'there'}.</h2>
          <p className="muted mt-2">Share surplus early so the rescue engine can protect the usable window.</p>
        </div>
        <Link to="/donor/new"><Button><Plus size={15} className="mr-2 inline" />Post surplus food</Button></Link>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Food rescued" value="184 kg" helper="This month · +18%" icon={TrendingUp} />
        <MetricCard label="Open donations" value={data.filter((item) => !['Delivered', 'Failed', 'Expired'].includes(item.status)).length} helper="Visible from your workspace" icon={Package} accent="amber" />
        <MetricCard label="On-time pickups" value="96%" helper="28 completed rescues" icon={Clock3} />
        <MetricCard label="Verified records" value="31" helper="Ready for impact reports" icon={FileCheck2} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.12fr_.88fr]">
        <section>
          <div className="flex items-end justify-between gap-3">
            <div><h3 className="font-semibold">Recent donations</h3><p className="muted mt-1">Every food lot and its current rescue state.</p></div>
            <Link to="/donor/donations" className="text-sm font-semibold text-forest">View all →</Link>
          </div>

          <div className="mt-4 space-y-3">
            {loading ? <Loader /> : data.map((donation) => <DonationCard key={donation.id} donation={donation} />)}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="surface p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-forest"><ShieldCheck size={18} /></div>
              <div><p className="text-sm font-semibold">Your donation passport</p><p className="mt-1 text-xs leading-5 text-slate-500">Preparation time, storage, safe-until and quantity help us reject unsafe or impossible rescue plans before matching.</p></div>
            </div>
            <div className="mt-4 rounded-xl bg-[#fbfaf7] p-4"><p className="text-xs font-semibold text-slate-500">Best practice</p><p className="mt-1 text-sm leading-6">Have packaging and quantity ready when a driver arrives. Verified handoff closes the rescue loop.</p></div>
          </div>

          <div className="surface p-5">
            <p className="eyebrow">Fastest path</p>
            <div className="mt-4 space-y-3">
              <Quick label="1" title="Share surplus" text="Use the web intake or WhatsApp-style flow." />
              <Quick label="2" title="Confirm the lot" text="Review the structured food details." />
              <Quick label="3" title="Let RescueLoop coordinate" text="Recipient + driver + backup are handled together." />
            </div>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}

function Quick({ label, title, text }) {
  return <div className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest text-xs font-bold text-white">{label}</span><div><p className="text-sm font-semibold">{title}</p><p className="mt-0.5 text-xs leading-5 text-slate-500">{text}</p></div></div>;
}
