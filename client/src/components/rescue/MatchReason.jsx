export default function MatchReason({ rescue }) {
  const candidates = (rescue?.candidates || []).slice(0, 3);
  if (!candidates.length) {
    return <p className="text-sm leading-6 text-slate-500">Candidate reasoning will appear once the matching engine has evaluated live capacity and driver availability.</p>;
  }

  const primaryId = rescue?.primary?.recipient?._id || rescue?.primary?.recipient;
  const backupId = rescue?.backup?.recipient?._id || rescue?.backup?.recipient;

  return (
    <div className="space-y-3">
      {candidates.map((candidate, index) => {
        const recipient = candidate.recipient || {};
        const recipientId = recipient._id || recipient.id || recipient.publicId;
        const isPrimary = String(recipientId) === String(primaryId);
        const isBackup = String(recipientId) === String(backupId);
        const reasons = candidate.reasons?.length ? candidate.reasons.join(' · ') : 'Meets the hard constraints';
        const label = isPrimary ? 'Primary' : isBackup ? 'Backup' : candidate.eligible ? 'Feasible candidate' : 'Eliminated';

        return (
          <div key={`${recipientId || index}`} className={`rounded-xl p-3 ${isPrimary ? 'border border-emerald-100 bg-emerald-50' : candidate.eligible ? 'bg-stone-50' : 'bg-rose-50/60'}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-semibold ${isPrimary ? 'text-forest' : 'text-ink'}`}>{recipient.organizationName || 'Recipient organization'}</p>
                  <span className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">{label}</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-500">{reasons}</p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-slate-400">{candidate.distanceKm != null ? `${candidate.distanceKm.toFixed(1)} km` : '—'}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
