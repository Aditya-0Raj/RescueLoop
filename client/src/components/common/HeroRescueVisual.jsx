import { ArrowDownRight, Check, Clock3, MapPin, ShieldCheck, Truck, UtensilsCrossed } from 'lucide-react';

export default function HeroRescueVisual() {
  return (
    <div className="relative">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border border-[#c8a679]/35" />
      <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full border border-[#8aa07b]/35" />

      <div className="story-frame relative overflow-hidden rounded-[34px] border border-[#e0d6c8] bg-[#e9dfd1] p-3 shadow-[0_30px_70px_rgba(32,48,39,.13)]">
        <div className="relative min-h-[560px] overflow-hidden rounded-[26px] bg-[#1b3b32]">
          <div className="absolute -left-28 top-20 h-72 w-72 rounded-full bg-[#b7c59f]/18 blur-2xl" />
          <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#d57b45]/20 blur-3xl" />
          <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:32px_32px]" />

          <div className="relative z-10 flex items-center justify-between px-5 pt-5 text-white">
            <div className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[.15em] text-emerald-50/80">
              <span className="live-dot" /> Rescue in motion
            </div>
            <span className="rounded-full border border-white/15 bg-white/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-emerald-50">Live logic</span>
          </div>

          <div className="relative z-10 px-5 pb-5 pt-10 md:px-7">
            <div className="max-w-[360px]">
              <p className="text-[10px] font-bold uppercase tracking-[.22em] text-emerald-100/50">Tonight's example</p>
              <h3 className="mt-3 font-serif text-4xl leading-[.94] tracking-[-.04em] text-white">25 kg of veg biryani. One usable window.</h3>
            </div>

            <div className="mt-8 space-y-3">
              <Node number="01" icon={UtensilsCrossed} title="The Spice House" meta="Food lot created · 7:20 PM" state="Posted" />
              <div className="route-line"><span /></div>
              <Node number="02" icon={ShieldCheck} title="Safety gate passed" meta="Storage + safe-until verified" state="Checked" tone="sage" />
              <div className="route-line"><span /></div>
              <Node number="03" icon={MapPin} title="City Shelter Network" meta="25 kg capacity · open until 10 PM" state="Primary" tone="amber" />
              <div className="route-line"><span /></div>
              <Node number="04" icon={Truck} title="Ravi · on duty" meta="Primary pickup committed" state="Committed" tone="violet" />
            </div>

            <div className="mt-6 rounded-[22px] border border-white/10 bg-white/[.08] p-4 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.16em] text-emerald-100/55">Rescue buffer</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-white">1h 42m</p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                  <Clock3 size={14} className="text-[#e0a069]" /> Safe until 9:30 PM
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-50/65"><Check size={14} className="text-[#a6c48c]" /> Backup path reserved before the clock runs out</div>
            </div>
          </div>

          <div className="absolute bottom-5 right-5 hidden rotate-[-3deg] rounded-2xl border border-[#cfa274]/35 bg-[#e0a069] px-4 py-3 text-[#17372f] shadow-lg sm:block">
            <p className="text-[10px] font-black uppercase tracking-[.14em]">Why it matters</p>
            <p className="mt-1 text-sm font-semibold">A match is not enough.</p>
            <div className="mt-1 flex items-center gap-1 text-[10px] font-medium"><ArrowDownRight size={11} /> The whole path has to hold.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Node({ number, icon: Icon, title, meta, state, tone = 'green' }) {
  const tones = {
    green: 'bg-white/10 text-white',
    sage: 'bg-[#a7c393]/15 text-[#d8e9c8]',
    amber: 'bg-[#e0a069]/15 text-[#f0c39a]',
    violet: 'bg-[#c6b9d8]/15 text-[#ddd4e9]',
  };
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/7 text-emerald-50"><Icon size={17} /></div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2"><p className="truncate text-sm font-semibold text-white">{title}</p><span className="text-[9px] font-bold tracking-[.14em] text-emerald-100/35">{number}</span></div>
        <p className="mt-0.5 truncate text-[11px] text-emerald-50/55">{meta}</p>
      </div>
      <span className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.12em] sm:inline-flex ${tones[tone]}`}>{state}</span>
    </div>
  );
}
