import { Check, Clock3, MapPin, ShieldCheck, Truck, UtensilsCrossed } from 'lucide-react';

const moments = [
  { time: '7:20 PM', label: 'Surplus appears', title: '25 kg veg biryani is ready to move.', icon: UtensilsCrossed, tone: 'orange' },
  { time: '7:22 PM', label: 'Safety gate', title: 'Storage + safe-until details are verified.', icon: ShieldCheck, tone: 'sage' },
  { time: '7:26 PM', label: 'Rescue plan', title: 'City Shelter Network + Ravi are committed.', icon: MapPin, tone: 'green' },
  { time: '7:31 PM', label: 'Failure', title: 'Primary driver drops out. The clock keeps moving.', icon: Truck, tone: 'amber' },
  { time: '7:31 PM', label: 'Recovery', title: 'Backup activates before the food window closes.', icon: Check, tone: 'green' },
];

export default function RescueStoryReel() {
  return (
    <section className="border-b border-[#ddd3c6] bg-[#efe8dc]">
      <div className="mx-auto max-w-[1420px] px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
          <div>
            <p className="eyebrow dark">One rescue, minute by minute</p>
            <h2 className="mt-4 max-w-xl font-serif text-5xl leading-[.92] tracking-[-.045em] md:text-7xl">
              The website should make you <span className="text-[#b86b3f]">feel the clock.</span>
            </h2>
          </div>
          <div className="max-w-2xl text-sm leading-7 text-slate-600 lg:pb-2 lg:text-base">
            <p>Instead of showing another generic food-delivery dashboard, RescueLoop tells one operational story: a real food lot appears, the window gets tighter, a human fails, and the system recovers.</p>
            <div className="mt-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#6b756e]"><span className="live-dot dark" /> Demo scenario · animated, not a stock video</div>
          </div>
        </div>

        <div className="relative mt-14 overflow-hidden border-y border-[#d4c8ba] bg-[#f8f4ec]">
          <div className="absolute left-[9.5%] right-[9.5%] top-[56px] hidden h-px bg-[#cbbdad] md:block" />
          <div className="relative grid md:grid-cols-5">
            {moments.map(({ time, label, title, icon: Icon, tone }, index) => (
              <article key={time + label} className="group relative border-b border-[#ded3c6] px-5 py-7 last:border-b-0 md:border-b-0 md:border-r md:px-6 md:py-8 md:last:border-r-0">
                <div className="flex items-center justify-between md:block">
                  <span className="text-[10px] font-black tracking-[.18em] text-slate-300">0{index + 1}</span>
                  <span className="font-mono text-[11px] font-semibold text-slate-500">{time}</span>
                </div>
                <div className={`mt-5 flex h-11 w-11 items-center justify-center rounded-full border bg-white ${tone === 'orange' ? 'border-[#d8b89e] text-[#b86b3f]' : tone === 'sage' ? 'border-[#b9cbb2] text-[#4e6c58]' : tone === 'amber' ? 'border-[#dfbe9b] text-[#a86236]' : 'border-[#b9c6bf] text-[#17372f]'}`}>
                  <Icon size={17} />
                </div>
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">{label}</p>
                <h3 className="mt-2 max-w-[220px] font-serif text-2xl leading-tight tracking-[-.025em] text-[#1d2822]">{title}</h3>
                {index < moments.length - 1 && <div className="mt-6 text-[10px] font-bold uppercase tracking-[.14em] text-[#78837c]">Next →</div>}
              </article>
            ))}
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-4 border-t border-[#ddd3c6] pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2"><Clock3 size={14} className="text-[#b86b3f]" /> The deadline is a system input, not a decorative countdown.</div>
          <div className="font-semibold text-[#17372f]">Posted → Checked → Committed → Recovered → Delivered</div>
        </div>
      </div>
    </section>
  );
}
