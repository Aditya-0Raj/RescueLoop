import { ArrowDown, ArrowRight, Check, Clock3, HeartHandshake, MapPin, ShieldCheck, Truck, UtensilsCrossed, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroRescueVisual from '../components/common/HeroRescueVisual';
import RescueStoryReel from '../components/common/RescueStoryReel';

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f2ede4] text-[#1d2822]">
      <header className="sticky top-0 z-40 border-b border-[#ded5c8] bg-[#f2ede4]/94 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1420px] items-center justify-between px-5 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#17372f] text-white shadow-sm"><HeartHandshake size={18} /></span>
            <div><p className="text-sm font-bold tracking-tight">RescueLoop</p><p className="text-[9px] uppercase tracking-[.2em] text-slate-500">Food rescue orchestration</p></div>
          </Link>

          <nav className="hidden items-center gap-7 text-[13px] font-medium text-slate-600 lg:flex">
            <a href="#story" className="hover:text-[#17372f]">The problem</a>
            <a href="#loop" className="hover:text-[#17372f]">The loop</a>
            <a href="#trust" className="hover:text-[#17372f]">Trust layer</a>
            <a href="#roles" className="hover:text-[#17372f]">Who uses it</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/login" className="hidden rounded-full border border-[#d7cec1] bg-white px-4 py-2 text-xs font-semibold md:inline-flex">Sign in</Link>
            <Link to="/login?role=donor" className="inline-flex items-center gap-2 rounded-full bg-[#17372f] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#0f2e27]">Open demo <ArrowRight size={14} /></Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-[#ded5c8]">
          <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_70%_10%,rgba(210,128,69,.16),transparent_54%),radial-gradient(circle_at_20%_15%,rgba(141,166,126,.18),transparent_50%)]" />
          <div className="relative mx-auto grid max-w-[1420px] gap-12 px-5 pb-16 pt-12 lg:grid-cols-[.88fr_1.12fr] lg:items-center lg:px-8 lg:pb-20 lg:pt-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d8ccbc] bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-[#617068]"><span className="live-dot dark" /> Built for the last few hours that matter</div>
              <h1 className="mt-6 font-serif text-[clamp(3.7rem,7vw,7.8rem)] leading-[.86] tracking-[-.055em] text-[#21342c]">
                Good food<br />should not become<br /><span className="text-[#bd7041]">waste because</span><br />the clock won.
              </h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 md:text-lg">RescueLoop turns a surplus-food message into an executable rescue: a safe recipient, live capacity, a committed driver and a backup path before the food window closes.</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/login?role=donor" className="inline-flex items-center gap-2 rounded-full bg-[#17372f] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(23,55,47,.12)]">Post surplus <ArrowRight size={16} /></Link>
                <a href="#loop" className="inline-flex items-center gap-2 rounded-full border border-[#d8cec2] bg-white px-5 py-3 text-sm font-semibold">See the loop <ArrowDown size={15} /></a>
              </div>

              <div className="mt-9 grid max-w-xl grid-cols-3 gap-3">
                <ProofChip icon={ShieldCheck} title="Safety first" text="Rules, not guesswork" />
                <ProofChip icon={MapPin} title="Live capacity" text="Who can take it now" />
                <ProofChip icon={Truck} title="Failover" text="Backup before panic" />
              </div>
            </div>

            <HeroRescueVisual />
          </div>
        </section>

        <RescueStoryReel />

        <section id="story" className="border-b border-[#ded5c8] bg-[#fbf8f2]">
          <div className="mx-auto max-w-[1420px] px-5 py-20 lg:px-8 lg:py-28">
            <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
              <div><p className="eyebrow dark">The part nobody sees</p><h2 className="mt-4 font-serif text-5xl leading-[.94] tracking-[-.045em] md:text-7xl">The donation can be perfectly good — and still get wasted.</h2></div>
              <div className="lg:pb-2"><p className="max-w-2xl text-lg leading-8 text-slate-600">A restaurant can post food. An NGO can want food. A volunteer can be nearby. The rescue can still fail because the pieces were never synchronized around the same deadline.</p><div className="mt-7 flex flex-wrap gap-2.5"><Pill>No live capacity</Pill><Pill>No committed driver</Pill><Pill>No backup</Pill><Pill>No verified handoff</Pill></div></div>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <FailureCard index="01" title="Surplus appears" text="Someone notices the food, but the useful window is already counting down." icon={UtensilsCrossed} />
              <FailureCard index="02" title="The false match" text="The nearest recipient is full, closed, or unable to take this food type." icon={UsersRound} />
              <FailureCard index="03" title="The no-show" text="The volunteer looked available until the moment a pickup had to happen." icon={Truck} />
              <FailureCard index="04" title="The silent loss" text="Without a fallback and proof of handoff, a rescue becomes a story nobody can verify." icon={Clock3} />
            </div>
          </div>
        </section>

        <section id="loop" className="bg-[#1b3b32] text-white">
          <div className="mx-auto max-w-[1420px] px-5 py-20 lg:px-8 lg:py-28">
            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
              <div><p className="text-[11px] font-bold uppercase tracking-[.23em] text-emerald-100/55">The rescue loop</p><h2 className="mt-4 max-w-3xl font-serif text-5xl leading-[.94] tracking-[-.045em] md:text-7xl">We do not call it matched until the path can actually move.</h2></div>
              <p className="max-w-sm text-sm leading-7 text-emerald-50/65">The frontend feels simple. The backend does the hard part underneath: safety, feasibility, commitments and recovery.</p>
            </div>

            <div className="mt-14 grid gap-4 lg:grid-cols-4">
              <LoopCard n="01" title="Capture" kicker="WhatsApp / web" text="Natural-language intake becomes a Food Lot Passport without a long form." />
              <LoopCard n="02" title="Check" kicker="Deterministic safety" text="Safe-until, storage and required details are verified before matching." />
              <LoopCard n="03" title="Commit" kicker="Recipient + driver" text="A rescue becomes Secured only when both sides accept the same plan." />
              <LoopCard n="04" title="Recover" kicker="Primary + backup" text="If the primary path breaks, the prepared backup is activated immediately." />
            </div>

            <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[.06] p-6 md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-emerald-100/45">One sentence</p><p className="mt-2 font-serif text-2xl leading-tight md:text-3xl">“A match is a plan. A rescue is a completed handoff.”</p></div>
                <Link to="/login?role=operations" className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e2a16b] px-4 py-2.5 text-xs font-bold text-[#17372f]">Open control room <ArrowRight size={14} /></Link>
              </div>
            </div>
          </div>
        </section>

        <section id="trust" className="border-b border-[#ded5c8] bg-[#f7f2ea]">
          <div className="mx-auto max-w-[1420px] px-5 py-20 lg:px-8 lg:py-28">
            <div className="max-w-2xl"><p className="eyebrow dark">Trust layer</p><h2 className="mt-4 font-serif text-5xl leading-[.94] tracking-[-.045em] md:text-7xl">The system should explain itself when the clock gets tight.</h2></div>
            <div className="mt-12 grid gap-4 lg:grid-cols-2">
              <TrustCard number="01" title="Why this recipient?" text="The engine shows which candidates failed the hard filters and why the selected plan was feasible." tags={['capacity', 'food type', 'open until', 'deadline slack']} />
              <TrustCard number="02" title="What if the driver cancels?" text="The rescue keeps a precomputed backup recipient + driver pair instead of restarting the search from zero." tags={['backup ready', 'automatic reroute', 'activity log']} />
              <TrustCard number="03" title="Did the food arrive?" text="Pickup and delivery are closed with OTP verification so the impact ledger reflects completed rescues, not posts." tags={['pickup OTP', 'delivery OTP', 'timestamp']} />
              <TrustCard number="04" title="Who sees what?" text="Each role gets the information it needs: donors see progress, NGOs manage capacity, drivers see jobs, operators see the whole chain." tags={['role-based access', 'minimal exposure', 'audit trail']} />
            </div>
          </div>
        </section>

        <section id="roles" className="bg-[#f2ede4]">
          <div className="mx-auto max-w-[1420px] px-5 py-20 lg:px-8 lg:py-28">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="eyebrow dark">Built around people</p><h2 className="mt-4 font-serif text-5xl leading-[.94] tracking-[-.045em] md:text-7xl">One rescue. Four perspectives.</h2></div><p className="max-w-md text-sm leading-7 text-slate-600">The product changes shape depending on who is holding the phone — without breaking the shared rescue state.</p></div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <RoleCard role="Donor" title="I have food now." text="Post in under a minute. Know whether the rescue is actually secured." to="/login?role=donor" />
              <RoleCard role="NGO / shelter" title="I can take this." text="Set capacity by time and food type, then accept only what fits." to="/login?role=recipient" />
              <RoleCard role="Driver" title="I can move it." text="Go on duty, commit to a feasible pickup and receive the handoff packet." to="/login?role=driver" />
              <RoleCard role="Operations" title="I can see the whole loop." text="Watch rescue health, explain matching decisions and trigger recovery when needed." to="/login?role=operations" />
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#bd7041] text-white">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/20" />
          <div className="absolute -bottom-28 left-8 h-72 w-72 rounded-full border border-white/15" />
          <div className="relative mx-auto flex max-w-[1420px] flex-col gap-7 px-5 py-16 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-20">
            <div className="max-w-3xl"><p className="text-[10px] font-bold uppercase tracking-[.22em] text-orange-50/60">AmiHacks · Track A</p><h2 className="mt-4 font-serif text-5xl leading-[.92] tracking-[-.045em] md:text-7xl">Less friction for the donor.<br />More certainty for the rescue.</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-orange-50/78">RescueLoop combines a WhatsApp-native intake idea with a deadline-first orchestration engine so the food does not disappear between “posted” and “delivered”.</p></div>
            <Link to="/login?role=donor" className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#17372f]">Try the live demo <ArrowRight size={16} /></Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#ded5c8] bg-[#fbf8f2]">
        <div className="mx-auto flex max-w-[1420px] flex-col gap-3 px-5 py-8 text-xs text-slate-500 md:flex-row md:items-center md:justify-between lg:px-8"><p className="font-semibold text-[#1f2b25]">RescueLoop</p><p>Surplus-to-Shelter · Real-time rescue orchestration</p></div>
      </footer>
    </div>
  );
}

