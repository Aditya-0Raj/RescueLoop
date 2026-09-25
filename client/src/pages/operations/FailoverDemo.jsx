import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import FailoverPanel from '../../components/rescue/FailoverPanel';
import RescueTimeline from '../../components/rescue/RescueTimeline';
import PrimaryPlan from '../../components/rescue/PrimaryPlan';
import BackupPlan from '../../components/rescue/BackupPlan';
import { getActiveRescues, simulateDriverFailure } from '../../services/rescueService';
import Toast from '../../components/common/Toast';
import Loader from '../../components/common/Loader';

export default function FailoverDemo() {
  const [rescue, setRescue] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { getActiveRescues().then((rows) => setRescue(rows[0] || null)); }, []);

  const run = async () => {
    if (!rescue || busy) return;
    setBusy(true);
    try {
      const updated = await simulateDriverFailure(rescue.id);
      setRescue({ ...rescue, ...updated, status: 'Secured', driver: rescue.backupDriver, recipient: rescue.backupRecipient });
      setMessage('Failover completed. Backup path activated.');
    } finally { setBusy(false); }
  };

  if (!rescue) return <DashboardLayout role="operations" title="Failover Demo"><Loader /></DashboardLayout>;

  return (
    <DashboardLayout role="operations" title="Failover Demo" subtitle="Controlled scenario for the AmiHacks demo.">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="surface overflow-hidden">
          <div className="border-b border-line bg-[#fbf8f2] p-6"><p className="eyebrow dark">Core demonstration</p><h2 className="mt-2 text-2xl font-semibold">The system recovers before the food window is lost.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">The first driver fails. RescueLoop does not start searching from zero — the prepared backup plan is activated immediately.</p></div>
          <div className="space-y-4 p-6"><PrimaryPlan recipient={rescue.recipient} driver={rescue.driver} eta={rescue.eta || 18} buffer={rescue.safetyBuffer || 52} /><BackupPlan recipient={rescue.backupRecipient} driver={rescue.backupDriver} eta={rescue.backupEta ?? "—"} buffer={rescue.backupBuffer ?? "—"} /><FailoverPanel onSimulate={run} reRouting={busy} /></div>
        </div>
        <div className="surface p-6"><h3 className="font-semibold">Live activity</h3><div className="mt-5"><RescueTimeline events={rescue.events || []} /></div></div>
      </div>
      <Toast message={message} />
    </DashboardLayout>
  );
}
