import { statusTone } from '../../utils/statusHelpers';

export default function StatusBadge({ status }) {
  const tone = statusTone(status);
  const styles = {
    neutral: 'bg-stone-100 text-slate-600 border-stone-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    warning: 'bg-orange-50 text-orange-700 border-orange-100',
    danger: 'bg-red-50 text-red-700 border-red-100',
  };
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[tone]}`}>{status}</span>;
}
