import { useMemo, useState } from 'react';
import { ArrowRight, Check, HeartHandshake, ShieldCheck, Truck, UsersRound, UtensilsCrossed, X } from 'lucide-react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roles = [
  { id: 'donor', label: 'Food donor', detail: 'Restaurant, caterer or campus kitchen', icon: UtensilsCrossed, accent: 'bg-[#f3dfc7]' },
  { id: 'recipient', label: 'NGO / shelter', detail: 'Set live capacity and accept food', icon: UsersRound, accent: 'bg-[#dce8d7]' },
  { id: 'driver', label: 'Driver', detail: 'Go on duty and commit to a route', icon: Truck, accent: 'bg-[#e6dfef]' },
  { id: 'operations', label: 'Operations', detail: 'Watch live rescues and failover', icon: ShieldCheck, accent: 'bg-[#e9e2d5]' },
];

export default function LoginPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const initialRole = roles.some((role) => role.id === params.get('role')) ? params.get('role') : 'donor';
  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const selected = useMemo(() => roles.find((item) => item.id === role), [role]);
  const next = new URLSearchParams(location.search).get('next');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login({ role, name: name.trim() || undefined, email: `${role}@rescueloop.local` });
      navigate(next || `/${role}`, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not connect to RescueLoop. Start the backend and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f2ede4] text-ink">
      <div className="mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-[.9fr_1.1fr]">
        <section className="relative overflow-hidden bg-[#17372f] px-7 py-8 text-white sm:px-10 lg:px-14 lg:py-12">
          <div className="absolute -right-24 top-8 h-72 w-72 rounded-full bg-[#d67b43]/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#91a97f]/18 blur-3xl" />
          <div className="relative z-10 flex h-full flex-col">
            <Link to="/" className="inline-flex w-fit items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10"><HeartHandshake size={18} /></span>
              <span className="text-sm font-semibold tracking-[.02em]">RescueLoop</span>
            </Link>

            <div className="mt-auto max-w-xl pb-10 pt-20 lg:pb-16">
              <p className="text-[11px] font-bold uppercase tracking-[.24em] text-emerald-100/60">Private demo workspace</p>
              <h1 className="mt-5 font-serif text-5xl leading-[.94] tracking-[-.04em] sm:text-6xl">
                The food is ready.<br />The clock is moving.<br /><span className="text-[#e3a06a]">Let the rescue move too.</span>
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-7 text-emerald-50/70 sm:text-base">Enter a role workspace to test the complete loop: safety gate, live capacity, committed pickup, backup activation and verified delivery.</p>

              <div className="mt-8 grid grid-cols-3 gap-2">
                {['Safety gate', 'Primary + backup', 'OTP proof'].map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/6 p-3 text-[11px] text-emerald-50/75">{item}</div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-14">
          <div className="w-full max-w-xl">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#6c776f]">Sign in</p>
                <h2 className="mt-2 font-serif text-4xl leading-none tracking-[-.03em]">Choose your workspace.</h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">This hackathon build uses role-based demo access. The same account flow will sit behind the production auth later.</p>
              </div>
              <Link to="/" className="rounded-full border border-[#dfd7cb] bg-white p-2 text-slate-500 hover:text-ink"><X size={17} /></Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {roles.map(({ id, label, detail, icon: Icon, accent }) => {
                  const active = role === id;
                  return (
                    <button type="button" key={id} onClick={() => setRole(id)} className={`text-left rounded-3xl border p-4 transition ${active ? 'border-[#17372f] bg-white shadow-[0_12px_32px_rgba(24,55,47,.08)]' : 'border-[#e1d9cd] bg-[#f8f4ee] hover:border-[#bfb4a6]'}`}>
                      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${accent} text-[#17372f]`}><Icon size={18} /></div>
                      <div className="mt-4 flex items-start justify-between gap-3">
                        <div><p className="text-sm font-semibold">{label}</p><p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p></div>
                        {active && <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#17372f] text-white"><Check size={13} /></span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="text-sm font-semibold">Your name <span className="font-normal text-slate-400">(optional)</span></label>
                <input className="field mt-2 h-12 rounded-2xl bg-white" value={name} onChange={(e) => setName(e.target.value)} placeholder={`e.g. ${selected.label}`} />
              </div>

              {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

              <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#17372f] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(23,55,47,.16)] transition hover:bg-[#0f2e27] disabled:cursor-not-allowed disabled:opacity-55">
                {busy ? 'Connecting…' : `Enter ${selected.label}`} {!busy && <ArrowRight size={16} />}
              </button>

              <p className="flex items-center justify-center gap-2 text-xs text-slate-400"><ShieldCheck size={14} /> Demo roles are isolated and reversible.</p>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
