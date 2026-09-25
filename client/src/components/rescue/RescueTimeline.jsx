export default function RescueTimeline({ events = [] }) {
  return <div className="space-y-4">{events.map((event, index) => <div key={`${event.time}-${index}`} className="flex gap-3"><div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-forest ring-4 ring-emerald-50" /><div><p className="text-xs font-semibold text-slate-400">{event.time}</p><p className="mt-0.5 text-sm text-slate-700">{event.text}</p></div></div>)}</div>;
}
