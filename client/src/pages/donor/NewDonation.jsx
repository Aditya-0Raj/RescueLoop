import { useState } from 'react';
import { Bot, CheckCircle2, MapPin, MessageCircle, Send, ShieldCheck, Sparkles, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import { createDonation } from '../../services/donationService';
import { parseDonationMessage } from '../../services/intakeService';

const initialForm = {
  foodName: '', foodType: 'Cooked meal', quantity: '', unit: 'kg', dietaryType: 'Vegetarian',
  readyAt: '', safeUntil: '', storageState: 'Hot-held', location: 'The Spice House, MG Road, Bengaluru', notes: '',
};

export default function NewDonation() {
  const [form, setForm] = useState(initialForm);
  const [messageText, setMessageText] = useState('');
  const [parsed, setParsed] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const update = (key, value) => setForm((old) => ({ ...old, [key]: value }));

  async function handleParse() {
    if (!messageText.trim()) return;
    setBusy(true); setError('');
    try {
      const result = await parseDonationMessage(messageText);
      const fields = result.fields || result;
      setParsed(fields);
      setForm((old) => ({
        ...old,
        foodName: fields.foodName || old.foodName,
        foodType: fields.foodType || old.foodType,
        quantity: fields.quantity ?? old.quantity,
        unit: fields.unit || old.unit,
      }));
    } catch {
      setError('We could not parse that message. You can still complete the fields manually.');
    } finally { setBusy(false); }
  }

  async function handleSubmit(event) {
    event.preventDefault(); setError('');
    try {
      await createDonation(form);
      setMessage('Donation created. Safety checks are next.');
      window.setTimeout(() => navigate('/donor'), 900);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to create the donation right now.');
    }
  }

  return (
    <DashboardLayout role="donor" title="Post Surplus Food" subtitle="Message-first intake with the same data model used by the rescue engine.">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div><p className="eyebrow dark">Food lot passport</p><h2 className="page-title mt-2">Tell us what you have. We will structure the rescue.</h2></div>
          <Link to="/donor" className="text-sm font-semibold text-slate-500 hover:text-ink">Cancel</Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-[.72fr_1.28fr]">
          <aside className="space-y-4">
            <div className="surface overflow-hidden">
              <div className="border-b border-line bg-[#fbf8f2] p-4">
                <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e9efe5] text-forest"><MessageCircle size={17} /></span><div><p className="text-sm font-semibold">RescueLoop intake</p><p className="text-[10px] text-emerald-700">Message parser online</p></div></div>
              </div>
              <div className="space-y-4 p-4">
                <Chat text="Send one normal message. Example: 25 kg veg biryani, ready now, safe till 9:30 PM." bot />
                {messageText && <Chat text={messageText} />}
                {parsed && <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3.5"><div className="flex items-center gap-2 text-xs font-semibold text-forest"><Bot size={14} /> Parsed food lot</div><div className="mt-3 grid grid-cols-2 gap-2 text-xs"><Info label="Food" value={parsed.foodName || '—'} /><Info label="Quantity" value={`${parsed.quantity ?? '—'} ${parsed.unit || ''}`} /><Info label="Ready" value={form.readyAt ? form.readyAt.replace('T', ' ') : 'Add time'} /><Info label="Safe until" value={form.safeUntil ? form.safeUntil.replace('T', ' ') : 'Add deadline'} /></div><p className="mt-3 text-[11px] leading-5 text-slate-500">AI/NLP assists extraction; deterministic safety rules still decide what can be routed.</p></div>}
                <div className="flex gap-2"><input className="field rounded-2xl" value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="25 kg veg biryani, safe till 9:30 PM" /><button type="button" onClick={handleParse} disabled={busy || !messageText.trim()} className="flex shrink-0 items-center justify-center rounded-2xl bg-forest px-4 text-white disabled:opacity-40" aria-label="Parse message">{busy ? '…' : <Send size={16} />}</button></div>
              </div>
            </div>

            <div className="surface p-5">
              <p className="eyebrow dark">What happens next</p>
              <div className="mt-4 space-y-4"><NextStep icon={ShieldCheck} title="Safety gate" text="Required timing, quantity and storage details are checked first." /><NextStep icon={Sparkles} title="Viability engine" text="Recipient capacity and driver feasibility are evaluated together." /><NextStep icon={CheckCircle2} title="Commit + backup" text="The rescue is not called secured until the whole path can move." /></div>
            </div>
          </aside>

          <section className="surface p-5 md:p-7">
            <div className="flex items-center justify-between gap-3 border-b border-line pb-5"><div><p className="text-sm font-semibold">Confirm donation details</p><p className="mt-1 text-xs text-slate-400">The message parser only fills fields. You remain in control.</p></div><span className="rounded-full bg-[#edf2eb] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-forest">Draft</span></div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <section><div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-forest text-xs font-bold">1</span><h3 className="text-sm font-semibold">Food details</h3></div>
                <div className="mt-4 grid gap-4 md:grid-cols-2"><Field label="Food name" required><input className="field mt-1.5" value={form.foodName} onChange={(e) => update('foodName', e.target.value)} placeholder="e.g. Vegetable Biryani" required /></Field><Field label="Type" required><select className="field mt-1.5" value={form.foodType} onChange={(e) => update('foodType', e.target.value)}><option value="Cooked meal">Cooked meal</option><option value="Bakery">Bakery</option><option value="Packaged food">Packaged food</option><option value="Fruits & vegetables">Fruits & vegetables</option><option value="Other">Other</option></select></Field><Field label="Quantity" required><div className="mt-1.5 flex gap-2"><input type="number" min="1" className="field" value={form.quantity} onChange={(e) => update('quantity', e.target.value)} placeholder="25" required /><select className="field max-w-28" value={form.unit} onChange={(e) => update('unit', e.target.value)}><option value="kg">kg</option><option value="portions">portions</option><option value="boxes">boxes</option><option value="pieces">pieces</option></select></div></Field><Field label="Dietary type"><select className="field mt-1.5" value={form.dietaryType} onChange={(e) => update('dietaryType', e.target.value)}><option>Vegetarian</option><option>Non-vegetarian</option><option>Mixed</option><option>Packaged</option></select></Field><Field label="Prepared / ready time" required><input type="datetime-local" className="field mt-1.5" value={form.readyAt} onChange={(e) => update('readyAt', e.target.value)} required /></Field><Field label="Safe until" required><input type="datetime-local" className="field mt-1.5" value={form.safeUntil} onChange={(e) => update('safeUntil', e.target.value)} required /></Field><Field label="Current storage" required><select className="field mt-1.5" value={form.storageState} onChange={(e) => update('storageState', e.target.value)}><option>Hot-held</option><option>Refrigerated</option><option>Ambient</option><option>Frozen</option></select></Field><Field label="Pickup location" required><input className="field mt-1.5" value={form.location} onChange={(e) => update('location', e.target.value)} required /></Field></div>
              </section>

              <section className="border-t border-line pt-6"><div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-forest"><MapPin size={14} /></span><h3 className="text-sm font-semibold">Pickup evidence</h3></div><div className="mt-4 grid gap-4 md:grid-cols-[1fr_190px]"><div className="rounded-xl border border-line bg-[#f0f3ed] p-4"><p className="text-xs text-slate-400">Current address</p><p className="mt-1 text-sm font-semibold">{form.location}</p><p className="mt-1 text-xs text-slate-400">The assigned driver will receive pickup instructions after commitment.</p></div><label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-line bg-stone-50 p-4 text-center"><Upload size={18} className="text-slate-400"/><span className="mt-2 text-xs font-semibold">Add food photo</span><span className="mt-1 text-[10px] text-slate-400">Optional evidence</span><input className="hidden" type="file" accept="image/*" /></label></div></section>

              <section className="border-t border-line pt-6"><label className="text-sm font-medium">Additional notes <span className="font-normal text-slate-400">(optional)</span><textarea className="field mt-1.5 min-h-24" value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Freshly packed, sealed containers, loading instructions..." /></label></section>

              {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
              <div className="flex items-center justify-between gap-3 border-t border-line pt-5"><div className="flex items-center gap-2 text-xs text-slate-400"><CheckCircle2 size={15} className="text-forest" /> Safety information is checked before matching.</div><Button type="submit">Post Donation</Button></div>
            </form>
          </section>
        </div>
      </div>
      <Toast message={message} tone={error ? 'error' : 'success'} />
    </DashboardLayout>
  );
}

function Field({ label, required, children }) { return <label className="text-sm font-medium text-slate-700">{label} {required && <span className="text-terracotta">*</span>}{children}</label>; }
function Chat({ text, bot }) { return <div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-5 ${bot ? 'bg-stone-100 text-slate-600' : 'ml-auto bg-forest text-white'}`}>{text}</div>; }
function Info({ label, value }) { return <div className="rounded-lg bg-white/70 p-2.5"><p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 truncate text-xs font-semibold text-slate-700">{value}</p></div>; }
function NextStep({ icon: Icon, title, text }) { return <div className="flex gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-forest"><Icon size={15} /></div><div><p className="text-sm font-semibold">{title}</p><p className="mt-0.5 text-xs leading-5 text-slate-500">{text}</p></div></div>; }
