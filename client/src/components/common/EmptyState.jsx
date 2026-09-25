export default function EmptyState({ title, description, action }) {
  return <div className="card flex flex-col items-center justify-center px-6 py-14 text-center"><div className="mb-3 h-10 w-10 rounded-full bg-stone-100" /><h3 className="text-base font-semibold">{title}</h3><p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>{action && <div className="mt-5">{action}</div>}</div>;
}