function ProofChip({ icon: Icon, title, text }) { return <div className="rounded-2xl border border-[#ded4c6] bg-white/65 p-3.5"><Icon size={16} className="text-[#17372f]" /><p className="mt-3 text-xs font-bold">{title}</p><p className="mt-1 text-[11px] leading-5 text-slate-500">{text}</p></div>; }
function Pill({ children }) { return <span className="rounded-full border border-[#d8cdbf] bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">{children}</span>; }
function FailureCard({ index, title, text, icon: Icon }) { return <article className="group rounded-[24px] border border-[#dfd5c8] bg-white p-5 transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(39,54,46,.08)]"><div className="flex items-center justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f0ece5] text-[#17372f]"><Icon size={17} /></div><span className="text-[10px] font-black tracking-[.18em] text-slate-300">{index}</span></div><h3 className="mt-6 font-serif text-2xl leading-tight tracking-[-.02em]">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></article>; }
function LoopCard({ n, title, kicker, text }) { return <article className="rounded-[24px] border border-white/10 bg-white/[.055] p-5"><p className="text-[10px] font-black tracking-[.18em] text-emerald-100/35">{n}</p><p className="mt-5 text-[10px] font-bold uppercase tracking-[.16em] text-[#e2a16b]">{kicker}</p><h3 className="mt-2 font-serif text-3xl tracking-[-.03em]">{title}</h3><p className="mt-3 text-sm leading-6 text-emerald-50/62">{text}</p></article>; }
function TrustCard({ number, title, text, tags }) { return <article className="rounded-[28px] border border-[#ded5c8] bg-white p-6 md:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-black tracking-[.18em] text-slate-300">{number}</p><h3 className="mt-4 font-serif text-3xl leading-none tracking-[-.03em]">{title}</h3></div><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf2eb] text-[#17372f]"><Check size={16} /></div></div><p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">{text}</p><div className="mt-5 flex flex-wrap gap-2">{tags.map((tag) => <span key={tag} className="rounded-full bg-[#f3eee6] px-2.5 py-1 text-[10px] font-semibold text-slate-500">{tag}</span>)}</div></article>; }
function RoleCard({ role, title, text, to }) { return <Link to={to} className="group rounded-[26px] border border-[#ddd3c7] bg-[#fbf8f2] p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_40px_rgba(39,54,46,.08)]"><p className="text-[10px] font-black uppercase tracking-[.16em] text-[#7a857d]">{role}</p><h3 className="mt-5 font-serif text-3xl leading-none tracking-[-.03em]">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-500">{text}</p><span className="mt-7 inline-flex items-center gap-1.5 text-xs font-bold text-[#17372f]">Open workspace <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span></Link>; }
