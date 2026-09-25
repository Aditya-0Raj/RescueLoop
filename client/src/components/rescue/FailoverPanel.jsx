import { AlertTriangle, RefreshCcw, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';

export default function FailoverPanel({ onSimulate, reRouting = false }) {
  return <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-4"><div className="flex items-start gap-3"><div className="rounded-lg bg-orange-100 p-2 text-terracotta"><AlertTriangle size={17} /></div><div className="flex-1"><p className="text-sm font-semibold">Failure recovery</p><p className="mt-1 text-xs leading-5 text-slate-500">A primary driver failure should trigger the prepared backup plan before the food window is lost.</p><div className="mt-4 flex flex-wrap items-center gap-2"><Button variant="warning" onClick={onSimulate} disabled={reRouting}>{reRouting ? <span className="flex items-center gap-2"><RefreshCcw className="animate-spin" size={15} /> Re-routing...</span> : 'Simulate Driver Failure'}</Button><span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500"><ShieldCheck size={14} /> Backup ready</span></div></div></div></div>;
}
