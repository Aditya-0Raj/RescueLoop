const steps = ['Posted', 'Secured', 'Picked Up', 'Delivered'];
export default function TrackingStatus({ current = 'Secured' }) {
  const index = steps.indexOf(current);
  return <div className="grid grid-cols-4 gap-2">{steps.map((step, i) => <div key={step} className="text-center"><div className={`mx-auto h-2 w-full rounded-full ${i <= index ? 'bg-forest' : 'bg-stone-200'}`} /><p className={`mt-2 text-[11px] font-semibold ${i <= index ? 'text-forest' : 'text-slate-400'}`}>{step}</p></div>)}</div>;
}
