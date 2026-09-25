import {
  Activity,
  BarChart3,
  Boxes,
  ClipboardList,
  HeartHandshake,
  Home,
  LogOut,
  PackagePlus,
  Settings,
  Truck,
  UsersRound,
  X,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const roleMenus = {
  donor: [
    ['Dashboard', '/donor', Home],
    ['New Donation', '/donor/new', PackagePlus],
    ['My Donations', '/donor/donations', ClipboardList],
    ['Impact', '/impact', BarChart3],
  ],
  recipient: [
    ['Dashboard', '/recipient', Home],
    ['Incoming', '/recipient/incoming', Boxes],
    ['Accepted', '/recipient/accepted', ClipboardList],
    ['Capacity', '/recipient/capacity', UsersRound],
  ],
  driver: [
    ['Dashboard', '/driver', Home],
    ['Available Jobs', '/driver/jobs', Truck],
    ['My Jobs', '/driver/my-jobs', ClipboardList],
    ['History', '/driver/history', BarChart3],
  ],
  operations: [
    ['Live Operations', '/operations', Activity],
    ['All Rescues', '/operations/live', ClipboardList],
    ['Failover Demo', '/operations/failover', HeartHandshake],
    ['Impact', '/impact', BarChart3],
  ],
};

export default function Sidebar({ role = 'operations', mobileOpen, onClose }) {
  const menu = roleMenus[role] || roleMenus.operations;
  const roleTitle = role === 'recipient' ? 'NGO workspace' : `${role[0].toUpperCase()}${role.slice(1)} workspace`;
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <>
      <div className={`fixed inset-0 z-40 bg-[#101814]/35 md:hidden ${mobileOpen ? 'block' : 'hidden'}`} onClick={onClose} />

      <aside className={`fixed inset-y-0 left-0 z-50 w-[270px] bg-[#17372f] text-white shadow-2xl transition-transform md:static md:translate-x-0 md:shadow-none ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full min-h-screen flex-col p-4">
          <div className="flex items-center justify-between px-2 py-2">
            <NavLink to="/" className="flex items-center gap-3" onClick={onClose}>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/10"><HeartHandshake size={19} /></span>
              <div><p className="font-semibold tracking-tight">RescueLoop</p><p className="mt-0.5 text-[9px] uppercase tracking-[.18em] text-emerald-100/60">{roleTitle}</p></div>
            </NavLink>
            <button className="rounded-lg p-1.5 text-emerald-100/70 hover:bg-white/10 md:hidden" onClick={onClose}><X size={17} /></button>
          </div>

          <div className="mt-8 px-2 text-[10px] font-semibold uppercase tracking-[.18em] text-emerald-100/45">Workspace</div>
          <nav className="mt-2 space-y-1">
            {menu.map(([label, path, Icon]) => (
              <NavLink key={path} to={path} end onClick={onClose} className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${isActive ? 'bg-white text-forest shadow-sm' : 'text-emerald-50/78 hover:bg-white/8 hover:text-white'}`}>
                <Icon size={17} strokeWidth={1.9} /><span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto">
            <div className="rounded-2xl border border-white/10 bg-white/6 p-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e2a16b] text-xs font-bold text-[#17372f]">{initials(user?.name)}</div>
                <div className="min-w-0"><p className="truncate text-xs font-semibold">{user?.name || 'Demo user'}</p><p className="truncate text-[10px] text-emerald-100/55">{user?.email || 'demo@rescueloop.local'}</p></div>
              </div>
            </div>

            <div className="mt-3 border-t border-white/10 pt-3">
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-emerald-50/70 hover:bg-white/8 hover:text-white"><Settings size={16} /> Settings</button>
              <button onClick={handleLogout} className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-emerald-50/70 hover:bg-white/8 hover:text-white"><LogOut size={16} /> Sign out</button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function initials(name = 'Demo User') {
  return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}
