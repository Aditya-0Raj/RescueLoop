import { Clock3 } from 'lucide-react';
import { useCountdown } from '../../hooks/useCountdown';

export default function Countdown({ minutes = 45, urgent = false }) {
  const { label } = useCountdown(minutes);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${urgent ? 'bg-orange-50 text-orange-700' : 'bg-stone-100 text-slate-600'}`}>
      <Clock3 size={13} /> {label}
    </span>
  );
}
