export default function ImpactStories({ data = {} }) {
  const stories = [
    { value: data.completedRescues ?? 0, label: 'verified rescues', text: 'Completed handoffs recorded in the impact ledger.' },
    { value: data.backupSaves ?? 0, label: 'backup saves', text: 'Rescues that continued after the primary path failed.' },
    { value: `${data.onTimeRate ?? 0}%`, label: 'on-time delivery', text: 'Delivered before the safe-until deadline in the ledger.' },
  ];

  return <div className="grid gap-3 md:grid-cols-3">{stories.map((story) => <div key={story.label} className="border border-line bg-stone-50 p-5"><p className="font-serif text-3xl leading-none tracking-tight text-forest">{story.value}</p><p className="mt-2 text-xs font-bold uppercase tracking-[.12em] text-slate-400">{story.label}</p><p className="mt-3 text-sm leading-6 text-slate-600">{story.text}</p></div>)}</div>;
}
