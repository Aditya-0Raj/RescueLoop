import { Bell, Menu, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ title, subtitle, role = 'Operations', onMenu, live = false }) {
  const { user } = useAuth();
  return (
    <header className="border-b border-[#ded5c8] bg-[#fbf8f2]/92 px-4 py-3 backdrop-blur md:px-7">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {onMenu && <button onClick={onMenu} className="rounded-lg border border-[#ded5c8] p-2 text-slate-600 md:hidden" aria-label="Open navigation"><Menu size={17} /></button>}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2"><h1 className="truncate text-lg font-semibold tracking-tight text-ink md:text-xl">{title}</h1>{live && <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600" /> Live</span>}</div>
            {subtitle && <p className="mt-1 truncate text-xs text-slate-400">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full border border-[#ded5c8] bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.14em] text-sage md:inline-flex">{role}</span>
          <button className="hidden items-center gap-2 rounded-lg border border-[#ded5c8] bg-white px-3 py-2 text-slate-400 md:flex"><Search size={15} /> Search</button>
          <button className="rounded-lg border border-[#ded5c8] bg-white p-2.5 text-slate-500" aria-label="Notifications"><Bell size={17} /></button>
          <button className="flex items-center gap-2 rounded-lg border border-[#ded5c8] bg-white px-2.5 py-2" aria-label="Profile"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#17372f] text-[11px] font-semibold text-white">{initials(user?.name)}</span><span className="hidden max-w-[120px] truncate text-sm font-medium md:block">{user?.name || 'Demo user'}</span></button>
        </div>
      </div>
    </header>
  );
}
function initials(name = 'Demo User') { return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase(); }
